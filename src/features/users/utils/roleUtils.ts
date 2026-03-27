export const isSeniorOrEmployer = (role: string) => {
  const r = role.toLowerCase();
  return r.includes("senior") || r === "employer";
};
