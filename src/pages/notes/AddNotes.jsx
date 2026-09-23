import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function AddNotes() {
  const navigate = useNavigate()
  const location = useLocation()

  const editNote = location.state?.editNote
  const isEditing = !!editNote

  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    notes_category_id: editNote?.notes_category_id?._id || editNote?.notes_category_id || '',
    notes_subcategory_id: editNote?.notes_subcategory_id?._id || editNote?.notes_subcategory_id || '',
    notes_name: editNote?.notes_name || '',
    notes_keywords: editNote?.notes_keywords || '',
    notes_intro: editNote?.notes_intro || '',
    notes_description: editNote?.notes_description || '',
    notes_status: editNote?.notes_status || 'active',
    notes_type: editNote?.notes_type || '',
    notes_price: editNote?.notes_price || '',
    notes_offer_price: editNote?.notes_offer_price || '',
    no_of_ratings: editNote?.no_of_ratings || '0',
    no_of_students_enrolled: editNote?.no_of_students_enrolled || '',
    subjects: editNote?.subjects || '',
    training_highlights: editNote?.training_highlights || ''
  })

  const [imageFile, setImageFile] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (formData.notes_category_id) {
      fetchSubCategories(formData.notes_category_id)
    } else {
      setSubCategories([])
    }
  }, [formData.notes_category_id])

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
      console.error('Error fetching notes categories:', error)
    }
  }

  const fetchSubCategories = async (categoryId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/notes-sub-category/dropdown/list?notes_category_id=${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status) {
        setSubCategories(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching notes sub categories:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handlePdfChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); 

    try {
      const token = localStorage.getItem('token')
      const payload = new FormData()

      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          payload.append(key, formData[key])
        }
      })
      
      if (imageFile) {
        payload.append('notes_image', imageFile)
      }
      if (pdfFile) {
        payload.append('notes_pdf', pdfFile)
      }

      let response
      if (isEditing) {
        response = await axios.put(
          `${BASE_URL}/myadmin/notes/update/${editNote._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        response = await axios.post(
          `${BASE_URL}/myadmin/notes/add`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }

      if (response.data?.status) {
        await window.customAlert(response.data.message || (isEditing ? 'Updated successfully!' : 'Added successfully!'))
        navigate('/notes/all')
      } else {
        await window.customAlert(response.data.message || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving notes:', error)
      await window.customAlert(error.response?.data?.message || 'Save failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden w-full mx-auto">
        <div className="p-4 border-b border-slate-200 bg-[#144f36] flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight text-white">{isEditing ? 'Edit Notes' : 'Add New Notes'}</h2>
          <Link 
            to={'/notes/all'}
            className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-1 border border-white/30"
          >
            <span>↩ Back</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Notes Category<span className="text-red-500">*</span></label>
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
              <label className="block text-sm font-bold text-slate-800 mb-2">Notes Sub Category<span className="text-red-500">*</span></label>
              <select 
                name="notes_subcategory_id"
                value={formData.notes_subcategory_id}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white text-slate-700"
                required
              >
                <option value="">{formData.notes_category_id ? '- - - Select - - -' : 'Select Category First'}</option>
                {subCategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Notes Title<span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="notes_name"
                value={formData.notes_name}
                onChange={handleChange}
                placeholder="Notes Title"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white text-slate-700"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Notes Type</label>
              <select 
                name="notes_type"
                value={formData.notes_type}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white text-slate-700"
              >
                <option value="">Select Type</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Price</label>
              <input 
                type="number" 
                name="notes_price"
                value={formData.notes_price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Offer Price</label>
              <input 
                type="number" 
                name="notes_offer_price"
                value={formData.notes_offer_price}
                onChange={handleChange}
                placeholder="Offer Price"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Notes Keyword</label>
              <input 
                type="text" 
                name="notes_keywords"
                value={formData.notes_keywords}
                onChange={handleChange}
                placeholder="Test Notes Keyword"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Notes No Of Ratings</label>
              <input 
                type="number" 
                step="0.1"
                name="no_of_ratings"
                value={formData.no_of_ratings}
                onChange={handleChange}
                placeholder="0.0"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">No Of Student Enrolled</label>
              <input 
                type="number" 
                name="no_of_students_enrolled"
                value={formData.no_of_students_enrolled}
                onChange={handleChange}
                placeholder="Notes Enrolled"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Notes Status</label>
              <select 
                name="notes_status"
                value={formData.notes_status}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white text-slate-700"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Notes Image</label>
              <div className="relative">
                <input 
                  type="file" 
                  id="notes-image"
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label 
                  htmlFor="notes-image"
                  className="bg-[#144f36] hover:bg-[#0f3d2a] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📷</span> {imageFile ? imageFile.name : 'Choose Image'}
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Notes PDF</label>
              <div className="relative">
                <input 
                  type="file" 
                  id="notes-pdf"
                  className="hidden" 
                  accept="application/pdf"
                  onChange={handlePdfChange}
                />
                <label 
                  htmlFor="notes-pdf"
                  className="bg-[#d87025] hover:bg-[#b55d1f] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📄</span> {pdfFile ? pdfFile.name : 'Choose PDF'}
                </label>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-800 mb-2">Notes Intro</label>
            <textarea 
              name="notes_intro"
              value={formData.notes_intro}
              onChange={handleChange}
              placeholder="Enter Notes Intro"
              rows={3}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white text-slate-700 resize-none"
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 mb-2">Notes Description</label>
            <textarea 
              name="notes_description"
              value={formData.notes_description}
              onChange={handleChange}
              placeholder="Enter Notes Description"
              rows={3}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white text-slate-700 resize-none"
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
              to={'/notes/all'}
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
