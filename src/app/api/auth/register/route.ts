// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new NextResponse(JSON.stringify({ error: 'Email is required' }), { status: 400 });
    }

    // Check if a verified user already exists
    const existingUser = await prisma.user.findFirst({
        where: { email, emailVerified: { not: null } }
    });

    if (existingUser) {
        return new NextResponse(JSON.stringify({ error: 'A verified user with this email already exists.' }), { status: 409 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutes from now

    // Store OTP in the database
    await prisma.verificationOtp.create({
      data: {
        email,
        token: otp,
        expires,
      },
    });

    // Send OTP email via Resend
    await resend.emails.send({
      from: 'WalkIntoVoid@noobx.in', // Replace with your verified domain
      to: email,
      subject: 'OTP for WalkIntoVoid Blogs',
      html: `<p>Your verification code is: <strong>${otp}</strong>. It will expire in 15 minutes.</p>`,
    });

    return NextResponse.json({ success: true, message: 'Verification OTP sent to email.' }, { status: 200 });

  } catch (error) {
    console.error('Registration OTP Error:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to send verification email.' }), { status: 500 });
  }
}