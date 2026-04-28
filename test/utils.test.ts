import { describe, expect, it } from 'vitest'
import { timeToSeconds } from '../src/parse.js'
import { columnSumm, secondsToMinutes, sum } from '../src/utils.js'

describe('utils', () => {
  it('secondsToMinutes', () => {
    expect(secondsToMinutes(60)).toBe('1:00')
    expect(secondsToMinutes(65)).toBe('1:05')
    expect(secondsToMinutes(125)).toBe('2:05')
    expect(secondsToMinutes(0)).toBe('0:00')
    expect(secondsToMinutes(5.5)).toBe('0:05')
    expect(secondsToMinutes(-10)).toBe('0:00')
    expect(secondsToMinutes(Number.NaN)).toBe('0:00')
    expect(secondsToMinutes(Number.POSITIVE_INFINITY)).toBe('0:00')
  })

  it('sum', () => {
    expect(sum([1, 2, 3])).toBe(6)
    expect(sum([])).toBe(0)
    expect(sum([-1, 1])).toBe(0)
  })

  it('columnSumm', () => {
    expect(columnSumm([[1, 2], [3, 4]])).toEqual([4, 6])
    expect(columnSumm([[1], [2, 3]])).toEqual([3, 3])
    expect(columnSumm([])).toEqual([])
  })

  it('timeToSeconds', () => {
    expect(timeToSeconds('01:02:03')).toBe(3723)
    expect(timeToSeconds('00:00:00')).toBe(0)
    expect(timeToSeconds('00:01:05')).toBe(65)
  })
})
