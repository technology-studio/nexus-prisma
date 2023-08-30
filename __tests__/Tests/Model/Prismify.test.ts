import { type Exact } from '@txo/types'

import { type Prismify } from '../../../src/Model/Prismify'

describe('Prismify Utility Type Tests', () => {
  it('should handle base types', () => {
    type Base = number | string | boolean
    type SuccessResult = Exact<Prismify<Base>, Base>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')
  })

  it('should handle null and undefined', () => {
    type Nullable = number | null | undefined
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const some: Prismify<Nullable> = 1
    type SuccessResult = Exact<Prismify<Nullable>, number | undefined>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')
  })

  it('should handle arrays', () => {
    type Arr = (number | null | undefined)[]
    type SuccessResult = Exact<Prismify<Arr>, (number | undefined)[]>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')
  })

  it('should handle objects', () => {
    type Obj = { a: number, b: string | null | undefined, c?: boolean }
    type Expected = { a: number, b: string | undefined, c?: boolean }
    type SuccessResult = Exact<Prismify<Obj>, Expected>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')
  })

  it('should handle nested structures', () => {
    type Nested = { a: { b: number | null | undefined, c: string[] }[] }
    type Expected = { a: { b: number | undefined, c: string[] }[] }
    type SuccessResult = Exact<Prismify<Nested>, Expected>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')
  })

  it('should handle arrays of nullable types', () => {
    type ArrOfNullable = (string | null)[]
    type SuccessResult = Exact<Prismify<ArrOfNullable>, (string | null)[]>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')
  })

  it('should handle nested arrays of nullable types', () => {
    type NestedArrOfNullable = (string | null)[][]
    type SuccessResult = Exact<Prismify<NestedArrOfNullable>, (string | null)[][]>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')
  })

  it('should handle objects with nested nullable properties', () => {
    type ObjWithNestedNullable = {
      a: {
        b: string | null,
        c: {
          d: number | undefined,
        },
      },
    }
    type Expected = {
      a: {
        b: string | null,
        c: {
          d: number | undefined,
        },
      },
    }
    type SuccessResult = Exact<Prismify<ObjWithNestedNullable>, Expected>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')
  })

  // Additional test cases for better coverage:

  it('should handle only undefined correctly', () => {
    type OnlyUndefined = undefined
    type SuccessResult = Exact<Prismify<OnlyUndefined>, undefined>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')
  })

  it('should handle only null correctly', () => {
    type OnlyNull = null
    type SuccessResult = Exact<Prismify<OnlyNull>, null>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')
  })

  it('should handle nested objects with mixed nullables', () => {
    type Mixed = {
      a: number | undefined | null,
      b: {
        c: string | undefined,
        d: boolean | null | undefined,
        e: null,
      },
    }
    type Expected = {
      a: number | undefined,
      b: {
        c: string | undefined,
        d: boolean | undefined,
        e: null,
      },
    }
    type SuccessResult = Exact<Prismify<Mixed>, Expected>
    const successResult: SuccessResult = 'exact-match'
    expect(successResult).toBe('exact-match')
  })
})
