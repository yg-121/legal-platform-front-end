"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Badge from "../../components/ui/Badge"
import Spinner from "../../components/ui/Spinner"
import Modal from "../../components/ui/Modal"
import { useAuth } from "../../hooks/useAuth"
import { caseService } from "../../services/caseService"
import { bidService } from "../../services/bidService"
import { type Case, CaseStatus, type Attachment } from "../../types/case"
import { type Bid, BidStatus } from "../../types/bid"
import { UserRole } from "../../types/auth"
import CreateBidForm from "../bids/CreateBidForm"

const CaseDetail: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>()
  const navigate = useNavigate()
  const { user, userRole } = useAuth()

  const [caseData, setCaseData] = useState<Case | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isClosingCase, setIsClosingCase] = useState(false)
  const [isBidModalOpen, setIsBidModalOpen] = useState(false)

  useEffect(() => {
    if (!caseId) return

    const fetchCaseData = async () => {
      try {
        setIsLoading(true)

        // Fetch case details
        const caseResponse = await caseService.getCaseById(caseId)
        if (caseResponse.data) {
          setCaseData(caseResponse.data)
        }

        // Fetch bids for the case
        const bidsResponse = await bidService.getBidsForCase(caseId)
        if (bidsResponse.data) {
          setBids(bidsResponse.data)
        }
      } catch (error) {
        console.error("Error fetching case data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCaseData()
  }, [caseId])

  const handleCloseCase = async () => {
    if (!caseId) return

    try {
      setIsClosingCase(true)
      const response = await caseService.closeCase(caseId)
      if (response.data) {
        setCaseData(response.data)
      }
    } catch (error) {
      console.error("Error closing case:", error)
    } finally {
      setIsClosingCase(false)
    }
  }

  const handleAcceptBid = async (bidId: string) => {
    try {
      const response = await bidService.acceptBid(bidId)
      if (response.data) {
        // Refresh bids
        const bidsResponse = await bidService.getBidsForCase(caseId!)
        if (bidsResponse.data) {
          setBids(bidsResponse.data)
        }

        // Refresh case data
        const caseResponse = await caseService.getCaseById(caseId!)
        if (caseResponse.data) {
          setCaseData(caseResponse.data)
        }
      }
    } catch (error) {
      console.error("Error accepting bid:", error)
    }
  }

  const handleCreateBid = async (bidData: any) => {
    if (!caseId) return

    try {
      const response = await bidService.createBid(caseId, bidData)
      if (response.data) {
        setIsBidModalOpen(false)

        // Refresh bids
        const bidsResponse = await bidService.getBidsForCase(caseId)
        if (bidsResponse.data) {
          setBids(bidsResponse.data)
        }
      }
    } catch (error) {
      console.error("Error creating bid:", error)
    }
  }

  const getStatusBadgeVariant = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.POSTED:
        return "warning"
      case CaseStatus.ASSIGNED:
        return "secondary"
      case CaseStatus.IN_PROGRESS:
        return "primary"
      case CaseStatus.CLOSED:
        return "success"
      default:
        return "default"
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h2 className="text-xl font-semibold">Case not found</h2>
        <p className="text-muted-foreground">
          The case you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button className="mt-4" onClick={() => navigate("/cases")}>
          Back to Cases
        </Button>
      </div>
    )
  }

  const isClient = userRole === UserRole.CLIENT
  const isLawyer = userRole === UserRole.LAWYER
  const isAdmin = userRole === UserRole.ADMIN
  const isOwner = user?.id === caseData.clientId
  const isAssigned = caseData.lawyerId && user?.id === caseData.lawyerId
  const canBid = isLawyer && caseData.status === CaseStatus.POSTED
  const canClose = (isOwner || isAdmin) && caseData.status !== CaseStatus.CLOSED
  const hasAlreadyBid = bids.some((bid) => bid.lawyerId === user?.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{caseData.title}</h1>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant(caseData.status)}>
              {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Created on {new Date(caseData.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {canBid && !hasAlreadyBid && <Button onClick={() => setIsBidModalOpen(true)}>Submit Bid</Button>}
          {canClose && (
            <Button variant="outline" onClick={handleCloseCase} isLoading={isClosingCase}>
              Close Case
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate("/cases")}>
            Back to Cases
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="mt-1 whitespace-pre-line">{caseData.description}</p>
              </div>

              <div>
                <h3 className="font-semibold">Category</h3>
                <p className="mt-1">{caseData.category}</p>
              </div>

              {caseData.budget && (
                <div>
                  <h3 className="font-semibold">Budget</h3>
                  <p className="mt-1">${caseData.budget}</p>
                </div>
              )}

              {caseData.dueDate && (
                <div>
                  <h3 className="font-semibold">Due Date</h3>
                  <p className="mt-1">{new Date(caseData.dueDate).toLocaleDateString()}</p>
                </div>
              )}

              {caseData.attachments && caseData.attachments.length > 0 && (
                <div>
                  <h3 className="font-semibold">Attachments</h3>
                  <ul className="mt-1 space-y-2">
                    {caseData.attachments.map((attachment: Attachment) => (
                      <li key={attachment.id} className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <a
                          href={attachment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {attachment.fileName}
                        </a>
                        <span className="text-xs text-muted-foreground">
                          ({Math.round(attachment.fileSize / 1024)} KB)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {(isOwner || isAdmin || isAssigned) && (
            <Card>
              <CardHeader>
                <CardTitle>Bids</CardTitle>
              </CardHeader>
              <CardContent>
                {bids.length > 0 ? (
                  <div className="space-y-4">
                    {bids.map((bid) => (
                      <div key={bid.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{bid.lawyerName}</h3>
                            <p className="text-sm text-muted-foreground">
                              Bid Amount: ${bid.amount} • Estimated Completion: {bid.estimatedCompletionTime}
                            </p>
                          </div>
                          <Badge
                            variant={
                              bid.status === BidStatus.ACCEPTED
                                ? "success"
                                : bid.status === BidStatus.REJECTED
                                  ? "danger"
                                  : "secondary"
                            }
                          >
                            {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <h4 className="text-sm font-medium">Proposal</h4>
                          <p className="mt-1 text-sm">{bid.proposal}</p>
                        </div>
                        {isOwner && bid.status === BidStatus.PENDING && (
                          <div className="mt-4 flex justify-end gap-2">
                            <Button size="sm" onClick={() => handleAcceptBid(bid.id)}>
                              Accept Bid
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No bids have been submitted yet.</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">{caseData.clientName}</p>
                {/* Additional client information would go here */}
                {isOwner && <p className="text-sm text-muted-foreground">This is your case</p>}
              </div>
            </CardContent>
          </Card>

          {caseData.lawyerId && caseData.lawyerName && (
            <Card>
              <CardHeader>
                <CardTitle>Assigned Lawyer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-semibold">{caseData.lawyerName}</p>
                  {/* Additional lawyer information would go here */}
                  {isAssigned && <p className="text-sm text-muted-foreground">You are assigned to this case</p>}
                  {(isOwner || isAssigned) && (
                    <Button
                      variant="outline"
                      className="mt-2 w-full"
                      onClick={() => navigate(`/chat/${isOwner ? caseData.lawyerId : caseData.clientId}`)}
                    >
                      Send Message
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {(isOwner || isAssigned || isAdmin) && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isOwner && caseData.status === CaseStatus.POSTED && (
                  <Button variant="outline" className="w-full" onClick={() => navigate(`/cases/${caseId}/bids`)}>
                    View All Bids
                  </Button>
                )}

                {(isOwner || isAssigned) && caseData.status !== CaseStatus.CLOSED && (
                  <Button variant="outline" className="w-full" onClick={() => navigate("/appointments")}>
                    Schedule Appointment
                  </Button>
                )}

                {canClose && (
                  <Button variant="outline" className="w-full" onClick={handleCloseCase} isLoading={isClosingCase}>
                    Close Case
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Modal isOpen={isBidModalOpen} onClose={() => setIsBidModalOpen(false)} title="Submit Bid" size="lg">
        <CreateBidForm onSubmit={handleCreateBid} onCancel={() => setIsBidModalOpen(false)} caseData={caseData} />
      </Modal>
    </div>
  )
}

export default CaseDetail

