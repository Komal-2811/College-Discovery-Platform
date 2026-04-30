import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const COLLEGES_DATA = [
  {
    name: 'Indian Institute of Technology Delhi',
    location: 'Delhi',
    state: 'Delhi',
    city: 'New Delhi',
    fees: 200000,
    rating: 4.8,
    description: 'One of India\'s premier engineering institutes',
    founded: 1961,
    courses: [
      { name: 'B.Tech Computer Science', duration: '4 years', specialization: 'CSE' },
      { name: 'B.Tech Electrical Engineering', duration: '4 years', specialization: 'EE' },
      { name: 'B.Tech Civil Engineering', duration: '4 years', specialization: 'CE' }
    ],
    placements: [
      { year: 2024, placementPercent: 99.5, avgPackage: 28.5, highestPackage: 95, topRecruiter: 'Google' }
    ]
  },
  {
    name: 'Indian Institute of Technology Bombay',
    location: 'Mumbai',
    state: 'Maharashtra',
    city: 'Mumbai',
    fees: 220000,
    rating: 4.9,
    description: 'Asia\'s best engineering institute',
    founded: 1958,
    courses: [
      { name: 'B.Tech Computer Science', duration: '4 years', specialization: 'CSE' },
      { name: 'B.Tech Mechanical Engineering', duration: '4 years', specialization: 'ME' }
    ],
    placements: [
      { year: 2024, placementPercent: 99.8, avgPackage: 30.2, highestPackage: 105, topRecruiter: 'Microsoft' }
    ]
  },
  {
    name: 'Indian Institute of Technology Madras',
    location: 'Chennai',
    state: 'Tamil Nadu',
    city: 'Chennai',
    fees: 180000,
    rating: 4.7,
    description: 'Premier technical education hub in South India',
    founded: 1959,
    courses: [
      { name: 'B.Tech Computer Science', duration: '4 years', specialization: 'CSE' },
      { name: 'B.Tech Aerospace Engineering', duration: '4 years', specialization: 'AE' }
    ],
    placements: [
      { year: 2024, placementPercent: 98.5, avgPackage: 26.8, highestPackage: 85, topRecruiter: 'Amazon' }
    ]
  },
  {
    name: 'National Institute of Technology Trichy',
    location: 'Trichy',
    state: 'Tamil Nadu',
    city: 'Trichy',
    fees: 120000,
    rating: 4.2,
    description: 'Leading NIT with excellent placements',
    founded: 1964,
    courses: [
      { name: 'B.Tech Computer Science', duration: '4 years', specialization: 'CSE' },
      { name: 'B.Tech Production Engineering', duration: '4 years', specialization: 'PE' }
    ],
    placements: [
      { year: 2024, placementPercent: 92.3, avgPackage: 16.5, highestPackage: 48, topRecruiter: 'TCS' }
    ]
  },
  {
    name: 'Delhi Technological University',
    location: 'Delhi',
    state: 'Delhi',
    city: 'New Delhi',
    fees: 100000,
    rating: 3.9,
    description: 'Government engineering university',
    founded: 1941,
    courses: [
      { name: 'B.Tech Computer Science', duration: '4 years', specialization: 'CSE' },
      { name: 'B.Tech Information Technology', duration: '4 years', specialization: 'IT' }
    ],
    placements: [
      { year: 2024, placementPercent: 85.6, avgPackage: 14.2, highestPackage: 42, topRecruiter: 'Infosys' }
    ]
  },
  {
    name: 'Vellore Institute of Technology',
    location: 'Vellore',
    state: 'Tamil Nadu',
    city: 'Vellore',
    fees: 350000,
    rating: 4.0,
    description: 'Private university with strong industry connections',
    founded: 1984,
    courses: [
      { name: 'B.Tech Computer Science', duration: '4 years', specialization: 'CSE' },
      { name: 'B.Tech Biotechnology', duration: '4 years', specialization: 'BT' }
    ],
    placements: [
      { year: 2024, placementPercent: 88.9, avgPackage: 18.3, highestPackage: 55, topRecruiter: 'Cognizant' }
    ]
  },
  {
    name: 'Manipal Institute of Technology',
    location: 'Manipal',
    state: 'Karnataka',
    city: 'Manipal',
    fees: 380000,
    rating: 3.8,
    description: 'Premium private engineering college',
    founded: 1957,
    courses: [
      { name: 'B.Tech Computer Science', duration: '4 years', specialization: 'CSE' },
      { name: 'B.Tech Information Technology', duration: '4 years', specialization: 'IT' }
    ],
    placements: [
      { year: 2024, placementPercent: 86.5, avgPackage: 17.8, highestPackage: 50, topRecruiter: 'Accenture' }
    ]
  },
  {
    name: 'Birla Institute of Technology and Science',
    location: 'Pilani',
    state: 'Rajasthan',
    city: 'Pilani',
    fees: 420000,
    rating: 4.4,
    description: 'Top-tier private engineering university',
    founded: 1964,
    courses: [
      { name: 'B.Tech Computer Science', duration: '4 years', specialization: 'CSE' },
      { name: 'B.Tech Mechanical Engineering', duration: '4 years', specialization: 'ME' }
    ],
    placements: [
      { year: 2024, placementPercent: 91.2, avgPackage: 22.5, highestPackage: 72, topRecruiter: 'Goldman Sachs' }
    ]
  }
];

const REVIEWS_DATA = [
  { rating: 5, title: 'Excellent college', content: 'Best infrastructure and faculty' },
  { rating: 4, title: 'Good placement record', content: 'Strong alumni network' },
  { rating: 5, title: 'Great campus', content: 'Beautiful campus with modern facilities' }
];

const PREDICTOR_RANKS = [
  { exam: 'JEE', minRank: 1, maxRank: 100 },
  { exam: 'JEE', minRank: 101, maxRank: 500 },
  { exam: 'JEE', minRank: 501, maxRank: 2000 },
  { exam: 'JEE', minRank: 2001, maxRank: 5000 }
];

async function main() {
  console.log('🌱 Seeding database...');
  
  // Clear existing data
  await prisma.comparison.deleteMany();
  await prisma.review.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.predictorMatch.deleteMany();
  await prisma.college.deleteMany();
  
  // Seed colleges
  for (const collegeData of COLLEGES_DATA) {
    const { courses, placements, ...collegeInfo } = collegeData;
    
    const college = await prisma.college.create({
      data: {
        ...collegeInfo,
        reviewCount: REVIEWS_DATA.length
      }
    });
    
    // Add courses
    for (const course of courses) {
      await prisma.course.create({
        data: {
          ...course,
          collegeId: college.id
        }
      });
    }
    
    // Add placements
    for (const placement of placements) {
      await prisma.placement.create({
        data: {
          ...placement,
          collegeId: college.id
        }
      });
    }
    
    // Add reviews
    for (let i = 0; i < REVIEWS_DATA.length; i++) {
      const reviewData = REVIEWS_DATA[i];
      await prisma.review.create({
        data: {
          ...reviewData,
          author: `Student ${i + 1}`,
          collegeId: college.id
        }
      });
    }
    
    // Add predictor matches - distribute colleges across rank ranges
    const collegeIndex = COLLEGES_DATA.indexOf(collegeData);
    const predictorData = PREDICTOR_RANKS[collegeIndex % PREDICTOR_RANKS.length];
    
    await prisma.predictorMatch.create({
      data: {
        exam: predictorData.exam,
        minRank: predictorData.minRank,
        maxRank: predictorData.maxRank,
        collegeId: college.id
      }
    });
    
    console.log(`✅ Created college: ${college.name}`);
  }
  
  console.log('✨ Seeding completed!');
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
