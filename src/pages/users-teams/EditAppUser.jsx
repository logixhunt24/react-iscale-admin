import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function EditAppUser() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    c_first_name: '',
    c_last_name: '',
    c_display_name: '',
    c_email: '',
    c_email_verified: '1',
    c_contact: '',
    c_mobile_verified: '1',
    c_alt_contact: '',
    c_user_status: '1',
    c_gender: '',
    c_dob: '',
    c_current_pincode: '',
    c_current_address1: '',
    password: '',
    confirm_password: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/app-users/single/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status && res.data?.data) {
        const d = res.data.data
        setFormData({
          c_first_name: d.c_first_name || '',
          c_last_name: d.c_last_name || '',
          c_display_name: d.c_display_name || '',
          c_email: d.c_email || '',
          c_email_verified: d.c_email_verified?.toString() || '1',
          c_contact: d.c_contact || '',
          c_mobile_verified: d.c_mobile_verified?.toString() || '1',
          c_alt_contact: d.c_alt_contact || '',
          c_user_status: d.c_user_status?.toString() || '1',
          c_gender: d.c_gender || '',
          c_dob: d.c_dob || '',
          c_current_pincode: d.c_current_pincode || '',
          c_current_address1: d.c_current_address1 || '',
          password: '',
          confirm_password: ''
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(formData.password && formData.password !== formData.confirm_password) {
      await window.customAlert("Passwords do not match")
      return
    }
    
    const token = localStorage.getItem('token')
    const payload = new FormData()
    Object.keys(formData).forEach(key => {
      payload.append(key, formData[key])
    })

    try {
      const res = await axios.put(`${BASE_URL}/myadmin/app-users/edit/${id}`, payload, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      })
      if (res.data?.status) {
        await window.customAlert(res.data.message || 'User updated successfully')
        navigate('/app-users')
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Error updating user')
    }
  }

  if (loading) return <div className="p-8 text-center">Loading user data...</div>

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#144f36] rounded-2xl shadow-md border border-white/10 p-5 mb-5 flex justify-between items-center relative overflow-hidden group">
        <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Edit App User</h2>
        <Link to={'/app-users'} className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-1 border border-white/30">
          <span>↩ Back</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">First Name</label>
              <input type="text" name="c_first_name" value={formData.c_first_name} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Last Name</label>
              <input type="text" name="c_last_name" value={formData.c_last_name} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Display Name</label>
              <input type="text" name="c_display_name" value={formData.c_display_name} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
              <input type="email" name="c_email" value={formData.c_email} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Contact No</label>
              <input type="text" name="c_contact" value={formData.c_contact} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Alt Contact</label>
              <input type="text" name="c_alt_contact" value={formData.c_alt_contact} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Gender</label>
              <select name="c_gender" value={formData.c_gender} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Date of Birth</label>
              <input type="date" name="c_dob" value={formData.c_dob?.split('T')[0] || ''} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Pincode</label>
              <input type="text" name="c_current_pincode" value={formData.c_current_pincode} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none" />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-bold text-slate-700 mb-1">Address</label>
              <textarea name="c_current_address1" value={formData.c_current_address1} onChange={handleChange} rows={2} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
              <select name="c_user_status" value={formData.c_user_status} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none">
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">New Password (optional)</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Confirm Password</label>
              <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none" />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-5">
            <Link to={'/app-users'} className="inline-block px-5 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm">
              Cancel
            </Link>
            <button type="submit" className="px-5 py-2.5 bg-[#144f36] text-white rounded-lg hover:bg-[#0f3d2a] transition-colors font-medium text-sm">
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
