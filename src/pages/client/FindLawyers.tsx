"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {Search,Filter,MapPin,Star,Users,Shield,Clock,} from "lucide-react";
import type { Lawyer } from "../../types/lawyer";
import { getLawyer } from "@/services/lawyerService"
import PageLayout from "../../components/layouts/PageLayout";

interface FindLawyersProps {
  userName: string;
}

export default function FindLawyers({ userName }: FindLawyersProps) {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");

  useEffect(() => {
    async function fetchLawyers(){
      try{

        const mockLawyers = await getLawyer()
        setLawyers(mockLawyers)

        // console.log(mockLawyers)
      }catch (error) {
        console.log(error)
      }
    }

    fetchLawyers();
    setTimeout(() => {
      const mockLawyers: Lawyer[] = [
       
      ];

      setLawyers(mockLawyers);
      setFilteredLawyers(mockLawyers);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter lawyers based on search term and filters
    const filtered = lawyers.filter((lawyer) => {
      // Filter by search term
      const matchesSearch =
        searchTerm === "" ||
        lawyer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by specialization
      const matchesSpecialization =
        selectedSpecialization === "" ||
        lawyer.specialization === selectedSpecialization;

      // Filter by location
      const matchesLocation =
        selectedLocation === "" || lawyer.location === selectedLocation;

      // Filter by experience
      let matchesExperience = true;
      if (selectedExperience === "0-5") {
        matchesExperience = lawyer.hourlyRate >= 0 && lawyer.hourlyRate <= 5;
      } else if (selectedExperience === "6-10") {
        matchesExperience = lawyer.hourlyRate >= 6 && lawyer.hourlyRate <= 10;
      } else if (selectedExperience === "11+") {
        matchesExperience = lawyer.hourlyRate >= 11;
      }

      return (
        matchesSearch &&
        matchesSpecialization &&
        matchesLocation &&
        matchesExperience
      );
    });

    setFilteredLawyers(filtered);
  }, [
    searchTerm,
    selectedSpecialization,
    selectedLocation,
    selectedExperience,
    lawyers,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is already handled by the useEffect above
  };

  const specializations = [
    "Business Law",
    "Family Law",
    "Criminal Law",
    "Property Law",
    "Labor Law",
    "Intellectual Property",
  ];

  const locations = [
    "Addis Ababa",
    "Bahir Dar",
    "Hawassa",
    "Dire Dawa",
    "Mekelle",
  ];

  const experienceRanges = [
    { value: "0-5", label: "0-5 years" },
    { value: "6-10", label: "6-10 years" },
    { value: "11+", label: "11+ years" },
  ];

  if (loading) {
    return (
      <PageLayout userRole="client" userName={userName}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout userRole="client" userName={userName} unreadNotifications={3}>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold">
            Find Lawyers in Ethiopia
          </h1>
          <p className="mt-2 text-blue-100">
            Search and filter to find the right legal professional for your
            needs
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or specialization"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <div className="relative">
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map((specialization) => (
                      <option key={specialization} value={specialization}>
                        {specialization}
                      </option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">All Locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <div className="relative">
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Any Experience</option>
                    {experienceRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredLawyers.length} Lawyers Found
            </h2>
            <div className="text-sm text-gray-500">
              Showing {filteredLawyers.length} of {lawyers.length} lawyers
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer) => (
              <div
                key={lawyer.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <img
                      // src={lawyer.imageUrl || "/placeholder.svg"}
                      alt={lawyer.username}
                      className="h-16 w-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {lawyer.username}
                      </h3>
                      <p className="text-blue-600">{lawyer.specialization}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(lawyer.averageRating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-500">
                          {lawyer.averageRating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      {lawyer.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      {lawyer.hourlyRate} years Hourly Rate
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      specialization: {lawyer.specialization.join(", ")}
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <Link
                      to={`/client/lawyers/${lawyer._id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-md transition duration-200"
                    >
                      View Profile
                    </Link>
                    {/* <Link
                      to={`/client/appointments/book?lawyer=${lawyer.id}`}
                      className="flex-1 bg-white hover:bg-gray-50 text-blue-600 text-center font-medium py-2 px-4 rounded-md border border-blue-600 transition duration-200"
                    >
                      Book Appointment
                    </Link> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLawyers.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No lawyers found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search filters to find more lawyers.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialization("");
                  setSelectedLocation("");
                  setSelectedExperience("");
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
