import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixUsernames() {
  try {
    // Update Admin
    await prisma.user.update({
      where: { email: 'admin@example.com' },
      data: { name: 'Admin' }
    })
    console.log('✓ Updated Admin name')

    // Update Instructor
    await prisma.user.update({
      where: { email: 'instructor@example.com' },
      data: { name: 'Sarah Smith' }
    })
    console.log('✓ Updated Instructor name')

    // Update Student
    await prisma.user.update({
      where: { email: 'student@example.com' },
      data: { name: 'John Doe' }
    })
    console.log('✓ Updated Student name')

    console.log('\n✅ All usernames fixed successfully!')
  } catch (error) {
    console.error('❌ Error fixing usernames:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixUsernames()
