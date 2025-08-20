import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const f = createUploadthing();

export const ourFileRouter = {
  // Document uploads for the document system
  documentUploader: f({ 
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    pdf: { maxFileSize: "16MB", maxFileCount: 5 },
    text: { maxFileSize: "2MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 2 },
    audio: { maxFileSize: "8MB", maxFileCount: 3 },
  })
    .middleware(async ({ req }) => {
      const { userId } = await auth();
      
      if (!userId) throw new Error("Unauthorized");
      
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId }
      });
      
      if (!user) throw new Error("User not found");
      
      return { userId: user.id, userRole: user.role };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Document uploaded by user:", metadata.userId);
      console.log("File URL:", file.url);
      
      // Store document metadata in database
      await prisma.document.create({
        data: {
          filename: file.name,
          originalName: file.name,
          filepath: file.url,
          url: file.url,
          mimetype: file.type || 'application/octet-stream',
          size: BigInt(file.size),
          type: getDocumentType(file.type || ''),
          uploadedById: metadata.userId,
          isPublic: false,
          accessLevel: 'OFFICIALS',
        }
      });
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Project attachments
  projectAttachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
    pdf: { maxFileSize: "8MB", maxFileCount: 5 },
    text: { maxFileSize: "1MB", maxFileCount: 5 },
  })
    .middleware(async ({ req }) => {
      const { userId } = await auth();
      
      if (!userId) throw new Error("Unauthorized");
      
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId }
      });
      
      if (!user) throw new Error("User not found");
      
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Project attachment uploaded:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Task attachments
  taskAttachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    pdf: { maxFileSize: "4MB", maxFileCount: 3 },
    text: { maxFileSize: "1MB", maxFileCount: 3 },
  })
    .middleware(async ({ req }) => {
      const { userId } = await auth();
      
      if (!userId) throw new Error("Unauthorized");
      
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId }
      });
      
      if (!user) throw new Error("User not found");
      
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Task attachment uploaded:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Event images and materials
  eventMedia: f({
    image: { maxFileSize: "8MB", maxFileCount: 20 },
    video: { maxFileSize: "32MB", maxFileCount: 5 },
    pdf: { maxFileSize: "4MB", maxFileCount: 5 },
  })
    .middleware(async ({ req }) => {
      const { userId } = await auth();
      
      if (!userId) throw new Error("Unauthorized");
      
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId }
      });
      
      if (!user) throw new Error("User not found");
      
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Event media uploaded:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Profile images
  profileImage: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const { userId } = await auth();
      
      if (!userId) throw new Error("Unauthorized");
      
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId }
      });
      
      if (!user) throw new Error("User not found");
      
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Profile image uploaded for user:", metadata.userId);
      
      // Update user profile image
      await prisma.user.update({
        where: { id: metadata.userId },
        data: { profileImage: file.url }
      });
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

function getDocumentType(mimeType: string): 'FILE' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'SPREADSHEET' | 'PRESENTATION' | 'ARCHIVE' | 'REPORT' | 'FORM' | 'CERTIFICATE' | 'PHOTO' {
  if (mimeType.startsWith('image/')) return 'IMAGE';
  if (mimeType.startsWith('video/')) return 'VIDEO';
  if (mimeType.startsWith('audio/')) return 'AUDIO';
  if (mimeType.includes('pdf')) return 'DOCUMENT';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'DOCUMENT';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'SPREADSHEET';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'PRESENTATION';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return 'ARCHIVE';
  return 'FILE';
}
