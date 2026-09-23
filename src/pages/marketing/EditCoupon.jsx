import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function EditCoupon() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  
  const couponData = location.state?.couponData || {}

  const getInitialCouponType = (typeVal) => {
    if (typeVal === undefined || typeVal === null) return '1';
    const valStr = String(typeVal).toLowerCase();
    if (valStr === 'course' || valStr === 'courses') return '1';
    if (valStr === 'notes') return '2';
    if (valStr === 'test series' || valStr === 'testseries') return '3';
    return valStr;
  };

  const [formData, setFormData] = useState({
    m_coupon_code: couponData.coupon_code || '',
    m_coupon_title: couponData.coupon_title || '',
    m_coupon_type: getInitialCouponType(couponData.coupon_type),
    m_coupon_discount_type: couponData.coupon_discount_type || 'flat',
    m_coupon_discount: couponData.coupon_discount || '',
    m_coupon_start_date: couponData.coupon_start_date ? new Date(couponData.coupon_start_date).toISOString().split('T')[0] : '',
    m_coupon_end_date: couponData.coupon_end_date ? new Date(couponData.coupon_end_date).toISOString().split('T')[0] : '',
    m_coupon_details: couponData.coupon_details || '',
    m_coupon_total: couponData.total_coupon || '',
    m_coupon_is_visible: (String(couponData.coupon_visible).toLowerCase() === 'yes' || couponData.coupon_visible === 1 || String(couponData.coupon_visible) === '1') ? '1' : '0',
    m_coupon_status: (String(couponData.coupon_status).toLowerCase() === 'active' || couponData.coupon_status === 1 || String(couponData.coupon_status) === '1') ? '1' : '0'
  })

  useEffect(() => {
    if (!couponData || !couponData._id) {
      // If no data passed via state, we could fetch it here
      // fetchCouponDetails()
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!formData.m_coupon_code || !formData.m_coupon_title) {
      await window.customAlert("Coupon Code and Title are required");
      return;
    }
    setLoading(true); 
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        coupon_code: formData.m_coupon_code,
        coupon_title: formData.m_coupon_title,
        coupon_type: Number(formData.m_coupon_type),
        coupon_discount_type: formData.m_coupon_discount_type.toLowerCase(),
        coupon_discount: Number(formData.m_coupon_discount) || 0,
        coupon_start_date: formData.m_coupon_start_date ? new Date(formData.m_coupon_start_date).toISOString() : null,
        coupon_end_date: formData.m_coupon_end_date ? new Date(formData.m_coupon_end_date).toISOString() : null,
        total_coupon: Number(formData.m_coupon_total) || 0,
        coupon_visible: formData.m_coupon_is_visible === '1' ? 'yes' : 'no',
        coupon_status: Number(formData.m_coupon_status),
        coupon_details: formData.m_coupon_details || ''
      };

      const res = await axios.put(`${BASE_URL}/myadmin/coupons/update/${id}`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.data?.status || res.data?.success || res.data?.message) {
        await window.customAlert(res.data?.message || 'Updated successfully');
        navigate('/master/coupons');
      } else {
        await window.customAlert(res.data?.message || 'Failed to update');
      }
    } catch (err) {
      console.error('Submit error:', err);
      if (err.response?.data?.message && err.response.data.message.includes('validation failed')) {
        await window.customAlert(`Backend Error: ${err.response.data.message}\n\nPlease take a screenshot of this error.`);
      } else {
        await window.customAlert(err.response?.data?.message || err.response?.data?.error || 'Failed to update coupon');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 overflow-hidden w-full">
        {/* Header - Success Story Theme */}
        <div className="p-4 flex justify-between items-center bg-gradient-to-r from-[#144f36] to-[#1a6545] rounded-t-2xl">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-white rounded-full mr-3"></div>
            <h2 className="text-xl font-bold text-white tracking-tight">Edit Coupon</h2>
          </div>
          <Link 
            to={'/master/coupons'}
            className="bg-white text-[#144f36] px-5 py-2 rounded-full flex items-center gap-2 text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            📄 List
          </Link>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Coupon Code</label>
              <input 
                type="text" 
                name="m_coupon_code"
                value={formData.m_coupon_code}
                onChange={handleChange}
                placeholder="Enter Coupon Code"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-[#f6f6ff] text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Coupon Title</label>
              <input 
                type="text" 
                name="m_coupon_title"
                value={formData.m_coupon_title}
                onChange={handleChange}
                placeholder="Enter Coupon Title"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-[#f6f6ff] text-slate-700"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-slate-800 mb-1">Coupon Type</label>
              <select 
                name="m_coupon_type"
                value={formData.m_coupon_type}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-[#f6f6ff] text-slate-700"
              >
                <option value="1">Course</option>
                <option value="2">Notes</option>
                <option value="3">Test Series</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Discount Type</label>
              <select name="m_coupon_discount_type" value={formData.m_coupon_discount_type} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-[#f6f6ff] text-slate-700">
                <option value="flat">Flat Amount</option>
                <option value="percent">Percentage %</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Coupon Discount</label>
              <input 
                type="number" 
                name="m_coupon_discount"
                value={formData.m_coupon_discount}
                onChange={handleChange}
                placeholder="Enter Amount / %"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-[#f6f6ff] text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Start Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  name="m_coupon_start_date"
                  value={formData.m_coupon_start_date}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-[#f6f6ff] text-slate-700"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">End Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  name="m_coupon_end_date"
                  value={formData.m_coupon_end_date}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-[#f6f6ff] text-slate-700"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-5">
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-slate-800 mb-1">Coupon Details</label>
              <textarea 
                name="m_coupon_details"
                value={formData.m_coupon_details}
                onChange={handleChange}
                placeholder="Enter Coupon Details"
                rows={4}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] resize-none bg-[#f6f6ff] text-slate-700"
              ></textarea>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6 self-start">
              <div className="sm:col-span-1">
                <label className="block text-sm font-bold text-slate-800 mb-1">Total Coupons</label>
                <input 
                  type="number" 
                  name="m_coupon_total"
                  value={formData.m_coupon_total}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-[#f6f6ff] text-slate-700"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-bold text-slate-800 mb-1">Is Visible</label>
                <select name="m_coupon_is_visible" value={formData.m_coupon_is_visible} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-[#f6f6ff] text-slate-700">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-bold text-slate-800 mb-1">Status</label>
                <select name="m_coupon_status" value={formData.m_coupon_status} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-[#f6f6ff] text-slate-700">
                  <option value="1">Active</option>
                  <option value="0">In-Active</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-[#144f36] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#0f3d2a] transition-colors flex-1 shadow-sm disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
            <Link 
              to={'/master/coupons'}
              className="inline-block bg-slate-50 text-slate-700 border border-slate-200 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex-1 shadow-sm"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
