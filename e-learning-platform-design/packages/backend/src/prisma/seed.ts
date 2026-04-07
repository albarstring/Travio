import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Hash passwords
  const hashedAdminPassword = await bcrypt.hash('password123', 10)
  const hashedInstructorPassword = await bcrypt.hash('password123', 10)
  const hashedStudentPassword = await bcrypt.hash('password123', 10)

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: 'Admin',
      isVerified: true,
      isActive: true,
      isApproved: true
    },
    create: {
      email: 'admin@example.com',
      password: hashedAdminPassword,
      name: 'Admin',
      role: 'admin',
      isVerified: true,
      isActive: true,
      isApproved: true
    },
  })

  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@example.com' },
    update: {
      bio: 'Full-stack developer with 10+ years of experience in web development. Specialized in React, Node.js, and modern JavaScript frameworks. Passionate about teaching and helping others grow their skills in software development.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      skills: JSON.stringify(['React', 'Node.js', 'TypeScript', 'Next.js', 'JavaScript', 'MongoDB', 'PostgreSQL', 'AWS']),
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA, USA',
      website: 'https://sarahsmith.dev',
      socialLinks: JSON.stringify({
        twitter: 'https://twitter.com/sarahsmith',
        linkedin: 'https://linkedin.com/in/sarahsmith',
        github: 'https://github.com/sarahsmith'
      }),
      notificationSettings: JSON.stringify({
        emailNotifications: true,
        courseUpdates: true,
        newReviews: true,
        earnings: true
      }),
      privacySettings: JSON.stringify({
        showEmail: false,
        showPhone: false,
        showLocation: true,
        showSocialLinks: true
      }),
      isVerified: true,
      isActive: true,
      isApproved: true
    },
    create: {
      email: 'instructor@example.com',
      password: hashedInstructorPassword,
      name: 'Sarah Smith',
      role: 'instructor',
      bio: 'Full-stack developer with 10+ years of experience in web development. Specialized in React, Node.js, and modern JavaScript frameworks. Passionate about teaching and helping others grow their skills in software development.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      skills: ['React', 'Node.js', 'TypeScript', 'Next.js', 'JavaScript', 'MongoDB', 'PostgreSQL', 'AWS'],
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA, USA',
      website: 'https://sarahsmith.dev',
      socialLinks: {
        twitter: 'https://twitter.com/sarahsmith',
        linkedin: 'https://linkedin.com/in/sarahsmith',
        github: 'https://github.com/sarahsmith'
      },
      notificationSettings: {
        emailNotifications: true,
        courseUpdates: true,
        newReviews: true,
        earnings: true
      },
      privacySettings: {
        showEmail: false,
        showPhone: false,
        showLocation: true,
        showSocialLinks: true
      },
      isVerified: true,
      isActive: true,
      isApproved: true
    },
  })

  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      password: hashedStudentPassword,
      name: 'John Doe',
      role: 'student',
    },
  })

  console.log('Seeded users:', { admin, instructor, student })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })