import Button from '../../components/common/Button'
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom'
import { Camera } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function EditEvent() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const eventData = location.state?.eventData || {}
  
  const [categories, setCategories] = useState([])
  
  const [formData, setFormData] = useState({
    m_event_category: (eventData.m_event_category?._id || eventData.m_event_category) || (eventData.category?._id || eventData.category) || '',
    m_event_title: eventData.m_event_title || eventData.title || eventData.eventTitle || '',
    m_event_start_date: eventData.m_event_date_start || eventData.m_event_start_date || '',
    m_event_end_date: eventData.m_event_date_end || eventData.m_event_end_date || '',
    m_event_start_time: eventData.m_event_time_start || eventData.m_event_start_time || '',
    m_event_end_time: eventData.m_event_time_end || eventData.m_event_end_time || '',
    m_event_skill_level: eventData.m_event_skill_level || 'Beginner',
    m_event_certificate: eventData.m_event_certificate || 'yes',
    m_event_language: eventData.m_event_lang || eventData.m_event_language || 'English',
    m_event_enrolled: eventData.m_event_enrolled || '',
    m_event_youtube: eventData.m_event_url || eventData.m_event_youtube || '',
    m_event_meeting_link: eventData.m_event_link || eventData.m_event_meeting_link || '',
    m_event_host_name: eventData.m_event_host || eventData.m_event_host_name || '',
    m_event_contact: eventData.m_event_contact || '',
    m_event_whatsapp: eventData.m_event_whatsapp || '',
    m_event_order: eventData.m_event_order || eventData.order || '',
    m_event_status: eventData.m_event_status || eventData.status || 'Active',
    m_event_description: eventData.m_event_description || ''
  })
  
  const [file, setFile] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/event-category/get-event-categories`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status || res.data?.success) {
        setCategories(res.data.data || res.data.categories || res.data.eventCategories || [])
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.m_event_title || !formData.m_event_category) {
      await window.customAlert("❌ Event Title and Category are required");
      return;
    }
    if (!formData.m_event_start_date || !formData.m_event_end_date) {
      await window.customAlert("❌ Start Date and End Date are required");
      return;
    }
    if (!formData.m_event_start_time || !formData.m_event_end_time) {
      await window.customAlert("❌ Start Time and End Time are required");
      return;
    }
    setLoading(true); 
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      const keyMap = {
        m_event_start_date: 'm_event_date_start',
        m_event_end_date: 'm_event_date_end',
        m_event_start_time: 'm_event_time_start',
        m_event_end_time: 'm_event_time_end',
        m_event_language: 'm_event_lang',
        m_event_host_name: 'm_event_host',
        m_event_youtube: 'm_event_url',
        m_event_meeting_link: 'm_event_link'
      };

      Object.keys(formData).forEach(key => {
        const backendKey = keyMap[key] || key;
        let val = formData[key];

        // Sanitize optional numeric fields if they are empty
        if (['m_event_order', 'm_event_enrolled'].includes(backendKey)) {
          if (val === "" || val === null || val === undefined || val === "NaN") {
            val = 0;
          } else {
            const num = Number(val);
            val = isNaN(num) ? 0 : num;
          }
        }

        data.append(backendKey, val ?? "");
      });
      if (file) {
        data.append('m_event_banner', file);
      }
      if (pdfFile) {
        data.append('m_event_pdf', pdfFile);
      }

      let res;
      try {
        res = await axios.put(`${BASE_URL}/myadmin/event/update-event/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (err) {
        if (err.response?.status === 404) {
          res = await axios.post(`${BASE_URL}/myadmin/event/update-event/${id}`, data, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } else throw err;
      }
      
      if (res.data?.status || res.data?.success || res.data?.msg) {
        await window.customAlert(res.data?.message || res.data?.msg || 'Updated successfully');
        navigate('/events/list');
      } else {
        await window.customAlert(res.data?.message || res.data?.msg || 'Failed to update');
      }
    } catch (err) {
      console.error('Submit error:', err);
      await window.customAlert(err.response?.data?.message || err.response?.data?.msg || 'Failed to update');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden max-w-[1200px]">
        <div className="p-4 border-b border-slate-200 dark:border-gray-800/50 bg-[#f6f6ff] dark:bg-[#1f1b2e] flex justify-between items-center">
          <h2 className="text-xl font-medium text-indigo-900 dark:text-indigo-300 font-bold tracking-tight">Edit Event</h2>
          <Link 
            to={'/events/list'}
            className="bg-[#428bca] text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium hover:bg-[#3071a9] transition-colors"
          >
            📄 List
          </Link>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                Event Category <span className="text-red-500">*</span>
              </label>
              <select name="m_event_category" value={formData.m_event_category} onChange={handleChange} className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-gray-700">
                <option value="">--Select Category--</option>
                {categories.map((c, i) => (
                  <option key={i} value={c?._id || c?.id || c?.name || (typeof c === 'string' ? c : JSON.stringify(c))}>
                    {c?.m_ec_title || c?.name || c?.title || c?.m_event_category || (typeof c === 'string' ? c : 'Unknown Category')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="m_event_title"
                value={formData.m_event_title}
                onChange={handleChange}
                placeholder="Event Title"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  name="m_event_start_date"
                  value={formData.m_event_start_date}
                  onChange={handleChange}
                  placeholder="mm/dd/yyyy"
                  className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400">📅</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  name="m_event_end_date"
                  value={formData.m_event_end_date}
                  onChange={handleChange}
                  placeholder="mm/dd/yyyy"
                  className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400">📅</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                Start Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  name="m_event_start_time"
                  value={formData.m_event_start_time}
                  onChange={handleChange}
                  placeholder="--:-- --"
                  className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 pr-10 placeholder:text-slate-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400">🕒</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                End Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  name="m_event_end_time"
                  value={formData.m_event_end_time}
                  onChange={handleChange}
                  placeholder="--:-- --"
                  className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 pr-10 placeholder:text-slate-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400">🕒</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Skill Level</label>
              <input 
                type="text" 
                name="m_event_skill_level"
                value={formData.m_event_skill_level}
                onChange={handleChange}
                placeholder="Skill Level"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Certificate</label>
              <select 
                name="m_event_certificate"
                value={formData.m_event_certificate}
                onChange={handleChange}
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-[#f6f6ff] dark:bg-[#1f1b2e] text-slate-800 dark:text-slate-200"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Language</label>
              <input 
                type="text" 
                name="m_event_language"
                value={formData.m_event_language}
                onChange={handleChange}
                placeholder="Language"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">No. Of Enrolled</label>
              <input 
                type="text" 
                name="m_event_enrolled"
                value={formData.m_event_enrolled}
                onChange={handleChange}
                placeholder="No. Of Enrolled"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Youtube URL</label>
              <input 
                type="text" 
                name="m_event_youtube"
                value={formData.m_event_youtube}
                onChange={handleChange}
                placeholder="Youtube Url"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Upload File(PDF Only)</label>
              <div className="flex border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded overflow-hidden relative">
                <input 
                  type="file"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf"
                />
                <button className="bg-slate-100 dark:bg-slate-700 border-r border-slate-300 dark:border-slate-600 px-3 py-2 text-sm text-slate-800 dark:text-slate-200 whitespace-nowrap hover:bg-slate-200">
                  Choose File
                </button>
                <span className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis bg-[#f6f6ff] dark:bg-[#1f1b2e] flex-1">
                  {pdfFile ? pdfFile.name : 'No file chosen'}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Meeting Link</label>
            <input 
              type="text" 
              name="m_event_meeting_link"
              value={formData.m_event_meeting_link}
              onChange={handleChange}
              placeholder="Meeting Link"
              className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Host Name</label>
              <input 
                type="text" 
                name="m_event_host_name"
                value={formData.m_event_host_name}
                onChange={handleChange}
                placeholder="Host Name"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Contact No.</label>
              <input 
                type="text" 
                name="m_event_contact"
                value={formData.m_event_contact}
                onChange={handleChange}
                placeholder="1234567890"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Whatsapp No.</label>
              <input 
                type="text" 
                name="m_event_whatsapp"
                value={formData.m_event_whatsapp}
                onChange={handleChange}
                placeholder="1234567890"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Order</label>
                <input 
                  type="text" 
                  name="m_event_order"
                  value={formData.m_event_order}
                  onChange={handleChange}
                  placeholder="00"
                  className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Status</label>
                <select name="m_event_status" value={formData.m_event_status} onChange={handleChange} className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-[#f6f6ff] dark:bg-[#1f1b2e] text-slate-800 dark:text-slate-200">
                  <option value="Active">Active</option>
                  <option value="In-Active">In-Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Category Banner ( 800px X 450px )</label>
              <div className="relative">
                <input 
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                />
                <button className="bg-[#428bca] text-white px-6 py-2 rounded flex items-center justify-center gap-2 hover:bg-[#3071a9] transition-colors w-full">
                  <Camera size={18} />
                  <span>{file ? file.name : 'Choose Banner'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Description</label>
            <div className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded overflow-hidden">
              <div className="bg-[#f8fafc] dark:bg-[#13111c] border-b border-slate-300 dark:border-slate-600 p-2 flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-400">
                <button className="px-2 hover:bg-slate-200 rounded">File</button>
                <button className="px-2 hover:bg-slate-200 rounded">Edit</button>
                <button className="px-2 hover:bg-slate-200 rounded">View</button>
                <button className="px-2 hover:bg-slate-200 rounded">Insert</button>
                <button className="px-2 hover:bg-slate-200 rounded">Format</button>
                <button className="px-2 hover:bg-slate-200 rounded">Tools</button>
                <button className="px-2 hover:bg-slate-200 rounded">Table</button>
                <div className="flex-1"></div>
                <button className="px-2 py-1 bg-[#f6f6ff] dark:bg-[#1f1b2e] border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded text-blue-600 flex items-center gap-1">
                  <span className="text-xs">⚡</span> Upgrade
                </button>
              </div>
              <div className="bg-[#f8fafc] dark:bg-[#13111c] border-b border-slate-300 dark:border-slate-600 p-2 flex flex-wrap gap-2 items-center text-slate-600 dark:text-slate-400 border-t-0">
                <button className="p-1 hover:bg-slate-200 rounded">↶</button>
                <button className="p-1 hover:bg-slate-200 rounded">↷</button>
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <select className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1 text-xs bg-[#f6f6ff] dark:bg-[#1f1b2e] w-24">
                  <option>Paragraph</option>
                </select>
                <select className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1 text-xs bg-[#f6f6ff] dark:bg-[#1f1b2e] w-24">
                  <option>System Font</option>
                </select>
                <select className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-2 py-1 text-xs bg-[#f6f6ff] dark:bg-[#1f1b2e] w-16">
                  <option>12pt</option>
                </select>
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <button className="p-1 hover:bg-slate-200 rounded font-bold">B</button>
                <button className="p-1 hover:bg-slate-200 rounded italic">I</button>
                <button className="p-1 hover:bg-slate-200 rounded underline">U</button>
                <button className="p-1 hover:bg-slate-200 rounded line-through">S</button>
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                {/* Random editor icons mock */}
                <button className="p-1 hover:bg-slate-200 rounded">🔗</button>
                <button className="p-1 hover:bg-slate-200 rounded">🖼️</button>
                <button className="p-1 hover:bg-slate-200 rounded">▶️</button>
                <button className="p-1 hover:bg-slate-200 rounded">⊞</button>
              </div>
              <textarea 
                name="m_event_description"
                value={formData.m_event_description}
                onChange={handleChange}
                placeholder="Enter Event Description"
                rows={12}
                className="w-full p-4 outline-none resize-none placeholder:text-slate-600 dark:text-slate-400 bg-transparent text-slate-800 dark:text-slate-200"
              ></textarea>
              <div className="bg-[#f6f6ff] dark:bg-[#1f1b2e] border-t border-slate-300 dark:border-slate-600 p-1 px-3 flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
                <span>p</span>
                <div className="flex items-center gap-2">
                  <span>{formData.m_event_description.split(/\s+/).filter(w=>w).length} words</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">tiny</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button fullWidth className="py-2" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
            <Link 
              to={'/events/list'}
              className="inline-block bg-[#d35400] text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-[#b04500] transition-colors flex-1 shadow-sm"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
