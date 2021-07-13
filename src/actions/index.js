import { get } from 'svelte/store';

import { delay } from '../utils';

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
  actionsStack,
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
  conflictTokens,
  conflictPawnIndex,
  isAgeInitSetupInProgress,
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
    setNext: x => {
      n = x; // !(x - 1) ? 1 : 0;
      return players[n];
    },
  };
};

export const createPlayers = (playerOneData, playerTwoData) => {
  playerOne.set(new Player({ ...playerOneData, idx: 0 }));
  playerTwo.set(new Player({ ...playerTwoData, idx: 1 }));

  playerControl = createPlayerControl(playerOne, playerTwo);

  currentPlayer.set(playerControl.getCurrent());
};

const prepareMilitaryBoard = async () => {
  const rawLayout = await getMilitaryBoardLayout();
  const tokens = rawLayout['conflict-tokens'];

  const slots = rawLayout['slots'].map(slot => ({
    ...slot,
    ...(tokens[slot['conflict-token']] ?? {})
  }));

  const layout = [
    ...slots.reduce((acc, o) => [{ ...o, player: playerOne }, ...acc], []),
    { start: true },
    ...slots.map(o => ({ ...o, player: playerTwo })),
  ];

  militaryLayout.set(layout);
  conflictTokens.set(tokens.map(({ debit }) => debit));
};

export const chooseFirstPlayer = player =>
  currentPlayer.set(playerControl.setNext(player.idx));

const ageInitSetup = () => isAgeInitSetupInProgress.set(true);

const prepareAge =
  (getAgeCards, getTableLayout, is1stAge = false) =>
  async () => {
    const promises = [];

    if (is1stAge) {
      const militaryBoardPromise = prepareMilitaryBoard();
      promises.push(militaryBoardPromise);
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

    await get(agePromise);

    return !is1stAge;

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
    const hasAgeInitSetup = await age.value.prepare();
    currentAgeName.set(age.value.name);

    if (hasAgeInitSetup) {
      ageInitSetup();
    }
  } else {
    hasGameEnded.set(true);
  }

  return;
};

const hasMilitarySupremacy = () => {
  const $conflictPawnIndex = get(conflictPawnIndex);
  const $playerOne = get(playerOne);
  const $playerTwo = get(playerTwo);

  if ($conflictPawnIndex <= 0) {
    militarySupremacist.set($playerTwo);
    hasGameEnded.set(true);
    return true;
  };

  if ($conflictPawnIndex >= 1 && $conflictPawnIndex <= 3) {
    $playerOne.takeDebitToken(5);
    $playerOne.takeMilitaryVPs(0);
    $playerTwo.takeMilitaryVPs(10);
    return false;
  }

  if ($conflictPawnIndex >= 4 && $conflictPawnIndex <= 6) {
    $playerOne.takeDebitToken(3);
    $playerOne.takeMilitaryVPs(0);
    $playerTwo.takeMilitaryVPs(5);
    return false;
  }

  if ($conflictPawnIndex === 7 || $conflictPawnIndex === 8) {
    $playerOne.takeMilitaryVPs(0);
    $playerTwo.takeMilitaryVPs(2);
    return false;
  }

  if ($conflictPawnIndex === 9) {
    $playerOne.takeMilitaryVPs(0);
    $playerTwo.takeMilitaryVPs(0);
  }

  if ($conflictPawnIndex === 10 || $conflictPawnIndex === 11) {
    $playerTwo.takeMilitaryVPs(0);
    $playerOne.takeMilitaryVPs(2);
    return false;
  }

  if ($conflictPawnIndex >= 12 && $conflictPawnIndex <= 14) {
    $playerTwo.takeDebitToken(3);
    $playerTwo.takeMilitaryVPs(0);
    $playerOne.takeMilitaryVPs(5);
    return false;
  }

  if ($conflictPawnIndex >= 15 && $conflictPawnIndex <= 17) {
    $playerTwo.takeDebitToken(5);
    $playerTwo.takeMilitaryVPs(0);
    $playerOne.takeMilitaryVPs(10);
    return false;
  }

  if ($conflictPawnIndex >= 18) {
    militarySupremacist.set($playerOne);
    hasGameEnded.set(true);
    return true;
  }
}

const hasScientificSupremacy = ({ differentSciences }) =>
  get(differentSciences) === 6;

const endTurn = $currentPlayer => {
  if (hasScientificSupremacy($currentPlayer)) {
    scientificSupremacist.set($currentPlayer);
    hasGameEnded.set(true);

    return;
  }

  if (hasMilitarySupremacy()) return;

  currentPlayer.set(playerControl.getNext());
};

export const buyCard = ({ card, slot }) => {
  try {
    const $currentPlayer = get(currentPlayer);

    const cardCost = $currentPlayer.getCardBuyValue(card);
    if (cardCost) $currentPlayer.pay(cardCost);

    removedCardSlots.update(arr => [slot, ...arr]);
    $currentPlayer.takeCard(card);

    actionsStack.update(a => [
      {
        player: $currentPlayer,
        action: { buyCard: { card, slot } }
      },
      ...a
    ]);

    endTurn($currentPlayer);
  } catch (e) {
    console.error(e);
  }
};

export const sellCard = ({ card, slot }) => {
  const $currentPlayer = get(currentPlayer);

  $currentPlayer.tradeCard();

  removedCardSlots.update(arr => [slot, ...arr]);
  discard.add(card);

  actionsStack.update(a => [
    {
      player: $currentPlayer,
      action: { sellCard: { card, slot } }
    },
    ...a
  ]);

  endTurn($currentPlayer);
};
