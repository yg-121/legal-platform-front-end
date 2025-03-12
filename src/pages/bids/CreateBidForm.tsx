"use client"

import type React from "react"
import { useState } from "react"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Textarea from "../../components/ui/Textarea"
import Select from "../../components/ui/Select"
import { useForm } from "../../hooks/useForm"
import { Case, CaseCategory, type CaseFormData } from "../../types/case"

interface CreateCaseFormProps {
  onSubmit: (data: CaseFormData) => Promise<void>
  onCancel: () => void
  caseData: Case
}

const CreateCaseForm: React.FC<CreateCaseFormProps> = ({ onSubmit, onCancel, caseData }: CreateCaseFormProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [fileUploadProgress, setFileUploadProgress] = useState<Record<string, number>>({})

  const initialValues: CaseFormData = {
    title: "",
    description: "",
    category: CaseCategory.OTHER,
    budget: undefined,
    dueDate: "",
    attachments: [],
  }

  const validate = (values: CaseFormData) => {
    const errors: Partial<Record<keyof CaseFormData, string>> = {}

    if (!values.title) {
      errors.title = "Title is required"
    }

    if (!values.description) {
      errors.description = "Description is required"
    }

    if (!values.category) {
      errors.category = "Category is required"
    }

    if (values.budget && values.budget <= 0) {
      errors.budget = "Budget must be greater than 0"
    }

    return errors
  }

  const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue } = useForm({
    initialValues,
    validate,
    onSubmit: async (formValues) => {
      // Add files to form data
      const formData: CaseFormData = {
        ...formValues,
        attachments: files,
      }

      await onSubmit(formData)
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prevFiles) => [...prevFiles, ...newFiles])

      // Initialize progress for each file
      newFiles.forEach((file) => {
        setFileUploadProgress((prev) => ({
          ...prev,
          [file.name]: 0,
        }))
      })
    }
  }

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
    setFileUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[fileName]
      return newProgress
    })
  }

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
        label="Description"
        id="description"
        name="description"
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description}
        fullWidth
        required
        rows={5}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Category"
          id="category"
          name="category"
          value={values.category}
          onChange={(value) => setFieldValue("category", value)}
          error={errors.category}
          options={[
            { value: CaseCategory.FAMILY, label: "Family Law" },
            { value: CaseCategory.CRIMINAL, label: "Criminal Law" },
            { value: CaseCategory.CIVIL, label: "Civil Law" },
            { value: CaseCategory.CORPORATE, label: "Corporate Law" },
            { value: CaseCategory.PROPERTY, label: "Property Law" },
            { value: CaseCategory.IMMIGRATION, label: "Immigration Law" },
            { value: CaseCategory.OTHER, label: "Other" },
          ]}
          required
        />

        <Input
          label="Budget (Optional)"
          id="budget"
          name="budget"
          type="number"
          value={values.budget?.toString() || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.budget}
          placeholder="Enter budget amount"
        />
      </div>

      <Input
        label="Due Date (Optional)"
        id="dueDate"
        name="dueDate"
        type="date"
        value={values.dueDate || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.dueDate}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Attachments (Optional)</label>
        <div className="flex items-center gap-2">
          <input type="file" id="attachments" multiple onChange={handleFileChange} className="hidden" />
          <label
            htmlFor="attachments"
            className="cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-muted"
          >
            Choose Files
          </label>
          <span className="text-sm text-muted-foreground">{files.length} file(s) selected</span>
        </div>

        {files.length > 0 && (
          <div className="mt-2 space-y-2 rounded-md border p-2">
            {files.map((file) => (
              <div key={file.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
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
                  <span className="text-sm">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(file.name)}
                  className="text-destructive hover:text-destructive/80"
                >
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
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Create Case
        </Button>
      </div>
    </form>
  )
}

export default CreateCaseForm

