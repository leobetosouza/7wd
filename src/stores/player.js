import { writable, derived, get } from 'svelte/store';
import { currentPlayer, playerOne, playerTwo } from './index';
import { permuteAcc } from '../utils';

const getOpponentPlayer = () => {
  const $playerOne = get(playerOne);

  if (get(currentPlayer) === $playerOne) return get(playerTwo);
  else return $playerOne;
};

export default ({ name, color }) => {
  const colorName = writable(color);
  const tableau = writable([]);
  const coins = writable(7);
  const militaryVPs = writable(0);

  const balance = derived([tableau, coins], ([$tableau, $coins]) =>
    $tableau.reduce((acc, { effects }) => {
      const { coins = 0 } = effects;
      return acc + coins;
    }, $coins)
  );

  const vps = derived([tableau, militaryVPs], ([$tableau, $militaryVPs]) =>
    $tableau.reduce((acc, { effects }) => {
      const { vp = 0 } = effects;

      return acc + vp;
    }, $militaryVPs)
  );

  const shields = derived(tableau, $tableau =>
    $tableau.reduce((acc, { effects }) => {
      const { shields = 0 } = effects;

      return acc + shields;
    }, 0)
  );

  const stone = derived(tableau, $tableau =>
    $tableau.reduce((acc, { effects }) => {
      const { stone = 0 } = effects;

      return acc + stone;
    }, 0)
  );

  const wood = derived(tableau, $tableau =>
    $tableau.reduce((acc, { effects }) => {
      const { wood = 0 } = effects;

      return acc + wood;
    }, 0)
  );

  const clay = derived(tableau, $tableau =>
    $tableau.reduce((acc, { effects }) => {
      const { clay = 0 } = effects;

      return acc + clay;
    }, 0)
  );

  const glass = derived(tableau, $tableau =>
    $tableau.reduce((acc, { effects }) => {
      const { glass = 0 } = effects;

      return acc + glass;
    }, 0)
  );

  const papyrus = derived(tableau, $tableau =>
    $tableau.reduce((acc, { effects }) => {
      const { papyrus = 0 } = effects;

      return acc + papyrus;
    }, 0)
  );

  const stock = derived(tableau, $tableau =>
    $tableau.reduce((acc, { effects }) => {
      const { stock } = effects;

      if (!stock) return acc;
      if (Array.isArray(stock)) return [...acc, ...stock];
      return [...acc, stock];
    }, [])
  );

  const chain = derived(tableau, $tableau =>
    $tableau.reduce((acc, { effects }) => {
      const { chain } = effects;

      if (!chain) return acc;
      return [...acc, chain];
    }, [])
  );

  const differentSciences = derived(
    tableau,
    $tableau =>
      $tableau.reduce((acc, { effects }) => {
        const { science } = effects;

        if (!science) return acc;
        if (acc.includes(science)) return acc;
        return [...acc, science];
      }, []).length
  );

  const orResources = derived(tableau, $tableau => {
    console.log('or');
    const ors = $tableau.reduce((acc, { effects }) => {
      const { or } = effects;

      if (!or) return acc;

      return [...acc, { ...or }];
    }, []);

    if (!ors.length) return ors;

    const listOfGroups = ors.reduce(
      (acc, o) => [
        ...acc,
        Object.entries(o).reduce(
          (acc, [key, val]) => [...acc, { [key]: val }],
          []
        ),
      ],
      []
    );

    return permuteAcc(listOfGroups);
  });

  const countCards = (testType, tableau) =>
    get(tableau).reduce(
      (acc, { type }) => (testType === type ? acc + 1 : acc),
      0
    );

  return {
    tableau,
    coins: balance,
    shields,
    vps,
    stone,
    wood,
    clay,
    glass,
    papyrus,
    stock,
    chain,
    differentSciences,
    name: writable(name),
    color: colorName,
    setMilitaryVPs: vps => militaryVPs.set(vps),
    getEndGameVPs: () => {
      const cardsVPs = get(vps);
      const coinsVPs = Math.floor(get(balance) / 3);

      const endGameEffectsVPs = get(tableau).reduce((acc, { effects }) => {
        const foreachEffect = effects['foreach-card'];

        if (foreachEffect?.where === 'most-of-type-city') {
          if (foreachEffect.type === 'coins') {
            const currentPlayerCoins = get(balance);
            const opponentCoins = get(getOpponentPlayer().balance);

            return (
              acc +
              foreachEffect.reward.vp *
                Math.floor(
                  Math.max(currentPlayerCoins, opponentCoins) /
                    foreachEffect['divide-count-by']
                )
            );
          }

          if (foreachEffect.reward.vp) {
            const countCardsInTableau = tableau =>
              Array.isArray(foreachEffect.type)
                ? foreachEffect.type.reduce(
                    (acc, type) => acc + countCards(type, tableau),
                    0
                  )
                : countCards(foreachEffect.type, tableau);

            const currentPlayerCount = countCardsInTableau(tableau);
            const opponentPlayerCount = countCardsInTableau(
              getOpponentPlayer().tableau
            );
            const gain =
              Math.max(currentPlayerCount, opponentPlayerCount) *
              foreachEffect.reward.vp;

            return acc + gain;
          }
        }

        return acc;
      }, 0);

      return cardsVPs + coinsVPs + endGameEffectsVPs;
    },
    takeCard: card => {
      tableau.update(arr => [card, ...arr]);

      const foreachEffect = card.effects['foreach-card'];

      if (foreachEffect?.where === 'your-city') {
        const count = countCards(foreachEffect.type, tableau);
        const newCoins = foreachEffect.reward.coins || 0;
        const gain = count * newCoins;

        if (gain) coins.update(c => c + gain);
      }

      if (
        foreachEffect?.where === 'most-of-type-city' &&
        foreachEffect?.reward?.coins
      ) {
        const countCardsInTableau = tableau =>
          Array.isArray(foreachEffect.type)
            ? foreachEffect.type.reduce(
                (acc, type) => acc + countCards(type, tableau),
                0
              )
            : countCards(foreachEffect.type, tableau);

        const currentPlayerCount = countCardsInTableau(tableau);
        const opponentPlayerCount = countCardsInTableau(
          getOpponentPlayer().tableau
        );

        const newCoins = foreachEffect.reward.coins;

        const gain =
          Math.max(currentPlayerCount, opponentPlayerCount) * newCoins;

        if (gain) coins.update(c => c + gain);
      }
    },
    takeDebit: debit => {
      const $balance = get(balance);

      if (debit <= $balance) coins.update(c => c - debit);
      else throw new Error('Not enougth coins');
    },
    tradeCard: () => {
      const tradeValue = countCards('trade', tableau);

      coins.update(c => c + tradeValue + 2);
    },
    getCardBuyValue: ({ cost }) => {
      if (!cost) return 0;

      if (cost.chain & get(chain).includes(cost.chain)) {
        return 0;
      }

      const $orResources = get(orResources);
      const $stock = get(stock);

      const opponent = getOpponentPlayer();

      const resources = [
        ['stone', get(stone), get(opponent.stone)],
        ['wood', get(wood), get(opponent.wood)],
        ['clay', get(clay), get(opponent.clay)],
        ['glass', get(glass), get(opponent.glass)],
        ['papyrus', get(papyrus), get(opponent.papyrus)],
      ];

      const calcCost = orGroup => {
        let accCost = 0;

        for (let [resource, $store, $opponentStore] of resources) {
          const resourceCost =
            (cost[resource] || 0) -
            ($store + orGroup ? orGroup[resource] || 0 : 0);

          if (resourceCost > 0) {
            accCost += $stock.includes(resource)
              ? resourceCost
              : resourceCost * ($opponentStore + 2);
          }
        }

        return accCost + (cost.coins || 0);
      };

      if (!$orResources.length) {
        return calcCost();
      }

      const orCosts = $orResources.map(calcCost);

      return Math.min(...orCosts);
    },
    getCardSellValue: () => {
      return 2 + countCards('trade', tableau);
    },
    isCurrentPlayer: player => {
      return player === get(currentPlayer);
    },
    getOpponentPlayer,
    getColor: () => get(colorName),
    getBalance: () => get(balance),
  };
};
