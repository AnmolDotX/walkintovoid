// prisma/seed.js
const { PrismaClient, Role, PostStatus } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL environment variable is not set.');
  }

  // 1. Create the Admin User
  const hashedPassword = await hash('password123', 12); // Use a secure password
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      hashedPassword: hashedPassword,
      emailVerified: new Date(),
      userType: Role.ADMIN,
    },
  });
  console.log(`Created admin user: ${adminUser.email}`);

  // 2. Create a Category
  const techCategory = await prisma.category.upsert({
    where: { name: 'Technology' },
    update: {},
    create: {
      name: 'Technology',
    },
  });
  console.log(`Created category: ${techCategory.name}`);

  // 3. Create Sample Posts
  await prisma.post.create({
    data: {
      title: 'Mastering Next.js 15',
      slug: 'mastering-nextjs-15',
      content: '# Welcome to Next.js 15\n\nThis is a sample post about the latest features.',
      excerpt: 'A deep dive into the new features of Next.js 15.',
      status: PostStatus.APPROVED,
      authorId: adminUser.id,
      categoryId: techCategory.id,
    },
  });

  await prisma.post.create({
    data: {
      title: 'The Ultimate Guide to Prisma',
      slug: 'ultimate-guide-to-prisma',
      content: '# Prisma is Awesome\n\nHere is why you should use Prisma ORM.',
      excerpt: 'Learn how Prisma can supercharge your database workflows.',
      status: PostStatus.PENDING,
      authorId: adminUser.id,
      categoryId: techCategory.id,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });