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
import type { Case } from "../../types/case"
import { type Bid, BidStatus } from "../../types/bid"
import { UserRole } from "../../types/auth"
import CreateBidForm from "./CreateBidForm"

const Bids: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>()
  const navigate = useNavigate()
  const { user, userRole } = useAuth()

  const [caseData, setCaseData] = useState<Case | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBidModalOpen, setIsBidModalOpen] = useState(false)

  useEffect(() => {
    if (!caseId) return

    const fetchData = async () => {
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
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [caseId])

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
  const isOwner = user?.id === caseData.clientId
  const canBid = isLawyer && caseData.status === "posted"
  const hasAlreadyBid = bids.some((bid) => bid.lawyerId === user?.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bids for Case: {caseData.title}</h1>
          <p className="text-muted-foreground">
            {bids.length} {bids.length === 1 ? "bid" : "bids"} submitted
          </p>
        </div>
        <div className="flex gap-2">
          {canBid && !hasAlreadyBid && <Button onClick={() => setIsBidModalOpen(true)}>Submit Bid</Button>}
          <Button variant="outline" onClick={() => navigate(`/cases/${caseId}`)}>
            Back to Case
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p>{caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
              <p>{caseData.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
              <p>{caseData.clientName}</p>
            </div>
            {caseData.budget && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Budget</h3>
                <p>${caseData.budget}</p>
              </div>
            )}
            {caseData.dueDate && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                <p>{new Date(caseData.dueDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
            <p className="mt-1 whitespace-pre-line">{caseData.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Bids</CardTitle>
        </CardHeader>
        <CardContent>
          {bids.length > 0 ? (
            <div className="space-y-6">
              {bids.map((bid) => (
                <div key={bid.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{bid.lawyerName}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">Bid Amount: ${bid.amount}</p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">
                          Estimated Completion: {bid.estimatedCompletionTime}
                        </p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">
                          Submitted: {new Date(bid.createdAt).toLocaleDateString()}
                        </p>
                      </div>
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
                  <div className="mt-4">
                    <h4 className="text-sm font-medium">Proposal</h4>
                    <p className="mt-1 whitespace-pre-line">{bid.proposal}</p>
                  </div>
                  {isOwner && bid.status === BidStatus.PENDING && (
                    <div className="mt-4 flex justify-end gap-2">
                      <Button size="sm" onClick={() => handleAcceptBid(bid.id)}>
                        Accept Bid
                      </Button>
                    </div>
                  )}
                  {bid.lawyerId === user?.id && (
                    <div className="mt-2 text-right">
                      <p className="text-sm text-muted-foreground italic">This is your bid</p>
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

      <Modal isOpen={isBidModalOpen} onClose={() => setIsBidModalOpen(false)} title="Submit Bid" size="lg">
        <CreateBidForm onSubmit={handleCreateBid} onCancel={() => setIsBidModalOpen(false)} caseData={caseData} />
      </Modal>
    </div>
  )
}

export default Bids

