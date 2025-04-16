"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, DollarSign, Calendar, Info } from "lucide-react";
import PageLayout from "../../components/layouts/PageLayout";
import axios from "axios";

interface PostCaseProps {
  userName: string;
}

export default function PostCase({ userName }: PostCaseProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    attachment: null as File | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        attachment: e.target.files[0],
      });
    }
  };

  const removeFile = () => {
    setFormData({
      ...formData,
      attachment: null,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token"); // Assuming JWT token is stored in localStorage
      if (!token) {
        setError("Please log in to post a case.");
        setSubmitting(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("description", formData.description);
      if (formData.attachment) {
        formDataToSend.append("file", formData.attachment);
      }

      const response = await axios.post(
        "http://localhost:5000/api/cases", // Adjust to your backend URL
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // On success, redirect to cases page
      setSubmitting(false);
      navigate("/client/cases");
    } catch (err: any) {
      setSubmitting(false);
      const errorMessage =
        err.response?.data?.message || "Failed to post case. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <PageLayout userRole="client" userName={userName}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Case</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Case Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Case Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Describe your legal issue in detail..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Be specific about your legal needs to receive accurate bids from lawyers.
                </p>
              </div>

              {/* File Attachment */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Attachment (Optional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                  </div>
                </div>

                {formData.attachment && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">Uploaded File:</h4>
                    <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                      <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                          <span className="ml-2 flex-1 w-0 truncate">{formData.attachment.name}</span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button
                            type="button"
                            onClick={removeFile}
                            className="font-medium text-red-600 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Terms and Privacy */}
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      By posting this case, you agree to our{" "}
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
                  onClick={() => navigate("/client/home")}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {submitting ? "Posting..." : "Post Case"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}