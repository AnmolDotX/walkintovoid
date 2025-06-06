// src/app/api/auth/verify-otp/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password, otp } = await req.json();

    if (!email || !password || !otp || !name) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const verificationOtp = await prisma.verificationOtp.findUnique({
      where: { email_token: { email, token: otp } },
    });

    if (!verificationOtp) {
      return new NextResponse(JSON.stringify({ error: 'Invalid OTP' }), { status: 400 });
    }

    if (new Date() > verificationOtp.expires) {
      return new NextResponse(JSON.stringify({ error: 'OTP has expired' }), { status: 400 });
    }

    const hashedPassword = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        emailVerified: new Date(),
      },
    });

    // Delete the used OTP
    await prisma.verificationOtp.delete({
      where: { id: verificationOtp.id },
    });

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });

  } catch (error) {
    console.error('Verification Error:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
        return new NextResponse(JSON.stringify({ error: 'A user with this email already exists.' }), { status: 409 });
    }
    return new NextResponse(JSON.stringify({ error: 'An internal error occurred' }), { status: 500 });
  }
}