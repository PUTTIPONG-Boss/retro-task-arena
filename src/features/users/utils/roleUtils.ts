export const isSeniorOrAdmin = (role: string) => {
  const r = role.toLowerCase();
  return r.includes("senior") || r === "admin";
};
