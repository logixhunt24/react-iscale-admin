import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function EditStudentTestimonial() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const testimonialData = location.state?.testimonialData || {}

  const [loading, setLoading] = useState(false)
  
  const getField = (row, fieldNames, defaultVal = '') => {
    for (const name of fieldNames) {
      if (row[name] !== undefined && row[name] !== null) return row[name]
    }
    return defaultVal
  }

  const url = getField(testimonialData, ['m_st_url', 'url', 'video_url', 'link'])
  const statusStr = getField(testimonialData, ['m_st_status', 'status', 'is_active'], 'active')

  const [formData, setFormData] = useState({
    m_st_url: url,
    m_st_status: (String(statusStr).toLowerCase() === 'active' || statusStr === 1 || String(statusStr).toLowerCase() === 'true') ? '1' : '0'
  })
  const [videoFile, setVideoFile] = useState(null)

  useEffect(() => {
    if (!testimonialData || Object.keys(testimonialData).length === 0) {
      navigate('/master/student-testimonial')
    }
  }, [testimonialData, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); 

    try {
      const token = localStorage.getItem('token')
      
      const payload = new FormData()
      payload.append('m_st_url', formData.m_st_url)
      payload.append('m_st_status', formData.m_st_status)
      
      if (videoFile) {
        payload.append('m_st_video', videoFile)
      }

      await axios.put(`${BASE_URL}/myadmin/stdtestimonial/update-stdtestimonial/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      navigate('/master/student-testimonial')
    } catch (error) {
      console.error('Submit error:', error)
      const errorMsg = error.response?.data?.message || error.message
      await window.customAlert(`Failed to update testimonial.\n\nBackend Error: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 overflow-hidden flex flex-col h-full w-full max-w-4xl mx-auto">
        <div className="p-4 flex justify-between items-center bg-gradient-to-r from-[#144f36] to-[#1a6545] rounded-t-2xl">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-white rounded-full mr-3"></div>
            <h2 className="text-xl font-bold text-white tracking-tight">Edit Student Testimonial</h2>
          </div>
          <Link 
            to={'/master/student-testimonial'}
            className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-colors"
          >
            <span>📄 List</span>
          </Link>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-800 mb-1">Video URL (YouTube/Vimeo)</label>
                <input 
                  type="url" 
                  name="m_st_url"
                  value={formData.m_st_url}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-[#f6f6ff] text-slate-700"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-800 mb-1">Upload New Video File (Optional)</label>
                <input 
                  type="file" 
                  name="m_st_video"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-[#f6f6ff] text-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Status</label>
                <select 
                  name="m_st_status"
                  value={formData.m_st_status}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-[#f6f6ff] text-slate-700"
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-200">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#144f36] text-white px-8 py-2.5 rounded hover:bg-[#0f3d2a] font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <Link 
                to={'/master/student-testimonial'}
                className="inline-block bg-slate-100 text-slate-600 px-8 py-2.5 rounded hover:bg-slate-200 font-medium transition-colors"
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
