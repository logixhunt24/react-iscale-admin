import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddNotesSubCategory() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const editSubCategory = location.state?.editSubCategory
  const isEditing = !!editSubCategory

  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  
  const [formData, setFormData] = useState({
    notes_category_id: editSubCategory?.notes_category_id?._id || editSubCategory?.notes_category_id || '',
    notes_subcategory_name: editSubCategory?.notes_subcategory_name || '',
    notes_subcategory_description: editSubCategory?.notes_subcategory_description || '',
    notes_subcategory_status: editSubCategory?.notes_subcategory_status || 'active'
  })
  
  const [iconFile, setIconFile] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/notes-category/dropdown/list`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        setCategories(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleIconChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIconFile(e.target.files[0])
    }
  }

  const handleBannerChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBannerFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); 

    try {
      const token = localStorage.getItem('token')
      const payload = new FormData()
      payload.append('notes_category_id', formData.notes_category_id)
      payload.append('notes_subcategory_name', formData.notes_subcategory_name)
      payload.append('notes_subcategory_description', formData.notes_subcategory_description)
      payload.append('notes_subcategory_status', formData.notes_subcategory_status)
      
      if (iconFile) {
        payload.append('nc_icon', iconFile)
      }
      if (bannerFile) {
        payload.append('nc_banner', bannerFile)
      }

      let response
      if (isEditing) {
        response = await axios.put(
          `${BASE_URL}/myadmin/notes-sub-category/update/${editSubCategory._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        response = await axios.post(
          `${BASE_URL}/myadmin/notes-sub-category/add`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }

      if (response.data?.status) {
        await window.customAlert(response.data.message || (isEditing ? 'Updated successfully!' : 'Added successfully!'))
        navigate('/notes/sub-category')
      } else {
        await window.customAlert(response.data.message || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving subcategory:', error)
      await window.customAlert(error.response?.data?.message || 'Save failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden w-full mx-auto">
        <div className="p-4 border-b border-slate-200 bg-[#144f36] text-white">
          <h2 className="text-xl font-bold tracking-tight text-white">{isEditing ? 'Edit Sub-Category' : 'Add New Sub-Category'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Category<span className="text-red-500">*</span></label>
              <select 
                name="notes_category_id"
                value={formData.notes_category_id}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white text-slate-700"
                required
              >
                <option value="">- - - Select - - -</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Sub-Category Name<span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="notes_subcategory_name"
                value={formData.notes_subcategory_name}
                onChange={handleChange}
                placeholder="Enter Sub-Category Name"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white text-slate-700"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Sub-Category Icon ( 512px X 512px )</label>
              <div className="relative">
                <input 
                  type="file" 
                  id="subcat-icon"
                  className="hidden" 
                  accept="image/*"
                  onChange={handleIconChange}
                />
                <label 
                  htmlFor="subcat-icon"
                  className="bg-[#144f36] hover:bg-[#0f3d2a] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📷</span> {iconFile ? iconFile.name : 'Choose Sub-Category Icon'}
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Sub-Category Banner ( 800px X 450px )</label>
              <div className="relative">
                <input 
                  type="file" 
                  id="subcat-banner"
                  className="hidden" 
                  accept="image/*"
                  onChange={handleBannerChange}
                />
                <label 
                  htmlFor="subcat-banner"
                  className="bg-[#144f36] hover:bg-[#0f3d2a] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📷</span> {bannerFile ? bannerFile.name : 'Choose Sub-Category Banner'}
                </label>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-800 mb-2">Sub-Category Description</label>
            <textarea 
              name="notes_subcategory_description"
              value={formData.notes_subcategory_description}
              onChange={handleChange}
              placeholder="Enter Sub-Category Description"
              rows={4}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white text-slate-700 resize-none"
            ></textarea>
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Sub-Category Status</label>
              <select 
                name="notes_subcategory_status"
                value={formData.notes_subcategory_status}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white text-slate-700"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#144f36] text-white px-10 py-2 rounded-lg text-sm font-medium hover:bg-[#0f3d2a] transition-colors flex-1 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Submit'}
            </button>
            <Link
              to={'/notes/sub-category'}
              className="inline-block bg-[#d87025] text-white px-10 py-2 rounded-lg text-sm font-medium hover:bg-[#c2621f] transition-colors flex-1"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
