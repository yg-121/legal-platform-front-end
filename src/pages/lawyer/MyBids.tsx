"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  DollarSign,
  Clock,
  FileText,
  Filter,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react"
import PageLayout from "../../components/layouts/PageLayout"

interface Bid {
  id: number
  caseId: number
  caseTitle: string
  clientName: string
  amount: number
  submittedDate: string
  expiryDate: string
  status: "pending" | "accepted" | "rejected" | "expired"
  notes: string
  category: string
}

interface MyBidsProps {
  userName: string
}

export default function MyBids({ userName }: MyBidsProps) {
  const [bids, setBids] = useState<Bid[]>([])
  const [filteredBids, setFilteredBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState("all")

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      const mockBids: Bid[] = [
        {
          id: 1,
          caseId: 201,
          caseTitle: "Corporate Merger Review",
          clientName: "ABC Corp",
          amount: 4500,
          submittedDate: "2025-03-16",
          expiryDate: "2025-03-23",
          status: "pending",
          notes: "Offered comprehensive legal review of merger documents with expertise in corporate law.",
          category: "Business Law",
        },
        {
          id: 2,
          caseId: 202,
          caseTitle: "Patent Application for New Technology",
          clientName: "Tech Innovations",
          amount: 3200,
          submittedDate: "2025-03-14",
          expiryDate: "2025-03-21",
          status: "accepted",
          notes: "Proposed expedited patent filing process with specialized knowledge in software patents.",
          category: "Intellectual Property",
        },
        {
          id: 3,
          caseId: 203,
          caseTitle: "Real Estate Transaction Review",
          clientName: "Property Holdings LLC",
          amount: 2000,
          submittedDate: "2025-03-12",
          expiryDate: "2025-03-19",
          status: "rejected",
          notes: "Offered comprehensive review of commercial property transaction documents.",
          category: "Property Law",
        },
        {
          id: 4,
          caseId: 204,
          caseTitle: "Employment Contract Dispute",
          clientName: "John Smith",
          amount: 2800,
          submittedDate: "2025-03-10",
          expiryDate: "2025-03-17",
          status: "expired",
          notes: "Proposed representation in non-compete clause dispute with expertise in employment law.",
          category: "Labor Law",
        },
        {
          id: 5,
          caseId: 205,
          caseTitle: "Trademark Infringement Case",
          clientName: "Fashion Brand Inc",
          amount: 3800,
          submittedDate: "2025-03-08",
          expiryDate: "2025-03-15",
          status: "pending",
          notes: "Offered representation in trademark infringement case with specialized experience.",
          category: "Intellectual Property",
        },
      ]

      setBids(mockBids)
      setFilteredBids(mockBids)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Filter bids based on selected status
    if (selectedStatus === "all") {
      setFilteredBids(bids)
    } else {
      const filtered = bids.filter((bid) => bid.status === selectedStatus)
      setFilteredBids(filtered)
    }
  }, [selectedStatus, bids])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "accepted":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "expired":
        return <AlertCircle className="h-5 w-5 text-gray-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <PageLayout userRole="lawyer" userName={userName}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout userRole="lawyer" userName={userName} unreadNotifications={2}>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold">My Bids</h1>
          <p className="mt-2 text-blue-100">Track and manage your case bids</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredBids.length} {selectedStatus === "all" ? "Total" : selectedStatus} Bids
            </h2>
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="all">All Bids</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {filteredBids.length > 0 ? (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {filteredBids.map((bid) => (
                <li key={bid.id} className="hover:bg-gray-50">
                  <Link to={`/lawyer/bids/${bid.id}`} className="block">
                    <div className="px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <DollarSign className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <h3 className="text-lg font-medium text-gray-900">{bid.caseTitle}</h3>
                              <span
                                className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}
                              >
                                {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              <span className="flex items-center">
                                <FileText className="mr-1 h-4 w-4 text-gray-400" />
                                Client: {bid.clientName}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <DollarSign className="mr-1 h-4 w-4 text-gray-400" />
                              Bid Amount: {formatCurrency(bid.amount)}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                            {bid.category}
                          </span>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="mr-1 h-4 w-4 text-gray-400" />
                            Submitted: {formatDate(bid.submittedDate)}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                            Expires: {formatDate(bid.expiryDate)}
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 mt-2" />
                        </div>
                      </div>
                      <div className="mt-2 ml-16">
                        <p className="text-sm text-gray-600 line-clamp-2">{bid.notes}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bids found</h3>
            <p className="text-gray-500 mb-4">
              {selectedStatus === "all"
                ? "You haven't submitted any bids yet."
                : `You don't have any ${selectedStatus} bids.`}
            </p>
            {selectedStatus !== "all" ? (
              <button
                onClick={() => setSelectedStatus("all")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
              >
                View All Bids
              </button>
            ) : null}
            <Link
              to="/lawyer/cases/available"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Available Cases
            </Link>
          </div>
        )}

        {/* Bid Status Guide */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Bid Status Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-500 mr-2" />
              <div>
                <p className="font-medium text-gray-900">Pending</p>
                <p className="text-sm text-gray-500">Client is reviewing your bid</p>
              </div>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="font-medium text-gray-900">Accepted</p>
                <p className="text-sm text-gray-500">Client has accepted your bid</p>
              </div>
            </div>
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <p className="font-medium text-gray-900">Rejected</p>
                <p className="text-sm text-gray-500">Client has rejected your bid</p>
              </div>
            </div>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="font-medium text-gray-900">Expired</p>
                <p className="text-sm text-gray-500">Bid has expired without response</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

