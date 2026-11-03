/**
 * Development seed script.
 * Creates a test user with a Free plan subscription.
 * Run with: pnpm --filter @sitecare/database db:seed
 *
 * WARNING: Never run against production.
 */

import { prisma } from './client.js';

async function seed(): Promise<void> {
  if (process.env['NODE_ENV'] === 'production') {
    throw new Error('Seed must not run in production');
  }

  console.warn('Seeding development database...');

  // Upsert a test user
  const user = await prisma.user.upsert({
    where: { email: 'dev@sitecare.test' },
    update: {},
    create: {
      email: 'dev@sitecare.test',
      name: 'Dev User',
      emailVerified: new Date(),
      subscription: {
        create: {
          plan: 'FREE',
          status: 'ACTIVE',
        },
      },
      notifications: {
        create: {
          outageAlerts: true,
          recoveryAlerts: true,
          sslExpiry: true,
          weeklySummary: false,
        },
      },
    },
  });

  console.warn(`Seeded user: ${user.email} (id: ${user.id})`);

  // Upsert a test client group
  const group = await prisma.clientGroup.upsert({
    where: { id: 'seed-client-group-1' },
    update: {},
    create: {
      id: 'seed-client-group-1',
      userId: user.id,
      name: 'Test Client',
    },
  });

  console.warn(`Seeded client group: ${group.name}`);

  // Upsert a test website
  const website = await prisma.website.upsert({
    where: { id: 'seed-website-1' },
    update: {},
    create: {
      id: 'seed-website-1',
      userId: user.id,
      clientGroupId: group.id,
      url: 'https://example.com',
      name: 'Example',
      status: 'PENDING',
    },
  });

  console.warn(`Seeded website: ${website.url}`);
  console.warn('Seed complete.');
}

seed()
  .catch((err: unknown) => {
    console.error('Seed failed:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
