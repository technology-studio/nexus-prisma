![npm](https://img.shields.io/npm/v/@txo/nexus-prisma)
![codecov](https://img.shields.io/codecov/c/github/technology-studio/nexus-prisma)
# Nexus prisma

Collection of utils for integration between nexus and prisma.

##### `prismify`

Will deeply remove null types on attributes that are both undefined or null. That ensures a temporary workaround until graphql starts differentiating between optional and nullable types.

##### `prismifyCursor`

It will add compatible typing for the cursor input object type. Prisma requires an object type that enforces at least one attribute present in case the object exists.

##### Example
```typescript:example/Schema.ts [7]
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
          cursor: prismifyCursor(args.cursor),
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

```
