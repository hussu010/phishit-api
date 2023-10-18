const generateRandomUsername = (): string => {
  return Math.random().toString(36).substring(6);
};

export { generateRandomUsername };
