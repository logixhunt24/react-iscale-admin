import Button from '../../components/common/Button'
import { useNavigate, Link } from 'react-router-dom'
import { Camera } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddEventCategory() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    m_event_category_name: '',
    m_event_category_status: 1,
    m_event_category_keyword: '',
    m_event_category_order: '',
    m_event_category_description: ''
  })
  const [iconFile, setIconFile] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'm_event_category_status' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.m_event_category_name) {
      await window.customAlert("Category Name is required");
      return;
    }
    setLoading(true); 
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('m_ec_title', formData.m_event_category_name);
      data.append('m_ec_status', Number(formData.m_event_category_status));
      
      // Print payload for debugging
      for (const pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      // The backend doesn't explicitly require these in the docs, but we pass them safely
      if (formData.m_event_category_keyword) data.append('m_ec_keyword', formData.m_event_category_keyword);
      
      if (formData.m_event_category_order) {
        const parsedOrder = parseInt(formData.m_event_category_order, 10);
        data.append('m_ec_order', isNaN(parsedOrder) ? 0 : parsedOrder);
      }
      
      if (formData.m_event_category_description) data.append('m_ec_desc', formData.m_event_category_description);

      if (iconFile) {
        data.append('m_ec_icon', iconFile);
      }
      if (bannerFile) {
        data.append('m_ec_banner', bannerFile);
      }

      const res = await axios.post(`${BASE_URL}/myadmin/event-category/add-event-category`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data?.status || res.data?.success || res.data?.msg) {
        await window.customAlert(res.data?.message || res.data?.msg || 'Added successfully');
        navigate('/events/category');
      } else {
        await window.customAlert(res.data?.message || res.data?.msg || 'Failed to add');
      }
    } catch (err) {
      console.error('Submit error:', err);
      let errorDetails = '';
      if (err.response && typeof err.response.data === 'string') {
        // Extract raw error text (like Multer Unexpected field)
        errorDetails = err.response.data.replace(/<[^>]*>?/gm, ' ').substring(0, 300);
      } else if (err.response && err.response.data) {
        errorDetails = JSON.stringify(err.response.data);
      }
      
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message;
      await window.customAlert(`Backend Error: ${msg}\n\nDetails: ${errorDetails}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden w-full">
        <div className="p-4 flex justify-between items-center bg-gradient-to-r from-[#144f36] to-[#1a6545] rounded-t-2xl">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-white rounded-full mr-3"></div>
            <h2 className="text-xl font-bold text-white tracking-tight">Add New Event Category</h2>
          </div>
          <Link 
            to={'/events/category'}
            className="bg-white text-[#144f36] px-5 py-2 rounded-full flex items-center gap-2 text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            📄 List
          </Link>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Category Name</label>
              <input 
                type="text" 
                name="m_event_category_name"
                value={formData.m_event_category_name}
                onChange={handleChange}
                placeholder="Enter Category Name"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Category Status</label>
              <select name="m_event_category_status" value={formData.m_event_category_status} onChange={handleChange} className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-[#f6f6ff] dark:bg-[#1f1b2e] text-slate-800 dark:text-slate-200">
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Enter Category Keyword</label>
              <input 
                type="text" 
                name="m_event_category_keyword"
                value={formData.m_event_category_keyword}
                onChange={handleChange}
                placeholder="Category Keyword"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Order</label>
              <input 
                type="text" 
                name="m_event_category_order"
                value={formData.m_event_category_order}
                onChange={handleChange}
                placeholder="Category Order"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Category Icon ( 512px X 512px )</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setIconFile(e.target.files[0])} 
                className="text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-1.5 file:px-4 file:rounded file:border file:border-slate-300 dark:file:border-[#1f1b2e] file:bg-[#f6f6ff] file:text-slate-700 dark:file:text-slate-300 hover:file:bg-slate-50 dark:hover:file:bg-[#1f1b2e]/50 cursor-pointer w-full" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Category Banner ( 800px X 450px )</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setBannerFile(e.target.files[0])} 
                className="text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-1.5 file:px-4 file:rounded file:border file:border-slate-300 dark:file:border-[#1f1b2e] file:bg-[#f6f6ff] file:text-slate-700 dark:file:text-slate-300 hover:file:bg-slate-50 dark:hover:file:bg-[#1f1b2e]/50 cursor-pointer w-full" 
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Category Description</label>
            <textarea 
              name="m_event_category_description"
              value={formData.m_event_category_description}
              onChange={handleChange}
              placeholder="Enter Category Description"
              rows={6}
              className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-none placeholder:text-slate-800 dark:text-slate-200"
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
              to={'/events/category'}
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
