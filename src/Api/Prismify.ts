/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2021-04-24T10:04:39+02:00
 * @Copyright: Technology Studio
**/

import { atLeastOne } from '@txo/types'

import type { Prismify } from '../Model/Types'

export const prismify = <VALUE>(value: VALUE): Prismify<VALUE> => (
  value as Prismify<VALUE>
)

// eslint-disable-next-line @typescript-eslint/ban-types
export const prismifyCursor = <VALUE extends object>(value: VALUE): Prismify<VALUE> => (
  atLeastOne(prismify(value))
)
