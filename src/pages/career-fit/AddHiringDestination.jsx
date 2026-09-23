import { useNavigate, useParams, useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import { getImageUrl } from '../../utils/imageUtils'

export default function AddHiringDestination() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  const [loading, setLoading] = useState(false)
  const [backendError, setBackendError] = useState(null)
  const [logoFile, setLogoFile] = useState(null)
  const [existingLogo, setExistingLogo] = useState('')
  const [formData, setFormData] = useState({
    m_phd_name: '',
    m_phd_order: '',
    m_phd_status: '1'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const populate = (d) => {
    setFormData({
      m_phd_name: d.m_phd_name || '',
      m_phd_order: (d.m_phd_order ?? '').toString(),
      m_phd_status: (d.m_phd_status ?? 1).toString()
    })
    setExistingLogo(d.m_phd_logo || '')
  }

  useEffect(() => {
    if (!id) return

    if (location.state?.destination) {
      populate(location.state.destination)
      return
    }

    const fetchOne = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}/myadmin/hiring-destination/get-all`, {
          params: { limit: 500 },
          headers: { Authorization: `Bearer ${token}` }
        })
        const found = (response.data?.data || []).find((d) => d._id === id)
        if (found) populate(found)
      } catch (err) {
        console.error('Error fetching logo', err)
        setBackendError('Error fetching logo')
      } finally {
        setLoading(false)
      }
    }
    fetchOne()
  }, [id, location.state])

  const handleSubmit = async () => {
    if (!id && !logoFile) {
      await window.customAlert('Logo image is required')
      return
    }

    try {
      setLoading(true)
      setBackendError(null)
      const token = localStorage.getItem('token')

      const payload = new FormData()
      payload.append('m_phd_name', formData.m_phd_name)
      payload.append('m_phd_order', Number(formData.m_phd_order) || 0)
      payload.append('m_phd_status', formData.m_phd_status)
      if (logoFile) payload.append('m_phd_logo', logoFile)

      const url = id
        ? `${BASE_URL}/myadmin/hiring-destination/update/${id}`
        : `${BASE_URL}/myadmin/hiring-destination/add`

      const response = await axios({
        method: id ? 'put' : 'post',
        url,
        data: payload,
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data?.status) {
        await window.customAlert(id ? 'Updated successfully' : 'Added successfully')
        navigate('/career-fit/hiring-destinations')
      } else {
        setBackendError(response.data?.message || 'Failed to save')
      }
    } catch (error) {
      console.error(error)
      setBackendError(error.response?.data?.message || 'Something went wrong')
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
              {id ? 'Edit Hiring Destination Logo' : 'Add Hiring Destination Logo'}
            </h2>
          </div>

          <Link
            to={'/career-fit/hiring-destinations'}
            className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 relative z-10 hover:shadow hover:-translate-y-0.5"
          >
            « Back
          </Link>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {backendError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg whitespace-pre-wrap font-mono text-sm shadow-sm">
              <strong className="font-bold">Error:</strong><br />
              {backendError}
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Company Name</label>
              <p className="text-xs text-slate-500 mb-1">Optional — used as the image's alt text.</p>
              <input
                type="text"
                name="m_phd_name"
                value={formData.m_phd_name}
                onChange={handleChange}
                placeholder="e.g. Uber"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Logo {!id && <span className="text-red-500">*</span>}</label>
              <div className="flex items-center gap-2 mt-1">
                {(logoFile || existingLogo) && (
                  <img
                    src={logoFile ? URL.createObjectURL(logoFile) : getImageUrl(existingLogo)}
                    alt="Logo"
                    className="w-9 h-9 rounded object-contain border border-slate-300 dark:border-gray-700 flex-shrink-0 bg-white"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border file:border-slate-300 dark:border-[#1f1b2e] file:bg-[#f6f6ff] file:text-slate-700 dark:text-slate-300 hover:file:bg-slate-50 dark:bg-[#1f1b2e]/50 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Order</label>
              <input
                type="number"
                name="m_phd_order"
                value={formData.m_phd_order}
                onChange={handleChange}
                placeholder="0"
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Status</label>
              <select
                name="m_phd_status"
                value={formData.m_phd_status}
                onChange={handleChange}
                className="w-full border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
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
            <Link
              to={'/career-fit/hiring-destinations'}
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
