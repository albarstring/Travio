import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function createAdmin() {
  try {
    console.log('=== Create Admin User ===\n')
    
    const name = await question('Nama Admin: ') || 'Admin'
    const email = await question('Email: ') || 'admin@example.com'
    const password = await question('Password (min 6 karakter): ') || 'admin123'
    
    if (password.length < 6) {
      console.error('❌ Password harus minimal 6 karakter!')
      process.exit(1)
    }
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      console.error(`❌ Email ${email} sudah terdaftar!`)
      process.exit(1)
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        emailVerified: true
      }
    })
    
    console.log('\n✅ Admin user berhasil dibuat!')
    console.log('\n📋 Detail Admin:')
    console.log(`   ID: ${admin.id}`)
    console.log(`   Nama: ${admin.name}`)
    console.log(`   Email: ${admin.email}`)
    console.log(`   Role: ${admin.role}`)
    console.log('\n🔗 Login di: http://localhost:5173/login')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}\n`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

createAdmin()

