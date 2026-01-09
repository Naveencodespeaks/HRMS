const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = {
  baseURL: API_BASE_URL,
  endpoints: {
    candidates: '/candidates',
    interviews: '/interviews',
    jobs: '/jobs',
    offers: '/offers',
  }
}

export default api