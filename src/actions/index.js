import { get } from 'svelte/store';

import {
  get1stAgeCards,
  get2ndAgeCards,
  get3rdAgeCards,
  get1stAgeTableLayout,
  get2ndAgeTableLayout,
  get3rdAgeTableLayout,
  getMilitaryBoardLayout,
} from '../services/resources';
import {
  agePromise,
  currentAgeName,
  currentPlayer,
  playerOne,
  playerTwo,
  scientificSupremacist,
  militarySupremacist,
  activeCards,
  removedCardSlots,
  reserve,
  discard,
  tableLayout,
  hasGameEnded,
  militaryLayout,
  conflictPawnIndex,
} from '../stores';

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
    setNext: x => (n = !(x - 1) ? 1 : 0),
  };
};

export const createPlayers = (playerOneData, playerTwoData) => {
  playerOne.set(new Player(playerOneData));
  playerTwo.set(new Player(playerTwoData));

  playerControl = createPlayerControl(playerOne, playerTwo);

  currentPlayer.set(playerControl.getCurrent());
};

const prepareMilitaryBoard = async () => {
  const rawLayout = await getMilitaryBoardLayout();

  const layout = [
    ...rawLayout.reduce((acc, o) => [{ ...o }, ...acc], []),
    { start: true },
    ...rawLayout,
  ];

  militaryLayout.set(layout);
};

const prepareAge =
  (getAgeCards, getTableLayout, is1stAge = false) =>
  async () => {
    const promises = [];

    if (is1stAge) {
      const militaryBoardPromise = prepareMilitaryBoard();
      promises.push(militaryBoardPromise);
    } else {
      // hasGameEnded.set(true);
    }

    const cardsPromise = getAgeCards().then(res => {
      reserve.add(...res.reserve);
      activeCards.set(res.cards);
    });

    promises.push(cardsPromise);

    const tableLayoutPromise = getTableLayout().then(layout => {
      tableLayout.set(layout);
    });

    promises.push(tableLayoutPromise);

    agePromise.set(Promise.all(promises));
  };

const agesList = [
  {
     name: '1st Age',
     prepare: prepareAge(get1stAgeCards, get1stAgeTableLayout, true),
  },
  {
    name: '2nd Age',
    prepare: prepareAge(get2ndAgeCards, get2ndAgeTableLayout),
  },
  {
    name: '3rd Age',
    prepare: prepareAge(get3rdAgeCards, get3rdAgeTableLayout),
  },
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


export const checkMilitarySupremacy = () => {
  const $conflictPawnIndex = get(conflictPawnIndex);

  if ($conflictPawnIndex <= 0) {
    militarySupremacist.set(get(playerTwo));
    hasGameEnded.set(true);
  };

  if ($conflictPawnIndex >= 18) {
    militarySupremacist.set(get(playerOne));
    hasGameEnded.set(true);
  }
}

const hasScientificSupremacy = ({ differentSciences }) =>
  get(differentSciences) === 6;

export const buyCard = ({ card, slot }) => {
  try {
    const $currentPlayer = get(currentPlayer);

    const cardCost = $currentPlayer.getCardBuyValue(card);
    if (cardCost) $currentPlayer.pay(cardCost);

    removedCardSlots.update(arr => [slot, ...arr]);
    $currentPlayer.takeCard(card);

    if (hasScientificSupremacy($currentPlayer)) {
      scientificSupremacist.set($currentPlayer);
      hasGameEnded.set(true);
    } else {
      currentPlayer.set(playerControl.getNext());
    }
  } catch (e) {
    console.error(e);
  }
};

export const sellCard = ({ card, slot }) => {
  const $currentPlayer = get(currentPlayer);

  $currentPlayer.tradeCard();

  removedCardSlots.update(arr => [slot, ...arr]);
  discard.add(card);
  currentPlayer.set(playerControl.getNext());
};
