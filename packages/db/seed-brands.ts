import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const brands = [
    { name: 'Philips', slug: 'philips' },
    { name: 'Havells', slug: 'havells' },
    { name: 'Schneider Electric', slug: 'schneider-electric' },
    { name: 'Bosch', slug: 'bosch' },
    { name: 'DeWalt', slug: 'dewalt' },
    { name: 'Legrand', slug: 'legrand' },
    { name: 'Panasonic', slug: 'panasonic' }
  ];

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    });
  }

  console.log('Successfully seeded brands!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
