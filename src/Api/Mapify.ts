/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2023-08-29T07:08:26+02:00
 * @Copyright: Technology Studio
 */

import { type IsArray } from '@txo/types'

import {
  type Mapify, type MapDeclarations,
} from '../Model/Types'

const isKeyRenamerDeclaration = (declaration: unknown): declaration is { key: string } => (
  declaration != null &&
  typeof declaration === 'object' &&
  'key' in declaration &&
  declaration.key != null
)

const isValueMapperDeclaration = <VALUE>(declaration: unknown): declaration is { value: (value: VALUE) => unknown } => (
  declaration != null &&
  typeof declaration === 'object' &&
  'value' in declaration &&
  declaration.value != null
)

export const mapify = <TYPE, MAP extends MapDeclarations<TYPE>>(value: TYPE, map: MAP | undefined): Mapify<TYPE, MAP> => {
  if (map == null) {
    return value as Mapify<TYPE, MAP>
  }
  if (Array.isArray(value)) {
    if (Array.isArray(map) && map.length > 0) {
      let isChanged = false
      const mappedArray = value.map((item: IsArray<TYPE>[number], index) => {
        const subMap = map[0] as MapDeclarations<IsArray<TYPE>[number]>
        const mappedItem = mapify(item, subMap)
        if (mappedItem !== item) {
          isChanged = true
        }
        return mappedItem
      })
      return (isChanged ? mappedArray : value) as Mapify<TYPE, MAP>
    } else {
      return value as Mapify<TYPE, MAP>
    }
  } else if (typeof value === 'object' && value != null) {
    if (typeof map === 'object') {
      let isChanged = false
      const result: Record<string | number | symbol, unknown> = {}
      for (const key in value) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        const subMap = (map as any)[key]
        const newKey = isKeyRenamerDeclaration(subMap) ? subMap.key : key
        const subValue = value[key]

        const mappedSubValue = isValueMapperDeclaration(subMap)
          ? subMap.value(subValue)
          : mapify(subValue, subMap)
        if (newKey !== key || mappedSubValue !== subValue) {
          isChanged = true
        }
        result[newKey] = mappedSubValue
      }
      return (isChanged ? result : value) as Mapify<TYPE, MAP>
    } else {
      return value as Mapify<TYPE, MAP>
    }
  } else {
    const mappedValue = isValueMapperDeclaration(map) ? map.value(value) : value
    return (mappedValue === value ? value : mappedValue) as Mapify<TYPE, MAP>
  }
}
