import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Create comparison
export const createComparison = async (req: Request, res: Response) => {
  try {
    const { collegeIds, name } = req.body;
    
    if (!Array.isArray(collegeIds) || collegeIds.length < 2 || collegeIds.length > 5) {
      return res.status(400).json({ error: 'Select 2-5 colleges for comparison' });
    }
    
    // Create comparison with colleges
    const comparison = await prisma.comparison.create({
      data: {
        name: name || `Comparison ${new Date().toLocaleDateString()}`,
        colleges: {
colleges: {
  create: collegeIds.map((id: number) => ({
    collegeId: id
  }))
}
        }
      },
      include: {
        colleges: {
          include: {
            college: {
              include: {
                placements: {
                  orderBy: { year: 'desc' },
                  take: 1
                }
              }
            }
          }
        }
      }
    });
    
    res.status(201).json(comparison);
  } catch (error) {
    console.error('Error creating comparison:', error);
    res.status(500).json({ error: 'Failed to create comparison' });
  }
};

// Get comparison
export const getComparison = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const comparison = await prisma.comparison.findUnique({
      where: { id },
      include: {
        colleges: {
          include: {
            college: {
              include: {
                placements: {
                  orderBy: { year: 'desc' },
                  take: 1
                }
              }
            }
          }
        }
      }
    });
    
    if (!comparison) {
      return res.status(404).json({ error: 'Comparison not found' });
    }
    
    res.json(comparison);
  } catch (error) {
    console.error('Error fetching comparison:', error);
    res.status(500).json({ error: 'Failed to fetch comparison' });
  }
};

// Delete comparison
export const deleteComparison = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.comparison.delete({
      where: { id }
    });
    
    res.json({ message: 'Comparison deleted' });
  } catch (error) {
    console.error('Error deleting comparison:', error);
    res.status(500).json({ error: 'Failed to delete comparison' });
  }
};
