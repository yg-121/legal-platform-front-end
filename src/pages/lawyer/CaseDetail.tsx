import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, Clock, DollarSign, FileText, User, Download, Send } from "lucide-react"
import PageLayout from "../../components/layouts/PageLayout"

interface CaseDetailProps {
  userName: string
}

export default function CaseDetail({ userName }: CaseDetailProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [caseData, setCaseData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState("")
  const [bidMessage, setBidMessage] = useState("")
  const [estimatedDuration, setEstimatedDuration] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showBidForm, setShowBidForm] = useState(false)

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      const mockCase = {
        id: 201,
        title: "Corporate Merger Review",
        client: "ABC Corp",
        postedDate: "2025-03-16",
        deadline: "2025-04-15",
        budget: "$3,000",
        budgetMin: 3000,
        budgetMax: 5000,
        category: "Corporate Law",
        description:
          "Need legal assistance with reviewing merger documents and ensuring compliance with regulatory requirements. The merger involves two medium-sized technology companies with operations in multiple states. We need a thorough review of all merger documents, due diligence reports, and assistance with regulatory filings. The lawyer should have experience with technology company mergers and be familiar with both federal and state regulations.",
        attachments: [
          { id: 1, name: "Merger_Agreement_Draft.pdf", size: "2.4 MB" },
          { id: 2, name: "Due_Diligence_Report.pdf", size: "5.1 MB" },
        ],
        clientInfo: {
          name: "ABC Corp",
          contactPerson: "Robert Johnson",
          location: "New York, NY",
          memberSince: "2024-01-15",
        },
      }

      setCaseData(mockCase)
      setLoading(false)
    }, 1000)
  }, [id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // In a real application, you would send this data to your API
    // For demo purposes, we'll simulate a delay
    setTimeout(() => {
      setSubmitting(false)
      // Redirect to bids page after successful submission
      navigate("/lawyer/bids")
    }, 1500)
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
    <PageLayout userRole="lawyer" userName={userName}>
      <div className="max-w-4xl mx-auto p-6 mb-6">
        <div className="bg-gray rounded-lg shadow-2xl p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              {/* <h1 className="text-2xl font-bold text-gray-900">{caseData.title}</h1> */}
              <div className="mt-2 flex items-center">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {caseData.category}
                </span>
                {/* <span className="ml-2 text-sm text-gray-500">Case #{caseData.id}</span> */}
              </div>
            </div>
            <button
              onClick={() => setShowBidForm(!showBidForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {showBidForm ? "Hide Bid Form" : "Submit a Bid"}
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Case Details</h2>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  <span>Client: <strong>{caseData.client}</strong></span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  <span>Posted:<strong> {formatDate(caseData.postedDate)}</strong></span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  <span>Deadline: <strong>{formatDate(caseData.deadline)}</strong></span>
                </div>
                <div className="font-semibold flex items-center text-sm text-gray-500">
                  <DollarSign className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  <span>Amount: <strong>{caseData.budget}</strong></span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Description </h2>
              <div className="space-y-4">
              <p className="text-gray-700">{caseData.description}</p>
              
              </div>
            </div>
          </div>

        

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h2>
            {caseData.attachments.length > 0 ? (
              <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                {caseData.attachments.map((attachment: any) => (
                  <li key={attachment.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="ml-2 flex-1 w-0 truncate">{attachment.name}</span>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center">
                      <span className="text-gray-500 mr-4">{attachment.size}</span>
                      <button className="font-medium text-blue-600 hover:text-blue-500 flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No attachments available.</p>
            )}
          </div>

          {showBidForm && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Bid</h2>
              <form onSubmit={handleSubmitBid}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700">
                      Bid Amount 
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="bidAmount"
                        required
                        min={caseData.budgetMin}
                        max={caseData.budgetMax}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter your bid amount"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Client's budget range: {caseData.budget}</p>
                  </div>

                  <div>
                    <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700">
                      Estimated Duration
                    </label>
                    <select
                      id="estimatedDuration"
                      required
                      value={estimatedDuration}
                      onChange={(e) => setEstimatedDuration(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select estimated duration</option>
                      <option value="Less than 1 week">Less than 1 week</option>
                      <option value="1-2 weeks">1-2 weeks</option>
                      <option value="2-4 weeks">2-4 weeks</option>
                      <option value="1-2 months">1-2 months</option>
                      <option value="More than 2 months">More than 2 months</option>
                    </select>
                  </div>

                  <div >
                    <label htmlFor="bidMessage" className="block text-sm font-medium text-gray-700 font-bold">
                      Message to Client
                    </label>
                    <textarea
                      id="bidMessage"
                      rows={4}
                      required
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Explain why you're the right lawyer for this case..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowBidForm(false)}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Bid"}
                      {!submitting && <Send className="ml-2 h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

