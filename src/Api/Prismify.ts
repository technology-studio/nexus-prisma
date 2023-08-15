/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2021-04-24T10:04:39+02:00
 * @Copyright: Technology Studio
**/
export const prismify = <VALUE>(value: VALUE): Prismify<VALUE> => (
  value as Prismify<VALUE>
)
