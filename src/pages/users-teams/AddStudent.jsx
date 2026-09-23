import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

// Creates a student account directly, no self-registration/OTP needed on
// their end - the account can log into the iScale mobile app right away
// via OTP, since that flow only requires a first name to be set, not a
// password (admin-added students never get one).
export default function AddStudent() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    mobile: '',
    email: '',
    gender: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(`${BASE_URL}/myadmin/app-users/add`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        await window.customAlert(res.data.message || 'Student added successfully')
        navigate('/app-users')
      } else {
        await window.customAlert(res.data?.message || 'Failed to add student')
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Error adding student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#144f36] rounded-2xl shadow-md border border-white/10 p-5 mb-5 flex justify-between items-center relative overflow-hidden group">
        <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Add Student</h2>
        <Link to={'/app-users'} className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-1 border border-white/30">
          <span>↩ Back</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-slate-500 mb-6">
            No password is needed - once added, this student can log into the iScale mobile app with just their mobile number and an OTP.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">First Name <span className="text-red-500">*</span></label>
              <input type="text" name="fname" value={formData.fname} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Last Name</label>
              <input type="text" name="lname" value={formData.lname} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
              <input type="text" name="mobile" maxLength={10} value={formData.mobile} onChange={handleChange} placeholder="10-digit mobile number" className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] outline-none">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-5">
            <Link to={'/app-users'} className="inline-block px-5 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#144f36] text-white rounded-lg hover:bg-[#0f3d2a] transition-colors font-medium text-sm disabled:opacity-60">
              {loading ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
