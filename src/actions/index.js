import { get } from 'svelte/store';

import { currentPlayer, playerOne, playerTwo, activeCards, removedCardSlots, reserve, discard, tableLayout } from '../stores';
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