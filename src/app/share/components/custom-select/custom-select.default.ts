export const USERS = Array.from({ length: 50 }, (_, i) => {
  const num = (i + 1).toString().padStart(2, '0');
  return {
    label: `user${num}`,
    value: `user${num}`,
  };
});
