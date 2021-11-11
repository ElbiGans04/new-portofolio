export default function changeFirstWord(word) {
    if (typeof word !== "string") return;
    return `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`;
}