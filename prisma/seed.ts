import 'dotenv/config';

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';


const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Début du seeding...')

  // Suppression
  await prisma.invoice.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.user.deleteMany()
  await prisma.plan.deleteMany()

  // Plans
  const freePlan = await prisma.plan.create({
    data: {
      name: 'Free',
      description: 'Parfait pour commencer',
      priceMonthly: 0,
      priceYearly: 0,
      features: JSON.stringify([
        '1 projet',
        '100 MB de stockage',
        'Support communautaire',
      ]),
      maxProjects: 1,
      maxStorage: 100,
      maxTeamMembers: 1,
      isActive: true,
      isPopular: false,
    },
  })

  const basicPlan = await prisma.plan.create({
    data: {
      name: 'Basic',
      description: 'Pour les pros',
      priceMonthly: 990,
      priceYearly: 9900,
      stripePriceIdMonthly: process.env.STRIPE_PRICE_ID_BASIC_MONTHLY,
      stripePriceIdYearly: process.env.STRIPE_PRICE_ID_BASIC_YEARLY,
      features: JSON.stringify(['5 projets', '5 GB', 'Support email']),
      maxProjects: 5,
      maxStorage: 5000,
      maxTeamMembers: 1,
      isActive: true,
      isPopular: false,
    },
  })

  const proPlan = await prisma.plan.create({
    data: {
      name: 'Pro',
      description: 'Pour les équipes',
      priceMonthly: 2990,
      priceYearly: 29900,
      stripePriceIdMonthly: process.env.STRIPE_PRICE_ID_PRO_MONTHLY,
      stripePriceIdYearly: process.env.STRIPE_PRICE_ID_PRO_YEARLY,
      features: JSON.stringify([
        'Projets illimités',
        '50 GB',
        'Support 24/7',
        'API',
      ]),
      maxProjects: null,
      maxStorage: 50000,
      maxTeamMembers: 5,
      isActive: true,
      isPopular: true,
    },
  })

  const enterprisePlan = await prisma.plan.create({
    data: {
      name: 'Enterprise',
      description: 'Pour les grandes orgas',
      priceMonthly: 9990,
      priceYearly: 99900,
      stripePriceIdMonthly: process.env.STRIPE_PRICE_ID_ENTERPRISE_MONTHLY,
      stripePriceIdYearly: process.env.STRIPE_PRICE_ID_ENTERPRISE_YEARLY,
      features: JSON.stringify([
        'Tout illimité',
        'Support dédié',
        'SSO/SAML',
      ]),
      maxProjects: null,
      maxStorage: null,
      maxTeamMembers: null,
      isActive: true,
      isPopular: false,
    },
  })

  console.log('Plans créés:', {
    free: freePlan.id,
    basic: basicPlan.id,
    pro: proPlan.id,
    enterprise: enterprisePlan.id,
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })