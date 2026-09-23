import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddTeam() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    member_name: '',
    member_position: '',
    member_expertise: '',
    member_experience: '',
    member_linkedin: '',
    member_type: '1',
    member_status: '1',
    member_order: '',
    member_bio: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (isEdit) {
      fetchTeam()
    }
  }, [id])

  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/team/single/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status && res.data.data) {
        const d = res.data.data
        setFormData({
          member_name: d.member_name || '',
          member_position: d.member_position || '',
          member_expertise: d.member_expertise || '',
          member_experience: d.member_experience || '',
          member_linkedin: d.member_linkedin || '',
          member_type: d.member_type?.toString() || '1',
          member_status: d.member_status?.toString() || '1',
          member_order: d.member_order || '',
          member_bio: d.member_bio || ''
        })
      }
    } catch (err) {
      await window.customAlert('Failed to fetch team details')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    try {
      if (!formData.member_name || !formData.member_position) {
        return await window.customAlert('Please fill the required fields')
      }

      const token = localStorage.getItem('token')
      const payload = new FormData()
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v))
      if (imageFile) {
        payload.append('member_image', imageFile)
      }

      const url = isEdit ? `${BASE_URL}/myadmin/team/update/${id}` : `${BASE_URL}/myadmin/team/add`
      const method = isEdit ? 'put' : 'post'

      const res = await axios[method](url, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (res.data?.status) {
        await window.customAlert(res.data.message || 'Success')
        navigate('/teams/all')
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to save team member')
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden">
        <div className="bg-[#144f36] rounded-t p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white dark:bg-[#13111c]/10 rounded-full blur-2xl group-hover:bg-white dark:bg-[#13111c]/20 transition-all duration-700 pointer-events-none"></div>
          <div className="flex items-center relative z-10">
            <div className="w-1.5 h-7 bg-white dark:bg-[#13111c]/90 rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">{isEdit ? 'Edit Team' : 'Add Team'}</h2>
          </div>
          <Link 
            to={'/teams/all'}
            className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 relative z-10 hover:shadow hover:-translate-y-0.5"
          >
            <span>Back</span>
          </Link>
        </div>

        <div className="p-6 bg-white dark:bg-[#13111c]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Member Name<span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="member_name"
                value={formData.member_name}
                onChange={handleChange}
                placeholder="Member Name"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#1f1b2e] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Member Position<span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="member_position"
                value={formData.member_position}
                onChange={handleChange}
                placeholder="Member Position"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#1f1b2e] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Member Expertise</label>
              <input 
                type="text" 
                name="member_expertise"
                value={formData.member_expertise}
                onChange={handleChange}
                placeholder="Member Expertise"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#1f1b2e] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Year Of Experience</label>
              <input 
                type="number" 
                name="member_experience"
                value={formData.member_experience}
                onChange={handleChange}
                placeholder="Member Experience"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#1f1b2e] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Linkedin Url</label>
              <input 
                type="url" 
                name="member_linkedin"
                value={formData.member_linkedin}
                onChange={handleChange}
                placeholder="Linkedin"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#1f1b2e] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Type</label>
              <select 
                name="member_type"
                value={formData.member_type}
                onChange={handleChange}
                className="w-full border border-slate-300 dark:border-gray-700 text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-[#f6f6ff] dark:bg-[#1f1b2e]"
              >
                <option value="1">Type 1</option>
                <option value="2">Type 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Status</label>
              <select 
                name="member_status"
                value={formData.member_status}
                onChange={handleChange}
                className="w-full border border-slate-300 dark:border-gray-700 text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-[#f6f6ff] dark:bg-[#1f1b2e]"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Order</label>
              <input 
                type="number" 
                name="member_order"
                value={formData.member_order}
                onChange={handleChange}
                placeholder="Member Order"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#1f1b2e] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Bio</label>
            <textarea 
              rows={4}
              name="member_bio"
              value={formData.member_bio}
              onChange={handleChange}
              placeholder="Member Bio"
              className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#1f1b2e] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] resize-none"
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Member Image</label>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#144f36] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#0f3d2a] transition-colors w-64 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>📷</span> <span className="truncate">{imageFile ? imageFile.name : 'Choose Image'}</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-gray-800 flex gap-4">
            <button 
              onClick={handleSubmit}
              className="bg-[#144f36] text-white px-10 py-2.5 rounded-lg text-sm font-bold hover:bg-[#0f3d2a] transition-colors shadow-md"
            >
              Submit
            </button>
            <Link 
              to={'/teams/all'}
              className="inline-block bg-[#d87025] text-white px-10 py-2.5 rounded-lg text-sm font-bold hover:bg-[#b55d1f] transition-colors shadow-md"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
