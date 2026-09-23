import Button from '../../components/common/Button'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddSuccessStory() {
  const navigate = useNavigate()
  const [imageFile, setImageFile] = useState(null)
  const [formData, setFormData] = useState({
    m_ss_name: '',
    m_ss_designation: '',
    m_ss_linkedin: '',
    m_ss_video: '',
    m_ss_placed: '',
    m_ss_package: '',
    m_ss_order: '',
    m_ss_feedback: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!formData.m_ss_name) {
      await window.customAlert('Name is required')
      return
    }

    const submitData = new FormData()
    submitData.append('m_ss_name', formData.m_ss_name)
    submitData.append('m_ss_designation', formData.m_ss_designation)
    submitData.append('m_ss_linkedin', formData.m_ss_linkedin)
    submitData.append('m_ss_youtube_url', formData.m_ss_video)
    submitData.append('m_ss_video', formData.m_ss_video)
    submitData.append('m_ss_placed', formData.m_ss_placed)
    submitData.append('m_ss_package', formData.m_ss_package)
    const parsedOrder = parseInt(formData.m_ss_order, 10);
    submitData.append('m_ss_order', isNaN(parsedOrder) ? 0 : parsedOrder)
    submitData.append('m_ss_feedback', formData.m_ss_feedback)
    if (imageFile) {
      submitData.append('m_ss_image', imageFile)
    }

    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const response = await axios.post(`${BASE_URL}/myadmin/success-story/add-ss`, submitData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data?.status) {
        await window.customAlert(response.data.message || 'Success story added')
        navigate('/success-story')
      } else {
        await window.customAlert(response.data?.message || 'Failed to add')
      }
    } catch (err) {
      console.error(err)
      await window.customAlert(err.response?.data?.message || 'Error adding success story')
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
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Add Success Story</h2>
          </div>
          
          <Link 
            to={'/success-story'}
            className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 relative z-10 hover:shadow hover:-translate-y-0.5"
          >
            « Back
          </Link>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            <div className="lg:col-span-1">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Full Name <span className="text-red-500">*</span></label>
              <input 
                name="m_ss_name"
                type="text" 
                value={formData.m_ss_name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Designation</label>
              <input 
                name="m_ss_designation"
                type="text" 
                value={formData.m_ss_designation}
                onChange={handleChange}
                placeholder="Candidate Designation"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div className="lg:col-span-1">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Image</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border file:border-slate-300 dark:border-[#1f1b2e] file:bg-[#f6f6ff] file:text-slate-700 dark:text-slate-300 hover:file:bg-slate-50 dark:bg-[#1f1b2e]/50 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">LinkedIn</label>
              <input 
                name="m_ss_linkedin"
                type="text" 
                value={formData.m_ss_linkedin}
                onChange={handleChange}
                placeholder="Candidate LinkedIn"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Video / Youtube Url</label>
              <input 
                name="m_ss_video"
                type="text" 
                value={formData.m_ss_video}
                onChange={handleChange}
                placeholder="Youtube Url"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Placed At</label>
              <input 
                name="m_ss_placed"
                type="text" 
                value={formData.m_ss_placed}
                onChange={handleChange}
                placeholder="Placed Company Name"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Package</label>
              <input 
                name="m_ss_package"
                type="text" 
                value={formData.m_ss_package}
                onChange={handleChange}
                placeholder="Package"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Order</label>
              <input 
                name="m_ss_order"
                type="number" 
                value={formData.m_ss_order}
                onChange={handleChange}
                placeholder="Order"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Feedback</label>
            <textarea 
              name="m_ss_feedback"
              value={formData.m_ss_feedback}
              onChange={handleChange}
              placeholder="Candidate Feedback"
              rows={4}
              className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] resize-none"
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-[#144f36] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#0f3d2a] transition-colors flex-1 shadow-sm disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <Link 
              to={'/success-story'}
              className="inline-block bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800 px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#152a4a] transition-colors flex-1"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
