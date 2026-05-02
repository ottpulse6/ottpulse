import { getPulseScore } from "./pulseService";

export const getTopPulseItems = (data, limit = 5) => {
  return [...data]
    .map(item => ({
      ...item,
      pulse: getPulseScore(item.id)
    }))
    .sort((a, b) => b.pulse - a.pulse)
    .slice(0, limit);
};