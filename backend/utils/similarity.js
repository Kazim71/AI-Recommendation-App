// Precompute token-based similarity (O(n))
export function preprocessName(name) {
  return name.toLowerCase().split(/\W+/).filter(Boolean);
}

export function tokenScore(aTokens, bTokens) {
  const setB = new Set(bTokens);
  let common = 0;
  for (const t of aTokens) if (setB.has(t)) common++;
  return common / ((aTokens.length + bTokens.length) / 2);
}
