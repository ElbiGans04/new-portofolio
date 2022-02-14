export default function changeFirstWord(word: string) {
  return `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`;
}
