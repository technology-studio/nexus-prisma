/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2021-04-24T10:04:89+02:00
 * @Copyright: Technology Studio
**/

export type NonNullIfUndefinedAndNull<TYPE> = undefined | null extends TYPE
  ? TYPE extends null
    ? never
    : TYPE
  : TYPE

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Prismify<TYPE> = TYPE extends (...args: any[]) => any
  ? TYPE
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  : TYPE extends any[]
    ? PrismifyArray<TYPE[number]>
    // eslint-disable-next-line @typescript-eslint/ban-types
    : TYPE extends object
      ? PrismifyObject<TYPE>
      : TYPE

export interface PrismifyArray<TYPE> extends Array<Prismify<NonNullIfUndefinedAndNull<TYPE>>> {}

export type PrismifyObject<TYPE> = {
  [KEY in keyof TYPE]: Prismify<NonNullIfUndefinedAndNull<TYPE[KEY]>>
}
