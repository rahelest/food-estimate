export function serial(n: number) {
  return new Array(n).fill(1).map((e, i) => i)
}

export function sort<T>(arr: T[], comparator: (a: T, b: T) => number): T[] {
  const copy = arr.slice(0)
  copy.sort(comparator)
  return copy
}

type Grouped<T> = {
  [key: string]: T[]
}

export function groupBy<T>(arr: T[], grouper: (a: T) => string): Grouped<T> {
  return arr.reduce((acc, cur) => {
    const field = grouper(cur)
    acc[field] = [...(acc[field] || []), cur]
    return acc
  }, {} as Grouped<T>)
}
