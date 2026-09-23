import * as Icons from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

const getInitialType = (type) => {
  const t = type !== undefined && type !== null ? String(type) : '';
  if (t === '1' || t === 'Video') return 'Video';
  if (t === '2' || t === 'Document' || t === 'PDF') return 'PDF';
  if (t === '3' || t === 'Link') return 'Link';
  return '';
}

// Moved above detectVideoType to avoid hoisting issue
const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Returns "1" (YouTube) or "2" (VdoCipher) — matches DB format
const detectVideoType = (videoId, savedType) => {
  if (videoId && videoId.trim()) {
    const ytId = getYouTubeId(videoId.trim());
    return ytId ? "1" : "2";
  }
  // No video ID — use savedType from DB directly
  return savedType !== undefined && savedType !== null ? String(savedType) : "2";
}

export default function AddCourseTopic() {
  const navigate = useNavigate()
  const { subjectId } = useParams()
  const location = useLocation()
  
  const editTopic = location.state?.editTopic
  const isEditing = !!editTopic
  const courseId = editTopic?.ml_course || new URLSearchParams(location.search).get('course') || location.state?.courseId || localStorage.getItem('currentCourseId')

  console.log("COURSE ID RECEIVED:", courseId)
  console.log("editTopic object on load:", editTopic)
  console.log("editTopic keys on load:", Object.keys(editTopic || {}))

  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [courseTitle, setCourseTitle] = useState(location.state?.courseTitle || '')

  // Symmetrical fallbacks so the Video ID is populated when editing, checking all DB variations
  const initialVideoId = 
    editTopic?.ml_video_id || 
    editTopic?.video_id || 
    editTopic?.ml_vdocipher_id || 
    editTopic?.vdocipher_id || 
    editTopic?.video || 
    editTopic?.video_url || 
    editTopic?.video_link || 
    editTopic?.url || 
    editTopic?.link || 
    '';

  const initialVdoCipherId = 
    editTopic?.ml_vdocipher_id || 
    editTopic?.vdocipher_id || 
    editTopic?.ml_video_id || 
    editTopic?.video_id || 
    initialVideoId || 
    '';

  const [formData, setFormData] = useState({
    ml_subject: editTopic?.ml_subject || subjectId || '',
    ml_title: editTopic?.ml_title || '',
    ml_code: editTopic?.ml_code || '',
    ml_type: getInitialType(editTopic?.ml_type),
    ml_stype: editTopic?.ml_stype || 'Topic',
    ml_video_id: initialVideoId,
    ml_vdocipher_id: initialVdoCipherId,
    ml_status: editTopic?.ml_status !== undefined ? (
      (editTopic.ml_status === 0 || editTopic.ml_status === "0" || editTopic.ml_status === false || editTopic.ml_status === "false" || String(editTopic.ml_status).toLowerCase() === "inactive") ? "0" : "1"
    ) : '1',
    ml_hours: editTopic?.ml_hours || '00',
    ml_minutes: editTopic?.ml_minutes || '00',
    ml_seconds: editTopic?.ml_seconds || '00',
    ml_yt_type: detectVideoType(initialVideoId, editTopic?.ml_yt_type),
    ml_pdffile: null,
    ml_link: (String(editTopic?.ml_type) === "3" || editTopic?.ml_type === "Link") ? initialVideoId : '',
    ml_videofile: null
  })

  const fetchCourseTitle = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${BASE_URL}/myadmin/course/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data?.status && response.data.data) {
        setCourseTitle(response.data.data.title || '')
      }
    } catch (error) {
      console.error('Error fetching course details:', error)
    }
  }

  useEffect(() => {
    console.log("COURSE ID FOR SUBJECT API:", courseId)

    if (courseId) {
      fetchSubjects()
      if (!courseTitle) {
        fetchCourseTitle()
      }
    }
  }, [courseId, isEditing, editTopic])

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log(
        "SUBJECT API URL:",
        `${BASE_URL}/myadmin/subject/subject-dropdown?m_course_id=${courseId}`
      )
      const response = await axios.get(`${BASE_URL}/myadmin/subject/subject-dropdown?m_course_id=${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log("SUBJECT API RESPONSE:", response.data)

      if (response.data?.status) {
        setSubjects(response.data.data || [])
        console.log("SUBJECTS LOADED:", response.data.data)
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      if (name === "ml_link") {
        const link = value || '';
        const ytId = getYouTubeId(link);
        if (ytId) {
          updated.ml_video_id = ytId;
          updated.ml_vdocipher_id = "";
          updated.ml_yt_type = "1";
        } else {
          const vdoId = getVdoCipherId(link);
          if (vdoId) {
            updated.ml_video_id = vdoId;
            updated.ml_vdocipher_id = vdoId;
            updated.ml_yt_type = "2";
          }
        }
      }

      if (name === "ml_video_id") {
        updated.ml_video_id = value;

        if (updated.ml_yt_type === "2") {
          updated.ml_vdocipher_id = value;
        } else {
          updated.ml_vdocipher_id = "";
        }
      }

      if (name === "ml_yt_type") {
        updated.ml_yt_type = value;

        if (value === "2") {
          updated.ml_vdocipher_id = updated.ml_video_id;
        } else {
          updated.ml_vdocipher_id = "";
        }
      }

      return updated;
    });
  }

  const getVdoCipherId = (url) => {
    if (/^[a-zA-Z0-9]{32}$/.test(url)) {
      return url;
    }
    const match = url.match(/\/([a-zA-Z0-9]{32})(\/|\?|$)/);
    if (match) return match[1];
    return null;
  }

  const handleEmbed = () => {
    const link = formData.ml_link || '';
    if (!link.trim()) {
      window.customAlert('Please enter a link first');
      return;
    }

    const ytId = getYouTubeId(link);
    if (ytId) {
      setFormData(prev => ({
        ...prev,
        ml_video_id: ytId,
        ml_vdocipher_id: "",   // clear VdoCipher ID for YouTube
        ml_yt_type: "1"
      }));
      window.customAlert('Successfully extracted YouTube Video ID: ' + ytId);
      return;
    }

    const vdoId = getVdoCipherId(link);
    if (vdoId) {
      setFormData(prev => ({
        ...prev,
        ml_video_id: vdoId,
        ml_vdocipher_id: vdoId, // also set ml_vdocipher_id for VdoCipher                       
        ml_yt_type: "2"
      }));
      window.customAlert('Successfully extracted VdoCipher Video ID: ' + vdoId);
      return;
    }

    // Default: store the entire link in ml_video_id
    setFormData(prev => ({
      ...prev,
      ml_video_id: link
    }));
    window.customAlert('Link saved to Topic Video ID');
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); 

    try {
      if (!formData.ml_subject) {
        await window.customAlert("Please select a Topic Subject before submitting")
        setLoading(false)
        return
      }

      const token = localStorage.getItem('token')
      const payload = new FormData()
      
      payload.append('ml_title', formData.ml_title || '')
      payload.append('ml_code', formData.ml_code || '')
      
      let rawType = formData.ml_type || '';
      if (!rawType && formData.ml_video_id) {
        rawType = 'Link';
      }
      let payloadType = '2';
      if (rawType === 'Video' || rawType === '1') {
        payloadType = '1';
      } else if (rawType === 'PDF' || rawType === '2') {
        payloadType = '2';
      } else if (rawType === 'Link' || rawType === '3') {
        payloadType = '3';
      } else {
        payloadType = rawType;
      }
      
      payload.append('ml_type', payloadType);
      payload.append('ml_stype', formData.ml_stype || 'Topic');
      
      payload.append('ml_video_id', formData.ml_video_id || '');
      
      payload.append('ml_hours', formData.ml_hours || '00')
      payload.append('ml_minutes', formData.ml_minutes || '00')
      payload.append('ml_seconds', formData.ml_seconds || '00')
      // ml_yt_type is already "1" or "2" — send directly
      console.log("FINAL TYPE =", formData.ml_yt_type);
      payload.append("ml_yt_type", formData.ml_yt_type);

      // Send ml_vdocipher_id only when VdoCipher is selected
      if (formData.ml_yt_type === "2") {
        payload.append("ml_vdocipher_id", formData.ml_vdocipher_id || formData.ml_video_id || "");
        console.log("Sending ml_vdocipher_id:", formData.ml_vdocipher_id || formData.ml_video_id);
      } else {
        payload.append("ml_vdocipher_id", ""); // clear it for YouTube
        console.log("YouTube selected — ml_vdocipher_id cleared");
      }
      console.log("===================");

      if (formData.ml_pdffile) {
        payload.append('ml_pdffile', formData.ml_pdffile);
      }
      if (formData.ml_videofile) {
        payload.append('ml_videofile', formData.ml_videofile);
      }
      
      const rawStatus = (formData.ml_status === "1" || formData.ml_status === 1) ? "1" : "0";
      payload.append('ml_status', rawStatus);
      payload.append('status', rawStatus);
      
      payload.append('ml_subject', formData.ml_subject || '')
      if (courseId) {
        payload.append('m_course_id', courseId)
        payload.append('ml_course', courseId)
        payload.append('course_id', courseId)
      }

      console.log("Submitting payload:");
      for (let pair of payload.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }

      let response
      if (isEditing) {
        response = await axios.put(`${BASE_URL}/myadmin/topics/update-topic/${editTopic._id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      } else {
        response = await axios.post(`${BASE_URL}/myadmin/topics/add-topic`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }

      if (response.data?.status) {
        await window.customAlert(response.data.message || 'Saved successfully')
        navigate(-1)
      } else {
        await window.customAlert(response.data.message || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving topic:', error)
      await window.customAlert(error.response?.data?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#eaf3f8] p-4 sm:p-6 font-sans">
      <div className="bg-white rounded-2xl shadow-md border border-slate-100 w-full overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-[#144f36] rounded-t-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700 pointer-events-none"></div>
          
          <div className="flex items-center relative z-10">
            <div className="w-1.5 h-7 bg-white rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
              {isEditing ? 'Edit Topic' : 'Add New Topic'}
            </h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-6 mt-3 sm:mt-0 text-sm text-white/90 relative z-10">
            <div>
              <span className="font-semibold text-white/70">Category :</span>{' '}
              <span className="text-white font-medium">{location.state?.categoryTitle || 'Cohort Courses'}</span>
            </div>
            {courseTitle && (
              <div>
                <span className="font-semibold text-white/70">Course :</span>{' '}
                <span className="text-white font-medium">{courseTitle}</span>
              </div>
            )}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 bg-white">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Topic Subject */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">Topic Subject</label>
              <select 
                name="ml_subject"
                value={formData.ml_subject}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white"
              >
                <option value="">Select Subject</option>
                {subjects.map(s => (
                  <option key={s._id} value={s._id}>{s.m_subject_title}</option>
                ))}
                {subjects.length === 0 && subjectId && (
                  <option value={subjectId}>Current Subject</option>
                )}
              </select>
            </div>

            {/* Select Type */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">Select Type</label>
              <select 
                name="ml_stype" 
                value={formData.ml_stype} 
                onChange={handleChange} 
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white"
              >
                <option value="Topic">Topic</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">Duration : HH</label>
                  <input 
                    type="text" 
                    name="ml_hours"
                    value={formData.ml_hours}
                    onChange={handleChange}
                    placeholder="00"
                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">: MM</label>
                  <input 
                    type="text" 
                    name="ml_minutes"
                    value={formData.ml_minutes}
                    onChange={handleChange}
                    placeholder="00"
                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1.5">: SS</label>
                  <input 
                    type="text" 
                    name="ml_seconds"
                    value={formData.ml_seconds}
                    onChange={handleChange}
                    placeholder="00"
                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Topic Title */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">Topic Title</label>
              <input 
                type="text" 
                name="ml_title"
                value={formData.ml_title}
                onChange={handleChange}
                placeholder="Enter Topic Title" 
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white" 
                required 
              />
            </div>

            {/* Topic Code */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">Topic Code</label>
              <input 
                type="text" 
                name="ml_code"
                value={formData.ml_code}
                onChange={handleChange}
                placeholder="Enter Topic Code" 
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white" 
              />
            </div>

            {/* Topic Type and Dynamic Topic Field */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              {/* Topic Type */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">Topic Type</label>
                <select 
                  name="ml_type" 
                  value={formData.ml_type} 
                  onChange={handleChange} 
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white"
                >
                  <option value="">Select Topic Type</option>
                  <option value="Link">Link</option>
                  <option value="Video">Video</option>
                  <option value="PDF">PDF</option>
                </select>
              </div>

              {/* Dynamic Field next to Topic Type */}
              <div>
                {formData.ml_type === 'Link' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">Topic</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        name="ml_link"
                        value={formData.ml_link || ''}
                        onChange={handleChange}
                        placeholder="Enter Topic Link" 
                        className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white" 
                      />
                      {/* <button
                        type="button"
                        onClick={handleEmbed}
                        className="bg-[#144f36] hover:bg-[#0f3d2a] text-white px-4 py-2 rounded text-sm font-bold transition-colors shadow-sm whitespace-nowrap"
                      >
                        Embed
                      </button> */}
                    </div>
                  </div>
                )}

                {formData.ml_type === 'Video' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">Topic</label>
                    <div className="relative">
                      <input
                        type="file"
                        id="video-upload"
                        accept="video/*"
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            ml_videofile: e.target.files[0]
                          }))
                        }
                        className="hidden"
                      />
                      <label
                        htmlFor="video-upload"
                        className="w-full bg-[#144f36] hover:bg-[#0f3d2a] text-white text-center py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors cursor-pointer block whitespace-nowrap overflow-hidden text-ellipsis border border-[#144f36]"
                      >
                        {formData.ml_videofile ? formData.ml_videofile.name : 'Select File'}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* YouTube vs VdoCipher Radio Group */}
            <div className="flex items-center gap-6 py-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 text-sm">
                <input 
                  type="radio" 
                  name="ml_yt_type" 
                  value="1" 
                  checked={formData.ml_yt_type === '1'} 
                  onChange={handleChange} 
                  className="w-4 h-4 text-[#144f36] focus:ring-[#144f36]" 
                />
                <span>YouTube</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 text-sm">
                <input 
                  type="radio" 
                  name="ml_yt_type" 
                  value="2" 
                  checked={formData.ml_yt_type === '2'} 
                  onChange={handleChange} 
                  className="w-4 h-4 text-[#144f36] focus:ring-[#144f36]" 
                />
                <span>VdoCipher</span>
              </label>
            </div>

            {/* Topic Video ID */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">Topic Video ID</label>
              <input 
                type="text" 
                name="ml_video_id"
                value={formData.ml_video_id}
                onChange={handleChange}
                placeholder="Enter Video ID" 
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white" 
              />
            </div>

            {/* PDF Attachment (Select PDF Button) */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">PDF Attachment</label>
              <div className="relative">
                <input
                  type="file"
                  id="pdf-upload"
                  accept=".pdf"
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      ml_pdffile: e.target.files[0]
                    }))
                  }
                  className="hidden"
                />
                <label
                  htmlFor="pdf-upload"
                  className="w-full bg-[#144f36] hover:bg-[#0f3d2a] text-white text-center py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors cursor-pointer block"
                >
                  {formData.ml_pdffile ? formData.ml_pdffile.name : 'Select PDF'}
                </label>
              </div>
            </div>

            {/* Topic Status */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">Topic Status</label>
              <select 
                name="ml_status" 
                value={formData.ml_status} 
                onChange={handleChange} 
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-white"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#144f36] hover:bg-[#0f3d2a] text-white py-2.5 rounded-lg text-sm font-bold transition-colors flex-1 shadow-sm disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="bg-[#ea580c] hover:bg-orange-600 text-white py-2.5 rounded-lg text-sm font-bold transition-colors flex-1 shadow-sm"
              >
                Cancel
              </button>
            </div>



          </form>
        </div>
      </div>
    </div>
  )
}


