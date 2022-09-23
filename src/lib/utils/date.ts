export type UnixTime = number

const DAY_MILLIS = 1000 * 3600 * 24
const MONTH_MILLIS = DAY_MILLIS * 30

export function tomorrow(date: UnixTime = Date.now()) {
  return setMidnight(date) + DAY_MILLIS
}

export function formatDateWithWeekNames(date: UnixTime = Date.now()) {
  const dateObj = new Date(setMidnight(date))
  const weekDay = new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(dateObj)
  const day = dateObj.getUTCDate().toString().padStart(2, '0')
  const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0')
  return `${weekDay}, ${day}.${month}`
}

export function setMidnight(date: UnixTime): number {
  return new Date(date).setUTCHours(0, 0, 0)
}

export function isBefore(first: UnixTime, second: UnixTime): boolean {
  return first < second
}

export function parseDate(dateString: string): number {
  if (!dateString?.length) {
    return Infinity
  }

  const [day, month] = dateString.split('.').map(Number)
  const thisYear = new Date().getFullYear()
  const date = Date.UTC(thisYear, month - 1, day)
  if (date + MONTH_MILLIS > Date.now()) {
    return date
  }

  return Date.UTC(thisYear + 1, month - 1, day)
}
