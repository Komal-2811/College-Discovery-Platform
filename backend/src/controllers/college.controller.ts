import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { query, validationResult } from 'express-validator';

const prisma = new PrismaClient();

// Get all colleges with search and filters
export const getColleges = async (req: Request, res: Response) => {
  try {
    const { search, location, maxFees, page = '1', limit = '10' } = req.query;
    
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
    const skip = (pageNum - 1) * limitNum;
    
    // Build where clause
    const where: any = {};
    
    if (search) {
      where.name = {
        contains: search as string,
        mode: 'insensitive'
      };
    }
    
    if (location) {
      where.location = {
        contains: location as string,
        mode: 'insensitive'
      };
    }
    
    if (maxFees) {
      where.fees = {
        lte: parseInt(maxFees as string)
      };
    }
    
    // Get total count
    const total = await prisma.college.count({ where });
    
    // Get colleges
    const colleges = await prisma.college.findMany({
      where,
      include: {
        courses: {
          take: 3
        },
        placements: {
          orderBy: { year: 'desc' },
          take: 1
        },
        reviews: {
          take: 2
        }
      },
      skip,
      take: limitNum,
      orderBy: { rating: 'desc' }
    });
    
    res.json({
      data: colleges,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ error: 'Failed to fetch colleges' });
  }
};

// Get single college with all details
export const getCollegeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        placements: {
          orderBy: { year: 'desc' }
        },
        reviews: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }
    
    res.json(college);
  } catch (error) {
    console.error('Error fetching college:', error);
    res.status(500).json({ error: 'Failed to fetch college' });
  }
};

// Add review
export const addReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, title, content, author } = req.body;
    
    if (!rating || !title || !content || !author) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const review = await prisma.review.create({
      data: {
        rating: Math.min(5, Math.max(1, rating)),
        title,
        content,
        author,
        collegeId: id
      }
    });
    
    // Update college rating
    const allReviews = await prisma.review.findMany({
      where: { collegeId: id }
    });
    
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await prisma.college.update({
      where: { id },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length
      }
    });
    
    res.status(201).json(review);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
};
