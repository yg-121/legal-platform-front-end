"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Select from "../../components/ui/Select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table"
import Spinner from "../../components/ui/Spinner"
import Badge from "../../components/ui/Badge"
import Modal from "../../components/ui/Modal"
import { useAuth } from "../../hooks/useAuth"
import { caseService } from "../../services/caseService"
import { type Case, CaseStatus, CaseCategory, type CaseFilters, type CaseFormData } from "../../types/case"
import { UserRole } from "../../types/auth"
import CreateCaseForm from "./CreateCaseForm"

const Cases: React.FC = () => {
  const { userRole } = useAuth()
  const [cases, setCases] = useState<Case[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<CaseFilters>({
    status: undefined,
    category: undefined,
    search: "",
    page: 1,
    limit: 10,
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    fetchCases()
  }, [filters])

  const fetchCases = async () => {
    try {
      setIsLoading(true)
      const response =
        userRole === UserRole.CLIENT ? await caseService.getMyCases(filters) : await caseService.getCases(filters)

      if (response.data) {
        setCases(response.data)
      }
    } catch (error) {
      console.error("Error fetching cases:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: keyof CaseFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1, // Reset to first page when filters change
    }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCases()
  }

  const handleCreateCase = async (caseData: CaseFormData) => {
    try {
      const response = await caseService.createCase(caseData)
      if (response.data) {
        setIsCreateModalOpen(false)
        fetchCases()
      }
    } catch (error) {
      console.error("Error creating case:", error)
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Legal Cases</h1>
        {userRole === UserRole.CLIENT && <Button onClick={() => setIsCreateModalOpen(true)}>Create New Case</Button>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-4">
            <Select
              label="Status"
              options={[
                { value: "all", label: "All Statuses" },
                { value: CaseStatus.POSTED, label: "Posted" },
                { value: CaseStatus.ASSIGNED, label: "Assigned" },
                { value: CaseStatus.IN_PROGRESS, label: "In Progress" },
                { value: CaseStatus.CLOSED, label: "Closed" },
              ]}
              value={filters.status || "all"}
              onChange={(value) => handleFilterChange("status", value)}
            />
            <Select
              label="Category"
              options={[
                { value: "all", label: "All Categories" },
                { value: CaseCategory.FAMILY, label: "Family Law" },
                { value: CaseCategory.CRIMINAL, label: "Criminal Law" },
                { value: CaseCategory.CIVIL, label: "Civil Law" },
                { value: CaseCategory.CORPORATE, label: "Corporate Law" },
                { value: CaseCategory.PROPERTY, label: "Property Law" },
                { value: CaseCategory.IMMIGRATION, label: "Immigration Law" },
                { value: CaseCategory.OTHER, label: "Other" },
              ]}
              value={filters.category || "all"}
              onChange={(value) => handleFilterChange("category", value)}
            />
            <Input
              label="Search"
              placeholder="Search by title or description"
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
            <div className="flex items-end">
              <Button type="submit" className="mb-0.5">
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.length > 0 ? (
                  cases.map((caseItem) => (
                    <TableRow key={caseItem.id}>
                      <TableCell className="font-medium">{caseItem.title}</TableCell>
                      <TableCell>{caseItem.category}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(caseItem.status)}>
                          {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{caseItem.clientName}</TableCell>
                      <TableCell>{new Date(caseItem.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/cases/${caseItem.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No cases found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Case" size="lg">
        <CreateCaseForm onSubmit={handleCreateCase} onCancel={() => setIsCreateModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default Cases

