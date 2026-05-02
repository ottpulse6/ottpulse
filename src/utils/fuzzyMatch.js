export const similarity = (a, b) => {
  let longer = a.length > b.length ? a : b;
  let shorter = a.length > b.length ? b : a;

  if (longer.length === 0) return 1;

  return (
    (longer.length - editDistance(longer, shorter)) /
    longer.length
  );
};

const editDistance = (a, b) => {
  const dp = [];

  for (let i = 0; i <= b.length; i++) {
    dp[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      dp[i][j] =
        b[i - 1] === a[j - 1]
          ? dp[i - 1][j - 1]
          : Math.min(
              dp[i - 1][j - 1] + 1,
              dp[i][j - 1] + 1,
              dp[i - 1][j] + 1
            );
    }
  }

  return dp[b.length][a.length];
};