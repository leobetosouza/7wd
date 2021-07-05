import { shuffle } from '../utils';

const resourcesPromise = (async () => {
    const res = await fetch('./resources.json');

    if (!res.ok) throw new Error('GET resources.json error');

    return res.json();
})();


export const get1stAgeCards = async () => {
    const resources = await resourcesPromise;

    const cards = shuffle(resources['1st-age']);
    const reserve = cards.splice(0, 3);

    return { cards, reserve };
};

export const get2ndAgeCards = async () => {
    const resources = await resourcesPromise;

    const cards = shuffle(resources['2nd-age']);
    const reserve = cards.splice(0, 3);

    return { cards, reserve };
};

export const get3rdAgeCards = async () => {
    const resources = await resourcesPromise;

    const guilds = shuffle(resources['guilds']).slice(0, 3);
    const cardsRaw = shuffle(resources['3rd-age']);

    const reserve = cardsRaw.splice(0, 3);
    const cards = shuffle([ ...cardsRaw, ...guilds ]);

    return { cards, reserve };
};

export const get1stAgeTableLayout = async () => {
    const resources = await resourcesPromise;

    return resources['table-layouts']['1st-age'];
};

export const get2ndAgeTableLayout = async () => {
    const resources = await resourcesPromise;

    return resources['table-layouts']['2nd-age'];
};

export const get3rdAgeTableLayout = async () => {
    const resources = await resourcesPromise;

    return resources['table-layouts']['3rd-age'];
};

export const getMilitaryBoardLayout = async () => {
    const resources = await resourcesPromise;

    return resources['military-board'];
};

