import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Trash2, Edit2, Eye, User, Mail, Phone, Calendar, MessageCircle, MapPin, Cake, Hash } from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
}

// Matches AppUsers.jsx's list-page definition - c_user_status is a
// separate Active/Inactive account flag, unrelated to this.
const isVerifiedUser = (user) =>
  Boolean(user.c_mobile_verified || user.c_email_verified || user.c_admin_verified);

export default function AppUserDetails({ userId, onClose }) {
  const { id: paramId } = useParams()
  const navigate = useNavigate()
  const id = userId || paramId
  const isModal = !!userId
  
  const [activeTab, setActiveTab] = useState('enrollments') // 'enrollments', 'wishlists'
  const [activeSubTab, setActiveSubTab] = useState('courses') // 'courses', 'test-series', 'notes'
  const [user, setUser] = useState(null)
  const [userLoading, setUserLoading] = useState(true)

  const fetchUserDetails = async () => {
    try {
      setUserLoading(true)
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/app-users/single/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        setUser(res.data.data)
      }
    } catch (err) {
      console.error('Error fetching user details:', err)
    } finally {
      setUserLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    fetchUserDetails()
  }, [id])

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in text-left">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative border border-slate-200 flex flex-col gap-4">
          
          {/* Modal Header */}
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800">User Details</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors text-xl font-bold">
              ✕
            </button>
          </div>

          {userLoading ? (
            <div className="p-8 text-center text-slate-500 animate-pulse">Loading user details...</div>
          ) : user ? (
            <div className="flex-1 flex flex-col gap-5">
              
              {/* CANDIDATE INFORMATION Block (styled like the second screenshot) */}
              <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                <h4 className="text-xs font-bold tracking-wider text-[#7c3aed] uppercase mb-4">
                  CANDIDATE INFORMATION
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <div className="text-xs text-slate-400 font-semibold mb-0.5">Name</div>
                    <div className="text-sm text-slate-800 font-bold flex items-center gap-2 flex-wrap">
                      {`${user.c_first_name || ''} ${user.c_last_name || ''}`.trim() || user.c_display_name || 'N/A'}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${user.c_user_status === 1 ? 'bg-[#144f36]/10 text-[#144f36] border border-[#144f36]/20' : 'bg-[#d87025]/10 text-[#d87025] border border-[#d87025]/20'}`}>
                        {user.c_user_status === 1 ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isVerifiedUser(user) ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                        {isVerifiedUser(user) ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold mb-0.5">Email</div>
                    <div className="text-sm text-slate-800 font-bold break-all">{user.c_email || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold mb-0.5">Mobile</div>
                    <div className="text-sm text-slate-800 font-bold">{user.c_contact || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold mb-0.5">Alternate Mobile</div>
                    <div className="text-sm text-slate-800 font-bold">{user.c_alt_contact || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold mb-0.5">WhatsApp Number</div>
                    <div className="text-sm text-slate-800 font-bold">{user.c_whatsapp || 'N/A'}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-xs text-slate-400 font-semibold mb-0.5">Address</div>
                    <div className="text-sm text-slate-800 font-bold">{user.c_current_address1 || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold mb-0.5">Candidate ID</div>
                    <div className="text-sm text-slate-800 font-bold">{user.candidate_idno || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold mb-0.5">Joined Date</div>
                    <div className="text-sm text-slate-800 font-bold">{formatDate(user.c_register_date)}</div>
                  </div>
                  {user.c_gender && (
                    <div>
                      <div className="text-xs text-slate-400 font-semibold mb-0.5">Gender</div>
                      <div className="text-sm text-slate-800 font-bold capitalize">{user.c_gender}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-slate-400 font-semibold mb-0.5">Date of Birth</div>
                    <div className="text-sm text-slate-800 font-bold">{formatDate(user.c_dob)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold mb-0.5">Pincode</div>
                    <div className="text-sm text-slate-800 font-bold">{user.c_current_pincode || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* ENROLLMENT & WISHLIST DETAILS Card Block */}
              <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col gap-4">
                
                {/* Tab Header Bar (styled like the second screenshot tabs) */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-slate-100 pb-3">
                  <button 
                    onClick={() => { setActiveTab('enrollments'); setActiveSubTab('courses'); }}
                    className={`text-xs font-bold tracking-wider uppercase transition-all pb-1.5 ${activeTab === 'enrollments' && activeSubTab === 'courses' ? 'text-[#7c3aed] border-b-2 border-[#7c3aed]' : 'text-emerald-700 hover:text-emerald-800'}`}
                  >
                    Enrolled Courses
                  </button>
                  <button 
                    onClick={() => { setActiveTab('enrollments'); setActiveSubTab('test-series'); }}
                    className={`text-xs font-bold tracking-wider uppercase transition-all pb-1.5 ${activeTab === 'enrollments' && activeSubTab === 'test-series' ? 'text-[#7c3aed] border-b-2 border-[#7c3aed]' : 'text-emerald-700 hover:text-emerald-800'}`}
                  >
                    Enrolled Test Series
                  </button>
                  <button 
                    onClick={() => { setActiveTab('enrollments'); setActiveSubTab('notes'); }}
                    className={`text-xs font-bold tracking-wider uppercase transition-all pb-1.5 ${activeTab === 'enrollments' && activeSubTab === 'notes' ? 'text-[#7c3aed] border-b-2 border-[#7c3aed]' : 'text-emerald-700 hover:text-emerald-800'}`}
                  >
                    Enrolled Notes
                  </button>
                  <button 
                    onClick={() => { setActiveTab('wishlists'); setActiveSubTab('courses'); }}
                    className={`text-xs font-bold tracking-wider uppercase transition-all pb-1.5 ${activeTab === 'wishlists' ? 'text-[#7c3aed] border-b-2 border-[#7c3aed]' : 'text-emerald-700 hover:text-emerald-800'}`}
                  >
                    Wishlist
                  </button>
                </div>

                {/* Tab Content Table */}
                <div className="min-h-[250px]">
                  {activeTab === 'enrollments' && activeSubTab === 'courses' && <EnrollmentCourses candidateId={id} />}
                  {activeTab === 'enrollments' && activeSubTab === 'test-series' && <EnrollmentTestSeries candidateId={id} />}
                  {activeTab === 'enrollments' && activeSubTab === 'notes' && <EnrollmentNotes candidateId={id} />}
                  
                  {activeTab === 'wishlists' && (
                    <div className="flex flex-col gap-4">
                      {/* Wishlist Sub-Tabs Switcher */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setActiveSubTab('courses')}
                          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${activeSubTab === 'courses' ? 'bg-[#7c3aed] text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          Courses
                        </button>
                        <button 
                          onClick={() => setActiveSubTab('test-series')}
                          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${activeSubTab === 'test-series' ? 'bg-[#7c3aed] text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          Test Series
                        </button>
                        <button 
                          onClick={() => setActiveSubTab('notes')}
                          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${activeSubTab === 'notes' ? 'bg-[#7c3aed] text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          Notes
                        </button>
                      </div>
                      
                      {/* Wishlist Table Content */}
                      <div className="border border-slate-100 rounded-lg overflow-hidden">
                        {activeSubTab === 'courses' && <WishlistCourses candidateId={id} />}
                        {activeSubTab === 'test-series' && <WishlistTestSeries candidateId={id} />}
                        {activeSubTab === 'notes' && <WishlistNotes candidateId={id} />}
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">Failed to load user details.</div>
          )}

          {/* Footer Close Button */}
          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button 
              onClick={onClose} 
              className="bg-[#f0f4f9] text-slate-700 hover:bg-[#e1e9f4] px-6 py-2.5 rounded-full font-bold text-sm transition-colors shadow-sm"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#144f36] rounded-2xl shadow-md border border-white/10 p-5 mb-5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">User Details</h2>
          <Link 
            to={'/app-users'}
            className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-1 border border-white/30"
          >
            <span>↩ Back</span>
          </Link>
        </div>
        
        <div className="flex gap-4 border-b border-white/20 pb-2">
          <button 
            className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${activeTab === 'enrollments' ? 'bg-white text-[#144f36]' : 'text-white hover:bg-white/10'}`}
            onClick={async () => { setActiveTab('enrollments'); setActiveSubTab('courses'); }}
          >
            Enrollments
          </button>
          <button 
            className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${activeTab === 'wishlists' ? 'bg-white text-[#144f36]' : 'text-white hover:bg-white/10'}`}
            onClick={async () => { setActiveTab('wishlists'); setActiveSubTab('courses'); }}
          >
            Wishlists
          </button>
        </div>

        <div className="flex gap-2">
          <button 
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${activeSubTab === 'courses' ? 'bg-[#d87025] text-white shadow' : 'bg-white/20 text-white hover:bg-white/30'}`}
            onClick={() => setActiveSubTab('courses')}
          >
            Courses
          </button>
          <button 
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${activeSubTab === 'test-series' ? 'bg-[#d87025] text-white shadow' : 'bg-white/20 text-white hover:bg-white/30'}`}
            onClick={() => setActiveSubTab('test-series')}
          >
            Test Series
          </button>
          <button 
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${activeSubTab === 'notes' ? 'bg-[#d87025] text-white shadow' : 'bg-white/20 text-white hover:bg-white/30'}`}
            onClick={() => setActiveSubTab('notes')}
          >
            Notes
          </button>
        </div>
      </div>

      {/* User Info Summary Card */}
      {userLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-5 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      ) : user ? (
        <div className="bg-[#f6f6ff] rounded-2xl shadow-md border border-slate-100 p-6 mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-[0_8px_30px_rgba(99,102,241,0.08)] transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#144f36]/10 text-[#144f36] rounded-full flex items-center justify-center font-bold text-2xl shadow-inner uppercase">
              {user.c_first_name?.[0] || user.c_display_name?.[0] || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex flex-wrap items-center gap-2">
                {`${user.c_first_name || ''} ${user.c_last_name || ''}`.trim() || user.c_display_name || 'N/A'}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${user.c_user_status === 1 ? 'bg-[#144f36]/10 text-[#144f36] border border-[#144f36]/20' : 'bg-rose-100 text-rose-800 border border-rose-200'}`}>
                  {user.c_user_status === 1 ? 'Active' : 'Inactive'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isVerifiedUser(user) ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                  {isVerifiedUser(user) ? 'Verified' : 'Unverified'}
                </span>
              </h3>
              <p className="text-sm text-slate-500 font-semibold mt-0.5">Candidate ID: {user.candidate_idno || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 flex-1 max-w-3xl md:border-l md:border-slate-200 md:pl-8">
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <span className="truncate font-semibold" title={user.c_email}>{user.c_email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <Phone size={16} className="text-slate-400 shrink-0" />
              <span className="font-semibold">{user.c_contact || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <Phone size={16} className="text-slate-400 shrink-0" />
              <span className="font-semibold">Alt: {user.c_alt_contact || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <MessageCircle size={16} className="text-slate-400 shrink-0" />
              <span className="font-semibold">{user.c_whatsapp || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <Calendar size={16} className="text-slate-400 shrink-0" />
              <span className="font-semibold">Joined: {formatDate(user.c_register_date)}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <Cake size={16} className="text-slate-400 shrink-0" />
              <span className="font-semibold">DOB: {formatDate(user.c_dob)}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <Hash size={16} className="text-slate-400 shrink-0" />
              <span className="font-semibold">{user.c_current_pincode || 'N/A'}</span>
            </div>
            {user.c_gender && (
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <User size={16} className="text-slate-400 shrink-0" />
                <span className="font-semibold capitalize">{user.c_gender}</span>
              </div>
            )}
            <div className="flex items-center gap-2.5 text-sm text-slate-700 sm:col-span-2 md:col-span-3">
              <MapPin size={16} className="text-slate-400 shrink-0" />
              <span className="font-semibold">{user.c_current_address1 || 'N/A'}</span>
            </div>
          </div>
        </div>
      ) : null}

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden min-h-[400px]">
        {activeTab === 'enrollments' && activeSubTab === 'courses' && <EnrollmentCourses candidateId={id} />}
        {activeTab === 'enrollments' && activeSubTab === 'test-series' && <EnrollmentTestSeries candidateId={id} />}
        {activeTab === 'enrollments' && activeSubTab === 'notes' && <EnrollmentNotes candidateId={id} />}
        
        {activeTab === 'wishlists' && activeSubTab === 'courses' && <WishlistCourses candidateId={id} />}
        {activeTab === 'wishlists' && activeSubTab === 'test-series' && <WishlistTestSeries candidateId={id} />}
        {activeTab === 'wishlists' && activeSubTab === 'notes' && <WishlistNotes candidateId={id} />}
      </div>
    </div>
  )
}

function EnrollmentCourses({ candidateId }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalData, setModalData] = useState(null)

  const handleView = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/app-users-enrollments-details/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        setModalData(res.data.data)
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to fetch details')
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/app-users-enrollments-details/course/all/${candidateId}?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(res.data?.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [candidateId])

  const handleDelete = async (id) => {
    if(!await window.customConfirm('Delete this purchased course?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await axios.delete(`${BASE_URL}/myadmin/app-users-enrollments-details/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        await window.customAlert(res.data.message || 'Deleted successfully')
        fetchData()
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleUpdateDuration = async (id, currentDays) => {
    const days = prompt('Enter new remaining days:', currentDays)
    if (days === null || days === '') return
    
    try {
      const token = localStorage.getItem('token')
      const res = await axios.put(`${BASE_URL}/myadmin/app-users-enrollments-details/course/duration/${id}`, { remaining_days: days }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        await window.customAlert(res.data.message || 'Duration updated')
        fetchData()
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Update failed')
    }
  }

  if (loading) return <div className="p-8 text-center">Loading courses...</div>

  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full text-left text-sm text-slate-800">
        <thead className="bg-[#144f36] text-white">
          <tr>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Course Name</th>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Registration Date</th>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Amount</th>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Access Type</th>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Remaining Days</th>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Status</th>
            <th className="px-4 py-3 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? <tr><td colSpan="7" className="text-center py-6">No records found.</td></tr> : data.map(row => (
            <tr key={row._id} className="border-b border-slate-200 hover:bg-slate-50">
              <td className="px-4 py-3 border-r border-slate-200">{row.course_name}</td>
              <td className="px-4 py-3 border-r border-slate-200">{formatDate(row.registration_date)}</td>
              <td className="px-4 py-3 border-r border-slate-200">₹{row.amount}</td>
              <td className="px-4 py-3 border-r border-slate-200 capitalize">{row.access_type}</td>
              <td className="px-4 py-3 border-r border-slate-200">
                {row.access_type === 'lifetime' ? 'Lifetime' : `${row.remaining_days} Days`}
                {row.access_type !== 'lifetime' && (
                  <button onClick={() => handleUpdateDuration(row._id, row.remaining_days)} className="ml-2 text-blue-600 hover:underline text-xs">
                    (Edit)
                  </button>
                )}
              </td>
              <td className="px-4 py-3 border-r border-slate-200 capitalize">{row.enrollment_data?.status}</td>
              <td className="px-4 py-3 flex gap-2">
                <button onClick={() => handleView(row._id)} className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700" title="View Details"><Eye size={14} /></button>
                <button onClick={() => handleDelete(row._id)} className="bg-[#d87025] text-white p-1.5 rounded hover:bg-[#b55d1f]" title="Delete"><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DetailsModal isOpen={!!modalData} onClose={() => setModalData(null)} data={modalData} type="Course" />
    </div>
  )
}

function EnrollmentTestSeries({ candidateId }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalData, setModalData] = useState(null)

  const handleView = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/app-users-enrollments-details/test-series/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        setModalData(res.data.data)
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to fetch details')
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/app-users-enrollments-details/test-series/all/${candidateId}?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(res.data?.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [candidateId])

  const handleDelete = async (id) => {
    if(!await window.customConfirm('Delete this purchased test series?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await axios.delete(`${BASE_URL}/myadmin/app-users-enrollments-details/test-series/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        await window.customAlert(res.data.message || 'Deleted successfully')
        fetchData()
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.patch(`${BASE_URL}/myadmin/app-users-enrollments-details/test-series/status/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) fetchData()
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Status update failed')
    }
  }

  if (loading) return <div className="p-8 text-center">Loading test series...</div>

  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full text-left text-sm text-slate-800">
        <thead className="bg-[#144f36] text-white">
          <tr>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Test Series Name</th>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Registration Date</th>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Amount</th>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Payment Mode</th>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Status</th>
            <th className="px-4 py-3 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? <tr><td colSpan="6" className="text-center py-6">No records found.</td></tr> : data.map(row => (
            <tr key={row._id} className="border-b border-slate-200 hover:bg-slate-50">
              <td className="px-4 py-3 border-r border-slate-200">{row.test_series_name}</td>
              <td className="px-4 py-3 border-r border-slate-200">{formatDate(row.registration_date)}</td>
              <td className="px-4 py-3 border-r border-slate-200">₹{row.payable_amount}</td>
              <td className="px-4 py-3 border-r border-slate-200 uppercase">{row.payment_mode}</td>
              <td className="px-4 py-3 border-r border-slate-200">
                <button onClick={() => handleToggleStatus(row._id)} className={`px-2 py-1 text-xs text-white rounded ${row.enrollment_data?.access_status === 'active' ? 'bg-[#144f36]' : 'bg-[#d87025]'}`}>
                  {row.enrollment_data?.access_status}
                </button>
              </td>
              <td className="px-4 py-3 flex gap-2">
                <button onClick={() => handleView(row._id)} className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700" title="View Details"><Eye size={14} /></button>
                <button onClick={() => handleDelete(row._id)} className="bg-[#d87025] text-white p-1.5 rounded hover:bg-[#b55d1f]" title="Delete"><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DetailsModal isOpen={!!modalData} onClose={() => setModalData(null)} data={modalData} type="Test Series" />
    </div>
  )
}

function EnrollmentNotes({ candidateId }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalData, setModalData] = useState(null)

  const handleView = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/app-users-enrollments-details/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        setModalData(res.data.data)
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to fetch details')
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/app-users-enrollments-details/notes/all/${candidateId}?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(res.data?.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [candidateId])

  const handleDelete = async (id) => {
    if(!await window.customConfirm('Delete this purchased note?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await axios.delete(`${BASE_URL}/myadmin/app-users-enrollments-details/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        await window.customAlert(res.data.message || 'Deleted successfully')
        fetchData()
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.patch(`${BASE_URL}/myadmin/app-users-enrollments-details/notes/status/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) fetchData()
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Status update failed')
    }
  }

  if (loading) return <div className="p-8 text-center">Loading notes...</div>

  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full text-left text-sm text-slate-800">
        <thead className="bg-[#144f36] text-white">
          <tr>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Notes Name</th>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Registration Date</th>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Status</th>
            <th className="px-4 py-3 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? <tr><td colSpan="4" className="text-center py-6">No records found.</td></tr> : data.map(row => (
            <tr key={row._id} className="border-b border-slate-200 hover:bg-slate-50">
              <td className="px-4 py-3 border-r border-slate-200">{row.notes_name || 'Notes Name Unavailable'}</td>
              <td className="px-4 py-3 border-r border-slate-200">{formatDate(row.registration_date)}</td>
              <td className="px-4 py-3 border-r border-slate-200">
                <button onClick={() => handleToggleStatus(row._id)} className={`px-2 py-1 text-xs text-white rounded ${row.enrollment_data?.enrollment_status === 'active' ? 'bg-[#144f36]' : 'bg-[#d87025]'}`}>
                  {row.enrollment_data?.enrollment_status}
                </button>
              </td>
              <td className="px-4 py-3 flex gap-2">
                <button onClick={() => handleView(row._id)} className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700" title="View Details"><Eye size={14} /></button>
                <button onClick={() => handleDelete(row._id)} className="bg-[#d87025] text-white p-1.5 rounded hover:bg-[#b55d1f]" title="Delete"><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DetailsModal isOpen={!!modalData} onClose={() => setModalData(null)} data={modalData} type="Notes" />
    </div>
  )
}

function WishlistCourses({ candidateId }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalData, setModalData] = useState(null)

  const handleView = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/app-users-wishlist-details/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        setModalData(res.data.data)
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to fetch details')
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/app-users-wishlist-details/course/all/${candidateId}?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(res.data?.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [candidateId])

  const handleDelete = async (id) => {
    if(!await window.customConfirm('Remove course from wishlist?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await axios.delete(`${BASE_URL}/myadmin/app-users-wishlist-details/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        await window.customAlert(res.data.message || 'Deleted successfully')
        fetchData()
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Delete failed')
    }
  }

  if (loading) return <div className="p-8 text-center">Loading wishlist...</div>

  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full text-left text-sm text-slate-800">
        <thead className="bg-[#144f36] text-white">
          <tr>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Course Name</th>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Added On</th>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Price</th>
            <th className="px-4 py-3 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? <tr><td colSpan="4" className="text-center py-6">No records found.</td></tr> : data.map(row => (
            <tr key={row._id} className="border-b border-slate-200 hover:bg-slate-50">
              <td className="px-4 py-3 border-r border-slate-200">{row.course_id?.m_course_title}</td>
              <td className="px-4 py-3 border-r border-slate-200">{formatDate(row.added_on)}</td>
              <td className="px-4 py-3 border-r border-slate-200">₹{row.course_id?.m_course_price}</td>
              <td className="px-4 py-3 flex gap-2">
                <button onClick={() => handleView(row._id)} className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700" title="View Details"><Eye size={14} /></button>
                <button onClick={() => handleDelete(row._id)} className="bg-[#d87025] text-white p-1.5 rounded hover:bg-[#b55d1f]"><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DetailsModal isOpen={!!modalData} onClose={() => setModalData(null)} data={modalData} type="Wishlist Course" />
    </div>
  )
}

function WishlistTestSeries({ candidateId }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalData, setModalData] = useState(null)

  const handleView = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/app-users-wishlist-details/test/series/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        setModalData(res.data.data)
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to fetch details')
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/app-users-wishlist-details/test/series/all/${candidateId}?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(res.data?.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [candidateId])

  const handleDelete = async (id) => {
    if(!await window.customConfirm('Remove test series from wishlist?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await axios.delete(`${BASE_URL}/myadmin/app-users-wishlist-details/test/series/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        await window.customAlert(res.data.message || 'Deleted successfully')
        fetchData()
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Delete failed')
    }
  }

  if (loading) return <div className="p-8 text-center">Loading wishlist...</div>

  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full text-left text-sm text-slate-800">
        <thead className="bg-[#144f36] text-white">
          <tr>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Package Name</th>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Added On</th>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Price</th>
            <th className="px-4 py-3 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? <tr><td colSpan="4" className="text-center py-6">No records found.</td></tr> : data.map(row => (
            <tr key={row._id} className="border-b border-slate-200 hover:bg-slate-50">
              <td className="px-4 py-3 border-r border-slate-200">{row.package_id?.m_package_title}</td>
              <td className="px-4 py-3 border-r border-slate-200">{formatDate(row.added_on)}</td>
              <td className="px-4 py-3 border-r border-slate-200">₹{row.package_id?.m_package_price}</td>
              <td className="px-4 py-3 flex gap-2">
                <button onClick={() => handleView(row._id)} className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700" title="View Details"><Eye size={14} /></button>
                <button onClick={() => handleDelete(row._id)} className="bg-[#d87025] text-white p-1.5 rounded hover:bg-[#b55d1f]"><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DetailsModal isOpen={!!modalData} onClose={() => setModalData(null)} data={modalData} type="Wishlist Test Series" />
    </div>
  )
}

function WishlistNotes({ candidateId }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalData, setModalData] = useState(null)

  const handleView = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/app-users-wishlist-details/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        setModalData(res.data.data)
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Failed to fetch details')
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const res = await axios.get(`${BASE_URL}/myadmin/app-users-wishlist-details/notes/all/${candidateId}?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(res.data?.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [candidateId])

  const handleDelete = async (id) => {
    if(!await window.customConfirm('Remove notes from wishlist?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await axios.delete(`${BASE_URL}/myadmin/app-users-wishlist-details/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.status) {
        await window.customAlert(res.data.message || 'Deleted successfully')
        fetchData()
      }
    } catch (err) {
      await window.customAlert(err.response?.data?.message || 'Delete failed')
    }
  }

  if (loading) return <div className="p-8 text-center">Loading wishlist...</div>

  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full text-left text-sm text-slate-800">
        <thead className="bg-[#144f36] text-white">
          <tr>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Notes Name</th>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Added On</th>
            <th className="px-4 py-3 font-semibold border-r border-[#0f3d2a]">Status</th>
            <th className="px-4 py-3 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? <tr><td colSpan="4" className="text-center py-6">No records found.</td></tr> : data.map(row => (
            <tr key={row._id} className="border-b border-slate-200 hover:bg-slate-50">
              <td className="px-4 py-3 border-r border-slate-200">{row.notes_id?.notes_name || 'Notes Unavailable'}</td>
              <td className="px-4 py-3 border-r border-slate-200">{formatDate(row.added_on)}</td>
              <td className="px-4 py-3 border-r border-slate-200 capitalize">{row.notes_id?.notes_status || 'N/A'}</td>
              <td className="px-4 py-3 flex gap-2">
                <button onClick={() => handleView(row._id)} className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700" title="View Details"><Eye size={14} /></button>
                <button onClick={() => handleDelete(row._id)} className="bg-[#d87025] text-white p-1.5 rounded hover:bg-[#b55d1f]"><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DetailsModal isOpen={!!modalData} onClose={() => setModalData(null)} data={modalData} type="Wishlist Notes" />
    </div>
  )
}

function DetailsModal({ isOpen, onClose, data, type }) {
  if (!isOpen || !data) return null;

  // 1. Candidate Info
  const candidate = data.user_id || {};
  const candidateName = `${candidate.c_first_name || ''} ${candidate.c_last_name || ''}`.trim() || candidate.c_display_name || 'N/A';
  const candidateEmail = candidate.c_email || 'N/A';
  const candidateMobile = candidate.c_contact || 'N/A';
  const candidateAltMobile = candidate.c_alt_contact || candidate.c_whatsapp || 'N/A';
  const candidateAddress = candidate.c_current_address1 || 'N/A';

  // 2. Item Info (Course/Test Series/Notes)
  let itemTitle = 'N/A';
  let itemPrice = 'N/A';
  let itemOfferPrice = 'N/A';
  let itemDescription = 'N/A';

  const courseObj = data.course_id;
  const testPackageObj = data.test_package_id || data.package_id;
  const notesObj = data.notes_id;

  if (courseObj) {
    itemTitle = courseObj.m_course_title || 'N/A';
    itemPrice = courseObj.m_course_price !== undefined ? `₹${courseObj.m_course_price}` : 'N/A';
    itemOfferPrice = courseObj.m_course_offer_price !== undefined ? `₹${courseObj.m_course_offer_price}` : 'N/A';
    itemDescription = courseObj.m_course_description || courseObj.m_course_intro || 'No description provided.';
  } else if (testPackageObj) {
    itemTitle = testPackageObj.m_package_title || 'N/A';
    itemPrice = testPackageObj.m_package_price !== undefined ? `₹${testPackageObj.m_package_price}` : 'N/A';
    itemOfferPrice = testPackageObj.m_package_offer_price !== undefined ? `₹${testPackageObj.m_package_offer_price}` : 'N/A';
    itemDescription = testPackageObj.m_package_description || testPackageObj.m_package_intro || 'No description provided.';
  } else if (notesObj) {
    itemTitle = notesObj.notes_name || 'N/A';
    itemPrice = notesObj.notes_price !== undefined ? `₹${notesObj.notes_price}` : 'N/A';
    itemOfferPrice = notesObj.notes_offer_price !== undefined ? `₹${notesObj.notes_offer_price}` : 'N/A';
    itemDescription = notesObj.notes_description || notesObj.notes_intro || 'No description provided.';
  }

  // 3. Registration Details
  const regDate = formatDate(data.enrolled_on || data.enrolled_at || data.registration_date || data.added_on);
  const accessType = data.access_type || 'N/A';
  const expiryDate = formatDate(data.expiry_date);
  const remainingDays = data.remaining_days !== null && data.remaining_days !== undefined ? `${data.remaining_days} Days` : 'N/A';
  const status = data.status || data.enrollment_data?.status || data.enrollment_data?.access_status || data.enrollment_data?.enrollment_status || 'N/A';

  // 4. Payment Details
  const amount = data.amount || data.original_amount;
  const payableAmount = data.payable_amount;
  const discountAmount = data.discount_amount;
  const paymentMode = data.payment_mode || 'N/A';
  const transactionId = data.transaction_id || 'N/A';
  const couponCode = data.coupon_code || 'N/A';

  const isWishlist = type.toLowerCase().includes('wishlist');

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 capitalize">
            {type} {isWishlist ? 'Details' : 'Purchase Details'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors text-xl font-bold">
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-5 pr-1">
          
          {/* Candidate Info */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white">
            <h4 className="text-xs font-bold tracking-wider text-indigo-600 uppercase mb-4">
              CANDIDATE INFORMATION
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <div className="text-xs text-slate-400 font-semibold mb-0.5">Name</div>
                <div className="text-sm text-slate-800 font-bold">{candidateName}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold mb-0.5">Email</div>
                <div className="text-sm text-slate-800 font-bold break-all">{candidateEmail}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold mb-0.5">Mobile</div>
                <div className="text-sm text-slate-800 font-bold">{candidateMobile}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold mb-0.5">Alternate Mobile</div>
                <div className="text-sm text-slate-800 font-bold">{candidateAltMobile}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs text-slate-400 font-semibold mb-0.5">Address</div>
                <div className="text-sm text-slate-800 font-bold">{candidateAddress}</div>
              </div>
            </div>
          </div>

          {/* Item Info */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white">
            <h4 className="text-xs font-bold tracking-wider text-emerald-700 uppercase mb-4">
              {type.toUpperCase().includes('COURSE') ? 'COURSE INFORMATION' : type.toUpperCase().includes('TEST') ? 'TEST SERIES INFORMATION' : 'NOTES INFORMATION'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <div className="md:col-span-2">
                <div className="text-xs text-slate-400 font-semibold mb-0.5">Title</div>
                <div className="text-sm text-slate-800 font-bold">{itemTitle}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold mb-0.5">Price</div>
                <div className="text-sm text-slate-800 font-bold">{itemPrice}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold mb-0.5">Offer Price</div>
                <div className="text-sm text-slate-800 font-bold">{itemOfferPrice}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs text-slate-400 font-semibold mb-0.5">Description</div>
                <div className="text-sm text-slate-800 font-medium whitespace-pre-line mt-1 bg-slate-50 p-3 rounded border border-slate-100 text-justify max-h-36 overflow-y-auto">
                  {itemDescription}
                </div>
              </div>
            </div>
          </div>

          {/* Registration Details & Payment Details in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Registration Details */}
            <div className="border border-slate-200 rounded-xl p-5 bg-white">
              <h4 className="text-xs font-bold tracking-wider text-indigo-600 uppercase mb-4">
                REGISTRATION DETAILS
              </h4>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between border-b border-slate-50 pb-1.5">
                  <span className="text-xs text-slate-400 font-semibold">{isWishlist ? 'Added On' : 'Enrolled On'}</span>
                  <span className="text-sm text-slate-800 font-bold">{regDate}</span>
                </div>
                {!isWishlist && (
                  <>
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-xs text-slate-400 font-semibold">Access Type</span>
                      <span className="text-sm text-slate-800 font-bold capitalize">{accessType}</span>
                    </div>
                    {accessType !== 'lifetime' && (
                      <>
                        <div className="flex justify-between border-b border-slate-50 pb-1.5">
                          <span className="text-xs text-slate-400 font-semibold">Expiry Date</span>
                          <span className="text-sm text-slate-800 font-bold">{expiryDate}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-1.5">
                          <span className="text-xs text-slate-400 font-semibold">Remaining Days</span>
                          <span className="text-sm text-slate-800 font-bold">{remainingDays}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between pb-0.5">
                      <span className="text-xs text-slate-400 font-semibold">Status</span>
                      <span className="text-sm text-slate-800 font-bold capitalize">{status}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Payment Details (Only show if not a wishlist item) */}
            {!isWishlist && (
              <div className="border border-slate-200 rounded-xl p-5 bg-white">
                <h4 className="text-xs font-bold tracking-wider text-emerald-700 uppercase mb-4">
                  PAYMENT DETAILS
                </h4>
                <div className="flex flex-col gap-3">
                  {amount !== undefined && (
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-xs text-slate-400 font-semibold">Original Amount</span>
                      <span className="text-sm text-slate-800 font-bold">₹{amount}</span>
                    </div>
                  )}
                  {payableAmount !== undefined && (
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-xs text-slate-400 font-semibold">Payable Amount</span>
                      <span className="text-sm text-slate-800 font-bold">₹{payableAmount}</span>
                    </div>
                  )}
                  {discountAmount !== undefined && (
                    <div className="flex justify-between border-b border-slate-50 pb-1.5">
                      <span className="text-xs text-slate-400 font-semibold">Discount</span>
                      <span className="text-sm text-slate-800 font-bold">₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span className="text-xs text-slate-400 font-semibold">Payment Mode</span>
                    <span className="text-sm text-slate-800 font-bold uppercase">{paymentMode}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span className="text-xs text-slate-400 font-semibold">Transaction ID</span>
                    <span className="text-sm text-slate-800 font-bold break-all">{transactionId}</span>
                  </div>
                  {couponCode && couponCode !== 'N/A' && (
                    <div className="flex justify-between pb-0.5">
                      <span className="text-xs text-slate-400 font-semibold">Coupon</span>
                      <span className="text-sm text-slate-800 font-bold uppercase">{couponCode}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button 
            onClick={onClose} 
            className="bg-[#f0f4f9] text-slate-700 hover:bg-[#e1e9f4] px-6 py-2.5 rounded-full font-bold text-sm transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}
