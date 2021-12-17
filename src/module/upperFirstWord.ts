export default function changeFirstWord(word: string) {
    console.log(word)
    return `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`;
}