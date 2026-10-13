import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

const inputCls = 'w-full border border-slate-300 dark:border-[#1f1b2e] rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white dark:bg-[#13111c]'
const labelCls = 'block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2'

export default function AddCompetition() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    m_competition_title: '',
    m_competition_company: '',
    m_competition_status: '1',
    m_competition_started: '',
    m_competition_ended: '',
    m_competition_priority: '',
    m_competition_des: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [existingImage, setExistingImage] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    ;(async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${BASE_URL}/myadmin/competition/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        if (res.data?.status && res.data.data) {
          const d = res.data.data
          setFormData({
            m_competition_title: d.m_competition_title || '',
            m_competition_company: d.m_competition_company || '',
            m_competition_status: String(d.m_competition_status ?? 1),
            m_competition_started: d.m_competition_started ? d.m_competition_started.split('T')[0] : '',
            m_competition_ended: d.m_competition_ended ? d.m_competition_ended.split('T')[0] : '',
            m_competition_priority: d.m_competition_priority ?? '',
            m_competition_des: d.m_competition_des || '',
          })
          setExistingImage(d.m_competition_image || '')
        }
      } catch {
        await window.customAlert('Failed to fetch competition details')
      } finally {
        setLoading(false)
      }
    })()
  }, [id, isEdit])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!formData.m_competition_title.trim()) return window.customAlert('Competition title is required')
    if (formData.m_competition_started && formData.m_competition_ended && formData.m_competition_ended < formData.m_competition_started) {
      return window.customAlert('End date cannot be before the start date')
    }

    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const payload = new FormData()
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v))
      if (imageFile) payload.append('m_competition_image', imageFile)

      const url = isEdit ? `${BASE_URL}/myadmin/competition/update/${id}` : `${BASE_URL}/myadmin/competition/add`
      const res = await axios[isEdit ? 'put' : 'post'](url, payload, { headers: { Authorization: `Bearer ${token}` } })

      if (res.data?.status) {
        await window.customAlert(res.data.message || 'Saved')
        navigate('/competitions')
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to save competition')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#eef5fa] p-4 min-h-screen">
        <div className="bg-[#144f36] dark:bg-[#0f3d2a] rounded-lg p-4 mb-4 shadow-sm">
          <h2 className="text-xl font-bold tracking-tight text-white">{isEdit ? 'Edit Competition' : 'Add New Competition'}</h2>
        </div>

        <div className="bg-white dark:bg-[#13111c] rounded-lg shadow-sm border border-slate-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className={labelCls}>Competition Title<span className="text-red-500">*</span></label>
              <input type="text" name="m_competition_title" value={formData.m_competition_title} onChange={handleChange} placeholder="Enter Competition Title" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Company / Organiser</label>
              <input type="text" name="m_competition_company" value={formData.m_competition_company} onChange={handleChange} placeholder="e.g. Microsoft" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select name="m_competition_status" value={formData.m_competition_status} onChange={handleChange} className={inputCls}>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Start Date</label>
              <input type="date" name="m_competition_started" value={formData.m_competition_started} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>End Date</label>
              <input type="date" name="m_competition_ended" value={formData.m_competition_ended} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <input type="number" name="m_competition_priority" value={formData.m_competition_priority} onChange={handleChange} placeholder="Lower numbers show first" className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Image ( 800px X 450px )</label>
              <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && setImageFile(e.target.files[0])} className="hidden" accept="image/*" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-[#144f36] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#0f3d2a] transition-colors w-full flex items-center justify-center gap-2">
                <span>📷</span> <span className="truncate">{imageFile ? imageFile.name : existingImage ? 'Change Image' : 'Choose Image'}</span>
              </button>
              {existingImage && !imageFile && <img src={existingImage} alt="current" className="mt-2 h-16 rounded object-cover" />}
            </div>

            <div className="md:col-span-3">
              <label className={labelCls}>Description</label>
              <textarea name="m_competition_des" value={formData.m_competition_des} onChange={handleChange} rows={4} placeholder="Enter Competition Description" className={`${inputCls} resize-none`}></textarea>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={handleSubmit} disabled={saving} className="bg-[#144f36] text-white px-10 py-2.5 rounded-lg text-sm font-bold hover:bg-[#0f3d2a] transition-colors flex-1 shadow-md disabled:opacity-60">
              {saving ? 'Saving...' : 'Submit'}
            </button>
            <Link to="/competitions" className="inline-block text-center bg-[#d87025] text-white px-10 py-2.5 rounded-lg text-sm font-bold hover:bg-[#b55d1f] transition-colors flex-1 shadow-md">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
