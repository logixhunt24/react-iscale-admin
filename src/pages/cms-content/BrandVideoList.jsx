import { useState, useEffect } from 'react'
import { Edit2, Trash2, Eye, EyeOff, X } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import ThemeButton from '../../components/common/ThemeButton'
import CardHeader from '../../components/ui/CardHeader'

export default function BrandVideoList() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentVideoUrl, setCurrentVideoUrl] = useState('')

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true); 
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/brand-video/all`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data && response.data.data) {
        setData(response.data.data)
      } else {
        setData([])
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!await window.customConfirm('Are you sure you want to delete this brand video?')) return
    try {
      const token = localStorage.getItem('token')
      let url = `${BASE_URL}/myadmin/brand-video/delete/${id}`
      const config = { headers: { Authorization: `Bearer ${token}` } }
      try {
        await axios.delete(url, config)
      } catch(e) {
        if (e.response?.status === 404) {
          // try alternative delete route
          await axios.delete(`${BASE_URL}/myadmin/brand-video/${id}`, config)
        } else throw e
      }
      fetchVideos()
    } catch (error) {
      console.error('Delete failed:', error)
      await window.customAlert(error.response?.data?.message || 'Failed to delete')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const url = `${BASE_URL}/myadmin/brand-video/status/${id}`
      const config = { headers: { Authorization: `Bearer ${token}` } }
      try { await axios.put(url, {}, config) } catch (err) {
        if (err.response?.status === 404) {
          try { await axios.post(url, {}, config) } catch (err2) {
            if (err2.response?.status === 404) {
              try { await axios.patch(url, {}, config) } catch (err3) {
                if (err3.response?.status === 404) {
                  await axios.get(url, config)
                } else throw err3;
              }
            } else throw err2;
          }
        } else throw err;
      }
      fetchVideos()
    } catch (error) {
      console.error('Status toggle failed:', error)
      if (error.response?.status === 404) {
        await window.customAlert("Status API Endpoint Not Found (404). Please ask your backend developer to verify the route for toggling status.")
      } else {
        await window.customAlert(error.response?.data?.message || 'Failed to update status')
      }
    }
  }

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  const getField = (row, fieldNames) => {
    for (const name of fieldNames) {
      if (row[name] !== undefined && row[name] !== null) return row[name]
    }
    return '-'
  }

  // Extract YouTube ID safely
  const getYouTubeId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Extract Vimeo ID safely
  const getVimeoId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const match = url.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i);
    return match ? match[1] : null;
  };

  // Construct local video URL
  const getLocalVideoUrl = (videoFile) => {
    if (!videoFile) return null;
    let normalized = videoFile.replace(/\\/g, '/');
    if (normalized.startsWith('src/')) {
      normalized = normalized.substring(4);
    }
    const baseUrlStripped = BASE_URL.replace(/\/api$/, '');
    return `${baseUrlStripped}/${normalized}`;
  };

  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    const name = getField(row, ['name', 'title', 'brand_video_name', 'bv_name', 'm_bv_name']);
    const url = getField(row, ['url', 'video_url', 'link', 'm_bv_url', 'bv_url']);
    
    const searchLower = searchTerm.toLowerCase();
    
    return (
      String(name).toLowerCase().includes(searchLower) ||
      String(url).toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastEntry = currentPage * entriesPerPage
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry)
  const TOTAL_ENTRIES = filteredData.length

  const handleViewClick = (url) => {
    setCurrentVideoUrl(url)
    setIsModalOpen(true)
  }

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 overflow-hidden flex flex-col h-full w-full">
        <CardHeader title="Brand Videos List">
          <ThemeButton variant="white-add" to={'/master/brand-video/add'}>
            + Add New
          </ThemeButton>
        </CardHeader>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-800">Show</span>
                <select 
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                  className="border border-slate-300 bg-[#f6f6ff] text-slate-700 rounded px-2 py-1 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-slate-800">Entries</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Search videos..."
                value={searchTerm}
                onChange={async (e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-slate-300 bg-[#f6f6ff] text-slate-700 rounded-full px-4 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] w-64"
              />
            </div>
          </div>

          <div className="overflow-auto border border-slate-200 rounded-lg flex-1">
            <table className="w-full text-left text-sm text-slate-800">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 whitespace-nowrap">S.No.</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 whitespace-nowrap">Video ( 1920x1080 )</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 whitespace-nowrap text-center">URL</th>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 whitespace-nowrap text-center">Status</th>
                  <th className="px-4 py-3 font-bold whitespace-nowrap text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8">Loading brand videos...</td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8">No brand videos found</td>
                  </tr>
                ) : currentEntries.length === 0 && searchTerm ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8">No matching brand videos found</td>
                  </tr>
                ) : (
                  currentEntries.map((row, index) => {
                    const id = row._id || row.id;
                    const sno = indexOfFirstEntry + index + 1;
                    const name = getField(row, ['name', 'title', 'brand_video_name', 'bv_name', 'm_bv_name']);
                    const url = getField(row, ['url', 'video_url', 'link', 'm_bv_url', 'bv_url']);
                    const statusStr = getField(row, ['status', 'm_bv_status', 'bv_status']);
                    const videoFile = row.video_file || null;
                    
                    const isActive = String(statusStr).toLowerCase() === 'active' || String(statusStr).toLowerCase() === 'true' || statusStr === 1;

                    const ytId = getYouTubeId(url);
                    const vimeoId = getVimeoId(url);
                    const localVideo = getLocalVideoUrl(videoFile);

                    return (
                      <tr key={id} className="border-b border-slate-200 hover:bg-slate-50 bg-[#f6f6ff] transition-colors">
                        <td className="px-4 py-4 border-r border-slate-200 align-middle text-center">{sno}</td>
                        <td className="px-4 py-4 border-r border-slate-200 align-middle font-bold text-[#144f36]">{name}</td>
                        <td className="px-4 py-4 border-r border-slate-200 align-middle">
                          {ytId ? (
                            <div className="w-[200px] h-[112px] bg-slate-900 rounded overflow-hidden relative">
                              <img 
                                src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} 
                                alt="Video thumbnail"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : vimeoId ? (
                            <div className="w-[200px] h-[112px] bg-slate-900 rounded overflow-hidden relative">
                              <iframe 
                                src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`} 
                                className="w-full h-full" 
                                frameBorder="0" 
                                allow="autoplay; fullscreen; picture-in-picture" 
                                allowFullScreen
                              ></iframe>
                            </div>
                          ) : localVideo ? (
                            <div className="w-[200px] h-[112px] bg-slate-900 rounded overflow-hidden relative">
                              <video src={localVideo} className="w-full h-full object-cover" controls muted />
                            </div>
                          ) : (
                            <div className="w-[200px] h-[112px] bg-slate-100 flex items-center justify-center rounded text-slate-400 text-xs text-center p-2 border border-dashed border-slate-300">
                              No Preview
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 border-r border-slate-200 align-middle text-center">
                          {url && url !== '-' ? (
                            <button 
                              onClick={() => handleViewClick(url)}
                              className="bg-[#337ab7] text-white px-5 py-1.5 rounded font-bold hover:bg-[#286090] transition-colors shadow-sm"
                            >
                              View
                            </button>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-4 border-r border-slate-200 align-middle text-center">
                          <button 
                            onClick={() => handleToggleStatus(id)}
                            className={`text-white px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${isActive ? 'bg-[#144f36] hover:bg-[#0f3d2a]' : 'bg-red-500 hover:bg-red-600'}`}
                          >
                            {isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-4 py-4 align-middle">
                          <div className="flex gap-2 justify-center">
                            <Link 
                              to={`/master/brand-video/edit/${id}`} state={{ videoData: row }}
                              className="inline-block bg-orange-500 text-white p-1.5 rounded hover:bg-orange-600 transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </Link>
                            <button 
                              onClick={() => handleDelete(id)}
                              className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-slate-800">
            <div>Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, TOTAL_ENTRIES)} of {TOTAL_ENTRIES} entries</div>
            <div className="flex space-x-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100">1</button>
            </div>
          </div>
        </div>
      </div>

      {/* URL View Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-bold text-lg text-slate-800">URL</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24}/>
              </button>
            </div>
            <div className="p-6 bg-slate-50 flex-1">
              <p className="text-sm font-bold text-slate-700 mb-4 break-all">{currentVideoUrl}</p>
              <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-inner">
                {(() => {
                  const ytId = getYouTubeId(currentVideoUrl);
                  const vimId = getVimeoId(currentVideoUrl);
                  if (ytId) {
                    return <iframe src={`https://www.youtube.com/embed/${ytId}`} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
                  } else if (vimId) {
                    return <iframe src={`https://player.vimeo.com/video/${vimId}`} className="w-full h-full" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
                  } else {
                    return <div className="text-white flex items-center justify-center h-full text-sm">Unsupported Video URL Format</div>
                  }
                })()}
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end bg-white">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg font-bold hover:bg-slate-300 transition-colors"
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
