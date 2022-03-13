export default function getRandom(index: number) {
  return `${Date.now()}${Math.floor(
    Math.random() * (1 - 100) + 100,
  )}${index}${Math.floor(Math.random() * (1 - 100) + 100)}${index}${Math.floor(
    Math.random() * (1 - 100) + 100,
  )}`;
}
