export function getRandomSoldierCount() {
  const weights = {
    5: 0.05, // 5% chance
    10: 0.5, // 50% chance
    15: 0.2, // 20% chance
    20: 0.2, // 20% chance
    25: 0.05, // 5% chance
  };

  const rand = Math.random();
  let sum = 0;

  for (const key in weights) {
    sum += weights[key];
    if (rand <= sum) {
      return parseInt(key);
    }
  }
  return 10; // Default value if all else fails
}
