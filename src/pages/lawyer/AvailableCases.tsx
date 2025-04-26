import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Filter, Clock, DollarSign, Calendar, FileText, User } from "lucide-react"
import PageLayout from "../../components/layouts/PageLayout"

interface AvailableCasesProps {
  userName: string
}

export default function AvailableCases({ userName }: AvailableCasesProps) {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const categories = [
    "All Categories",
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
  ]

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      const mockCases = [
        {
          id: 201,
          title: "Corporate Merger Review",
          client: "ABC Corp",
          postedDate: "2025-03-16",
          deadline: "2025-04-15",
          budget: "$3,000-$5,000",
          category: "Corporate Law",
          description:
            "Need legal assistance with reviewing merger documents and ensuring compliance with regulatory requirements.",
          attachments: 2,
        },
        {
          id: 202,
          title: "Patent Application for New Technology",
          client: "Tech Innovations",
          postedDate: "2025-03-15",
          deadline: "2025-05-01",
          budget: "$2,500-$4,000",
          category: "Intellectual Property",
          description: "Seeking legal help to file a patent application for a new software technology in the AI space.",
          attachments: 3,
        },
        {
          id: 203,
          title: "Real Estate Transaction Review",
          client: "Property Holdings LLC",
          postedDate: "2025-03-14",
          deadline: "2025-03-28",
          budget: "$1,500-$2,500",
          category: "Real Estate",
          description: "Need a lawyer to review commercial property transaction documents and assist with closing.",
          attachments: 5,
        },
        {
          id: 204,
          title: "Employment Contract Dispute",
          client: "John Smith",
          postedDate: "2025-03-13",
          deadline: "2025-04-10",
          budget: "$2,000-$3,500",
          category: "Employment Law",
          description: "Dispute regarding non-compete clause in employment contract. Need legal representation.",
          attachments: 4,
        },
        {
          id: 205,
          title: "Divorce Proceedings",
          client: "Jane Doe",
          postedDate: "2025-03-12",
          deadline: "2025-04-30",
          budget: "$3,500-$6,000",
          category: "Family Law",
          description:
            "Seeking legal representation for divorce proceedings including child custody and asset division.",
          attachments: 2,
        },
      ]

      setCases(mockCases)
      setLoading(false)
    }, 1000)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would filter the cases based on the search term and category
    // For demo purposes, we'll just log the search parameters
    console.log("Search term:", searchTerm)
    console.log("Selected category:", selectedCategory)
  }

  const filteredCases = cases.filter((caseItem: any) => {
    const matchesSearch =
      searchTerm === "" ||
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === "" || selectedCategory === "All Categories" || caseItem.category === selectedCategory

    return matchesSearch && matchesCategory
  })

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
    <PageLayout userRole="lawyer" userName={userName}>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Cases</h1>

        {/* Search and Filter */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="w-full md:w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
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
          </div>
        </form>

        {/* Cases List */}
        {filteredCases.length > 0 ? (
          <div className="space-y-6">
            {filteredCases.map((caseItem: any) => (
              <div
                key={caseItem.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start">
                      {/* <h2 className="text-lg font-semibold text-gray-900">{caseItem.title}</h2> */}
                      <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {caseItem.category}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      Client: <strong>{caseItem.client}</strong>
                    </div>

                    <strong><p className="mt-2 text-sm text-gray-600 line-clamp-2">{caseItem.description}</p></strong>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        Posted: {formatDate(caseItem.postedDate)}
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        Due: {formatDate(caseItem.deadline)}
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        Budget: {caseItem.budget}
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <FileText className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        Attachments: {caseItem.attachments}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6 flex md:flex-col md:items-end">
                    <Link
                      to={`/lawyer/cases/available/${caseItem.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cases found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

