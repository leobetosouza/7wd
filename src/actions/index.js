import { get } from 'svelte/store';

import { get1stAgeCards, get2ndAgeCards, get3rdAgeCards, get1stAgeTableLayout, get2ndAgeTableLayout, get3rdAgeTableLayout } from '../services/resources';
import { agePromise, currentAgeName, currentPlayer, playerOne, playerTwo, activeCards, removedCardSlots, reserve, tableLayout } from '../stores';
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

export const takeCard = ({ card, slot }) => {
    try {
        if (card.cost?.coins) get(currentPlayer).takeDebit(card.cost.coins);
        
        removedCardSlots.update(arr => [ slot, ...arr ]);
        get(currentPlayer).takeCard(card);
        currentPlayer.set(playerControl.getNext());
    } catch(e){
        console.error(e);
    }
};

const prepareAge = (getAgeCards, getTableLayout) => async () => {
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
        prepare: prepareAge(get2ndAgeCards, get2ndAgeTableLayout),
    },
    {
        name: '3rd Age',
        prepare: prepareAge(get3rdAgeCards, get3rdAgeTableLayout),
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
        currentAgeName.set('GAME&apos;s END');
    }	
};
