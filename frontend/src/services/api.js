import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true 
})

let isRefreshing = false

let failedQueue = []
const processQueue = (error) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(true)
    }
  })
  failedQueue = []
}

api.interceptors.request.use(
  (config)=>{
   config.headers = config.headers || {}
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  } else {
    config.headers['Content-Type'] = 'application/json'
  }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use((response)=>{
  return response.data
}, async(error)=>{
  if (!error.config) {
  return Promise.reject('Unexpected error')
  }
    const originalRequest = error.config
 if (error.response?.status === 401 && !originalRequest._retry) {

        if (originalRequest.url.includes('/refresh-token')) {
          window.location.href = '/login'
          return Promise.reject(error)
        }
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        
        await axios.post(
          `${API_BASE_URL}/users/refresh-token`,
          {},
          { withCredentials: true }
        )

        processQueue(null)

        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)

        window.location.href = '/login'

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // ---- Handle Other Errors ----
    if (error.response) {
      switch (error.response.status) {
        case 403:
          console.error('Access forbidden')
          break
        case 404:
          console.error('Resource not found')
          break
        case 409:
          console.error('Conflict — resource already exists')
          break
        case 500:
          console.error('Internal server error')
          break
        default:
          console.error('API Error:', error.response.data?.message)
      }

      return Promise.reject(
        error.response.data?.message || 'Something went wrong'
      )
    }
   return Promise.reject('Network error. Please check your connection.')
})


export default api
