import { useState, useEffect } from 'react'
import { Eye, Edit2, Trash2, Book, X, Check } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import { getImageUrl } from '../../utils/imageUtils'
import ThemeButton from '../../components/common/ThemeButton'
import CardHeader from '../../components/ui/CardHeader'
export default function AllCourses() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [totalEntries, setTotalEntries] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [categoriesDropdown, setCategoriesDropdown] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentVideoUrl, setCurrentVideoUrl] = useState('')

  // Draft text per course id for the inline "Card Badge" editor below,
  // separate from `courses` so typing doesn't need a round-trip per
  // keystroke - only saved (and courses re-synced) on click.
  const [badgeDrafts, setBadgeDrafts] = useState({})

  const getYouTubeId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getVimeoId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const match = url.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i);
    return match ? match[1] : null;
  };

  const getVideoLink = (row) => {
    // Explicitly check known field names first
    const explicit = row.m_course_video_link || row.video_link || row.course_video_link || row.videoLink || row.m_video_link;
    if (explicit && typeof explicit === 'string' && explicit.trim()) return explicit.trim();

    // Dynamically scan ALL fields for any that look like a video URL
    for (const key of Object.keys(row)) {
      const val = row[key];
      if (typeof val === 'string' && val.trim()) {
        const lk = key.toLowerCase();
        // field name contains "video" or "link"
        if ((lk.includes('video') || lk.includes('link')) && (val.startsWith('http') || val.startsWith('www'))) {
          return val.trim();
        }
      }
    }
    return '';
  };

  const handleWatchVideo = async (row) => {
    const videoLink = getVideoLink(row);
    // Log all fields to help debug what the API returns
    const videoRelatedFields = Object.entries(row).filter(([k]) => {
      const lk = k.toLowerCase();
      return lk.includes('video') || lk.includes('link');
    });
    console.log('=== Watch Video clicked: ' + (row.title || row.m_course_title) + ' ===');
    console.log('Video-related fields:', Object.fromEntries(videoRelatedFields));
    console.log('Resolved video link:', videoLink);
    if (!videoLink || typeof videoLink !== 'string' || !videoLink.trim()) {
      await window.customAlert('❌ Video Not Found.', {
        title: '',
        iconContainerClass: 'w-20 h-20 rounded-full border-[4px] border-[#f27474] flex items-center justify-center mb-4 text-[#f27474]',
        icon: <X className="w-10 h-10 stroke-[3]" />,
        btnClass: 'bg-[#3fc3ee] hover:bg-[#2db6e3] text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3fc3ee]/20'
      });
      return;
    }
    setCurrentVideoUrl(videoLink);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchCategoriesDropdown()
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [currentPage, entriesPerPage, searchTerm, categoryFilter])

const fetchCategoriesDropdown = async () => {
  try {
    const token = localStorage.getItem('token')

    const response = await axios.get(
      `${BASE_URL}/myadmin/category/all-categories?search=&page=1&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (response.data?.status) {
      setCategoriesDropdown(response.data.data || [])
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

  const fetchCourses = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${BASE_URL}/myadmin/course/all-courses?search=${searchTerm}&limit=${entriesPerPage}&page=${currentPage}&category=${categoryFilter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (response.data && response.data.status) {
        const allCourses = response.data.data || [];
        if (allCourses.length > 0) {
          console.log("=== FIRST COURSE ALL KEYS ===", Object.keys(allCourses[0]));
          console.log("=== FIRST COURSE RAW DATA ===", allCourses[0]);
        }
        setCourses(allCourses)
        setBadgeDrafts(Object.fromEntries(allCourses.map((c) => [c._id, c.badge_text || ''])))
        setTotalEntries(response.data.pagination?.total || 0)
        setTotalPages(response.data.pagination?.totalPages || 1)
      } else {
        setCourses([])
        setTotalEntries(0)
        setTotalPages(1)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleLms = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.patch(
        `${BASE_URL}/myadmin/course/lms-status/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data?.status) {
        fetchCourses()
      } else {
        await window.customAlert(response.data?.message || 'Failed to update LMS status')
      }
    } catch (error) {
      await window.customAlert(error.response?.data?.message || 'Error updating LMS status')
    }
  }

  // Free-text badge shown on the nav mega-menu's course card (e.g.
  // "Popular", "New", "50% Off") - any text, not a fixed label. No
  // dedicated endpoint, so this reuses update-course with just the one
  // field - updateCourse only writes fields actually present in the body,
  // so it's a safe partial update.
  const handleSaveBadgeText = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${BASE_URL}/myadmin/course/update-course/${id}`,
        { m_course_badge_text: badgeDrafts[id] ?? '' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data?.status) {
        fetchCourses()
      } else {
        await window.customAlert(response.data?.message || 'Failed to update card badge')
      }
    } catch (error) {
      await window.customAlert(error.response?.data?.message || 'Error updating card badge')
    }
  }

  const handleDelete = async (id) => {
  if (!await window.customConfirm('Are you sure you want to delete this course?')) {
    return
  }

  try {
    const token = localStorage.getItem('token')

    const response = await axios.delete(
      `${BASE_URL}/myadmin/course/delete-course/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    console.log('DELETE COURSE RESPONSE:', response.data)

    if (response.data?.status) {
      await window.customAlert(response.data.message || 'Course deleted successfully')
      fetchCourses()
    } else {
      await window.customAlert('Delete failed')
    }
  } catch (error) {
    console.error('DELETE COURSE ERROR:', error)

    if (error.response) {
      console.log(error.response.data)
      await window.customAlert(error.response.data?.message || 'Delete failed')
    } else {
      await window.customAlert('Network Error')
    }
  }
}

  const TOTAL_ENTRIES = totalEntries
  const TOTAL_PAGES = totalPages
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = Math.min(startIndex + entriesPerPage, TOTAL_ENTRIES)
  const currentData = courses

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < TOTAL_PAGES) setCurrentPage(currentPage + 1)
  }

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(TOTAL_PAGES, startPage + 4)
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4)
    }
    const pages = []
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden flex flex-col h-full">
        <CardHeader title="All Courses List">
          <ThemeButton variant="white-add" to={'/courses/all/add'}>
            + Add New Course
          </ThemeButton>
        </CardHeader>

        <div className="p-4 flex-1 flex flex-col min-h-0">
          <div className="flex flex-col xl:flex-row justify-between xl:items-center mb-4 shrink-0 gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 bg-white dark:bg-[#1f1b2e] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1f1b2e] shadow-sm hover:border-indigo-300 transition-colors">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Show</span>
                <select 
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                  className="bg-transparent text-slate-800 dark:text-slate-200 font-bold text-sm outline-none cursor-pointer focus:text-[#144f36] transition-colors"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Entries</span>
              </div>
              <div className="flex gap-0 border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded overflow-hidden flex-wrap">
                {[
                  { label: 'Copy', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#144f36]"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> },
                  { label: 'Excel', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg> },
                  { label: 'PDF', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg> },
                  { label: 'Print', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg> }
                ].map(btn => (
                  <button 
                    key={btn.label} 
                    title={btn.label} 
                    onClick={async () => {
                      if (btn.label === 'Print') {
                        window.print();
                      } else if (btn.label === 'Excel' || btn.label === 'Copy' || btn.label === 'PDF') {
                        const table = document.querySelector('table');
                        if (!table) return;
                        let csv = '';
                        const rows = table.querySelectorAll('tr');
                        rows.forEach(row => {
                          const cols = row.querySelectorAll('td, th');
                          const rowData = Array.from(cols).map(c => '"' + c.innerText.replace(/"/g, '""') + '"');
                          csv += rowData.join(',') + '\n';
                        });
                        if (btn.label === 'Copy') {
                          navigator.clipboard.writeText(csv);
                          await window.customAlert('Table data copied to clipboard!');
                        } else {
                          const blob = new Blob([csv], { type: 'text/csv' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'export.csv';
                          a.click();
                        }
                      }
                    }}
                    className="px-3 py-1.5 bg-[#f6f6ff] dark:bg-[#1f1b2e] hover:bg-slate-50 dark:bg-[#1f1b2e]/50 border-r border-slate-300 dark:border-slate-600 last:border-r-0 flex items-center justify-center">
                    {btn.icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] w-full sm:w-48"
              >
                <option value="">All Categories</option>
                {categoriesDropdown.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.m_category_name}</option>
                ))}
              </select>
              <input 
                type="text" 
                placeholder="Search anything..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-slate-300 dark:border-gray-700 bg-white dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded-full px-5 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all w-full sm:w-64 flex-1 hover:border-indigo-300"
              />
            </div>
          </div>

          <div className="overflow-auto border border-slate-200 dark:border-[#1f1b2e] flex-1 min-h-0">
            <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
              <thead className="bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">S.No.</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap min-w-[150px]">Title</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Code</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Category</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Banner</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Video</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Course Type</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Course Price</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Offer Price</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Faq</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Features</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Tools</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Subjects</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Test Package</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Training Highlights</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Status</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">LMS</th>
                  <th className="px-3 py-3 font-bold border-r border-slate-200 dark:border-gray-800/50 whitespace-nowrap">Card Badge</th>
                  <th className="px-3 py-3 font-bold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="18" className="text-center py-8">Loading...</td>
                  </tr>
                ) : currentData.map((row, index) => (
                  <tr key={row._id} className="border-b border-slate-200 dark:border-gray-800/50 hover:bg-[#eaf3f8]/60 dark:hover:bg-indigo-900/20 transition-all duration-200 group">
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{startIndex + index + 1}</td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle text-[#144f36] font-medium">
                      <div className="w-40 break-words">{row.title}</div>
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.code || 'N/A'}</td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.category || 'N/A'}</td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                      {row.banner ? (
                        <img src={getImageUrl(row.banner)} alt="Banner" className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-200 border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] text-center overflow-hidden rounded">
                          Img
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle whitespace-nowrap text-center">
                      {(() => {
                        const videoLink = getVideoLink(row);
                        const ytId = getYouTubeId(videoLink);
                        return (
                          <div 
                            onClick={() => handleWatchVideo(row)}
                            className="flex items-center gap-2 cursor-pointer group w-fit mx-auto"
                          >
                            {ytId ? (
                              <div className="relative w-12 h-8 rounded border border-slate-200 dark:border-gray-700 overflow-hidden shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105">
                                <img 
                                  src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover" 
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/45 transition-colors">
                                  <svg className="w-3.5 h-3.5 text-white fill-current drop-shadow" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                            ) : null}
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-[#144f36] dark:group-hover:text-emerald-400 underline decoration-dotted transition-colors">
                              Watch Video
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.course_type}</td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.price}</td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">{row.offer_price}</td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                      <Link to={`/courses/faq/${row._id}`} className="bg-[#144f36] text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-[#0f3d2a] transition-colors flex items-center gap-1.5 whitespace-nowrap">
                        <Book size={12} /> Faq
                      </Link>
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                      <Link to={`/courses/features/${row._id}`} className="bg-[#144f36] text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-[#0f3d2a] transition-colors flex items-center gap-1.5 whitespace-nowrap">
                        <Book size={12} /> Features
                      </Link>
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                      <Link to={`/courses/tools/${row._id}`} className="bg-[#144f36] text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-[#0f3d2a] transition-colors flex items-center gap-1.5 whitespace-nowrap">
                        <Book size={12} /> Tools
                      </Link>
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                      <Link to={`/courses/subjects/${row._id}`} className="bg-[#144f36] text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-[#0f3d2a] transition-colors flex items-center gap-1.5 whitespace-nowrap">
                        <Book size={12} /> Subject
                      </Link>
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                      <Link to={`/courses/test-series/${row._id}`} state={{ courseTitle: row.title }} className="bg-[#144f36] text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-[#0f3d2a] transition-colors flex items-center gap-1.5 whitespace-nowrap">
                        <Book size={12} /> Test Package
                      </Link>
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                      <Link to={`/courses/training-highlights/${row._id}`} state={{ courseTitle: row.title }} className="bg-[#144f36] text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-[#0f3d2a] transition-colors flex items-center gap-1.5 whitespace-nowrap" title="Manage this course's Course Highlights section">
                        <Book size={12} /> Highlights
                      </Link>
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                      {(() => {
                        let s = row.m_course_status ?? row.is_active ?? row.course_status ?? row.isActive ?? row.active;
                        
                        // Default to Active if the backend didn't send a proper status field, ignoring the bugged row.status
                        let isActive = true;
                        if (s !== undefined && s !== null) {
                           isActive = s === 1 || s === '1' || s === true || String(s).toLowerCase() === 'active';
                        }
                        
                        return (
                          <span className={`px-3 py-1 rounded-full text-white text-xs whitespace-nowrap ${isActive ? 'bg-[#144f36]' : 'bg-gray-500'}`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                      <button
                        onClick={() => handleToggleLms(row._id)}
                        className={`px-3 py-1 rounded-full text-white text-xs whitespace-nowrap cursor-pointer transition-opacity hover:opacity-80 ${row.m_course_lms_status === 1 ? 'bg-[#144f36]' : 'bg-gray-500'}`}
                        title={`Click to ${row.m_course_lms_status === 1 ? 'remove from' : 'add to'} the LMS course list`}
                      >
                        {row.m_course_lms_status === 1 ? 'On LMS' : 'Not on LMS'}
                      </button>
                    </td>
                    <td className="px-3 py-3 border-r border-slate-200 dark:border-gray-800/50 align-middle">
                      <div className="flex items-center gap-1.5 w-36">
                        <input
                          type="text"
                          maxLength={40}
                          placeholder="e.g. Popular, New"
                          value={badgeDrafts[row._id] ?? ''}
                          onChange={(e) => setBadgeDrafts((prev) => ({ ...prev, [row._id]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveBadgeText(row._id) }}
                          className="w-full border border-slate-300 dark:border-gray-700 rounded px-2 py-1 text-xs outline-none bg-white dark:bg-[#13111c] focus:border-[#144f36]"
                        />
                        {(badgeDrafts[row._id] ?? '') !== (row.badge_text || '') && (
                          <button
                            onClick={() => handleSaveBadgeText(row._id)}
                            title="Save badge text"
                            className="bg-[#144f36] text-white p-1 rounded hover:bg-[#0f3d2a] transition-colors shrink-0"
                          >
                            <Check size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <div className="flex gap-1.5">
                      <Link to={`/courses/view/${row._id}`} state={{ courseData: row }} className="inline-block bg-[#144f36] text-white p-1.5 rounded hover:bg-[#0f3d2a] transition-colors">
                        <Eye size={14} />
                      </Link>
                        <Link to={`/courses/all/edit/${row._id || row.id}`} state={{ courseData: row }} className="inline-block bg-[#d87025] text-white p-1.5 rounded hover:bg-[#c2621f] transition-colors">
                          <Edit2 size={14} />
                        </Link>
                        <button onClick={() => handleDelete(row._id || row.id)} className="bg-red-600 text-white p-1.5 rounded hover:bg-red-700 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentData.length === 0 && (
                  <tr>
                    <td colSpan="18" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No Data Available In Table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-slate-800 dark:text-slate-200">
            <div>
              Showing {TOTAL_ENTRIES === 0 ? 0 : startIndex + 1} to {endIndex} of {TOTAL_ENTRIES} entries
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded ${currentPage === 1 ? 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1f1b2e]' : 'text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:bg-[#1f1b2e]/50'}`}
              >
                Previous
              </button>
              {getPageNumbers().map(pageNum => (
                <button 
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === pageNum ? 'bg-slate-50 dark:bg-[#13111c] text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-gray-800' : 'hover:bg-slate-50 dark:bg-[#1f1b2e]/50 text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-300 dark:border-[#1f1b2e]'}`}
                >
                  {pageNum}
                </button>
              ))}
              <button 
                onClick={handleNext}
                disabled={currentPage === TOTAL_PAGES}
                className={`px-3 py-1 border rounded ${currentPage === TOTAL_PAGES ? 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1f1b2e]' : 'text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:bg-[#1f1b2e]/50'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video View Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#13111c] border border-slate-100 dark:border-[#1f1b2e] rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-gray-800">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                Video
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X size={24}/>
              </button>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex-1">
              <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-inner flex items-center justify-center">
                {(() => {
                  const ytId = getYouTubeId(currentVideoUrl);
                  const vimId = getVimeoId(currentVideoUrl);
                  if (ytId) {
                    return <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1`} className="w-full h-full" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
                  } else if (vimId) {
                    return <iframe src={`https://player.vimeo.com/video/${vimId}?autoplay=1`} className="w-full h-full" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
                  } else {
                    return <video src={currentVideoUrl} className="w-full h-full object-contain" controls autoPlay />
                  }
                })()}
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-gray-800 flex justify-end bg-white dark:bg-[#13111c]">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-6 py-2 rounded-lg font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


