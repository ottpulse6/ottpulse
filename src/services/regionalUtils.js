export const platformNames = {
  hoichoi: "Hoichoi (Bengali)",
  aha: "Aha (Telugu)",
  sunnxt: "SunNXT (South)",
  netflix: "Netflix India",
  prime: "Amazon Prime",
};

// 🔹 Normalize platform key
const normalizePlatform = (platform) => {
  return platform?.toLowerCase().replace(/\s+/g, "") || "others";
};

// 🔹 Group content by platform
export const groupByPlatform = (data) => {
  const groups = {};

  data.forEach((item) => {
    const key = normalizePlatform(item.platform);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(item);
  });

  return groups;
};

// 🔹 Get display name (safe fallback)
export const getPlatformDisplayName = (key) => {
  return platformNames[key] || key.toUpperCase();
};