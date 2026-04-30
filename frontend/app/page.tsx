'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';
import { collegeAPI } from '@/lib/api';
import { College } from '@/lib/types';

export default function Home() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [maxFees, setMaxFees] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);

  useEffect(() => {
    fetchColleges();
  }, [search, location, maxFees, page]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const response = await collegeAPI.getColleges({
        search: search || undefined,
        location: location || undefined,
        maxFees: maxFees || undefined,
        page,
        limit: 9,
      });
      setColleges(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCollege = (id: string) => {
    setSelectedColleges(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleCompare = () => {
    if (selectedColleges.length < 2 || selectedColleges.length > 5) {
      alert('Select 2-5 colleges to compare');
      return;
    }
    window.location.href = `/compare?colleges=${selectedColleges.join(',')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🎓 CollegeFinder
          </Link>
          <div className="flex gap-4">
            <Link href="/predictor" className="text-gray-700 hover:text-blue-600">
              Predictor Tool
            </Link>
            {selectedColleges.length > 0 && (
              <button
                onClick={handleCompare}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Compare ({selectedColleges.length})
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect College</h1>
          <p className="text-lg mb-8">Explore thousands of colleges with detailed information, placements, and reviews</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search by Name</label>
              <input
                type="text"
                placeholder="e.g., IIT Delhi"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Location</label>
              <select
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All Locations</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Chennai">Chennai</option>
                <option value="Trichy">Trichy</option>
                <option value="Vellore">Vellore</option>
                <option value="Manipal">Manipal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Fees (₹)</label>
              <select
                value={maxFees}
                onChange={(e) => {
                  setMaxFees(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All Fees</option>
                <option value="150000">Up to 1.5L</option>
                <option value="250000">Up to 2.5L</option>
                <option value="400000">Up to 4L</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Actions</label>
              <button
                onClick={() => {
                  setSearch('');
                  setLocation('');
                  setMaxFees('');
                  setPage(1);
                }}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Colleges Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading colleges...</p>
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No colleges found. Try different filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {colleges.map(college => (
                <div
                  key={college.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-800 flex-1">{college.name}</h3>
                      <input
                        type="checkbox"
                        checked={selectedColleges.includes(college.id)}
                        onChange={() => toggleCollege(college.id)}
                        className="w-5 h-5 cursor-pointer"
                        title="Select for comparison"
                      />
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{college.location}, {college.state}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rating</span>
                        <span className="font-semibold text-yellow-500">★ {college.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Annual Fees</span>
                        <span className="font-semibold">₹{(college.fees / 100000).toFixed(2)}L</span>
                      </div>
                      {college.placements?.[0] && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Placement</span>
                          <span className="font-semibold text-green-600">
                            {college.placements[0].placementPercent}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-2 font-semibold">Top Courses:</p>
                      <div className="flex flex-wrap gap-1">
                        {college.courses?.slice(0, 2).map(course => (
                          <span key={course.id} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {course.specialization || course.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={`/college/${college.id}`}
                      className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                ← Previous
              </button>
              <span className="text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
