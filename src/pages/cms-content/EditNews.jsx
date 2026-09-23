import { useNavigate, useLocation, useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function EditNews() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  
  const [imageFile, setImageFile] = useState(null)
  const [formData, setFormData] = useState({
    m_news_title: '',
    m_news_intro: '',
    m_news_description: '',
    m_news_order: '',
    m_news_status: 'active'
  })
  const [loading, setLoading] = useState(false)
  const [backendError, setBackendError] = useState(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}/myadmin/news_updates/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.data?.status && response.data.data) {
          const news = response.data.data
          setFormData({
            m_news_title: news.m_news_title || '',
            m_news_intro: news.m_news_intro || '',
            m_news_description: news.m_news_description || '',
            m_news_order: news.m_news_order !== undefined ? String(news.m_news_order) : '',
            m_news_status: news.m_news_status || 'active'
          })
        }
      } catch (err) {
        console.error('Error fetching News:', err)
      }
    }

    if (location.state?.news) {
      const news = location.state.news
      setFormData({
        m_news_title: news.m_news_title || '',
        m_news_intro: news.m_news_intro || '',
        m_news_description: news.m_news_description || '',
        m_news_order: news.m_news_order !== undefined ? String(news.m_news_order) : '',
        m_news_status: news.m_news_status || 'active'
      })
      // We still fetch full news if the list didn't have all data like description
      fetchNews()
    } else if (id) {
      fetchNews()
    }
  }, [id, location.state])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (loading) return
    if (!formData.m_news_title) {
      await window.customAlert('Title is required')
      return
    }

    const submitData = new FormData()
    submitData.append('m_news_title', formData.m_news_title)
    submitData.append('m_news_intro', formData.m_news_intro)
    submitData.append('m_news_description', formData.m_news_description)
    submitData.append('m_news_status', formData.m_news_status)
    
    const parsedOrder = parseInt(formData.m_news_order, 10);
    submitData.append('m_news_order', isNaN(parsedOrder) ? 0 : parsedOrder)

    if (imageFile) {
      submitData.append('m_news_image', imageFile)
    }

    try {
      setLoading(true); 
      setBackendError(null)
      const token = localStorage.getItem('token')
      const response = await axios.put(`${BASE_URL}/myadmin/news_updates/update/${id}`, submitData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data?.status || response.data?.msg === 'Updated') {
        await window.customAlert(response.data.message || response.data.msg || 'News updated successfully')
        navigate('/news-updates')
      } else {
        setBackendError(response.data?.message || response.data?.msg || 'Failed to update News')
      }
    } catch (err) {
      console.error(err)
      let errMsg = err.response?.data?.message || 
        err.response?.data?.msg || 
        err.message || 
        'Unknown error occurred while updating News';
        
      if (errMsg.includes('E11000 duplicate key error') && errMsg.includes('m_news_slug')) {
        errMsg = 'A news item with this title already exists. Please choose a unique title.';
      }
      
      setBackendError(errMsg)
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
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Edit News & Updates</h2>
          </div>
          
          <Link 
            to={'/news-updates'}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Title <span className="text-red-500">*</span></label>
              <input 
                name="m_news_title"
                type="text" 
                value={formData.m_news_title}
                onChange={handleChange}
                placeholder="News/Update Title"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 mb-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Intro</label>
              <textarea 
                name="m_news_intro"
                rows="2"
                value={formData.m_news_intro}
                onChange={handleChange}
                placeholder="Short Introduction..."
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Description</label>
              <textarea 
                name="m_news_description"
                rows="6"
                value={formData.m_news_description}
                onChange={handleChange}
                placeholder="Full Description..."
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Update Image</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border file:border-slate-300 dark:border-[#1f1b2e] file:bg-white file:text-slate-700 dark:text-slate-300 hover:file:bg-slate-50 cursor-pointer" />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Order</label>
                <input 
                  name="m_news_order"
                  type="number" 
                  value={formData.m_news_order}
                  onChange={handleChange}
                  placeholder="Display Order (e.g. 1)"
                  className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Status</label>
                <select 
                  name="m_news_status"
                  value={formData.m_news_status}
                  onChange={handleChange}
                  className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="1">1 (Active)</option>
                  <option value="0">0 (Inactive)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-[#144f36] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#0f3d2a] transition-colors flex-1 shadow-sm disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update News'}
            </button>
            <Link 
              to={'/news-updates'}
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
