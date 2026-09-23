import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddLeadGenerate() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    m_lg_title: '',
    m_lg_desc: '',
    m_lg_redirect_link: '',
    m_lg_college: false,
    m_lg_education: false,
    m_lg_field_of_study: false,
    m_lg_branch: false,
    m_lg_passing_year: false,
    m_lg_state: false,
    m_lg_gender: false,
    m_lg_laptop_desktop: false,
    m_lg_working_professional: false,
    m_lg_status: 1
  })
  
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (isEdit) {
      fetchLead()
    }
  }, [id])

  const fetchLead = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/lead-generate/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status && res.data.data) {
        const d = res.data.data
        setFormData({
          m_lg_title: d.m_lg_title || '',
          m_lg_desc: d.m_lg_desc || '',
          m_lg_redirect_link: d.m_lg_redirect_link || '',
          m_lg_college: d.m_lg_college || false,
          m_lg_education: d.m_lg_education || false,
          m_lg_field_of_study: d.m_lg_field_of_study || false,
          m_lg_branch: d.m_lg_branch || false,
          m_lg_passing_year: d.m_lg_passing_year || false,
          m_lg_state: d.m_lg_state || false,
          m_lg_gender: d.m_lg_gender || false,
          m_lg_laptop_desktop: d.m_lg_laptop_desktop || false,
          m_lg_working_professional: d.m_lg_working_professional || false,
          m_lg_status: d.m_lg_status !== undefined ? d.m_lg_status : 1
        })
      }
    } catch (err) {
      await window.customAlert('Failed to fetch lead generate details')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    })
  }

  const handleSubmit = async () => {
    try {
      if (!formData.m_lg_title || !formData.m_lg_redirect_link) {
        return await window.customAlert('Please fill the required fields')
      }

      const token = localStorage.getItem('token')
      const url = isEdit ? `${BASE_URL}/myadmin/lead-generate/update/${id}` : `${BASE_URL}/myadmin/lead-generate/add`
      const method = isEdit ? 'put' : 'post'

      const res = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.data?.status) {
        await window.customAlert(res.data.message || 'Success')
        navigate('/leads')
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to save lead generate form')
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden max-w-5xl">
        <div className="p-4 bg-[#144f36] dark:bg-[#0f3d2a] rounded-t-2xl">
          <h2 className="text-xl font-bold tracking-tight text-white">{isEdit ? 'Edit Lead Generate' : 'Add New Lead Generate'}</h2>
        </div>

        <div className="p-6">
          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Title<span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="m_lg_title"
              value={formData.m_lg_title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#1f1b2e] rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="college" name="m_lg_college" checked={formData.m_lg_college} onChange={handleChange} className="w-4 h-4 text-[#144f36] rounded border-gray-300 focus:ring-[#144f36]" />
              <label htmlFor="college" className="text-sm font-bold text-slate-800 dark:text-slate-200">Field of Institute / College Name</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="education" name="m_lg_education" checked={formData.m_lg_education} onChange={handleChange} className="w-4 h-4 text-[#144f36] rounded border-gray-300 focus:ring-[#144f36]" />
              <label htmlFor="education" className="text-sm font-bold text-slate-800 dark:text-slate-200">Field of Education Qualifications</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="field_of_study" name="m_lg_field_of_study" checked={formData.m_lg_field_of_study} onChange={handleChange} className="w-4 h-4 text-[#144f36] rounded border-gray-300 focus:ring-[#144f36]" />
              <label htmlFor="field_of_study" className="text-sm font-bold text-slate-800 dark:text-slate-200">Field of Study</label>
            </div>
            
            <div className="flex items-center gap-2">
              <input type="checkbox" id="branch" name="m_lg_branch" checked={formData.m_lg_branch} onChange={handleChange} className="w-4 h-4 text-[#144f36] rounded border-gray-300 focus:ring-[#144f36]" />
              <label htmlFor="branch" className="text-sm font-bold text-slate-800 dark:text-slate-200">Branch</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="passing_year" name="m_lg_passing_year" checked={formData.m_lg_passing_year} onChange={handleChange} className="w-4 h-4 text-[#144f36] rounded border-gray-300 focus:ring-[#144f36]" />
              <label htmlFor="passing_year" className="text-sm font-bold text-slate-800 dark:text-slate-200">Passing Year</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="state" name="m_lg_state" checked={formData.m_lg_state} onChange={handleChange} className="w-4 h-4 text-[#144f36] rounded border-gray-300 focus:ring-[#144f36]" />
              <label htmlFor="state" className="text-sm font-bold text-slate-800 dark:text-slate-200">State (Residence)</label>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="gender" name="m_lg_gender" checked={formData.m_lg_gender} onChange={handleChange} className="w-4 h-4 text-[#144f36] rounded border-gray-300 focus:ring-[#144f36]" />
              <label htmlFor="gender" className="text-sm font-bold text-slate-800 dark:text-slate-200">Gender</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="laptop_desktop" name="m_lg_laptop_desktop" checked={formData.m_lg_laptop_desktop} onChange={handleChange} className="w-4 h-4 text-[#144f36] rounded border-gray-300 focus:ring-[#144f36]" />
              <label htmlFor="laptop_desktop" className="text-sm font-bold text-slate-800 dark:text-slate-200">Do you have Laptop or Desktop?</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="working_professional" name="m_lg_working_professional" checked={formData.m_lg_working_professional} onChange={handleChange} className="w-4 h-4 text-[#144f36] rounded border-gray-300 focus:ring-[#144f36]" />
              <label htmlFor="working_professional" className="text-sm font-bold text-slate-800 dark:text-slate-200">Are you Fresher or Working Professional?</label>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Redirect Link<span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="m_lg_redirect_link"
              value={formData.m_lg_redirect_link}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Description</label>
            <textarea 
              name="m_lg_desc"
              value={formData.m_lg_desc}
              onChange={handleChange}
              placeholder="Enter HTML description here..."
              rows={6}
              className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] resize-none"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Status</label>
            <select 
              name="m_lg_status"
              value={formData.m_lg_status}
              onChange={(e) => setFormData({ ...formData, m_lg_status: Number(e.target.value) })}
              className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button 
              onClick={handleSubmit}
              className="bg-[#144f36] text-white px-10 py-2.5 rounded-lg text-sm font-bold hover:bg-[#0f3d2a] transition-colors flex-1 shadow-md"
            >
              Submit
            </button>
            <Link 
              to={'/leads'}
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
