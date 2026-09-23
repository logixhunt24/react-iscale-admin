import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddOffer() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    m_offer_title: '',
    m_offer_status: '1',
    m_offer_started: '',
    m_offer_priority: '',
    m_offer_des: '',
    m_offer_url: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (isEdit) {
      fetchOffer()
    }
  }, [id])

  const fetchOffer = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/offers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status && res.data.data) {
        const d = res.data.data
        setFormData({
          m_offer_title: d.m_offer_title || '',
          m_offer_status: d.m_offer_status?.toString() || '1',
          m_offer_started: d.m_offer_started ? d.m_offer_started.split('T')[0] : '',
          m_offer_priority: d.m_offer_priority || '',
          m_offer_des: d.m_offer_des || '',
          m_offer_url: d.m_offer_url || ''
        })
      }
    } catch (err) {
      await window.customAlert('Failed to fetch offer details')
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
      if (!formData.m_offer_title || !formData.m_offer_des || !formData.m_offer_url) {
        return await window.customAlert('Please fill the required fields')
      }

      const token = localStorage.getItem('token')
      const payload = new FormData()
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v))
      if (imageFile) {
        payload.append('m_offer_image', imageFile)
      }

      const url = isEdit ? `${BASE_URL}/myadmin/offers/update/${id}` : `${BASE_URL}/myadmin/offers/add`
      const method = isEdit ? 'put' : 'post'

      const res = await axios[method](url, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (res.data?.status) {
        await window.customAlert(res.data.message || 'Success')
        navigate('/offers')
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to save offer')
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#eef5fa] p-4 min-h-screen">
        <div className="bg-[#144f36] dark:bg-[#0f3d2a] rounded-lg p-4 mb-4 shadow-sm flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight text-white">{isEdit ? 'Edit Offer' : 'Add New Offer'}</h2>
        </div>

        <div className="bg-white dark:bg-[#13111c] rounded-lg shadow-sm border border-slate-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Offer Title<span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="m_offer_title"
                value={formData.m_offer_title}
                onChange={handleChange}
                placeholder="Enter Offer Title"
                className="w-full border border-slate-300 dark:border-[#1f1b2e] rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white dark:bg-[#13111c]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Offer Status</label>
              <select 
                name="m_offer_status"
                value={formData.m_offer_status}
                onChange={handleChange}
                className="w-full border border-slate-300 dark:border-[#1f1b2e] rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white dark:bg-[#13111c]"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Offer Image ( 1280px X 320px )</label>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#144f36] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#0f3d2a] transition-colors w-full flex items-center justify-center gap-2"
              >
                <span>📷</span> <span className="truncate">{imageFile ? imageFile.name : 'Choose Image'}</span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Offer Start Date</label>
              <input 
                type="date" 
                name="m_offer_started"
                value={formData.m_offer_started}
                onChange={handleChange}
                className="w-full border border-slate-300 dark:border-[#1f1b2e] rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white dark:bg-[#13111c] text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Offer Priority</label>
              <input 
                type="number" 
                name="m_offer_priority"
                value={formData.m_offer_priority}
                onChange={handleChange}
                placeholder="Enter Offer Priority"
                className="w-full border border-slate-300 dark:border-[#1f1b2e] rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white dark:bg-[#13111c]"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Offer Url<span className="text-red-500">*</span></label>
              <input 
                type="url"
                name="m_offer_url"
                value={formData.m_offer_url}
                onChange={handleChange}
                placeholder="Enter Offer Url (e.g. https://example.com)"
                className="w-full border border-slate-300 dark:border-[#1f1b2e] rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white dark:bg-[#13111c]"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Offer Description<span className="text-red-500">*</span></label>
              <textarea 
                name="m_offer_des"
                value={formData.m_offer_des}
                onChange={handleChange}
                placeholder="Enter Offer Description"
                rows={4}
                className="w-full border border-slate-300 dark:border-[#1f1b2e] rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white dark:bg-[#13111c] resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleSubmit}
              className="bg-[#144f36] text-white px-10 py-2.5 rounded-lg text-sm font-bold hover:bg-[#0f3d2a] transition-colors flex-1 shadow-md"
            >
              Submit
            </button>
            <Link 
              to={'/offers'}
              className="inline-block bg-[#d87025] text-white px-10 py-2.5 rounded-lg text-sm font-bold hover:bg-[#b55d1f] transition-colors flex-1 shadow-md"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
