import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import { getImageUrl } from '../../utils/imageUtils'
import { Image, Play, Grid, MoreHorizontal } from 'lucide-react'

export default function AddJobUpdate() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  const [backendError, setBackendError] = useState(null)
  const [enumHints, setEnumHints] = useState([])
  const [loading, setLoading] = useState(false)
  const [jobTitles, setJobTitles] = useState([])
  const [logoFile, setLogoFile] = useState(null)
  const [existingLogo, setExistingLogo] = useState('')
  const [formData, setFormData] = useState({
    job_title: '',
    company_name: '',
    location: '',
    experience: '',
    salaryFrom: '',
    salaryTo: '',
    salary_type: 'PM',
    job_description: '',
    apply_link: '',
    linkedin: '',
    job_order: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setLogoFile(file)
  }

  // Older jobs may still carry the pre-PM/PA salary_type strings; normalize
  // them on load so the dropdown only ever needs to offer PM/PA, and saving
  // (even without touching this field) writes the current value back.
  const normalizeSalaryType = (value) => {
    if (value === 'per_month') return 'PM'
    if (value === 'per_annum') return 'PA'
    return value || 'PM'
  }

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true); 
        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}/myadmin/comp-requirement/get-job/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.data?.status && response.data.data) {
          const job = response.data.data
          setFormData({
            job_title: job.job_title || '',
            company_name: job.company_name || '',
            location: job.job_locations?.[0] || '',
            experience: job.experience?.max?.toString() || '',
            salaryFrom: job.salary?.min?.toString() || '',
            salaryTo: job.salary?.max?.toString() || '',
            salary_type: normalizeSalaryType(job.salary_type),
            job_description: job.job_description || '',
            apply_link: job.application_link || job.apply_link || '',
            linkedin: job.company_social_links?.linkedin || job.social_links?.linkedin || '',
            job_order: (job.order ?? job.job_order ?? '').toString()
          })
          setExistingLogo(job.company_logo || '')
        }
      } catch (err) {
        console.error('Error fetching job details', err)
        setBackendError('Error fetching job details')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      if (location.state?.jobData) {
        const job = location.state.jobData
        setFormData({
          job_title: job.job_title || '',
          company_name: job.company_name || '',
          location: job.job_locations?.[0] || '',
          experience: job.experience?.max?.toString() || '',
          salaryFrom: job.salary?.min?.toString() || '',
          salaryTo: job.salary?.max?.toString() || '',
          salary_type: normalizeSalaryType(job.salary_type),
          job_description: job.job_description || '',
          apply_link: job.application_link || job.apply_link || '',
          linkedin: job.company_social_links?.linkedin || job.social_links?.linkedin || '',
          job_order: (job.order ?? job.job_order ?? '').toString()
        })
        setExistingLogo(job.company_logo || '')
      } else {
        fetchJob()
      }
    }
  }, [id, location.state])

  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}/myadmin/comp-requirement/job-titles-dropdown`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.data?.status) {
          setJobTitles(response.data.data || [])
        }
      } catch (err) {
        console.error('Error fetching job titles', err)
      }
    }

    const fetchEnumHints = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}/myadmin/comp-requirement/get-all-jobs`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.data?.status && response.data.data) {
          const types = response.data.data.map(j => j.salary_type).filter(Boolean)
          setEnumHints([...new Set(types)])
        }
      } catch (err) {
        console.error('Error fetching hints', err)
      }
    }

    fetchJobTitles()
    fetchEnumHints()
  }, [])

  const handleSubmit = async () => {
    if (!formData.job_title) {
      await window.customAlert('Job Title is required')
      return
    }

    try {
      setLoading(true); 
      setBackendError(null)
      const token = localStorage.getItem('token')

      const payload = new FormData()
      payload.append('job_title', formData.job_title)
      payload.append('company_name', formData.company_name)
      payload.append('location', formData.location)
      payload.append('salary_from', Number(formData.salaryFrom) || 0)
      payload.append('salary_to', Number(formData.salaryTo) || 0)
      payload.append('salary_type', formData.salary_type)
      payload.append('experience', formData.experience || '0')
      payload.append('job_description', formData.job_description || 'No description provided')
      payload.append('apply_link', formData.apply_link)
      payload.append('linkedin', formData.linkedin)
      payload.append('order', Number(formData.job_order) || 0)
      // Only default a brand-new job to Active; editing an existing job must
      // not silently reactivate one an admin has deliberately deactivated.
      if (!id) payload.append('status', '1')
      payload.append('job_status', '1')
      if (logoFile) payload.append('company_logo', logoFile)

      const url = id
        ? `${BASE_URL}/myadmin/comp-requirement/update-job/${id}`
        : `${BASE_URL}/myadmin/comp-requirement/add-jobs`

      const response = await axios({
        method: id ? 'put' : 'post',
        url,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data?.status) {
        await window.customAlert(id ? 'Updated successfully' : 'Added successfully')
        navigate('/job-updates')
      } else {
        setBackendError(response.data?.message || 'Failed to save: ' + JSON.stringify(response.data))
      }
    } catch (error) {
      console.error(error)
      if (error.response && error.response.data) {
        setBackendError(error.response.data.message || JSON.stringify(error.response.data))
      } else {
        setBackendError('Network error or server down')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full animate-fade-in-up flex flex-col min-h-0">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white dark:bg-[#13111c]/10 rounded-full blur-2xl group-hover:bg-white dark:bg-[#13111c]/20 transition-all duration-700 pointer-events-none"></div>
          
          <div className="flex items-center relative z-10">
            <div className="w-1.5 h-7 bg-white dark:bg-[#13111c]/90 rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
              {id ? 'Edit Job Update' : 'Add New Job Update'}
            </h2>
          </div>
          
          <button 
            onClick={() => navigate('/job-updates')}
            className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 relative z-10 hover:shadow hover:-translate-y-0.5"
          >
            « Back
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {backendError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg whitespace-pre-wrap font-mono text-sm shadow-sm">
              <strong className="font-bold">Backend Error:</strong><br/>
              {backendError}
              <br/><br/>
              <strong className="font-bold">Valid Salary Types already in Database:</strong><br/>
              {enumHints.length > 0 ? enumHints.join(', ') : 'None found'}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="job_title"
                list="job-titles-list"
                value={formData.job_title}
                onChange={handleChange}
                placeholder="Job Title"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
              <datalist id="job-titles-list">
                {jobTitles.map((item, i) => {
                  const val = typeof item === 'object' ? (item.title || item.job_title || item.name) : item;
                  return val ? <option key={i} value={val} /> : null;
                })}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Company Logo</label>
              <div className="flex items-center gap-2 mt-1">
                {(logoFile || existingLogo) && (
                  <img
                    src={logoFile ? URL.createObjectURL(logoFile) : getImageUrl(existingLogo)}
                    alt="Company logo"
                    className="w-9 h-9 rounded object-cover border border-slate-300 dark:border-gray-700 flex-shrink-0"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  name="company_logo"
                  onChange={handleLogoChange}
                  className="text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border file:border-slate-300 dark:border-[#1f1b2e] file:bg-[#f6f6ff] file:text-slate-700 dark:text-slate-300 hover:file:bg-slate-50 dark:bg-[#1f1b2e]/50 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Job Description</label>
            <div className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded overflow-hidden">
              <textarea
                name="job_description"
                value={formData.job_description}
                onChange={handleChange}
                className="w-full h-48 p-4 bg-[#f6f6ff] dark:bg-[#1f1b2e] outline-none text-sm resize-none"
                placeholder="Write the job description that outlines the main duties involved in a job..."
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Company <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
{/* 
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Experience (Max Years) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 5"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
*/}
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Location <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Order</label>
              <input 
                type="number" 
                name="job_order"
                value={formData.job_order}
                onChange={handleChange}
                placeholder="Order"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Salary <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="number" 
                name="salaryFrom"
                value={formData.salaryFrom}
                onChange={handleChange}
                placeholder="Salary Min"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
              <input 
                type="number" 
                name="salaryTo"
                value={formData.salaryTo}
                onChange={handleChange}
                placeholder="Salary Max"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
              <select 
                name="salary_type"
                value={formData.salary_type}
                onChange={handleChange}
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]">
               <option value="PM">Per Month</option>
               <option value="PA">Per Annum</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Apply Link</label>
              <input
                type="text"
                name="apply_link"
                value={formData.apply_link}                onChange={handleChange}
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-[#144f36] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#0f3d2a] transition-colors flex-1 shadow-sm disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button 
              onClick={() => navigate('/job-updates')}
              className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800 px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#152a4a] transition-colors flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
