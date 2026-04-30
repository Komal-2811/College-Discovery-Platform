'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { collegeAPI } from '@/lib/api';
import { College } from '@/lib/types';
import { Star, MapPin, DollarSign, Users, Briefcase } from 'lucide-react';

export default function CollegePage() {
  const params = useParams();
  const id = params.id as string;
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'placements' | 'reviews'>('courses');
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', content: '', author: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCollege();
  }, [id]);

  const fetchCollege = async () => {
    try {
      const response = await collegeAPI.getCollegeById(id);
      setCollege(response.data);
    } catch (error) {
      console.error('Error fetching college:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.title || !reviewForm.content || !reviewForm.author) {
      alert('Please fill all fields');
      return;
    }

    setSubmitting(true);
    try {
      await collegeAPI.addReview(id, reviewForm);
      setReviewForm({ rating: 5, title: '', content: '', author: '' });
      fetchCollege();
      alert('Review added successfully!');
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">College not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Colleges
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{college.name}</h1>
          <div className="flex flex-wrap gap-6 text-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {college.city}, {college.state}
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              ₹{(college.fees / 100000).toFixed(2)}L per year
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-300" />
              {college.rating.toFixed(1)} ({college.reviewCount} reviews)
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Overview</h2>
          <p className="text-gray-700 mb-6 text-lg">{college.description}</p>
          {college.founded && (
            <p className="text-gray-600">
              <span className="font-semibold">Founded:</span> {college.founded}
            </p>
          )}
          {college.affiliatedTo && (
            <p className="text-gray-600">
              <span className="font-semibold">Affiliated To:</span> {college.affiliatedTo}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex border-b">
            {(['courses', 'placements', 'reviews'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-center font-semibold transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Courses Offered</h3>
                {college.courses && college.courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {college.courses.map(course => (
                      <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-800 mb-2">{course.name}</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-semibold">Duration:</span> {course.duration}
                          </p>
                          {course.specialization && (
                            <p>
                              <span className="font-semibold">Specialization:</span> {course.specialization}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No courses information available</p>
                )}
              </div>
            )}

            {/* Placements Tab */}
            {activeTab === 'placements' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Placement Statistics</h3>
                {college.placements && college.placements.length > 0 ? (
                  <div className="space-y-4">
                    {college.placements.map(placement => (
                      <div key={placement.id} className="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-green-50 to-blue-50">
                        <h4 className="text-lg font-bold text-gray-800 mb-4">Batch {placement.year}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Placement %</p>
                            <p className="text-2xl font-bold text-green-600">{placement.placementPercent}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Avg Package</p>
                            <p className="text-2xl font-bold text-blue-600">₹{placement.avgPackage} LPA</p>
                          </div>
                          {placement.highestPackage && (
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Highest Package</p>
                              <p className="text-2xl font-bold text-purple-600">₹{placement.highestPackage} LPA</p>
                            </div>
                          )}
                          {placement.topRecruiter && (
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Top Recruiter</p>
                              <p className="text-lg font-bold text-gray-800">{placement.topRecruiter}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No placement information available</p>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Student Reviews</h3>

                {/* Add Review Form */}
                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                  <h4 className="font-bold text-gray-800 mb-4">Share Your Experience</h4>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                      <input
                        type="text"
                        value={reviewForm.author}
                        onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Rating *</label>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {[1, 2, 3, 4, 5].map(r => (
                          <option key={r} value={r}>{r} ★</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                      <input
                        type="text"
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="e.g., Excellent college with great facilities"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Review *</label>
                      <textarea
                        value={reviewForm.content}
                        onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        rows={4}
                        placeholder="Share your detailed review..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                {college.reviews && college.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {college.reviews.map(review => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-800">{review.title}</h4>
                          <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">By {review.author}</p>
                        <p className="text-gray-700">{review.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
