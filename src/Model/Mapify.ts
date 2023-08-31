/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2023-08-21T06:08:15+02:00
 * @Copyright: Technology Studio
 */

import {
  type IsArray, type IsFunction, type IsPlainObject,
} from '@txo/types'

export type MapDeclaration<VALUE> = {
  key?: string,
  value?: (value: VALUE) => unknown,
}

export type MapValueDeclaration<VALUE> = {
  value?: (value: VALUE) => unknown,
}

export type MapDeclarations<TYPE, DEFAULT=MapDeclaration<TYPE>> = TYPE extends IsFunction<TYPE>
  ? never
  : TYPE extends IsArray<TYPE>
    ? MapDeclarationsArray<TYPE> | DEFAULT
    : TYPE extends IsPlainObject<TYPE>
      ? MapDeclarationsObject<TYPE> | DEFAULT
      : DEFAULT

export type MapDeclarationsArray<TYPE> = TYPE extends (infer ITEM_TYPE)[]
  ? MapDeclarations<ITEM_TYPE, MapValueDeclaration<ITEM_TYPE>>[]
  : never

export type MapDeclarationsObject<TYPE> = {
  [KEY in keyof TYPE]?: MapDeclarations<TYPE[KEY]>
}

export type Mapify<TYPE, MAP extends MapDeclarations<TYPE>> = [MAP] extends [never]
  ? TYPE
  : TYPE extends IsFunction<TYPE>
    ? TYPE
    : TYPE extends IsArray<TYPE>
      ? MapifyArray<TYPE, MAP>
      : TYPE extends IsPlainObject<TYPE>
        ? MapperObject<TYPE, MAP>
        : TYPE

export type ArrayItemType<TYPE> = TYPE extends (infer ITEM_TYPE)[] ? ITEM_TYPE : never

export type MapifyArray<TYPE, MAP extends MapDeclarations<TYPE>> = [MAP] extends [never]
  ? TYPE
  : TYPE extends (infer ITEM_TYPE)[]
    ? MAP extends (infer MAP_ITEM_TYPE)[]
      ? MAP_ITEM_TYPE extends MapDeclarations<ITEM_TYPE>
        ? [GetMappedValue<ITEM_TYPE, MAP_ITEM_TYPE>] extends [never]
            ? Mapify<ITEM_TYPE, MAP_ITEM_TYPE>[]
            : GetMappedValue<ITEM_TYPE, MAP_ITEM_TYPE>[]
        : TYPE
      : TYPE
    : never

export type GetKeyRename<KEY, MAP> = KEY extends keyof MAP
  ? MAP[KEY] extends { key: infer NEW_KEY }
    ? NEW_KEY extends string
      ? NEW_KEY
      : KEY
    : KEY
  : KEY

export type GetMappedValue<TYPE, MAP extends MapDeclarations<TYPE>> = MAP extends { value: infer VALUE_MAPPER }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ? VALUE_MAPPER extends (value: any) => infer NEW_VALUE
    ? NEW_VALUE
    : never
  : never

export type MapperObject<TYPE, MAP extends MapDeclarations<TYPE>> = [MAP] extends [never]
  ? TYPE
  : {
      [KEY in keyof TYPE as GetKeyRename<KEY, MAP>]: (
        MAP extends ({ [K in KEY]: infer MAP_VALUE })
          ? MAP_VALUE extends MapDeclarations<TYPE[KEY]>
            ? [GetMappedValue<TYPE[KEY], MAP_VALUE>] extends [never]
                ? Mapify<TYPE[KEY], MAP_VALUE>
                : GetMappedValue<TYPE[KEY], MAP_VALUE>
            : TYPE[KEY]
          : TYPE[KEY]
      )
    }

export type MapifyArrayTest<TYPE, MAP extends MapDeclarations<TYPE>> = TYPE extends (infer ITEM_TYPE)[]
  ? MAP extends (infer MAP_ITEM_TYPE)[]
    ? MAP_ITEM_TYPE extends MapDeclarations<ITEM_TYPE>
      ? MAP_ITEM_TYPE
      : never
    : never
  : never
