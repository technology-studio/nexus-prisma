/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2021-04-24T10:04:39+02:00
 * @Copyright: Technology Studio
**/

import { atLeastOne } from '@txo/types'
import { type AtLeastOne } from '@txo/types'

import type {
  Prismify, PrismifyObject,
} from '../Model/Types'

export const prismify = <VALUE>(value: VALUE): Prismify<VALUE> => (
  value as Prismify<VALUE>
)

// eslint-disable-next-line @typescript-eslint/ban-types
export const prismifyObject = <VALUE extends object>(value: VALUE | null | undefined): PrismifyObject<VALUE> => (
  value as PrismifyObject<VALUE>
)

// eslint-disable-next-line @typescript-eslint/ban-types
export const prismifyCursor = <VALUE extends object>(value: VALUE | undefined | null): AtLeastOne<PrismifyObject<VALUE>> | undefined => (
  atLeastOne(prismifyObject(value))
)
