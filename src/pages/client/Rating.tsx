"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Info } from "lucide-react";
import PageLayout from "../../components/layouts/PageLayout";
import axios from "axios";

interface RateLawyerProps {
  userName: string;
}

interface Lawyer {
  _id: string;
  username: string;
}

export default function RateLawyer({ userName }: RateLawyerProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lawyerId: "",
    rating: 0,
    comment: "",
  });
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch lawyers or pending ratings on mount
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to rate a lawyer.");
          return;
        }

        // Optionally fetch pending ratings to get lawyers
        const response = await axios.get("http://localhost:5000/api/ratings/pending", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Assuming response.data contains lawyers or cases with lawyer info
        const fetchedLawyers = response.data.map((item: any) => ({
          _id: item.lawyer._id,
          username: item.lawyer.username,
        }));
        setLawyers(fetchedLawyers);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load lawyers.");
      }
    };

    fetchLawyers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRatingClick = (value: number) => {
    setFormData({
      ...formData,
      rating: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to submit a rating.");
        setSubmitting(false);
        return;
      }

      if (!formData.lawyerId) {
        setError("Please select a lawyer.");
        setSubmitting(false);
        return;
      }

      if (formData.rating < 1 || formData.rating > 5) {
        setError("Please select a rating between 1 and 5 stars.");
        setSubmitting(false);
        return;
      }

      await axios.post(
        "http://localhost:5000/api/ratings",
        {
          lawyerId: formData.lawyerId,
          rating: formData.rating,
          comment: formData.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSubmitting(false);
      navigate("/client/dashboard"); // Adjust to your desired redirect
    } catch (err: any) {
      setSubmitting(false);
      const errorMessage =
        err.response?.data?.message || "Failed to submit rating. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <PageLayout userRole="client" userName={userName}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Rate a Lawyer</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Lawyer Selection */}
              <div>
                <label
                  htmlFor="lawyerId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Lawyer
                </label>
                <select
                  id="lawyerId"
                  name="lawyerId"
                  required
                  value={formData.lawyerId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select a lawyer</option>
                  {lawyers.map((lawyer) => (
                    <option key={lawyer._id} value={lawyer._id}>
                      {lawyer.username}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  Choose the lawyer you worked with to provide feedback.
                </p>
              </div>

              {/* Rating Stars */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rating
                </label>
                <div className="mt-1 flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer ${
                        (hoverRating || formData.rating) >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Click the stars to rate your experience (1-5).
                </p>
              </div>

              {/* Comment */}
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Comment (Optional)
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={4}
                  value={formData.comment}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Share your experience with this lawyer..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Provide additional feedback to help others.
                </p>
              </div>

              {/* Terms and Privacy */}
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      By submitting this rating, you agree to our{" "}
                      <a href="/terms" className="font-medium underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="font-medium underline">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/client/dashboard")}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Rating"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}