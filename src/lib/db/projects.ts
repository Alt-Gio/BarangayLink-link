import { prisma } from '@/lib/prisma';
import { Project, ProjectStatus, ProjectCategory } from '@prisma/client';

export interface PublicProject {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  startDate: Date;
  completedDate: Date | null;
  budget: number;
  category: ProjectCategory;
  objectives: string | null;
  beneficiaries: string | null;
  location: string | null;
  featuredImage: string | null;
  galleryImages: string[];
  progressPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getPublicProjects(): Promise<PublicProject[]> {
  try {
    const projects = await prisma.project.findMany({
      where: {
        isPublic: true,
        isArchived: false,
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        startDate: true,
        completedDate: true,
        budget: true,
        category: true,
        objectives: true,
        beneficiaries: true,
        location: true,
        featuredImage: true,
        galleryImages: true,
        progressPercentage: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        completedDate: 'desc',
      },
    });

    return projects;
  } catch (error) {
    console.error('Error fetching public projects:', error);
    return [];
  }
}

export async function getCompletedProjects(): Promise<PublicProject[]> {
  try {
    const projects = await prisma.project.findMany({
      where: {
        isPublic: true,
        isArchived: false,
        status: 'COMPLETED',
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        startDate: true,
        completedDate: true,
        budget: true,
        category: true,
        objectives: true,
        beneficiaries: true,
        location: true,
        featuredImage: true,
        galleryImages: true,
        progressPercentage: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        completedDate: 'desc',
      },
      take: 6, // Limit to 6 most recent completed projects
    });

    return projects;
  } catch (error) {
    console.error('Error fetching completed projects:', error);
    return [];
  }
}

export interface ProjectStats {
  totalProjects: number;
  completedProjects: number;
  totalBudget: number;
  totalBeneficiaries: number;
}

export async function getProjectStats(): Promise<ProjectStats> {
  try {
    const [totalProjects, completedProjects, budgetSum] = await Promise.all([
      prisma.project.count({
        where: {
          isPublic: true,
          isArchived: false,
        },
      }),
      prisma.project.count({
        where: {
          isPublic: true,
          isArchived: false,
          status: 'COMPLETED',
        },
      }),
      prisma.project.aggregate({
        where: {
          isPublic: true,
          isArchived: false,
          status: 'COMPLETED',
        },
        _sum: {
          budget: true,
        },
      }),
    ]);

    // Calculate total beneficiaries from completed projects
    const completedProjectsWithBeneficiaries = await prisma.project.findMany({
      where: {
        isPublic: true,
        isArchived: false,
        status: 'COMPLETED',
        beneficiaries: {
          not: null,
        },
      },
      select: {
        beneficiaries: true,
      },
    });

    // Extract numbers from beneficiaries text (simple approach)
    let totalBeneficiaries = 0;
    completedProjectsWithBeneficiaries.forEach((project) => {
      if (project.beneficiaries) {
        const numbers = project.beneficiaries.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          totalBeneficiaries += parseInt(numbers[0]);
        }
      }
    });

    return {
      totalProjects,
      completedProjects,
      totalBudget: budgetSum._sum.budget || 0,
      totalBeneficiaries,
    };
  } catch (error) {
    console.error('Error fetching project stats:', error);
    return {
      totalProjects: 0,
      completedProjects: 0,
      totalBudget: 0,
      totalBeneficiaries: 0,
    };
  }
}
