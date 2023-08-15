/**
 * @Author: Rostislav Simonik <rostislav.simonik@technologystudio.sk>
 * @Date: 2023-08-15T07:08:31+02:00
 * @Copyright: Technology Studio
**/

import {
  arg, inputObjectType, makeSchema, nonNull, objectType,
} from 'nexus'
import { join } from 'path'

import {
  prismify, prismifyCursor,
} from '../src'

const BarWhereUniqueInput = inputObjectType({
  name: 'BarWhereUniqueInput',
  definition (t) {
    t.nullable.id('id')
  },
})

const Bar = objectType({
  name: 'Bar',
  definition (t) {
    t.id('id')
  },
})

const Foo = objectType({
  name: 'Foo',
  definition (t) {
    t.list.field('barList', {
      type: 'Bar',
      args: {
        where: nonNull(arg({
          type: 'BarWhereUniqueInput',
        })),
        cursor: arg({
          type: 'BarWhereUniqueInput',
        }),
      },
      resolve: async (_parent, args, ctx, _info) => {
        const barList = await ctx.prisma.bar.findMany({
          cursor2: prismifyCursor(args.cursor),
          where: prismify(args.where),
        })
        return barList
      },
    })
  },
})

export const schema = makeSchema({
  nonNullDefaults: {
    output: true,
  },
  types: [
    Bar,
    BarWhereUniqueInput,
    Foo,
  ],
  outputs: {
    schema: join(__dirname, '../generated', 'schema.graphql'),
    typegen: join(__dirname, '../node_modules/@types/typegen-nexus/index.d.ts'),
  },
  contextType: {
    module: join(__dirname, './ContextType.ts'),
    export: 'Context',
  },
})
