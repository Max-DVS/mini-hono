export const generateRandomName = () => {
  const adjectives = [
    "Happy",
    "Lucky",
    "Sunny",
    "Clever",
    "Swift",
    "Brave",
    "Bright",
  ];
  const nouns = ["Panda", "Tiger", "Eagle", "Dolphin", "Lion", "Wolf", "Bear"];

  const randomNoun = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomPronoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;

  return `${randomPronoun}${randomNoun}#${randomNumber}`;
};
