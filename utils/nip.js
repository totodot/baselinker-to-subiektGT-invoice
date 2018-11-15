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

const removeSeparator = nip => nip.replace(/-/g, '');

module.exports = {
  nipIsValid,
  removeSeparator,
};
