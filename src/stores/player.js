import { writable } from 'svelte/store';

export default ({ name, color }) => {
    const tableau = writable([]);
    const coins = writable(0);
    const shields = writable(0);
    const vps = writable(0);
    
    return {
        coins, shields, vps, tableau,
        name: writable(name),
        color: writable(color),
        takeCard: card => tableau.update(arr => [card, ...arr])
    };
}