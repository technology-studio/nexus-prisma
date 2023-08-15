/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2023-08-15T07:08:14+02:00
 * @Copyright: Technology Studio
**/

import type { PrismaClient } from '@prisma/client'
export interface Context {
  prisma: PrismaClient,
}
