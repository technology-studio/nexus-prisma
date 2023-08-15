![npm](https://img.shields.io/npm/v/@txo/nexus-prisma)
![codecov](https://img.shields.io/codecov/c/github/technology-studio/nexus-prisma)
# Nexus prisma #

Collection of utils for integration between nexus and prisma.

##### `prismify`

Will deeply remove null types on attributes that are both undefined or null. That ensures a temporary workaround until graphql starts differentiating between optional and nullable types.

```
import { nonNull, objectType } from 'nexus'
import { prismify } from '@txo/nexus-prisma'

export const Foo = objectType({
  name: 'Foo',
  definition (t) {
    t.list.field('barList', {
      type: 'Bar',
      args: {
        where: nonNull(arg({
          type: 'BarWhereUniqueInput',
        })),
      },
      resolve: async (parent, args, ctx, info) => (
        ctx.prisma.bar.findMany({
          where: prismify(args.where),
        })
      ),
    })
  },
})
```

##### `prismifyCursor`

It will add compatible typing for the cursor input object type. Prisma requires an object type that enforces at least one attribute present in case the object exists.

```
import { nonNull, objectType } from 'nexus'
import { prismify, prismifyCursor } from '@txo/nexus-prisma'

export const Foo = objectType({
  name: 'Foo',
  definition (t) {
    t.list.field('barList', {
      type: 'Bar',
      args: {
        where: nonNull(arg({
          type: 'BarWhereUniqueInput',
        })),
        cursor: arg({
          type: 'BarWhereUniqueInput'
        }),
      },
      resolve: async (parent, args, ctx, info) => (
        ctx.prisma.bar.findMany({
          cursor: prismifyCursor(args.cursor),
          where: prismify(args.where),
        })
      ),
    })
  },
})
```
