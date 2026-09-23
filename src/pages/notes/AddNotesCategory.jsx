import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddNotesCategory() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const editCategory = location.state?.editCategory
  const isEditing = !!editCategory

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nc_name: editCategory?.nc_name || '',
    nc_status: editCategory?.nc_status || 'active',
    nc_keywords: editCategory?.nc_keywords || '',
    nc_order: editCategory?.nc_order || '',
    nc_description: editCategory?.nc_description || ''
  })
  
  const [iconFile, setIconFile] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)

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
      payload.append('nc_name', formData.nc_name)
      payload.append('nc_status', formData.nc_status)
      payload.append('nc_keywords', formData.nc_keywords)
      payload.append('nc_order', formData.nc_order)
      payload.append('nc_description', formData.nc_description)
      
      if (iconFile) {
        payload.append('nc_icon', iconFile)
      }
      if (bannerFile) {
        payload.append('nc_banner', bannerFile)
      }

      let response
      if (isEditing) {
        // Assuming there is an update endpoint matching the pattern
        response = await axios.put(
          `${BASE_URL}/myadmin/notes-category/update/${editCategory._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        response = await axios.post(
          `${BASE_URL}/myadmin/notes-category/add`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }

      if (response.data?.status) {
        await window.customAlert(response.data.message || (isEditing ? 'Updated successfully!' : 'Added successfully!'))
        navigate('/notes/category')
      } else {
        await window.customAlert(response.data.message || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving notes category:', error)
      await window.customAlert(error.response?.data?.message || 'Save failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden w-full mx-auto">
        <div className="p-4 border-b border-slate-200 bg-[#144f36] text-white">
          <h2 className="text-xl font-bold tracking-tight text-white">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Category Name</label>
              <input 
                type="text" 
                name="nc_name"
                value={formData.nc_name}
                onChange={handleChange}
                placeholder="Enter Category Name"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none bg-white focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Category Status</label>
              <select 
                name="nc_status"
                value={formData.nc_status}
                onChange={handleChange}
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Enter Category Keyword</label>
              <input 
                type="text" 
                name="nc_keywords"
                value={formData.nc_keywords}
                onChange={handleChange}
                placeholder="Category Keyword"
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Order</label>
              <input 
                type="number" 
                name="nc_order"
                value={formData.nc_order}
                onChange={handleChange}
                placeholder="Category Order"
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Category Icon ( 512px X 512px )</label>
              <div className="relative">
                <input 
                  type="file" 
                  id="category-icon"
                  className="hidden" 
                  accept="image/*"
                  onChange={handleIconChange}
                />
                <label 
                  htmlFor="category-icon"
                  className="bg-[#144f36] hover:bg-[#0f3d2a] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📷</span> {iconFile ? iconFile.name : 'Choose Category Icon'}
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Category Banner ( 800px X 450px )</label>
              <div className="relative">
                <input 
                  type="file" 
                  id="category-banner"
                  className="hidden" 
                  accept="image/*"
                  onChange={handleBannerChange}
                />
                <label 
                  htmlFor="category-banner"
                  className="bg-[#144f36] hover:bg-[#0f3d2a] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📷</span> {bannerFile ? bannerFile.name : 'Choose Category Banner'}
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 mb-2">Category Description</label>
            <textarea 
              name="nc_description"
              value={formData.nc_description}
              onChange={handleChange}
              placeholder="Enter Category Description"
              rows={4}
              className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] resize-none"
            ></textarea>
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
              to={'/notes/category'}
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
