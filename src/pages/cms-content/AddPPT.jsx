import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddPPT() {
  const navigate = useNavigate()
  const [imageFile, setImageFile] = useState(null)
  const [companyImgFile, setCompanyImgFile] = useState(null)
  const [formData, setFormData] = useState({
    m_pre_name: '',
    m_pre_designation: '',
    m_pre_company: '',
    m_pre_video_link: ''
  })
  const [loading, setLoading] = useState(false)
  const [backendError, setBackendError] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!formData.m_pre_name) {
      await window.customAlert('Name is required')
      return
    }

    const submitData = new FormData()
    submitData.append('m_pre_name', formData.m_pre_name)
    submitData.append('m_pre_designation', formData.m_pre_designation)
    submitData.append('m_pre_company', formData.m_pre_company)
    submitData.append('m_pre_video_link', formData.m_pre_video_link)

    if (imageFile) {
      submitData.append('m_pre_image', imageFile)
    }
    if (companyImgFile) {
      submitData.append('m_pre_company_img', companyImgFile)
    }

    try {
      setLoading(true); 
      setBackendError(null)
      const token = localStorage.getItem('token')
      const response = await axios.post(`${BASE_URL}/myadmin/ppt/add-ppt`, submitData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data?.status) {
        await window.customAlert(response.data.message || 'PPT added successfully')
        navigate('/placement-talks')
      } else {
        setBackendError(response.data?.message || 'Failed to add PPT (Backend returned status: false)')
      }
    } catch (err) {
      console.error(err)
      setBackendError(
        err.response?.data?.message || 
        err.message || 
        'Unknown error occurred while adding PPT'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full animate-fade-in-up flex flex-col">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden flex-1 flex flex-col">
        <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white dark:bg-[#13111c]/10 rounded-full blur-2xl group-hover:bg-white dark:bg-[#13111c]/20 transition-all duration-700 pointer-events-none"></div>
          
          <div className="flex items-center relative z-10">
            <div className="w-1.5 h-7 bg-white dark:bg-[#13111c]/90 rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Add Pre-Placement Talk</h2>
          </div>
          
          <Link 
            to={'/placement-talks'}
            className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 relative z-10 hover:shadow hover:-translate-y-0.5"
          >
            « Back
          </Link>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {backendError && (
            <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
              <p className="font-bold">Error from Backend Server:</p>
              <p>{backendError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            <div className="lg:col-span-1">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Full Name <span className="text-red-500">*</span></label>
              <input 
                name="m_pre_name"
                type="text" 
                value={formData.m_pre_name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Designation</label>
              <input 
                name="m_pre_designation"
                type="text" 
                value={formData.m_pre_designation}
                onChange={handleChange}
                placeholder="Designation"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Company</label>
              <input 
                name="m_pre_company"
                type="text" 
                value={formData.m_pre_company}
                onChange={handleChange}
                placeholder="Company Name"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Video Link</label>
              <input 
                name="m_pre_video_link"
                type="text" 
                value={formData.m_pre_video_link}
                onChange={handleChange}
                placeholder="Youtube or Video URL"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Person Image</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border file:border-slate-300 dark:border-[#1f1b2e] file:bg-white file:text-slate-700 dark:text-slate-300 hover:file:bg-slate-50 cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Company Logo</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="file" accept="image/*" onChange={e => setCompanyImgFile(e.target.files[0])} className="text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border file:border-slate-300 dark:border-[#1f1b2e] file:bg-white file:text-slate-700 dark:text-slate-300 hover:file:bg-slate-50 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#144f36] text-white px-8 py-2.5 rounded shadow hover:bg-[#0f3d2a] transition-colors disabled:opacity-50 font-bold"
            >
              {loading ? 'Submitting...' : 'Submit PPT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
