"use client"

import type React from "react"

import { useState } from "react"
import DashboardLayout from "../layouts/DashboardLayouts"
import { Search, Star, MapPin, Filter } from "lucide-react"

interface Lawyer {
  id: number
  name: string
  specialization: string
  rating: number
  location: string
  hourlyRate: number
  imageUrl: string
}

const mockLawyers: Lawyer[] = [
  {
    id: 1,
    name: "Jane Smith",
    specialization: "Corporate Law",
    rating: 4.8,
    location: "New York, NY",
    hourlyRate: 250,
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "John Doe",
    specialization: "Family Law",
    rating: 4.5,
    location: "Los Angeles, CA",
    hourlyRate: 200,
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Alice Johnson",
    specialization: "Intellectual Property",
    rating: 4.9,
    location: "Chicago, IL",
    hourlyRate: 275,
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Robert Williams",
    specialization: "Criminal Law",
    rating: 4.7,
    location: "Houston, TX",
    hourlyRate: 225,
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    name: "Emily Davis",
    specialization: "Real Estate Law",
    rating: 4.6,
    location: "Miami, FL",
    hourlyRate: 230,
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 6,
    name: "Michael Brown",
    specialization: "Tax Law",
    rating: 4.4,
    location: "Seattle, WA",
    hourlyRate: 240,
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
]

interface FindLawyersProps {
  userName: string
}

export default function FindLawyers({ userName }: FindLawyersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] = useState("")
  const [lawyers, setLawyers] = useState<Lawyer[]>(mockLawyers)

  const specializations = [
    "All",
    "Corporate Law",
    "Family Law",
    "Intellectual Property",
    "Criminal Law",
    "Real Estate Law",
    "Tax Law",
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    let filtered = mockLawyers

    if (searchTerm) {
      filtered = filtered.filter(
        (lawyer) =>
          lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lawyer.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedSpecialization && selectedSpecialization !== "All") {
      filtered = filtered.filter((lawyer) => lawyer.specialization === selectedSpecialization)
    }

    setLawyers(filtered)
  }

  return (
    <DashboardLayout userRole="client" userName={userName}>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Find Lawyers</h1>
      </div>

      <div className="mt-6">
        <form onSubmit={handleSearch} className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by name or location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full md:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {lawyers.map((lawyer) => (
          <div key={lawyer.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-16 w-16 rounded-full"
                    src={lawyer.imageUrl || "/placeholder.svg"}
                    alt={lawyer.name}
                  />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">{lawyer.name}</h3>
                  <div className="text-sm text-gray-500">{lawyer.specialization}</div>
                  <div className="mt-1 flex items-center">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-500">{lawyer.rating}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  {lawyer.location}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <span className="font-medium text-gray-900">${lawyer.hourlyRate}</span> / hour
                </div>
              </div>

              <div className="mt-5 flex space-x-3">
                <a
                  href={`/client/lawyers/${lawyer.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Profile
                </a>
                <a
                  href={`/client/appointments/book?lawyer=${lawyer.id}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Book Appointment
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

