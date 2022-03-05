export default function parseDate(data: string) {
  const date = new Date(data);
  const month =
    date.getMonth() + 1 < 10
      ? `0${date.getMonth() + 1}`
      : `${date.getMonth() + 1}`;

  return `${date.getFullYear()}-${month}-${
    date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  }`;
}
