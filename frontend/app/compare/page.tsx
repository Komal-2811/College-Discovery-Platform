'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { collegeAPI, comparisonAPI } from '@/lib/api';
import { College } from '@/lib/types';
import { X, Download } from 'lucide-react';

interface ComparisonField {
  label: string;
  key: keyof College | 'avgPackage';
}

const COMPARISON_FIELDS: ComparisonField[] = [
  { label: 'Name', key: 'name' },
  { label: 'Location', key: 'location' },
  { label: 'Annual Fees', key: 'fees' },
  { label: 'Rating', key: 'rating' },
  { label: 'Avg Placement', key: 'avgPackage' },
];

export default function ComparePage() {
  const searchParams = useSearchParams();
  const collegeIds = searchParams.get('colleges')?.split(',') || [];

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparisonId, setComparisonId] = useState<number | null>(null);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const collegeData = await Promise.all(
        collegeIds.map(id => collegeAPI.getCollegeById(id))
      );
      const colleges = collegeData.map(r => r.data);
      setColleges(colleges);

      // Create comparison
      const comparisonResponse = await comparisonAPI.create({
        collegeIds: colleges.map(c => c.id),
        name: `Comparison: ${colleges.map(c => c.name.split(' ')[0]).join(' vs ')}`
      });
      setComparisonId(comparisonResponse.data.id);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeCollege = (id: number) => {
    const updated = colleges.filter(c => c.id !== id);
    if (updated.length < 2) {
      window.location.href = '/';
    } else {
      setColleges(updated);
    }
  };

  const getFieldValue = (college: College, field: ComparisonField): string => {
    if (field.key === 'avgPackage') {
      const placement = college.placements?.[0];
      return placement ? `₹${placement.avgPackage} LPA` : 'N/A';
    }
    const value = college[field.key as keyof College];
    if (field.key === 'fees') {
      return `₹${(value as number) / 100000}L`;
    }
    if (field.key === 'rating') {
      return `${(value as number).toFixed(1)} ★`;
    }
    return String(value || 'N/A');
  };

  const downloadComparison = () => {
    let csv = 'Criteria,' + colleges.map(c => c.name).join(',') + '\n';
    COMPARISON_FIELDS.forEach(field => {
      csv += field.label + ',' + colleges.map(c => getFieldValue(c, field)).join(',') + '\n';
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', 'college-comparison.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Colleges
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Compare Colleges</h1>
          <button
            onClick={downloadComparison}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </button>
        </div>
      </nav>

      {/* Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <th className="px-6 py-4 text-left font-semibold">Criteria</th>
                {colleges.map(college => (
                  <th key={college.id} className="px-6 py-4 text-left font-semibold">
                    <div className="flex justify-between items-start gap-2">
                      <span>{college.name}</span>
                      <button
                        onClick={() => removeCollege(college.id)}
                        className="text-white hover:text-red-300"
                        title="Remove college"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FIELDS.map((field, idx) => (
                <tr key={field.key} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 font-semibold text-gray-800 border-r">{field.label}</td>
                  {colleges.map(college => (
                    <td key={college.id} className="px-6 py-4 text-gray-700">
                      {getFieldValue(college, field)}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Courses */}
              <tr className="bg-blue-50">
                <td className="px-6 py-4 font-semibold text-gray-800 border-r">Top Courses</td>
                {colleges.map(college => (
                  <td key={college.id} className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {college.courses?.slice(0, 2).map(course => (
                        <span key={course.id} className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                          {course.specialization || 'Course'}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Reviews Count */}
              <tr className="bg-white">
                <td className="px-6 py-4 font-semibold text-gray-800 border-r">Student Reviews</td>
                {colleges.map(college => (
                  <td key={college.id} className="px-6 py-4 text-gray-700">
                    {college.reviewCount} reviews
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* College Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {colleges.map(college => (
            <div key={college.id} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{college.name}</h3>
              <p className="text-gray-600 mb-4">{college.description}</p>
              <Link
                href={`/college/${college.id}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                View Full Details →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
