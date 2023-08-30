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
  atLeastOne,
} from '@txo/types'

import {
  prismify,
} from '../src'

const BarWhereUniqueInput = inputObjectType({
  name: 'BarWhereUniqueInput',
  definition (t) {
    t.nullable.id('id')
  },
})

const BarUpdateOneWithoutBarListNestedInput = inputObjectType({
  name: 'BarUpdateOneWithoutBarListNestedInput',
  definition (t) {
    t.field('connect', { type: 'FooWhereUniqueInput' })
  },
})
const BarUpdateInput = inputObjectType({
  name: 'BarUpdateInput',
  definition (t) {
    t.field('foo', { type: 'BarUpdateOneWithoutBarListNestedInput' })
  },
})

const FooWhereUniqueInput = inputObjectType({
  name: 'FooWhereUniqueInput',
  definition (t) {
    t.nullable.id('id')
    t.nullable.id('key')
  },
})

const whereUniqueInputMapper = {
  key: {
    key: 'key_deleted' as const,
    value: (key: string | undefined | null) => key == null
      ? undefined
      : ({
          key,
          deleted: false,
        }),
  },
}

const Bar = objectType({
  name: 'Bar',
  definition (t) {
    t.id('id')
    t.field('update', {
      type: 'Bar',
      args: {
        data: nonNull(arg({ type: 'BarUpdateInput' })),
      },
      resolve: async (_parent, args, ctx, _info) => {
        const prismifiedArgs = prismify(args, {
          data: {
            foo: {
              connect: {
                value: (connect) => atLeastOne(prismify(connect, whereUniqueInputMapper)),
              },
            },
          },
        })
        const updatedBar = await ctx.prisma.bar.update({
          ...prismifiedArgs,
          where: {
            id: '1',
          },
        })
        return updatedBar
      },
    })
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
        const mapifiedArgs = prismify(args, {
          cursor: {
            value: (cursor) => atLeastOne(cursor),
          },
        })
        const barList = await ctx.prisma.bar.findMany({
          ...mapifiedArgs,
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
    BarUpdateOneWithoutBarListNestedInput,
    BarUpdateInput,
    Foo,
    FooWhereUniqueInput,
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
