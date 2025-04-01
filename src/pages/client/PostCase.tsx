"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, DollarSign, Calendar, Info } from "lucide-react"
import PageLayout from "../../components/layouts/PageLayout"

interface PostCaseProps {
  userName: string
}

export default function PostCase({ userName }: PostCaseProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
    attachments: [] as File[],
  })
  const [submitting, setSubmitting] = useState(false)

  const categories = [
    "Family Law",
    "Criminal Law",
    "Corporate Law",
    "Intellectual Property",
    "Real Estate",
    "Immigration",
    "Tax Law",
    "Employment Law",
    "Personal Injury",
    "Estate Planning",
    "Other",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...newFiles],
      })
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = [...formData.attachments]
    updatedFiles.splice(index, 1)
    setFormData({
      ...formData,
      attachments: updatedFiles,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // In a real application, you would send this data to your API
    // For demo purposes, we'll simulate a delay
    setTimeout(() => {
      setSubmitting(false)
      // Redirect to cases page after successful submission
      navigate("/client/cases")
    }, 1500)
  }

  return (
    <PageLayout userRole="client" userName={userName}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Case</h1>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Case Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Case Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g., Contract Review for Small Business"
                />
              </div>

              {/* Case Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Legal Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

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

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Budget Range (USD)</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex items-stretch flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="budgetMin"
                      required
                      value={formData.budgetMin}
                      onChange={handleInputChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
                      placeholder="Min"
                    />
                  </div>
                  <span className="inline-flex items-center px-3 rounded-none border border-l-0 border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    to
                  </span>
                  <div className="relative flex items-stretch flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="budgetMax"
                      required
                      value={formData.budgetMax}
                      onChange={handleInputChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none rounded-r-md pl-10 sm:text-sm border-gray-300"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                  Deadline
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    required
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* File Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Attachments (Optional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB each</p>
                  </div>
                </div>

                {formData.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                    <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                      {formData.attachments.map((file, index) => (
                        <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                          <div className="w-0 flex-1 flex items-center">
                            <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                            <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="font-medium text-red-600 hover:text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
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
  )
}

