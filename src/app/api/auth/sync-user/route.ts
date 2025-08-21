import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';

type UserRole = 'ADMIN' | 'BARANGAY_CAPTAIN' | 'SECRETARY' | 'TREASURER' | 'COUNCILOR' | 'STAFF';

export async function POST(request: NextRequest) {
  try {
    const { clerkUserId, email, name } = await request.json();

    if (!clerkUserId || !email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Syncing user:', { clerkUserId, email, name });

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { clerkUserId }
    });

    if (!user) {
      // For TEST MODE: Auto-assign roles based on email patterns
      let role: UserRole = 'STAFF';
      let position = 'Staff Member';
      
      // Test user role assignment based on email/name patterns
      if (email.includes('admin') || name.toLowerCase().includes('admin')) {
        role = 'ADMIN';
        position = 'System Administrator';
      } else if (email.includes('captain') || name.toLowerCase().includes('captain')) {
        role = 'BARANGAY_CAPTAIN';
        position = 'Barangay Captain';
      } else if (email.includes('secretary') || name.toLowerCase().includes('secretary')) {
        role = 'SECRETARY';
        position = 'Barangay Secretary';
      } else if (email.includes('treasurer') || name.toLowerCase().includes('treasurer')) {
        role = 'TREASURER';
        position = 'Barangay Treasurer';
      } else if (email.includes('councilor') || name.toLowerCase().includes('councilor')) {
        role = 'COUNCILOR';
        position = 'Barangay Councilor';
      }

      console.log('Creating new user with role:', role);

      user = await prisma.user.create({
        data: {
          clerkUserId,
          name,
          email,
          position,
          role,
          phoneNumber: null,
          isActive: true, // Auto-activate test users
          metadata: {
            isTestUser: true,
            registrationDate: new Date().toISOString(),
            autoAssignedRole: role
          }
        }
      });

      console.log('Successfully created user:', user);
    } else {
      // Update last active timestamp
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          lastActiveAt: new Date(),
          name, // Update name in case it changed
          email // Update email in case it changed
        }
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
