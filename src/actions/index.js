import { get } from 'svelte/store';

import { get1stAgeCards, get2ndAgeCards, get3rdAgeCards, get1stAgeTableLayout, get2ndAgeTableLayout, get3rdAgeTableLayout } from '../services/resources';
import { agePromise, currentAgeName, currentPlayer, playerOne, playerTwo, activeCards, removedCardSlots, reserve, discard, tableLayout, hasGameEnded } from '../stores';
import Player from '../stores/player';

let playerControl;

const createPlayerControl = (...players) => {
    let n = Math.random() >= 0.5 ? 1 : 0;
    
    const idx = (function* () {
        while (true) {
            n = n ? 0 : 1;
            yield n;
        }
    })();

    return {
        getCurrent: () => players[n],
        getNext: () => players[idx.next().value],
        setNext: (x) => n = !(x-1) ? 1 : 0
    };

};

export const createPlayers = (playerOneData, playerTwoData) => {
	playerOne.set(Player(playerOneData));
	playerTwo.set(Player(playerTwoData));

    playerControl = createPlayerControl(playerOne, playerTwo);

	currentPlayer.set(playerControl.getCurrent());
}

const prepareAge = (getAgeCards, getTableLayout, hasPreAgeSetup = false) => async () => {
    if (hasPreAgeSetup) {
        hasGameEnded.set(true);
    }

    const cardsPromise = getAgeCards().then(res => {
        reserve.add(...res.reserve);
        activeCards.set(res.cards);
    });

    const tableLayoutPromise = getTableLayout().then(layout => {
        tableLayout.set(layout);
    });

    agePromise.set(Promise.all([ cardsPromise, tableLayoutPromise ]));
};

const agesList = [
    {
        name: '1st Age',
        prepare: prepareAge(get1stAgeCards, get1stAgeTableLayout),
    },
    {
        name: '2nd Age',
        prepare: prepareAge(get2ndAgeCards, get2ndAgeTableLayout, true),
    },
    {
        name: '3rd Age',
        prepare: prepareAge(get3rdAgeCards, get3rdAgeTableLayout, true),
    }
];

const ages = (function* () {
    let count = 0;
    while (count !== agesList.length) yield agesList[count++];
})();


export const setupNextAge = async () => {
    const age = ages.next();
    
    if (!age.done) {
            
        age.value.prepare();

        await get(agePromise);

        currentAgeName.set(age.value.name);
    } else {
        hasGameEnded.set(true);
    }
};

export const buyCard = ({ card, slot }) => {
    try {
        const $currentPlayer = get(currentPlayer);
        const cardCost = $currentPlayer.getCardBuyValue(card);
        if (cardCost) $currentPlayer.takeDebit(cardCost);
        
        removedCardSlots.update(arr => [ slot, ...arr ]);
        $currentPlayer.takeCard(card);
        currentPlayer.set(playerControl.getNext());
    } catch(e) {
        console.error(e);
    }
};

export const sellCard = ({ card, slot }) => {
    const $currentPlayer = get(currentPlayer);

    $currentPlayer.tradeCard();

    removedCardSlots.update(arr => [ slot, ...arr ]);
    discard.add(card);
    currentPlayer.set(playerControl.getNext());
};
