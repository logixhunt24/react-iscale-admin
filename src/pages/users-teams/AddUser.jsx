import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { User, Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddUser() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  const fileInputRef = useRef(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedFileName, setSelectedFileName] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    login_id: '',
    role: '1',
    status: '1',
    password: ''
  })

  useEffect(() => {
    if (isEditing) {
      fetchUser()
    }
  }, [id])

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/auth/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const user = response.data.data || response.data
      
      const statusStr = user.status || user.is_active || user.m_status
      const isActive = String(statusStr).toLowerCase() === 'active' || String(statusStr).toLowerCase() === 'true' || String(statusStr) === '1'

      setFormData({
        name: user.admin_name || user.user_name || user.name || '',
        phone: user.contact_no || user.phone || user.contact || '',
        role: user.role || user.permission || '1',
        status: isActive ? 'active' : 'inactive',
        email: user.email || '',
        login_id: user.login_id || user.email || '',
        password: '' // Always blank on edit
      })
    } catch (error) {
      console.error('Failed to fetch user:', error)
      await window.customAlert('Failed to load user details for editing.')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const token = localStorage.getItem('token')
      
      if (isEditing) {
        const formPayload = new FormData()

        formPayload.append('kh_admin_name', formData.name)
        formPayload.append('kh_admin_phone', String(formData.phone))
        formPayload.append('kh_admin_email', formData.email)
        formPayload.append('kh_role', formData.role)
        formPayload.append('kh_status', formData.status)

        const file = fileInputRef.current?.files?.[0];
        if (file) {
          formPayload.append("kh_pic", file);
        }

        console.log("EDIT FORM DATA")
        for (let pair of formPayload.entries()) {
          console.log(pair[0], pair[1])
        }

        await axios.put(`${BASE_URL}/myadmin/auth/update/${id}`, formPayload, {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        })
      } else {
        const formPayload = new FormData()

        formPayload.append("admin_name", formData.name);
        formPayload.append("username", formData.login_id);
        formPayload.append("email", formData.email);
        formPayload.append("phone", formData.phone);
        formPayload.append("password", formData.password);
        formPayload.append("role", formData.role);
        formPayload.append("status", formData.status);
        const file = fileInputRef.current?.files?.[0];
        if (file) {
          formPayload.append("kh_pic", file);
        }

        console.log("ADD FORM DATA")
        for (let pair of formPayload.entries()) {
          console.log(pair[0], pair[1])
        }

        await axios.post(`${BASE_URL}/myadmin/auth/add`, formPayload, {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        })
      }
      
      navigate('/user-role')
    } catch (error) {
      console.log("FULL ERROR", error)

      if (error.response) {
        console.log("BACKEND RESPONSE", error.response.data)
        console.log("STATUS", error.response.status)
      }

      let msg = error.response?.data?.message ||
        (error.response?.data ? (typeof error.response.data === 'object' ? JSON.stringify(error.response.data) : error.response.data) : null) ||
        error.message;
        
      if (String(msg) === "0") {
        msg = "Failed to save user. Please check your inputs or try again later.";
      }
      
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full animate-fade-in-up flex flex-col">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md border border-slate-100 flex flex-col h-full w-full">
        
        {/* Header - White Theme with Green Button per screenshot */}
        <div className="p-4 flex justify-between items-center bg-white rounded-t-2xl border-b border-slate-200">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              {isEditing ? 'Edit User' : 'Add New User'}
            </h2>
          </div>
          <Link 
            to={'/user-role'}
            className="bg-[#144f36] text-white px-5 py-2 rounded flex items-center gap-2 text-sm font-bold hover:bg-[#0f3d2a] transition-colors shadow-sm"
          >
            <User size={16} />
            <span>View All Users</span>
          </Link>
        </div>

        {/* Form Body */}
        <div className="p-6 bg-white flex-1 rounded-b-2xl">
          {errorMessage && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 font-medium whitespace-pre-wrap">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* ROW 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Name<span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Name"
                  required
                  className="w-full border-2 border-fuchsia-500 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-fuchsia-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number<span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter Phone Number"
                  required
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">User Type</label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:right_10px_center] pr-8"
                >
                  <option value="1">Admin (Level 1)</option>
                  <option value="2">User (Level 2)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:right_10px_center] pr-8"
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Email Address"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Profile Image</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => setSelectedFileName(e.target.files[0]?.name || '')}
                  className="hidden" 
                  accept="image/*"
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-[#144f36] text-white rounded px-3 py-2 text-sm font-medium hover:bg-[#0f3d2a] transition-colors flex items-center justify-center gap-2 shadow-sm truncate"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  {selectedFileName ? selectedFileName : 'Profile Image (196 X 215)'}
                </button>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Login Id <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="login_id"
                  value={formData.login_id}
                  onChange={handleInputChange}
                  placeholder="Enter Login Id"
                  required
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter Password"
                    required={!isEditing}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white pr-10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#144f36]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 bg-[#144f36] text-white px-6 py-2.5 rounded font-medium hover:bg-[#0f3d2a] transition-colors disabled:opacity-50 shadow-sm"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <Link 
                to={'/user-role'}
                className="inline-block flex-1 bg-[#d97706] text-white px-6 py-2.5 rounded font-medium hover:bg-amber-600 transition-colors shadow-sm"
              >
                Cancel
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
