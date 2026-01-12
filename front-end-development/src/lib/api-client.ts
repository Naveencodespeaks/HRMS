const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

// API request wrapper with auth
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken()

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.detail || `API Error: ${response.status}`)
  }

  return response.json()
}

/* =========================
   Candidates API
========================= */
export const candidatesAPI = {
  getAll: (params?: {
    page?: number
    page_size?: number
    search?: string
  }) => {
    const query = params
      ? '?' + new URLSearchParams(params as any).toString()
      : ''
    return apiRequest(`/candidates${query}`)
  },

  getById: (id: string) => apiRequest(`/candidates/${id}`),

  create: (data: any) =>
    apiRequest('/candidates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/candidates/${id}`, {
      method: 'PATCH', // ✅ FIXED
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/candidates/${id}`, {
      method: 'DELETE',
    }),

  restore: (id: string) =>
    apiRequest(`/candidates/${id}/restore`, {
      method: 'POST',
    }),
}

/* =========================
   Auth API
========================= */
export const authAPI = {
  login: (email: string, password: string) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
    }
  },

  getCurrentUser: () => apiRequest('/auth/me'),
}

/* =========================
   Jobs API
========================= */
export const jobsAPI = {
  getAll: () => apiRequest('/jobs'),
  getById: (id: string) => apiRequest(`/jobs/${id}`),
  create: (data: any) =>
    apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

/* =========================
   Interviews API
========================= */
export const interviewsAPI = {
  getAll: () => apiRequest('/interviews'),
  getById: (id: string) => apiRequest(`/interviews/${id}`),
  create: (data: any) =>
    apiRequest('/interviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

/* =========================
   Offers API
========================= */
export const offersAPI = {
  getAll: () => apiRequest('/offers'),
  getById: (id: string) => apiRequest(`/offers/${id}`),
  create: (data: any) =>
    apiRequest('/offers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
