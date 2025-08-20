import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';

// Define UserRole enum locally since it's having import issues
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

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { clerkUserId }
    });

    if (!user) {
      try {
        // Get full user data from Clerk including metadata
        const clerkUser = await clerkClient.users.getUser(clerkUserId);
        const metadata = clerkUser.unsafeMetadata as Record<string, unknown>;

        console.log('Creating new user with Clerk data:', {
          clerkUserId,
          name,
          email,
          metadata
        });

        // Create new user with registration data
        user = await prisma.user.create({
          data: {
            clerkUserId,
            name,
            email,
            position: metadata?.jobTitle || 'New User',
            role: metadata?.role as UserRole || 'STAFF',
            phone: metadata?.phone || null,
            address: metadata?.address || null,
            isActive: !metadata?.needsApproval, // Active if doesn't need approval
            // Store additional registration info in metadata
            metadata: {
              registrationDate: metadata?.registrationDate || new Date().toISOString(),
              needsApproval: metadata?.needsApproval || false,
              isApproved: metadata?.isApproved || false
            }
          }
        });

        console.log('Successfully created user:', user);
      } catch (clerkError) {
        console.error('Error fetching from Clerk, creating basic user:', clerkError);
        
        // Fallback: create basic user without metadata for users without registration data
        user = await prisma.user.create({
          data: {
            clerkUserId,
            name,
            email,
            position: 'User',
            role: 'STAFF',
            isActive: true,
            metadata: {
              registrationDate: new Date().toISOString(),
              needsApproval: false,
              isApproved: true
            }
          }
        });
        
        console.log('Created fallback user:', user);
      }
    } else {
      // Update last active timestamp
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          lastActiveAt: new Date(),
          // Update name and email in case they changed in Clerk
          name,
          email
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
