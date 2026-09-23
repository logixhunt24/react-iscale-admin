import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

export default function LeadGeneratePreview() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statesList, setStatesList] = useState([])

  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    alternate: '',
    sameAsMobile: false,
    college: '',
    education: '',
    passing_year: '',
    study_field: '',
    branch: '',
    state: '',
    gender: '',
    accessories: '',
    profession: ''
  })

  useEffect(() => {
    fetchLead()
  }, [slug])

  useEffect(() => {
    if (data && data.m_lg_state) {
      loadStates()
    }
  }, [data])

  const loadStates = async () => {
    const fallbackStates = [
      { _id: '6a0ee3a40cc5eb43223ae5fe', m_state_name: 'Bihar' },
      { _id: '6a0ee3190cc5eb43223ae5fb', m_state_name: 'Chhattisgarh' },
      { _id: '6a0ee3950cc5eb43223ae5fd', m_state_name: 'Telangana' },
      { _id: '6a0ee3750cc5eb43223ae5fc', m_state_name: 'UP' },
      { _id: '6a2f967f64f2835474753fef', m_state_name: 'Madhya Pradesh' },
      { _id: '6a0ee3dc0cc5eb43223ae600', m_state_name: 'Other / Union Territory (UT)' }
    ];

    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.get(`${BASE_URL}/myadmin/location/state/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.data && res.data.data.length > 0) {
          const formatted = res.data.data.map(s => ({
            _id: s._id,
            m_state_name: s.m_state_name || s.state_name || s.name
          }));
          setStatesList(formatted);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to fetch states dynamically, using fallback", err);
    }
    setStatesList(fallbackStates);
  }

  const fetchLead = async () => {
    try {
      console.log("URL Slug =", slug)
      const res = await axios.get(`${BASE_URL}/DataAnalytics/${slug}`)

      if (res.data?.status && res.data.data) {
        setData(res.data.data)
      }
    } catch (err) {
      console.error(err)
      await window.customAlert('Failed to load lead details')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === 'sameAsMobile') {
      setForm({ ...form, sameAsMobile: checked, alternate: checked ? form.mobile : '' })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Current Data =", data)
    console.log("Current ID =", data?._id)
    console.log("Current Slug =", data?.m_lg_slug)
    
    try {
      const payload = { 
        data_name: form.fullName,
        data_mobile: form.mobile,
        data_email: form.email,
        data_whatsapp: form.alternate
      };

      if (!!data.m_lg_college) payload.data_college_name = form.college;
      if (!!data.m_lg_education) payload.data_qualification = form.education;
      if (!!data.m_lg_passing_year) payload.data_passing_year = form.passing_year;
      if (!!data.m_lg_field_of_study) payload.data_study_field = form.study_field;
      if (!!data.m_lg_branch) payload.data_branch = form.branch;
      if (!!data.m_lg_state) payload.data_state = form.state;
      if (!!data.m_lg_gender) payload.data_gender = form.gender;
      if (!!data.m_lg_laptop_desktop) payload.data_accessories = form.accessories;
      if (!!data.m_lg_working_professional) payload.data_profession = form.profession;

      const res = await axios.post(`${BASE_URL}/DataAnalytics/${slug}`, payload);
      
      if (res.data?.status || res.status === 200 || res.status === 201) {
        await window.customAlert(res.data?.message || 'Form submitted successfully');
        if (res.data?.redirect_url || data?.m_lg_redirect_link) {
          window.open(res.data.redirect_url || data.m_lg_redirect_link, '_blank')
        }
      } else {
        await window.customAlert(res.data?.message || 'Failed to submit form');
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'An error occurred while submitting the form');
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f4ebd0]"><div className="text-xl">Loading...</div></div>
  if (!data) return <div className="min-h-screen flex items-center justify-center bg-[#f4ebd0]"><div className="text-xl">Lead not found</div></div>

  return (
    <div className="min-h-screen bg-[#f4ebd0] py-10 px-4 flex justify-center font-sans">
      <div className="w-full max-w-4xl bg-[#2e2b2c] rounded-2xl overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="bg-[#facc15] py-6 px-8 text-center border-b-[6px] border-black/10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {data.m_lg_title || 'A.I. Full Course (Free) | Master AI Tools & Core Concepts Notes'}
          </h1>
        </div>

        <div className="p-8">
          
          {/* Media / Download Area */}
          <div className="bg-white rounded-xl p-6 mb-10 text-center max-w-2xl mx-auto shadow-inner">
            <div className="relative w-full max-w-xs mx-auto mb-4 rounded-lg overflow-hidden shadow-md group cursor-pointer">
              {/* Dummy Thumbnail */}
              <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=80" alt="Thumbnail" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-14 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2">Download Notes</h3>
            <p className="text-sm text-slate-600">
              Click on the Submit button after filling your details to download the PDF.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-white font-bold text-sm mb-2">Full Name<span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                className="w-full rounded-full border-none py-3 px-4 outline-none focus:ring-2 focus:ring-[#facc15] text-slate-900 font-medium"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-white font-bold text-sm mb-2">Mobile Number<span className="text-red-500">*</span></label>
              <input 
                type="tel" 
                name="mobile"
                required
                value={form.mobile}
                onChange={async (e) => {
                  handleChange(e);
                  if (form.sameAsMobile) {
                    setForm(prev => ({ ...prev, alternate: e.target.value }))
                  }
                }}
                className="w-full rounded-full border-none py-3 px-4 outline-none focus:ring-2 focus:ring-[#facc15] text-slate-900 font-medium mb-1"
              />
              <p className="text-[#facc15] text-xs leading-tight opacity-90">
                No Duplicate Mobile Number Allowed, kindly Contact/WhatsApp- 7880-113-112
              </p>
            </div>

            {/* Alternate Number */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <input 
                  type="checkbox" 
                  id="sameAsMobile"
                  name="sameAsMobile"
                  checked={form.sameAsMobile}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#facc15] focus:ring-[#facc15] border-gray-300"
                />
                <label htmlFor="sameAsMobile" className="text-white text-sm">Same as Mobile Number</label>
              </div>
              <label className="block text-white font-bold text-sm mb-2">Alternate Number (WhatsApp)<span className="text-red-500">*</span></label>
              <input 
                type="tel" 
                name="alternate"
                required
                value={form.alternate}
                onChange={handleChange}
                disabled={form.sameAsMobile}
                className="w-full rounded-full border-none py-3 px-4 outline-none focus:ring-2 focus:ring-[#facc15] text-slate-900 font-medium disabled:opacity-70 disabled:bg-gray-200 mb-1"
              />
              <p className="text-[#facc15] text-xs leading-tight opacity-90">
                Kindly give WhatsApp Number below, if above mobile number has no WhatsApp.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white font-bold text-sm mb-2">Email<span className="text-red-500">*</span></label>
              <input 
                type="email" 
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-full border-none py-3 px-4 outline-none focus:ring-2 focus:ring-[#facc15] text-slate-900 font-medium mb-1"
              />
              <p className="text-[#facc15] text-xs leading-tight opacity-90">
                If you have already Filled this form Previously kindly Contact/WhatsApp- 7880-113-112
              </p>
            </div>

            {/* Optional Fields Based on Settings */}
            {!!data.m_lg_college && (
              <div className="md:col-span-2">
                <label className="block text-white font-bold text-sm mb-2">College/Institute Name<span className="text-red-500">*</span></label>
                <input type="text" name="college" value={form.college} onChange={handleChange} required className="w-full rounded-full border-none py-3 px-4 outline-none focus:ring-2 focus:ring-[#facc15] text-slate-900 font-medium" />
              </div>
            )}
            
            {!!data.m_lg_education && (
              <div>
                <label className="block text-white font-bold text-sm mb-2">Education Qualification<span className="text-red-500">*</span></label>
                <input type="text" name="education" value={form.education} onChange={handleChange} required className="w-full rounded-full border-none py-3 px-4 outline-none focus:ring-2 focus:ring-[#facc15] text-slate-900 font-medium" />
              </div>
            )}
            {!!data.m_lg_passing_year && (
              <div>
                <label className="block text-white font-bold text-sm mb-2">Passing Year<span className="text-red-500">*</span></label>
                <input type="number" name="passing_year" value={form.passing_year} onChange={handleChange} required className="w-full rounded-full border-none py-3 px-4 outline-none focus:ring-2 focus:ring-[#facc15] text-slate-900 font-medium" />
              </div>
            )}

            {!!data.m_lg_field_of_study && (
              <div>
                <label className="block text-white font-bold text-sm mb-2">Field of Study<span className="text-red-500">*</span></label>
                <input type="text" name="study_field" value={form.study_field} onChange={handleChange} required className="w-full rounded-full border-none py-3 px-4 outline-none focus:ring-2 focus:ring-[#facc15] text-slate-900 font-medium" />
              </div>
            )}

            {!!data.m_lg_branch && (
              <div>
                <label className="block text-white font-bold text-sm mb-2">Branch / Specialization<span className="text-red-500">*</span></label>
                <input type="text" name="branch" value={form.branch} onChange={handleChange} required className="w-full rounded-full border-none py-3 px-4 outline-none focus:ring-2 focus:ring-[#facc15] text-slate-900 font-medium" />
              </div>
            )}

            {!!data.m_lg_state && (
              <div>
                <label className="block text-white font-bold text-sm mb-2">State<span className="text-red-500">*</span></label>
                <select 
                  name="state" 
                  value={form.state} 
                  onChange={handleChange} 
                  required 
                  className="w-full rounded-full border-none py-3 px-4 outline-none focus:ring-2 focus:ring-[#facc15] text-slate-900 font-medium bg-white"
                >
                  <option value="">--Select State--</option>
                  {statesList.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.m_state_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!!data.m_lg_gender && (
              <div>
                <label className="block text-white font-bold text-sm mb-2">Gender<span className="text-red-500">*</span></label>
                <select name="gender" value={form.gender} onChange={handleChange} required className="w-full rounded-full border-none py-3 px-4 outline-none focus:ring-2 focus:ring-[#facc15] text-slate-900 font-medium bg-white">
                  <option value="">--Select Gender--</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            {!!data.m_lg_laptop_desktop && (
              <div>
                <label className="block text-white font-bold text-sm mb-2">Do you have Laptop or Desktop?<span className="text-red-500">*</span></label>
                <select name="accessories" value={form.accessories} onChange={handleChange} required className="w-full rounded-full border-none py-3 px-4 outline-none focus:ring-2 focus:ring-[#facc15] text-slate-900 font-medium bg-white">
                  <option value="">--Select Option--</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            )}

            {!!data.m_lg_working_professional && (
              <div>
                <label className="block text-white font-bold text-sm mb-2">Are you Fresher or Working Professional?<span className="text-red-500">*</span></label>
                <select name="profession" value={form.profession} onChange={handleChange} required className="w-full rounded-full border-none py-3 px-4 outline-none focus:ring-2 focus:ring-[#facc15] text-slate-900 font-medium bg-white">
                  <option value="">--Select Option--</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Working Professional">Working Professional</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center mt-6">
              <button 
                type="submit"
                className="bg-[#facc15] hover:bg-[#eab308] text-slate-900 text-lg font-bold py-3 px-24 rounded-full transition-transform hover:scale-105 shadow-lg"
              >
                Submit
              </button>
            </div>
            
          </form>

        </div>
        
        {/* Return to Admin Button (for preview convenience) */}
        <Link 
          to={'/leads'} 
          className="inline-block absolute top-4 left-4 bg-white/20 hover:bg-white/40 text-black px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
        >
          ← Back to Admin
        </Link>
        
      </div>
    </div>
  )
}
