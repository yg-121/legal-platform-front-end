"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "../layouts/DashboardLayouts"
import {
  Calendar,
  FileText,
  MessageSquare,
  Clock,
  User,
  Briefcase,
  ChevronDown,
  ChevronUp,
  PaperclipIcon,
} from "lucide-react"

interface CaseDetailsProps {
  userName: string
  userRole: "client" | "lawyer" | "admin"
  caseId: number
}

interface CaseData {
  id: number
  title: string
  description: string
  status: string
  createdAt: string
  client: {
    name: string
    email: string
    phone: string
  }
  lawyer: {
    name: string
    email: string
    phone: string
  }
  type: string
  documents: {
    id: number
    name: string
    uploadedBy: string
    uploadedAt: string
    size: string
  }[]
  timeline: {
    id: number
    date: string
    title: string
    description: string
  }[]
}

export default function CaseDetails({ userName, userRole, caseId }: CaseDetailsProps) {
  const [caseData, setCaseData] = useState<CaseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [documentsExpanded, setDocumentsExpanded] = useState(true)
  const [timelineExpanded, setTimelineExpanded] = useState(true)

  useEffect(() => {
    // In a real application, you would fetch case data from your API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      const mockCaseData: CaseData = {
        id: caseId,
        title: "Property Boundary Dispute",
        description:
          "Dispute regarding property boundary lines between client and neighbor. Client has provided deed and recent survey showing discrepancy with neighbor's fence placement.",
        status: "active",
        createdAt: "2025-03-01",
        client: {
          name: "John Smith",
          email: "john.smith@example.com",
          phone: "(555) 123-4567",
        },
        lawyer: {
          name: "Jane Doe",
          email: "jane.doe@example.com",
          phone: "(555) 987-6543",
        },
        type: "Real Estate",
        documents: [
          {
            id: 1,
            name: "Property_Deed.pdf",
            uploadedBy: "John Smith",
            uploadedAt: "2025-03-01",
            size: "2.4 MB",
          },
          {
            id: 2,
            name: "Property_Survey_2025.pdf",
            uploadedBy: "John Smith",
            uploadedAt: "2025-03-01",
            size: "5.1 MB",
          },
          {
            id: 3,
            name: "Neighbor_Communication.pdf",
            uploadedBy: "Jane Doe",
            uploadedAt: "2025-03-05",
            size: "1.2 MB",
          },
          {
            id: 4,
            name: "Legal_Analysis.docx",
            uploadedBy: "Jane Doe",
            uploadedAt: "2025-03-10",
            size: "0.8 MB",
          },
        ],
        timeline: [
          {
            id: 1,
            date: "2025-03-01",
            title: "Case Opened",
            description: "Client submitted initial documentation and case was assigned to Jane Doe.",
          },
          {
            id: 2,
            date: "2025-03-05",
            title: "Initial Consultation",
            description: "Discussed case details and strategy with client. Requested additional documentation.",
          },
          {
            id: 3,
            date: "2025-03-10",
            title: "Legal Analysis Completed",
            description: "Completed initial legal analysis of property dispute based on provided documentation.",
          },
          {
            id: 4,
            date: "2025-03-15",
            title: "Demand Letter Sent",
            description: "Sent formal demand letter to neighbor requesting removal of encroaching fence.",
          },
        ],
      }

      setCaseData(mockCaseData)
      setLoading(false)
    }, 1000)
  }, [caseId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  if (loading) {
    return (
      <DashboardLayout userRole={userRole} userName={userName}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!caseData) {
    return (
      <DashboardLayout userRole={userRole} userName={userName}>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">Case not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole={userRole} userName={userName}>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">{caseData.title}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Case #{caseData.id} • {caseData.type}
              </p>
            </div>
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                caseData.status === "active"
                  ? "bg-green-100 text-green-800"
                  : caseData.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "documents"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("documents")}
            >
              Documents
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "timeline"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("timeline")}
            >
              Timeline
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "messages"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("messages")}
            >
              Messages
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Case Details</h4>
                <p className="mt-2 text-sm text-gray-500">{caseData.description}</p>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Opened on {formatDate(caseData.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Case Type: {caseData.type}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-gray-900">Parties</h4>
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-900 flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      Client
                    </h5>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900">{caseData.client.name}</p>
                      <p className="text-sm text-gray-500">{caseData.client.email}</p>
                      <p className="text-sm text-gray-500">{caseData.client.phone}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-900 flex items-center">
                      <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                      Lawyer
                    </h5>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900">{caseData.lawyer.name}</p>
                      <p className="text-sm text-gray-500">{caseData.lawyer.email}</p>
                      <p className="text-sm text-gray-500">{caseData.lawyer.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900">Recent Documents</h4>
                  <button
                    onClick={() => setDocumentsExpanded(!documentsExpanded)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {documentsExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
                {documentsExpanded && (
                  <div className="mt-4 overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {caseData.documents.slice(0, 3).map((document) => (
                        <li key={document.id} className="py-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{document.name}</p>
                              <p className="text-xs text-gray-500">
                                Uploaded by {document.uploadedBy} on {formatDate(document.uploadedAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-4">{document.size}</span>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Download</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {caseData.documents.length > 3 && (
                      <div className="mt-4">
                        <button
                          onClick={() => setActiveTab("documents")}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          View all documents ({caseData.documents.length})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900">Recent Activity</h4>
                  <button
                    onClick={() => setTimelineExpanded(!timelineExpanded)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {timelineExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
                {timelineExpanded && (
                  <div className="mt-4 flow-root">
                    <ul className="-mb-8">
                      {caseData.timeline.slice(0, 3).map((event, eventIdx) => (
                        <li key={event.id}>
                          <div className="relative pb-8">
                            {eventIdx !== caseData.timeline.slice(0, 3).length - 1 ? (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                  <Clock className="h-4 w-4 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-900">{event.title}</p>
                                  <p className="mt-1 text-sm text-gray-500">{event.description}</p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  {formatDate(event.date)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {caseData.timeline.length > 3 && (
                      <div className="mt-4">
                        <button
                          onClick={() => setActiveTab("timeline")}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          View full timeline ({caseData.timeline.length} events)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-medium text-gray-900">Case Documents</h4>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <PaperclipIcon className="h-4 w-4 mr-2" />
                  Upload Document
                </button>
              </div>

              <div className="overflow-hidden bg-white shadow sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {caseData.documents.map((document) => (
                    <li key={document.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <p className="text-sm font-medium text-gray-900 truncate">{document.name}</p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Download</button>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">Uploaded by {document.uploadedBy}</p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              {formatDate(document.uploadedAt)} • {document.size}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-6">Case Timeline</h4>

              <div className="flow-root">
                <ul className="-mb-8">
                  {caseData.timeline.map((event, eventIdx) => (
                    <li key={event.id}>
                      <div className="relative pb-8">
                        {eventIdx !== caseData.timeline.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                              <Clock className="h-4 w-4 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{event.title}</p>
                              <p className="mt-1 text-sm text-gray-500">{event.description}</p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {formatDate(event.date)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex justify-center">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Add Timeline Event
                </button>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-6">Case Messages</h4>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-500">
                  This tab provides a quick overview of case-related messages. For a full messaging experience, please
                  use the Messages section.
                </p>
                <div className="mt-4">
                  <a
                    href={`/${userRole}/messages`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Go to Messages
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">JD</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Jane Doe</p>
                        <p className="text-sm text-gray-500">March 15, 2025</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      I've sent the demand letter to the neighbor today. We should expect a response within 10 business
                      days.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">JS</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">John Smith</p>
                        <p className="text-sm text-gray-500">March 10, 2025</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Thank you for the legal analysis. I've reviewed it and agree with your approach.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

