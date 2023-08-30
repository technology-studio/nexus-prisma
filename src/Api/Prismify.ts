/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2021-04-24T10:04:39+02:00
 * @Copyright: Technology Studio
**/

import type {
  MapDeclarations,
  Mapify,
  Prismify,
} from '../Model/Types'

import { mapify } from './Mapify'

export const prismify = <TYPE, MAP extends MapDeclarations<Prismify<TYPE>>>(value: TYPE, map?: MAP): Mapify<Prismify<TYPE>, MAP> => (
  mapify(value as Prismify<TYPE>, map)
)
