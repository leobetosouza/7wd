import { writable, derived, get } from 'svelte/store';

export default ({ name, color }) => {
    const tableau = writable([]);
    const coins = writable(7);

    const balance = derived([tableau, coins], ([$tableau, $coins]) => $tableau.reduce((acc, { effects }) => {
        const { coins = 0 } = effects;
        return acc + coins
    }, $coins));

    const vps = derived(tableau, $tableau => $tableau.reduce((acc, { effects }) => {
        const { vp = 0 } = effects;

        return acc + vp;
    }, 0));

    
    const shields = derived(tableau, $tableau => $tableau.reduce((acc, { effects }) => {
        const { shields = 0 } = effects;

        return acc + shields;
    }, 0));

    const stone = derived(tableau, $tableau => $tableau.reduce((acc, { effects }) => {
        const { stone = 0 } = effects;

        return acc + stone;
    }, 0));

    const wood = derived(tableau, $tableau => $tableau.reduce((acc, { effects }) => {
        const { wood = 0 } = effects;

        return acc + wood;
    }, 0));

    const clay = derived(tableau, $tableau => $tableau.reduce((acc, { effects }) => {
        const { clay = 0 } = effects;

        return acc + clay;
    }, 0));
    
    const glass = derived(tableau, $tableau => $tableau.reduce((acc, { effects }) => {
        const { glass = 0 } = effects;

        return acc + glass;
    }, 0));

    const papyrus = derived(tableau, $tableau => $tableau.reduce((acc, { effects }) => {
        const { papyrus = 0 } = effects;

        return acc + papyrus;
    }, 0));
    
    const stock = derived(tableau, $tableau => $tableau.reduce((acc, { effects }) => {
        const { stock } = effects;
        
        if (!stock) return acc;
        if (Array.isArray(stock)) return [ ...acc, ...stock ];
        return [ ...acc, stock ];
    }, []));

    const chain = derived(tableau, $tableau => $tableau.reduce((acc, { effects }) => {
        const { chain } = effects;

        if (!chain) return acc;
        return [ ...acc, chain ];
    }, []));
    
    return {
        tableau,
        coins: balance,
        shields, vps,
        stone, wood, clay, glass, papyrus,
        stock, chain,
        name: writable(name),
        color: writable(color),
        takeCard: card => tableau.update(arr => [card, ...arr]),
        takeDebit: debit => {
            const $balance = get(balance);

            if (debit <= $balance) coins.update(c => c - debit);
            else throw new Error('Not enougth coins');
        } 
    };
}