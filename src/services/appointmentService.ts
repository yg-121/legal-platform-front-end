import api from "./api"
import type { Appointment, AppointmentFormData } from "../types/appointment"
import type { ApiResponse } from "../types/api"

export const appointmentService = {
  getAppointments: async (
    startDate?: string,
    endDate?: string,
    page?: number,
    limit?: number,
  ): Promise<ApiResponse<Appointment[]>> => {
    const params = new URLSearchParams()

    if (startDate) params.append("startDate", startDate)
    if (endDate) params.append("endDate", endDate)
    if (page) params.append("page", page.toString())
    if (limit) params.append("limit", limit.toString())

    const response = await api.get<ApiResponse<Appointment[]>>("/appointments", { params })
    return response.data
  },

  getAppointmentById: async (appointmentId: string): Promise<ApiResponse<Appointment>> => {
    const response = await api.get<ApiResponse<Appointment>>(`/appointments/${appointmentId}`)
    return response.data
  },

  createAppointment: async (appointmentData: AppointmentFormData): Promise<ApiResponse<Appointment>> => {
    const response = await api.post<ApiResponse<Appointment>>("/appointments", appointmentData)
    return response.data
  },

  updateAppointment: async (
    appointmentId: string,
    appointmentData: Partial<AppointmentFormData>,
  ): Promise<ApiResponse<Appointment>> => {
    const response = await api.put<ApiResponse<Appointment>>(`/appointments/${appointmentId}`, appointmentData)
    return response.data
  },

  confirmAppointment: async (appointmentId: string): Promise<ApiResponse<Appointment>> => {
    const response = await api.put<ApiResponse<Appointment>>(`/appointments/${appointmentId}/confirm`)
    return response.data
  },

  cancelAppointment: async (appointmentId: string): Promise<ApiResponse<Appointment>> => {
    const response = await api.put<ApiResponse<Appointment>>(`/appointments/${appointmentId}/cancel`)
    return response.data
  },

  completeAppointment: async (appointmentId: string): Promise<ApiResponse<Appointment>> => {
    const response = await api.put<ApiResponse<Appointment>>(`/appointments/${appointmentId}/complete`)
    return response.data
  },
}

