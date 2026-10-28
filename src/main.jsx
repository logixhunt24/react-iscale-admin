import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import './styles/globals.css'

import axios from 'axios'
import { AuthProvider } from './store/AuthContext'

// An expired/invalid token (they last 60 days) makes every API call 401 while the app still
// looks logged in. Clear it and send the user to login. Wrong-password 401s are left alone.
axios.interceptors.response.use(null, (error) => {
  if (error.response?.status === 401 && localStorage.getItem('token') && !error.config?.url?.includes('/auth/')) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.replace('/login')
  }
  return Promise.reject(error)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)