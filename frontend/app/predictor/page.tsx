'use client';

import { useState } from 'react';
import Link from 'next/link';
import { predictorAPI, collegeAPI } from '@/lib/api';
import { College } from '@/lib/types';
import { Zap } from 'lucide-react';

export default function PredictorPage() {
  const [exam, setExam] = useState('JEE');
  const [rank, setRank] = useState('');
  const [results, setResults] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rank) {
      alert('Please enter your rank');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await predictorAPI.predict({ exam, rank: parseInt(rank) });
      setResults(response.data.colleges);
    } catch (error) {
      console.error('Error predicting:', error);
      alert('Failed to predict colleges');
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🎓 CollegeFinder
          </Link>
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Back to Listings
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8" />
            <h1 className="text-4xl font-bold">College Predictor Tool</h1>
          </div>
          <p className="text-lg">Find colleges matching your exam rank</p>
        </div>
      </div>

      {/* Predictor Form */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Your Details</h2>
          <form onSubmit={handlePredict} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Exam *
              </label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="JEE">JEE (Mains/Advanced)</option>
                <option value="NEET">NEET</option>
                <option value="BITSAT">BITSAT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Rank *
              </label>
              <input
                type="number"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="e.g., 500"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50 font-semibold"
            >
              {loading ? 'Predicting...' : 'Predict Colleges'}
            </button>
          </form>
        </div>

        {/* Results */}
        {hasSearched && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Predicting colleges...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No colleges found for this rank</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {results.length} Colleges Found
                  </h2>
                  {selectedColleges.length > 0 && (
                    <button
                      onClick={handleCompare}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Compare ({selectedColleges.length})
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map(college => (
                    <div
                      key={college.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
                    >
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

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating</span>
                          <span className="font-semibold text-yellow-500">★ {college.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Annual Fees</span>
                          <span className="font-semibold">₹{(college.fees / 100000).toFixed(2)}L</span>
                        </div>
                        {college.placements?.[0] && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Avg Package</span>
                            <span className="font-semibold text-green-600">
                              ₹{college.placements[0].avgPackage} LPA
                            </span>
                          </div>
                        )}
                      </div>

                      <Link
                        href={`/college/${college.id}`}
                        className="block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition"
                      >
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
