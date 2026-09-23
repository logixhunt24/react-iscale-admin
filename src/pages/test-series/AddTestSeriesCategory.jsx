import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddTestSeriesCategory() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const editCategory = location.state?.editCategory
  const isEditing = !!editCategory

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    test_categoryName: editCategory?.test_categoryName || '',
    test_category_description: editCategory?.test_category_description || '',
    test_category_status: editCategory?.test_category_status !== undefined ? editCategory.test_category_status.toString() : '1'
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
      payload.append('test_categoryName', formData.test_categoryName)
      payload.append('test_category_description', formData.test_category_description)
      payload.append('test_category_status', formData.test_category_status)
      
      if (iconFile) {
        payload.append('test_category_icon', iconFile)
      }
      if (bannerFile) {
        payload.append('test_category_banner', bannerFile)
      }

      let response
      if (isEditing) {
        response = await axios.put(
          `${BASE_URL}/myadmin/test-category/update/${editCategory._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        response = await axios.post(
          `${BASE_URL}/myadmin/test-category/add`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }

      if (response.data?.status) {
        await window.customAlert(response.data.message || (isEditing ? 'Updated successfully!' : 'Added successfully!'))
        navigate('/test-series/category')
      } else {
        await window.customAlert(response.data.message || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      await window.customAlert(error.response?.data?.message || 'Save failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden w-full">
        <div className="p-4 border-b border-slate-200 bg-[#144f36] text-white">
          <h2 className="text-xl font-bold tracking-tight text-white">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Category Name</label>
              <input 
                type="text" 
                name="test_categoryName"
                value={formData.test_categoryName}
                onChange={handleChange}
                placeholder="Enter Category Name"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none bg-white focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Category Status</label>
              <select 
                name="test_category_status"
                value={formData.test_category_status}
                onChange={handleChange}
                className="w-full border border-slate-300 bg-white text-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
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
              name="test_category_description"
              value={formData.test_category_description}
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
              className="bg-[#144f36] text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0f3d2a] transition-colors flex-1 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Submit'}
            </button>
            <Link
              to={'/test-series/category'}
              className="inline-block bg-[#d87025] text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-[#c2621f] transition-colors flex-1"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
