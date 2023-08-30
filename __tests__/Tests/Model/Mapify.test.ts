/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2023-08-24T09:08:45+02:00
 * @Copyright: Technology Studio
 */

import { type Exact } from '@txo/types'

import {
  type Mapify, mapify,
} from '../../../src'

describe('Mapify Utility Type Tests', () => {
  it('should handle base types', () => {
    type Base = number | string | boolean

    // eslint-disable-next-line @typescript-eslint/ban-types
    type MapDec = {}

    type SuccessResult = Exact<Mapify<Base, MapDec>, Base>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')

    const data: Base = 42
    const mapping: MapDec = {}
    expect(mapify(data, mapping)).toBe(42)
  })

  it('should handle simple object with renamed keys', () => {
    type Obj = { a: number, b: string }
    type MapDec = { a: { key: 'x' }, b: { key: 'y' } }
    type Expected = { x: number, y: string }
    type SuccessResult = Exact<Mapify<Obj, MapDec>, Expected>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')

    const data: Obj = { a: 1, b: 'text' }
    const mapping: MapDec = { a: { key: 'x' }, b: { key: 'y' } }
    expect(mapify(data, mapping)).toEqual({ x: 1, y: 'text' })
  })

  it('should handle simple object with value transformation', () => {
    type Obj = { a: number, b: string }
    type MapDec = { a: { value: (n: number) => string } }
    type Expected = { a: string, b: string }
    type SuccessResult = Exact<Mapify<Obj, MapDec>, Expected>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')

    const data: Obj = { a: 1, b: 'text' }
    const mapping: MapDec = { a: { value: (n: number) => `${n}` } }
    expect(mapify(data, mapping)).toEqual({ a: '1', b: 'text' })
  })

  it('should handle arrays object with value transformation', () => {
    type Arr = number[]
    type MapDec = ({ value: (n: number) => string })[]
    type Expected = string[]
    type SuccessResult = Exact<Mapify<Arr, MapDec>, Expected>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')

    const data: Arr = [1, 2, 3]
    const mapping: MapDec = [{ value: (n: number) => `${n}` }]
    expect(mapify(data, mapping)).toEqual(['1', '2', '3'])
  })

  it('should handle shallow arrays object with value transformation', () => {
    type Arr = ({ a: number })[]
    type MapDec = ({ a: { value: (n: number) => string } })[]
    type Expected = ({ a: string })[]
    type SuccessResult = Exact<Mapify<Arr, MapDec>, Expected>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')

    const data: Arr = [{ a: 1 }, { a: 2 }]
    const mapping: MapDec = [{ a: { value: (n) => `${n}` } }]
    expect(mapify(data, mapping)).toEqual([{ a: '1' }, { a: '2' }])
  })

  it('should handle objects with nested structures', () => {
    type Nested = { a: { b: number }, c: string[] }
    type MapDec = { a: { b: { key: 'd' } } }
    type Expected = { a: { d: number }, c: string[] }
    type SuccessResult = Exact<Mapify<Nested, MapDec>, Expected>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')

    const data: Nested = { a: { b: 1 }, c: ['string1', 'string2'] }
    const mapping: MapDec = { a: { b: { key: 'd' } } }
    expect(mapify(data, mapping)).toEqual({ a: { d: 1 }, c: ['string1', 'string2'] })
  })

  it('should handle arrays of nullable types', () => {
    type ArrOfNullable = (string | null)[]
    type MapDec = [{ value: (s: string | null) => number | null }]
    type Expected = (number | null)[]
    type SuccessResult = Exact<Mapify<ArrOfNullable, MapDec>, Expected>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')

    const data: ArrOfNullable = ['string1', null, 'string2']
    const mapping: MapDec = [{ value: (s) => s != null ? s.length : null }]
    expect(mapify(data, mapping)).toEqual([7, null, 7])
  })

  it('should handle nested arrays with key renaming and value transformation, and keep unmapped keys', () => {
    type NestedArr = { data: (string | null)[][], extraKey: string }
    type MapDec = { data: [{ value: (s: string | null) => number | null }][] }
    type Expected = { data: (number | null)[][], extraKey: string }
    type SuccessResult = Exact<Mapify<NestedArr, MapDec>, Expected>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')

    const data: NestedArr = { data: [['string1', null], ['string2']], extraKey: 'extraValue' }
    const mapping: MapDec = { data: [[{ value: (s: string | null) => s != null ? s.length : null }]] }
    const result = mapify(data, mapping)
    expect(result).toEqual({ data: [[7, null], [7]], extraKey: 'extraValue' })
    expect(result.extraKey).toEqual(data.extraKey)
  })

  it('should handle deep mixed structure with nullability and optionality, and keep unmapped keys', () => {
    type Complex = {
      a?: { b: { c: string | null, d?: number[] } | undefined } | null,
      e: (boolean | null)[][],
      extraKey: string,
    }
    type MapDec = {
      a: { b: { c: { key: 'x', value: (s: string | null) => number | null } } },
      e: [{ value: (b: boolean | null) => string | null }][],
    }
    type Expected = {
      a?: { b: { x: number | null, d?: number[] } | undefined } | null,
      e: (string | null)[][],
      extraKey: string,
    }
    type SuccessResult = Exact<Mapify<Complex, MapDec>, Expected>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')

    const data: Complex = { a: { b: { c: 'string1', d: [1, 2] } }, e: [[true, null], [false]], extraKey: 'extraValue' }
    const mapping: MapDec = {
      a: { b: { c: { key: 'x', value: (s) => s != null ? s.length : null } } },
      e: [[{ value: (b: boolean | null) => b != null ? b.toString() : null }]],
    }
    const result = mapify(data, mapping)
    expect(result).toEqual({ a: { b: { x: 7, d: [1, 2] } }, e: [['true', null], ['false']], extraKey: 'extraValue' })
    expect(result.extraKey).toEqual(data.extraKey)
  })

  it('should fail for incorrect key renaming', () => {
    type Obj = { a: number }
    type MapDec = { a: { key: 'x' } }
    type WrongExpected = { a: number }
    type FailureResult = Exact<Mapify<Obj, MapDec>, WrongExpected>
    const failureResult: FailureResult = 'differs'
    expect(failureResult).toBe('differs')
  })

  it('should fail for incorrect value transformation', () => {
    type Arr = string[]
    type MapDec = [{ value: (s: string) => number }]
    type WrongExpected = string[]
    type FailureResult = Exact<Mapify<Arr, MapDec>, WrongExpected>
    const failureResult: FailureResult = 'differs'
    expect(failureResult).toBe('differs')
  })

  it('should fail for missing keys in nested structure', () => {
    type Nested = { a: { b: number } }
    type MapDec = { a: { b: { key: 'd' } } }
    type WrongExpected = { a: number }
    type FailureResult = Exact<Mapify<Nested, MapDec>, WrongExpected>
    const failureResult: FailureResult = 'differs'
    expect(failureResult).toBe('differs')
  })

  it('should fail for incorrect handling of nullability', () => {
    type Nullable = (string | null)[]
    type MapDec = [{ value: (s: string | null) => string }]
    type WrongExpected = (string | null)[]
    type FailureResult = Exact<Mapify<Nullable, MapDec>, WrongExpected>
    const failureResult: FailureResult = 'differs'
    expect(failureResult).toBe('differs')
  })

  it('should fail for incorrect mapping of mixed structure', () => {
    type Complex = { a: number | null, b: { c: string | undefined } }
    type MapDec = { a: { value: (n: number | null) => string }, b: { c: { key: 'x' } } }
    type WrongExpected = { a: string, b: { c: string } }
    type FailureResult = Exact<Mapify<Complex, MapDec>, WrongExpected>
    const failureResult: FailureResult = 'differs'
    expect(failureResult).toBe('differs')
  })

  it('should preserve references for deep objects', () => {
    const deepObject = { x: 1, y: { z: 2 } }
    const data = { a: { b: deepObject } }

    const mapping = { a: { b: {} } }
    const result = mapify(data, mapping)

    expect(result.a.b).toBe(deepObject)
  })

  it('should preserve references for deep arrays', () => {
    const deepArray = [1, [2, 3], 4]
    const data = { a: { b: deepArray } }

    const mapping = { a: { b: [] } }
    const result = mapify(data, mapping)

    expect(result.a.b).toBe(deepArray)
  })

  it('should preserve references for mixed structures', () => {
    const deepObject = { x: 1 }
    const deepArray = [1, deepObject, 2]
    const data = { a: { b: { c: deepArray } } }

    const mapping = { a: { b: { c: [] } } }
    const result = mapify(data, mapping)

    expect(result.a.b.c).toBe(deepArray)
    expect(result.a.b.c[1]).toBe(deepObject)
  })
})
