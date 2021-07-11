export const shuffle = array => {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const delay = async ms =>
  new Promise(resolve => setTimeout(() => resolve(), ms));

export const accObjs = (o1, o2) => {
  const entries = Object.entries(o2);
  const res = { ...o1 };

  for (let [key, val] of entries) {
    if (res.hasOwnProperty(key)) {
      res[key] += val;
    } else {
      res[key] = val;
    }
  }

  return res;
};

export const compObjs = (o1, o2) => {
  for (let [key, val] of Object.entries(o1)) {
    if (o2[key] !== val) return false;
  }
  for (let [key, val] of Object.entries(o2)) {
    if (o1[key] !== val) return false;
  }
  return true;
};

export const uniqByObj = arr =>
  arr.reduce((acc, o) => {
    if (acc.find(e => compObjs(e, o))) return acc;
    return [...acc, o];
  }, []);

export const zipAcc = (arr1, arr2) => {
  let res = [];

  for (let o1 of arr1) {
    for (let o2 of arr2) {
      res.push(accObjs(o1, o2));
    }
  }

  return res;
};

export const permuteAcc = groupList => {
  let acc = [...groupList[0]];

  for (let i = 1; i < groupList.length; i++) {
    acc = zipAcc(acc, groupList[1]);
  }

  return uniqByObj(acc);
};
