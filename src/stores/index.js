import { writable, get } from 'svelte/store';

export const currentPlayer = (() => {
    const player = writable({});
    const { subscribe, set } = player;

    return {
        subscribe,
        set: (p) => {
            set(get(p))
        }
    }

})();
export const playerOne = writable({});
export const playerTwo = writable({});

export const removedCardSlots = writable([]);
export const tableLayout = writable([]);
export const discard = (() => {
    const cards = writable([]);
    const { subscribe, update } = cards;

    return {
        subscribe,
        add: (...args) => update(arr => [...args, ...arr])
    }
})();

export const reserve = (() => {
    const cards = writable([]);
    const { subscribe, update } = cards;

    return {
        subscribe,
        add: (...args) => update(arr => [...args, ...arr])
    }
})();

export const activeCards = (() => {
    const cards = writable([]);
    const { subscribe, set } = cards;

    let count = 0;

    return {
        subscribe,
        next: () => get(cards)[count++],
        set: (val) => {
            removedCardSlots.set([])
            set(val);
            count = 0;
        }
    };
})();