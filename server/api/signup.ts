import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { sendWelcomeEmail } from '../email/emailService'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (event.req.method !== 'POST') {
    return { status: 405, message: 'Method Not Allowed' }
  }
  const body = await readBody(event)
  const { firstName, lastName, email, phone, password } = body
  if (!firstName || !lastName || !email || !phone || !password) {
    return { status: 400, message: 'All fields are required.' }
  }
  // Check if user with same email exists
  const existingEmail = await prisma.user.findUnique({
    where: { email }
  })
  if (existingEmail) {
    return { status: 409, message: 'Email address already registered.' }
  }

  // Check if user with same phone exists
  const existingPhone = await prisma.user.findUnique({
    where: { phone }
  })
  if (existingPhone) {
    return { status: 409, message: 'Phone number already registered.' }
  }
  // Hash password
  const hashed = await bcrypt.hash(password, 10)
  // Create user
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      password: hashed,
    }
  })
  // Send welcome email
  await sendWelcomeEmail(email, firstName)
  return { status: 201, message: 'User created successfully.' }
}) 