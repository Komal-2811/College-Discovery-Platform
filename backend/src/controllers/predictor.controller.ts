import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Predict colleges based on exam and rank
export const predictColleges = async (req: Request, res: Response) => {
  try {
    const { exam, rank } = req.body;
    
    if (!exam || !rank) {
      return res.status(400).json({ error: 'Exam and rank are required' });
    }
    
    const rankNum = parseInt(rank);
    
    // Find colleges that match the rank criteria
    const matches = await prisma.predictorMatch.findMany({
      where: {
        exam: exam.toUpperCase(),
        minRank: { lte: rankNum },
        maxRank: { gte: rankNum }
      },
      include: {
        college: {
          include: {
            placements: {
              orderBy: { year: 'desc' },
              take: 1
            }
          }
        }
      },
      orderBy: {
        college: {
          rating: 'desc'
        }
      },
      take: 20
    });
    
    res.json({
      exam,
      rank: rankNum,
      count: matches.length,
      colleges: matches.map(m => m.college)
    });
  } catch (error) {
    console.error('Error predicting colleges:', error);
    res.status(500).json({ error: 'Failed to predict colleges' });
  }
};
