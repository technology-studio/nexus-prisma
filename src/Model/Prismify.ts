/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2023-08-19T11:08:22+02:00
 * @Copyright: Technology Studio
**/

import {
  type IsArray, type IsFunction, type IsPlainObject,
} from '@txo/types'

export type RemoveNullIfAlsoUndefined<TYPE> = null | undefined extends TYPE
  ? Exclude<TYPE, null>
  : TYPE

export type Prismify<TYPE> = RemoveNullIfAlsoUndefined<
TYPE extends IsFunction<TYPE>
  ? TYPE
  : TYPE extends IsArray<TYPE>
    ? PrismifyArray<TYPE>
    : TYPE extends IsPlainObject<TYPE>
      ? PrismifyObject<TYPE>
      : TYPE
>

export type PrismifyArray<TYPE> = TYPE extends (infer ITEM_TYPE)[] ? Prismify<ITEM_TYPE>[] : never

export type PrismifyObject<TYPE> = {
  [KEY in keyof TYPE]: Prismify<RemoveNullIfAlsoUndefined<TYPE[KEY]>>
}
