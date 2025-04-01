"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { User, Mail, Phone, MapPin, Book, Award, Edit, Camera, Save, DollarSign } from "lucide-react"
import PageLayout from "../../components/layouts/PageLayout"

interface ProfilePageProps {
  userName: string
  userRole: "client" | "lawyer" | "admin"
}

export default function ProfilePage({ userName, userRole }: ProfilePageProps) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<any>(null)

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      const mockClientProfile = {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "(555) 123-4567",
        address: "123 Main St, New York, NY 10001",
        bio: "Business owner seeking legal advice for various corporate matters.",
        joinDate: "2024-01-15",
        profileImage: "/placeholder.svg?height=200&width=200",
      }

      const mockLawyerProfile = {
        id: 1,
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "(555) 987-6543",
        address: "456 Park Ave, New York, NY 10022",
        bio: "Experienced attorney specializing in corporate law and intellectual property with over 10 years of practice.",
        joinDate: "2023-11-10",
        profileImage: "/placeholder.svg?height=200&width=200",
        specializations: ["Corporate Law", "Intellectual Property", "Contract Law"],
        education: [
          { degree: "J.D.", institution: "Harvard Law School", year: "2013" },
          { degree: "B.A. in Political Science", institution: "Yale University", year: "2010" },
        ],
        barAdmission: "New York State Bar, 2014",
        hourlyRate: 250,
        rating: 4.8,
        reviewCount: 27,
      }

      if (userRole === "client") {
        setProfile(mockClientProfile)
        setEditedProfile(mockClientProfile)
      } else {
        setProfile(mockLawyerProfile)
        setEditedProfile(mockLawyerProfile)
      }

      setLoading(false)
    }, 1000)
  }, [userRole])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedProfile({
      ...editedProfile,
      [name]: value,
    })
  }

  const handleSaveProfile = () => {
    // In a real application, you would send this data to your API
    setProfile(editedProfile)
    setEditing(false)
  }

  if (loading) {
    return (
      <PageLayout userRole={userRole} userName={userName}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout userRole={userRole} userName={userName}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-700">
          {editing && (
            <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md">
              <Camera className="h-5 w-5 text-blue-600" />
            </button>
          )}
        </div>

        <div className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row">
            {/* Profile Image */}
            <div className="relative -mt-16 md:mr-6">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                <img
                  src={profile.profileImage || "/placeholder.svg"}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {editing && (
                <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-200">
                  <Camera className="h-4 w-4 text-blue-600" />
                </button>
              )}
            </div>

            {/* Profile Info Header */}
            <div className="mt-4 md:mt-4 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={editedProfile.name}
                      onChange={handleInputChange}
                      className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500 pb-1 mb-1"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                  )}
                  <p className="text-gray-500 capitalize">{userRole}</p>
                </div>

                <div className="mt-4 md:mt-0">
                  {editing ? (
                    <button
                      onClick={handleSaveProfile}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {userRole === "lawyer" && (
                <div className="mt-2 flex flex-wrap items-center">
                  <div className="flex items-center mr-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.floor(profile.rating) ? "text-yellow-400" : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.585l-7.07 3.715 1.35-7.865L.36 7.13l7.91-1.15L10 0l1.73 5.98 7.91 1.15-5.92 5.305 1.35 7.865z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-gray-500">
                      {profile.rating} ({profile.reviewCount} reviews)
                    </span>
                  </div>

                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">${profile.hourlyRate}/hour</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedProfile.email}
                      onChange={handleInputChange}
                      className="text-sm text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{profile.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedProfile.phone}
                      onChange={handleInputChange}
                      className="text-sm text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{profile.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  {editing ? (
                    <input
                      type="text"
                      name="address"
                      value={editedProfile.address}
                      onChange={handleInputChange}
                      className="text-sm text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{profile.address}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-sm text-gray-900">{new Date(profile.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
            {editing ? (
              <textarea
                name="bio"
                value={editedProfile.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 p-2"
              />
            ) : (
              <p className="text-sm text-gray-700">{profile.bio}</p>
            )}
          </div>

          {/* Lawyer-specific sections */}
          {userRole === "lawyer" && (
            <>
              {/* Specializations */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Specializations</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.specializations.map((specialization: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {specialization}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Education</h2>
                <div className="space-y-4">
                  {profile.education.map((edu: any, index: number) => (
                    <div key={index} className="flex items-start">
                      <Book className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{edu.degree}</p>
                        <p className="text-sm text-gray-500">
                          {edu.institution}, {edu.year}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar Admission */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Bar Admission</h2>
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <p className="text-sm text-gray-700">{profile.barAdmission}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

