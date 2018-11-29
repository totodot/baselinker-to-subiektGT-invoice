const nipIsValid = (nip) => {
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  const clearNip = nip.replace(/[\s-]/g, '');

  if (clearNip.length === 10 && parseInt(clearNip, 10) > 0) {
    const sum = weights.reduce((prev, next, i) => {
      const val = prev + next * clearNip[i];
      return val;
    }, 0);
    return sum % 11 === Number(clearNip[9]);
  }
  return false;
};

const removeSeparator = nip => nip.replace(/-/g, '').replace(/ /g, '');

const getNipVariants = (nip) => {
  const n = removeSeparator(nip);
  return [
    n,
    [n.slice(0, 3), n.slice(3, 6), n.slice(6, 8), n.slice(8, 10)].join('-'),
    [n.slice(0, 3), n.slice(3, 5), n.slice(5, 7), n.slice(7, 10)].join('-'),
  ];
};

module.exports = {
  nipIsValid,
  removeSeparator,
  getNipVariants,
};
