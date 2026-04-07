import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding instructor profile data...')

  // Update existing instructor or create new one
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@example.com' },
    update: {
      bio: 'Full-stack developer with 10+ years of experience in web development. Specialized in React, Node.js, and modern JavaScript frameworks. Passionate about teaching and helping others grow their skills in software development. I have taught over 5000+ students and created 20+ successful courses.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      skills: JSON.stringify(['React', 'Node.js', 'TypeScript', 'Next.js', 'JavaScript', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes']),
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
        earnings: true,
        studentEnrollments: true
      },
      privacySettings: {
        showEmail: false,
        showPhone: false,
        showLocation: true,
        showSocialLinks: true,
        showWebsite: true
      }
    },
    create: {
      email: 'instructor@example.com',
      password: 'password123',
      name: 'Sarah Smith',
      role: 'instructor',
      bio: 'Full-stack developer with 10+ years of experience in web development. Specialized in React, Node.js, and modern JavaScript frameworks. Passionate about teaching and helping others grow their skills in software development. I have taught over 5000+ students and created 20+ successful courses.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      skills: JSON.stringify(['React', 'Node.js', 'TypeScript', 'Next.js', 'JavaScript', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes']),
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
        earnings: true,
        studentEnrollments: true
      },
      privacySettings: {
        showEmail: false,
        showPhone: false,
        showLocation: true,
        showSocialLinks: true,
        showWebsite: true
      }
    },
  })

  console.log('✅ Instructor profile updated:', {
    id: instructor.id,
    name: instructor.name,
    email: instructor.email,
    skills: JSON.parse(instructor.skills || '[]'),
    location: instructor.location,
    website: instructor.website
  })

  // Create additional instructor profiles for testing
  const instructor2 = await prisma.user.upsert({
    where: { email: 'instructor2@example.com' },
    update: {},
    create: {
      email: 'instructor2@example.com',
      password: 'password123',
      name: 'Michael Chen',
      role: 'instructor',
      bio: 'Senior Software Engineer and Tech Educator. Expert in Python, Machine Learning, and Data Science. Former Google engineer with 8 years of industry experience. Teaching since 2019 with 3000+ students.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      skills: JSON.stringify(['Python', 'Machine Learning', 'Data Science', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn']),
      phone: '+1 (555) 234-5678',
      location: 'New York, NY, USA',
      website: 'https://michaelchen.dev',
      socialLinks: {
        twitter: 'https://twitter.com/michaelchen',
        linkedin: 'https://linkedin.com/in/michaelchen',
        github: 'https://github.com/michaelchen'
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
      }
    },
  })

  const instructor3 = await prisma.user.upsert({
    where: { email: 'instructor3@example.com' },
    update: {},
    create: {
      email: 'instructor3@example.com',
      password: 'password123',
      name: 'Emily Johnson',
      role: 'instructor',
      bio: 'UI/UX Designer and Frontend Developer. Specialized in creating beautiful, accessible, and user-friendly interfaces. 7 years of experience in design systems, React, and modern CSS. Passionate about design education.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      skills: JSON.stringify(['UI/UX Design', 'Figma', 'Adobe XD', 'React', 'CSS', 'Sass', 'Design Systems', 'Accessibility']),
      phone: '+1 (555) 345-6789',
      location: 'Los Angeles, CA, USA',
      website: 'https://emilyjohnson.design',
      socialLinks: {
        twitter: 'https://twitter.com/emilyjohnson',
        linkedin: 'https://linkedin.com/in/emilyjohnson',
        github: 'https://github.com/emilyjohnson'
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
      }
    },
  })

  console.log('✅ Additional instructor profiles created')
  console.log('📊 Summary:')
  console.log(`   - Total instructors: 3`)
  console.log(`   - Main instructor: ${instructor.name} (${instructor.email})`)
  console.log(`   - Additional: ${instructor2.name}, ${instructor3.name}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding instructor profiles:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

