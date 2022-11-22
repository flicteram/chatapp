export default function truncateText(text: string, start: number, end: number) {
  if (text.length < end) {
    return text
  }
  return `${text.slice(start, end)}...`
}