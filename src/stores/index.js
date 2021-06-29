import { writable } from 'svelte/store';

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
        next: () => {
            let card;

            subscribe(arr => {
                card = arr[count++];
            });

            return card;
        },
        set: (val) => {
            removedCardSlots.set([])
            set(val);
            count = 0;
        }
    };
})();