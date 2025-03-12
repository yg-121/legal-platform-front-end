"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Textarea from "../../components/ui/Textarea"
import Select from "../../components/ui/Select"
import { useForm } from "../../hooks/useForm"
import { caseService } from "../../services/caseService"
import { type AppointmentFormData, AppointmentType } from "../../types/appointment"
import type { Case } from "../../types/case"
import { useAuth } from "../../hooks/useAuth"

interface CreateAppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => Promise<void>
  onCancel: () => void
  selectedDate?: Date
}

const CreateAppointmentForm: React.FC<CreateAppointmentFormProps> = ({ onSubmit, onCancel, selectedDate }) => {
  const { userRole } = useAuth()
  const [cases, setCases] = useState<Case[]>([])
  const [isLoadingCases, setIsLoadingCases] = useState(false)

  // Format date as YYYY-MM-DD for input
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const initialValues: AppointmentFormData = {
    title: "",
    description: "",
    caseId: "",
    date: selectedDate ? formatDateForInput(selectedDate) : formatDateForInput(new Date()),
    startTime: "09:00",
    endTime: "10:00",
    type: AppointmentType.VIRTUAL,
    location: "",
  }

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setIsLoadingCases(true)
        const response = await caseService.getMyCases()
        if (response.data) {
          setCases(response.data)
        }
      } catch (error) {
        console.error("Error fetching cases:", error)
      } finally {
        setIsLoadingCases(false)
      }
    }

    fetchCases()
  }, [])

  const validate = (values: AppointmentFormData) => {
    const errors: Partial<Record<keyof AppointmentFormData, string>> = {}

    if (!values.title) {
      errors.title = "Title is required"
    }

    if (!values.date) {
      errors.date = "Date is required"
    }

    if (!values.startTime) {
      errors.startTime = "Start time is required"
    }

    if (!values.endTime) {
      errors.endTime = "End time is required"
    }

    if (values.startTime && values.endTime && values.startTime >= values.endTime) {
      errors.endTime = "End time must be after start time"
    }

    if (!values.type) {
      errors.type = "Appointment type is required"
    }

    if (values.type === AppointmentType.IN_PERSON && !values.location) {
      errors.location = "Location is required for in-person appointments"
    }

    return errors
  }

  const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue } = useForm({
    initialValues,
    validate,
    onSubmit,
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        id="title"
        name="title"
        value={values.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.title}
        fullWidth
        required
      />

      <Textarea
        label="Description (Optional)"
        id="description"
        name="description"
        value={values.description || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description}
        fullWidth
        rows={3}
      />

      <Select
        label="Related Case (Optional)"
        id="caseId"
        name="caseId"
        value={values.caseId || ""}
        onChange={(value) => setFieldValue("caseId", value)}
        error={errors.caseId}
        options={[
          { value: "", label: "Select a case" },
          ...cases.map((caseItem) => ({
            value: caseItem.id,
            label: caseItem.title,
          })),
        ]}
        fullWidth
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Input
          label="Date"
          id="date"
          name="date"
          type="date"
          value={values.date}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.date}
          fullWidth
          required
        />

        <Input
          label="Start Time"
          id="startTime"
          name="startTime"
          type="time"
          value={values.startTime}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.startTime}
          fullWidth
          required
        />

        <Input
          label="End Time"
          id="endTime"
          name="endTime"
          type="time"
          value={values.endTime}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.endTime}
          fullWidth
          required
        />
      </div>

      <Select
        label="Appointment Type"
        id="type"
        name="type"
        value={values.type}
        onChange={(value) => setFieldValue("type", value as AppointmentType)}
        error={errors.type}
        options={[
          { value: AppointmentType.VIRTUAL, label: "Virtual Meeting" },
          { value: AppointmentType.IN_PERSON, label: "In-Person Meeting" },
          { value: AppointmentType.PHONE_CALL, label: "Phone Call" },
        ]}
        fullWidth
        required
      />

      {values.type === AppointmentType.IN_PERSON && (
        <Input
          label="Location"
          id="location"
          name="location"
          value={values.location || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.location}
          placeholder="Enter the meeting location"
          fullWidth
          required
        />
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Create Appointment
        </Button>
      </div>
    </form>
  )
}

export default CreateAppointmentForm

