import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  try {
    // Find all users with names ending in 0
    const users = await prisma.user.findMany()
    
    let updated = 0
    
    for (const user of users) {
      // Check if name ends with a number
      if (/\d$/.test(user.name)) {
        const cleanName = user.name.replace(/\d+$/, '').trim()
        
        if (cleanName && cleanName !== user.name) {
          await prisma.user.update({
            where: { id: user.id },
            data: { name: cleanName }
          })
          console.log(`Updated: "${user.name}" → "${cleanName}"`)
          updated++
        }
      }
    }
    
    console.log(`\nTotal cleaned: ${updated} users`)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
