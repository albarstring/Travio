import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'student@example.com' }
    })
    
    if (user) {
      console.log('Current user:', user.name)
      
      const cleanName = user.name.replace(/\d+$/, '').trim()
      
      if (cleanName !== user.name) {
        await prisma.user.update({
          where: { email: 'student@example.com' },
          data: { name: cleanName }
        })
        console.log(`Updated: "${user.name}" → "${cleanName}"`)
      }
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
