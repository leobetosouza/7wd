import { writable, derived, get } from 'svelte/store';
import { currentPlayer, playerOne, playerTwo } from './index';
import { permuteAcc, listOfGroups } from '../utils';

export default class Player {
  tableau = writable([]);
  _coins = writable(7);
  _militaryVPs = writable(0);
  _store = writable(this);

  constructor ({ name, color }) {
    this.color = writable(color);
    this.name = writable(name);
  }

  resources = derived(
    [this.tableau, this._coins, this._militaryVPs],
    ([$tableau, $coins, $militaryVPs]) => {
      const resources = $tableau.reduce(
        (acc, { effects }) => {
          const { chain, science, stock, or } = effects;

          acc.balance += effects.coins ?? 0;
          acc.vps += effects.vp ?? 0;
          acc.shields += (effects.shields ? effects.shields + 9 : 0) ?? 0;
          acc.wood += effects.wood ?? 0;
          acc.stone += effects.stone ?? 0;
          acc.clay += effects.clay ?? 0;
          acc.glass += effects.glass ?? 0;
          acc.papyrus += effects.papyrus ?? 0;

          if (chain) acc.chains.push(chain);
          if (science) acc.sciences.push(science);
          if (or) acc.ors.push(or);

          if (stock) {
            if (Array.isArray(stock)) acc.stocks = [...acc.stocks, ...stock]
            else acc.stocks.push(stock);
          }

          return acc;
        },
        {
          balance: $coins, vps: $militaryVPs, shields: 0,
          wood: 0, stone: 0, clay: 0, glass: 0, papyrus: 0,
          sciences: [], ors: [], chains: [], stocks: []
        }
      );

      resources.differentSciences = new Set(resources.sciences).size;

      resources.permutedOrs = resources.ors.length
        ? permuteAcc(listOfGroups(resources.ors))
        : [];

      delete resources.ors;

      return resources;
    }
  );

  getOpponentPlayer = () => {
    const $playerOne = get(playerOne);

    return (get(currentPlayer) === $playerOne) ? get(playerTwo) : $playerOne;
  };

  countCardsByType(testTypes) {
    const reducer = testType => this.$tableau.reduce(
      (acc, { type }) => (testType === type ? acc + 1 : acc),
      0
    );

    if (Array.isArray(testTypes)) {
      return testTypes.reduce(
        (acc, type) => acc + reducer(type),
        0
      );
    }

    return reducer(testTypes);
  }

  takeCard(card) {
    this.tableau.update(tableau => [ card, ...tableau ]);

    const foreachEffect = card.effects['foreach-card'];

    if (foreachEffect?.where === 'your-city') {
      const count = this.countCardsByType(foreachEffect.type);
      const newCoins = foreachEffect.reward.coins || 0;
      const gain = count * newCoins;

      if (gain) this._coins.update(c => c + gain);
    }


    if (
      foreachEffect?.where === 'most-of-type-city' &&
      foreachEffect?.reward?.coins
    ) {

      const currentPlayerCount = this.countCardsByType(foreachEffect.type);
      const opponentPlayerCount =
        this.getOpponentPlayer().countCardsByType(foreachEffect.type);

      const newCoins = foreachEffect.reward.coins;

      const gain =
        Math.max(currentPlayerCount, opponentPlayerCount) * newCoins;

      if (gain) this._coins.update(c => c + gain);
    }

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

  tradeCard() {
    this._coins.update(c => c + this.cardTradeValue);
    this._store.set(this);
  }

  get cardTradeValue() {
    const tradeValue = this.countCardsByType('trade');

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

};
