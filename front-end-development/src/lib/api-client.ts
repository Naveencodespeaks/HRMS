const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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
    throw new Error(`API Error: ${response.status}`)
  }
  
  return response.json()
}

// Candidates API
export const candidatesAPI = {
  getAll: () => apiRequest('/candidates'),
  getById: (id: number) => apiRequest(`/candidates/${id}`),
  create: (data: any) => apiRequest('/candidates', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id: number, data: any) => apiRequest(`/candidates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id: number) => apiRequest(`/candidates/${id}`, {
    method: 'DELETE'
  })
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }),
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
    }
  },
  
  getCurrentUser: () => apiRequest('/auth/me')
}

// Jobs API
export const jobsAPI = {
  getAll: () => apiRequest('/jobs'),
  getById: (id: number) => apiRequest(`/jobs/${id}`),
  create: (data: any) => apiRequest('/jobs', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// Interviews API
export const interviewsAPI = {
  getAll: () => apiRequest('/interviews'),
  getById: (id: number) => apiRequest(`/interviews/${id}`),
  create: (data: any) => apiRequest('/interviews', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// Offers API
export const offersAPI = {
  getAll: () => apiRequest('/offers'),
  getById: (id: number) => apiRequest(`/offers/${id}`),
  create: (data: any) => apiRequest('/offers', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}