import { writable, derived, get } from 'svelte/store';

export const agePromise = writable();
export const currentAgeName = writable('');
export const isAgeInitSetupInProgress = writable(false);

export const currentPlayer = (() => {
  const player = writable({});
  const { subscribe, set } = player;

  return {
    subscribe,
    set: p => {
      set(get(p));
    },
  };
})();

export const playerOne = writable(writable({}));
export const playerTwo = writable(writable({}));
export const scientificSupremacist = writable();
export const militarySupremacist = writable();

export const hasGameEnded = writable(false);

export const removedCardSlots = writable([]);
export const tableLayout = writable([]);
export const discard = (() => {
  const cards = writable([]);
  const { subscribe, update } = cards;

  return {
    subscribe,
    add: (...args) => update(arr => [...args, ...arr]),
  };
})();

export const reserve = (() => {
  const cards = writable([]);
  const { subscribe, update } = cards;

  return {
    subscribe,
    add: (...args) => update(arr => [...args, ...arr]),
  };
})();

export const activeCards = (() => {
  const cards = writable([]);
  const { subscribe, set } = cards;

  let count = 0;

  return {
    subscribe,
    next: () => get(cards)[count++],
    set: val => {
      removedCardSlots.set([]);
      set(val);
      count = 0;
    },
  };
})();

export const actionsStack = writable([]);

export const militaryLayout = writable([]);
export const conflictTokens = writable([]);

export const conflictPawnIndex = derived(actionsStack, _ => {
    const $currentPlayer = get(currentPlayer);
    const playerShields = $currentPlayer?.$resources?.shields ?? 0;
    const opponentShields = $currentPlayer?.getOpponentPlayer?.()?.$resources?.shields ?? 0;

    let firstShields, lastShields;

    if (get(playerOne) === $currentPlayer) {
      firstShields = playerShields;
      lastShields = opponentShields;
    } else {
      firstShields = opponentShields;
      lastShields = playerShields;
    }

    const diff = (firstShields - lastShields) || 0;
    return Math.max(Math.min(diff + 9, 18), 0);
  }
);
