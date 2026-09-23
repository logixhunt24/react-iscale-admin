import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddBanner() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    m_banner_title: '',
    m_banner_status: 'running'
  })
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (isEdit) {
      fetchBanner()
    }
  }, [id])

  const fetchBanner = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/banners/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status && res.data.data) {
        setFormData({
          m_banner_title: res.data.data.m_banner_title || '',
          m_banner_status: res.data.data.m_banner_status || 'running'
        })
      }
    } catch (err) {
      await window.customAlert('Failed to fetch banner details')
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
      if (!formData.m_banner_title) {
        return await window.customAlert('Please enter banner title')
      }

      const token = localStorage.getItem('token')
      const payload = new FormData()
      payload.append('m_banner_title', formData.m_banner_title)
      payload.append('m_banner_status', formData.m_banner_status)
      if (imageFile) {
        payload.append('banner_image', imageFile)
      }

      const url = isEdit ? `${BASE_URL}/myadmin/banners/update/${id}` : `${BASE_URL}/myadmin/banners/add`
      const method = isEdit ? 'put' : 'post'

      const res = await axios[method](url, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (res.data?.status) {
        await window.customAlert(res.data.message || 'Success')
        navigate('/banners')
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to save banner')
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden">
        <div className="p-4 bg-[#144f36] dark:bg-[#0f3d2a] rounded-t-2xl">
          <h2 className="text-xl font-bold tracking-tight text-white">{isEdit ? 'Edit Banner' : 'Add New Banner'}</h2>
        </div>

        <div className="p-6 bg-white dark:bg-[#13111c]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Banner Title<span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="m_banner_title"
                value={formData.m_banner_title}
                onChange={handleChange}
                placeholder="Enter Banner Title"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#1f1b2e] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Banner Status</label>
              <select 
                name="m_banner_status"
                value={formData.m_banner_status}
                onChange={handleChange}
                className="w-full border border-slate-300 dark:border-gray-700 text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-[#f6f6ff] dark:bg-[#1f1b2e]"
              >
                <option value="running">Running</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Banner Image</label>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#144f36] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#0f3d2a] transition-colors w-full md:w-[48%] flex items-center justify-center gap-2 shadow-sm"
            >
              <span>📷</span> <span className="truncate">{imageFile ? imageFile.name : 'Choose Banner Image (520x250)'}</span>
            </button>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-gray-800">
            <button 
              onClick={handleSubmit}
              className="bg-[#144f36] text-white px-10 py-2.5 rounded-lg text-sm font-bold hover:bg-[#0f3d2a] transition-colors shadow-md"
            >
              Submit
            </button>
            <Link 
              to={'/banners'}
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
