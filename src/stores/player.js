import { writable, derived, get } from 'svelte/store';
import { currentPlayer, playerOne, playerTwo } from './index';
import { permuteAcc, listOfGroups } from '../utils';
import { conflictTokens } from './index';
import { chooseProgressToken } from '../actions';

export default class Player {
  tableau = writable([]);
  debitTokens = writable([]);
  takenProgressTokens = writable({});

  _coins = writable(7);
  _militaryVPs = writable(0);
  _store = writable(this);

  constructor ({ name, color, idx }) {
    this.color = writable(color);
    this.name = writable(name);
    this.idx = idx;
  }

  resources = derived(
    [this.tableau, this._coins, this._militaryVPs],
    ([$tableau, $coins, $militaryVPs]) => {
      const resources = $tableau.reduceRight(
        (acc, { effects, type }) => {
          const { chain, science, stock, or } = effects;

          acc.balance += effects.coins ?? 0;
          acc.vps += effects.vp ?? 0;
          acc.shields += effects.shields ?? 0;
          acc.wood += effects.wood ?? 0;
          acc.stone += effects.stone ?? 0;
          acc.clay += effects.clay ?? 0;
          acc.glass += effects.glass ?? 0;
          acc.papyrus += effects.papyrus ?? 0;

          if (chain) acc.chains.push(chain);
          if (or) acc.ors.push(or);

          if (science) {
            const i = acc.sciences.indexOf(science);

            if (i === -1) {
              acc.sciences.push(science);
            } else {
              const pair = [ science, science ];
              acc.sciences.splice(i, 1, pair);
            }
          }

          if (stock) {
            if (Array.isArray(stock)) acc.stocks = [...acc.stocks, ...stock]
            else acc.stocks.push(stock);
          }

          acc.cards[type] += 1;

          if (effects['foreach-card']?.reward?.vp) {
            acc['foreach-card'].push(effects['foreach-card']);
          }

          acc.chains.sort();

          return acc;
        },
        {
          balance: $coins, vps: $militaryVPs, shields: 0,
          wood: 0, stone: 0, clay: 0, glass: 0, papyrus: 0,
          sciences: [], ors: [], chains: [], stocks: [],
          cards: {
            raw: 0, manufacture: 0, civic: 0, trade: 0, military: 0,
            science: 0, guild: 0, 'progress-token': 0, wonder: 0
          },
          'foreach-card': [],
        }
      );

      resources.differentSciences = new Set(resources.sciences).size;

      resources.permutedOrs = resources.ors.length
        ? permuteAcc(listOfGroups(resources.ors))
        : [];

      return resources;
    }
  );

  getOpponentPlayer = () => {
    const $playerOne = get(playerOne);

    return (get(currentPlayer) === $playerOne) ? get(playerTwo) : $playerOne;
  };

  countCardsByType(testTypes) {
    if (Array.isArray(testTypes)) {
      return testTypes.reduce(
        (acc, type) => acc + this.$resources.cards[type],
        0
      );
    }

    return this.$resources.cards[testTypes];
  }

  async checkScienceProgress() {
    for (const science of this.$resources.sciences) {
      if (Array.isArray(science) && !this.$takenProgressTokens[science[0]]) {
        return this.takeProgressToken(science[0]);
      }
    }

    return;
  }

  async takeProgressToken(science) {
    const progressToken = await chooseProgressToken();

    this.takenProgressTokens.update(o => ({ ...o, [science]: true }));
    this.tableau.update(tableau => [ progressToken, ...tableau ]);
  }

  takeCoinsIfForeachCardEffect(card) {
    const foreachEffect = card.effects['foreach-card'];

    if (!foreachEffect?.reward?.coins) return;

    if (foreachEffect?.where === 'your-city') {
      const count = this.countCardsByType(foreachEffect.type);
      const newCoins = foreachEffect.reward.coins || 0;
      const gain = count * newCoins;

      if (gain) this._coins.update(c => c + gain);
    }

    if (foreachEffect?.where === 'most-of-type-city') {

      const currentPlayerCount = this.countCardsByType(foreachEffect.type);
      const opponentPlayerCount =
        this.getOpponentPlayer().countCardsByType(foreachEffect.type);

      const newCoins = foreachEffect.reward.coins;

      const gain =
        Math.max(currentPlayerCount, opponentPlayerCount) * newCoins;

      if (gain) this._coins.update(c => c + gain);
    }
  }

  async takeCard(card) {
    this.tableau.update(tableau => [ card, ...tableau ]);

    this.takeCoinsIfForeachCardEffect(card);

    await this.checkScienceProgress();

    this._store.set(this);
  }

  getEndGameVPs() {
    const playerResources = this.$resources;

    const cardsVPs = playerResources.vps;
    const coinsVPs = Math.floor(playerResources.balance / 3);

    const endGameEffectsVPs = this.$tableau.reduce((acc, { effects }) => {
      const foreachEffect = effects['foreach-card'];

      if (foreachEffect?.where === 'most-of-type-city') {
        if (foreachEffect.type === 'coins') {
          const currentPlayerCoins = playerResources.balance;
          const opponentCoins = this.getOpponentPlayer().$resources.balance;

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
          const currentPlayerCount = this.countCardsByType(foreachEffect.type);
          const opponentPlayerCount =
            this.getOpponentPlayer().countCardsByType(foreachEffect.type)

          const gain =
            Math.max(currentPlayerCount, opponentPlayerCount) *
            foreachEffect.reward.vp;

          return acc + gain;
        }
      }

      if (foreachEffect?.where === 'your-city' && foreachEffect?.reward?.vp) {
        const count = this.countCardsByType(foreachEffect.type);
        const gain = count * foreachEffect.reward.vp;

        return acc + gain;
      }

      return acc;
    }, 0);

    return cardsVPs + coinsVPs + endGameEffectsVPs;
  }

  getCardBuyValue({ cost }) {
    if (!cost) return 0;

    const playerResources = this.$resources;
    const { chains } = playerResources;

    if (cost.chain & chains.includes(cost.chain)) return 0;

    const { permutedOrs, stocks } = playerResources;

    const opponentResources = this.getOpponentPlayer().$resources;

    const resources = [
      ['stone', playerResources.stone, opponentResources.stone],
      ['wood', playerResources.wood, opponentResources.wood],
      ['clay', playerResources.clay, opponentResources.clay],
      ['glass', playerResources.glass, opponentResources.glass],
      ['papyrus', playerResources.papyrus, opponentResources.papyrus],
    ];

    const calcCost = (orGroup = []) => {
      let accCost = 0;

      for (let [resourceName, playerResource, opponentResource] of resources) {
        const groupCount = orGroup[resourceName] ?? 0;
        const resourceCost =
          (cost[resourceName] ?? 0) - (playerResource + groupCount);

        if (resourceCost > 0) {
          accCost += stocks.includes(resourceName)
            ? resourceCost
            : resourceCost * (opponentResource + 2);
        }
      }

      return accCost + (cost.coins ?? 0);
    };

    if (!permutedOrs.length) {
      return calcCost();
    }

    const orCosts = permutedOrs.map(calcCost);

    return Math.min(...orCosts);
  }

  pay(coins) {
    if (coins > this.$resources.balance) throw new Error('Not enough coins');

    this._coins.update(c => c - coins);
    this._store.set(this);
  }

  takeDebit(coins) {
    const debit = this.$resources.balance - coins;

    if (debit >= 0) this.pay(coins);
    else this.pay(coins + debit);
  }

  takeDebitToken(value) {
    const $conflictTokens = get(conflictTokens);

    for (let debit of $conflictTokens) {
      if (!this.$debitTokens.includes(debit)) {
        this.debitTokens.update(arr => [...arr, debit]);
        this.takeDebit(debit);
      }
      if (debit === value) break;
    }
  }

  tradeCard() {
    this._coins.update(c => c + this.cardTradeValue);
    this._store.set(this);
  }

  get cardTradeValue() {
    const tradeValue = this.$resources.cards['trade'];

    return tradeValue + 2;
  }

  takeMilitaryVPs(vps) {
    this._militaryVPs.set(vps);
    this._store.set(this);
  }

  isCurrentPlayer() {
    return this === get(currentPlayer);
  }

  subscribe(subscriber) {
    return this._store.subscribe(subscriber)
  }

  get $name() {
    return get(this.name);
  }

  get $color() {
    return get(this.color);
  }

  get $tableau() {
    return get(this.tableau);
  }

  get $resources() {
    return get(this.resources);
  }

  get $debitTokens() {
    return get(this.debitTokens);
  }

  get $takenProgressTokens() {
    return get(this.takenProgressTokens);
  }

};
