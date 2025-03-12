"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"

type FormErrors<T> = Partial<Record<keyof T, string>>

interface UseFormProps<T> {
  initialValues: T
  validate?: (values: T) => FormErrors<T>
  onSubmit: (values: T) => void | Promise<void>
}

export const useForm = <T extends Record<string, any>>({ initialValues, validate, onSubmit }: UseFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors<T>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    // Handle checkboxes
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setValues({
        ...values,
        [name]: checked,
      })
    } else {
      setValues({
        ...values,
        [name]: value,
      })
    }

    // Clear error when field is changed
    if (errors[name as keyof T]) {
      setErrors({
        ...errors,
        [name]: undefined,
      })
    }
  }

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target

    setTouched({
      ...touched,
      [name]: true,
    })

    // Validate on blur if validate function is provided
    if (validate) {
      const validationErrors = validate(values)
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validationErrors[name as keyof T],
      }))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<keyof T, boolean>,
    )
    setTouched(allTouched)

    // Validate all fields if validate function is provided
    if (validate) {
      const validationErrors = validate(values)
      setErrors(validationErrors)

      // If there are errors, don't submit
      if (Object.keys(validationErrors).length > 0) {
        return
      }
    }

    setIsSubmitting(true)

    try {
      await onSubmit(values)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({} as Record<keyof T, boolean>)
    setIsSubmitting(false)
  }

  const setFieldValue = (name: keyof T, value: any) => {
    setValues({
      ...values,
      [name]: value,
    })
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
  }
}

