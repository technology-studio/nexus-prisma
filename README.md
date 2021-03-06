# Nexus prisma #

Collection of utils for integration between nexus and prisma.

##### `prismify`

Will deeply remove null types on attributes that are both undefined or null. That ensures a temporary workaround until graphql starts differentiating between optional and nullable types.

```
import { nonNull, objectType } from 'nexus'
import { prismify } from "@txo/nexus-prisma"

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
