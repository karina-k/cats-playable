export function shuffle<T>(items: T[]) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const otherIndex = Math.floor(Math.random() * (index + 1));
    const item = items[index];

    items[index] = items[otherIndex];
    items[otherIndex] = item;
  }

  return items;
}
