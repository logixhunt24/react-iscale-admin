import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function EditInstructor() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    m_instructor_name: '',
    m_instructor_email: '',
    m_instructor_phone: '',
    m_instructor_skills: '',
    m_instructor_status: '1',
    m_linkedin_profile: '',
    m_instructor_bio: '',
    m_instructor_designation: '',
    m_instructor_experience: '',
    m_instructor_order: ''
  })
  const [profileFile, setProfileFile] = useState(null)

  useEffect(() => {
    // Fetch all instructors and find the one we need since get-instructor/:id was not provided
    const fetchInstructor = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          `${BASE_URL}/myadmin/instructor/get-all-instructors`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        
        if (response.data && response.data.status) {
          const allInst = response.data.data || []
          const inst = allInst.find(i => i._id === id)
          
          if (inst) {
            setFormData({
              m_instructor_name: inst.m_instructor_name || '',
              m_instructor_email: inst.m_instructor_email || '',
              m_instructor_phone: inst.m_instructor_phone || '',
              m_instructor_skills: Array.isArray(inst.m_instructor_skills) ? inst.m_instructor_skills.join(', ') : '',
              m_instructor_status: inst.m_instructor_status !== undefined ? inst.m_instructor_status.toString() : '1',
              m_linkedin_profile: inst.m_linkedin_profile || '',
              m_instructor_bio: inst.m_instructor_bio || '',
              m_instructor_designation: inst.m_instructor_designation || '',
              m_instructor_experience: inst.m_instructor_experience || '',
              m_instructor_order: inst.m_instructor_order || ''
            })
          }
        }
      } catch (error) {
        console.error("Failed to fetch instructor:", error)
      }
    }
    fetchInstructor()
  }, [id])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); 

    try {
      const token = localStorage.getItem('token')
      
      const skillsArray = formData.m_instructor_skills.split(',').map(s => s.trim()).filter(Boolean)

      const payload = new FormData()
      payload.append('m_instructor_name', formData.m_instructor_name)
      payload.append('m_instructor_email', formData.m_instructor_email)
      payload.append('m_instructor_phone', formData.m_instructor_phone)
      payload.append('m_instructor_bio', formData.m_instructor_bio)
      payload.append('m_instructor_designation', formData.m_instructor_designation)
      payload.append('m_linkedin_profile', formData.m_linkedin_profile)
      payload.append('m_instructor_experience', formData.m_instructor_experience)
      payload.append('m_instructor_skills', JSON.stringify(skillsArray))
      payload.append('m_instructor_status', formData.m_instructor_status)
      payload.append('m_instructor_order', formData.m_instructor_order)
      
      if (profileFile) {
        payload.append('m_instructor_profile', profileFile)
      }

      const response = await axios.put(
        `${BASE_URL}/myadmin/instructor/update-instructor/${id}`,
        payload,
        { headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data && response.data.status) {
        navigate('/instructors/all')
      } else {
        await window.customAlert(response.data.message || 'Failed to update instructor')
      }
    } catch (error) {
      console.error('Submit failed:', error)
      await window.customAlert('Failed to update instructor. Please check console.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 overflow-hidden">
        <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white dark:bg-[#13111c]/10 rounded-full blur-2xl group-hover:bg-white dark:bg-[#13111c]/20 transition-all duration-700 pointer-events-none"></div>
          <div className="flex items-center relative z-10">
            <div className="w-1.5 h-7 bg-white dark:bg-[#13111c]/90 rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Edit Instructor</h2>
          </div>
          <button onClick={() => navigate('/instructors/all')} className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 relative z-10 hover:shadow hover:-translate-y-0.5">
            <span>↩ Back</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Name</label>
              <input 
                type="text" 
                name="m_instructor_name"
                value={formData.m_instructor_name}
                onChange={handleChange}
                placeholder="Instructor Name"
                required
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Email</label>
              <input 
                type="email" 
                name="m_instructor_email"
                value={formData.m_instructor_email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Phone</label>
              <input 
                type="text" 
                name="m_instructor_phone"
                value={formData.m_instructor_phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Skills (comma separated)</label>
              <input 
                type="text" 
                name="m_instructor_skills"
                value={formData.m_instructor_skills}
                onChange={handleChange}
                placeholder="e.g. reactjs, nodejs"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Linkedin Url</label>
              <input 
                type="text" 
                name="m_linkedin_profile"
                value={formData.m_linkedin_profile}
                onChange={handleChange}
                placeholder="Linkedin URL"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Designation</label>
              <input
                type="text"
                name="m_instructor_designation"
                value={formData.m_instructor_designation}
                onChange={handleChange}
                placeholder="e.g. Senior Data Scientist at Google"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Bio</label>
              <textarea
                name="m_instructor_bio"
                value={formData.m_instructor_bio}
                onChange={handleChange}
                placeholder="Instructor Bio"
                rows="1"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Experience</label>
              <input 
                type="text" 
                name="m_instructor_experience"
                value={formData.m_instructor_experience}
                onChange={handleChange}
                placeholder="e.g. 5 Years"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Order</label>
              <input 
                type="number" 
                name="m_instructor_order"
                value={formData.m_instructor_order}
                onChange={handleChange}
                placeholder="Sort Order"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Profile Image (Leave blank to keep existing)</label>
              <input 
                type="file" 
                name="m_instructor_profile"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#eaf3f8] file:text-[#144f36] hover:file:bg-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Status</label>
              <select 
                name="m_instructor_status"
                value={formData.m_instructor_status}
                onChange={handleChange}
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="bg-[#144f36] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#0f3d2a] transition-colors w-64 text-center disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Instructor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

