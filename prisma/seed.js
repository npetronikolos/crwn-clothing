import { createPrismaClient } from '../src/lib/prisma.js';
import SHOP_DATA from './data/shop.data.js';
import SECTIONS from './data/directory.data.js';

const prisma = createPrismaClient();

const seed = async () => {
  await prisma.$transaction([
    prisma.item.deleteMany(),
    prisma.collection.deleteMany(),
    prisma.section.deleteMany()
  ]);

  for (const { id, title, routeName, items } of Object.values(SHOP_DATA)) {
    await prisma.collection.create({
      data: {
        id,
        title,
        routeName,
        items: {
          create: items.map(({ id, name, imageUrl, price }) => ({
            id,
            name,
            imageUrl,
            priceInCents: Math.round(price * 100)
          }))
        }
      }
    });
  }

  await prisma.section.createMany({ data: SECTIONS });

  console.log(
    `Seeded ${Object.keys(SHOP_DATA).length} collections and ${SECTIONS.length} sections.`
  );
};

try {
  await seed();
} finally {
  await prisma.$disconnect();
}
