export default function getRandom(index = 1) {
    return `${Date.now()}${Math.floor(Math.random() * (1 - 100) + 100)}${
      index
    }`;
  }