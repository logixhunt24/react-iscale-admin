import * as Icons from 'lucide-react';
import Button from '../../components/common/Button';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config/api';

export default function AddCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [bannerFile, setBannerFile] = useState(null);
  const [megaBannerFile, setMegaBannerFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [feeStructureFile, setFeeStructureFile] = useState(null);
  const [partnerLogoFiles, setPartnerLogoFiles] = useState([]);

  // Form state
  const [description, setDescription] = useState('');
  const [selectedInstructorIds, setSelectedInstructorIds] = useState([]);
  const [instructorSearch, setInstructorSearch] = useState('');
  const [courseType, setCourseType] = useState('1');
  const [pricingMode, setPricingMode] = useState('1'); // 1 = single price, 2 = 3-tier pricing
  const [feeTiers, setFeeTiers] = useState([
    { tier_name: 'Basic', price: '', offer_price: '' },
    { tier_name: 'Premium', price: '', offer_price: '' },
    { tier_name: 'Pro', price: '', offer_price: '' },
  ]);
  // Positional against feeTiers above (included[0]/values[0] -> feeTiers[0],
  // etc), not keyed by tier name, so renaming a tier doesn't disconnect it
  // from its checkboxes/text here. row_type "check" uses `included`
  // (checkmark/cross per tier); row_type "text" uses `values` (free text
  // per tier, e.g. a duration like "6 Months" vs "2 Year" vs "5 Year").
  const [feeFeatures, setFeeFeatures] = useState([
    { label: '', row_type: 'check', included: [false, false, false], values: ['', '', ''] },
  ]);
  const [order, setOrder] = useState('');
  const [views, setViews] = useState('0');
  const [reviews, setReviews] = useState('0');
  const [ratings, setRatings] = useState('0');
  const [durationApp, setDurationApp] = useState('');
  const [durationWeb, setDurationWeb] = useState('');
  const [commencementDate, setCommencementDate] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('');
  const [jobAssistance, setJobAssistance] = useState('');
  const [appLink, setAppLink] = useState('');
  const [webLink, setWebLink] = useState('');
  const [graphyInstruction, setGraphyInstruction] = useState('');
  const [certificateShow, setCertificateShow] = useState(false);
  const [liveClassShow, setLiveClassShow] = useState(false);
  const [popularShow, setPopularShow] = useState(false);
  const [badgeText, setBadgeText] = useState('');
  const [recommendedShow, setRecommendedShow] = useState(false);
  const [lifetimeShow, setLifetimeShow] = useState(false);
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');



  useEffect(() => {
    const fetchCats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/myadmin/course/categories-dropdown`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.status) setCategories(response.data.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    const fetchInstructors = async () => {
      try {
        const token = localStorage.getItem('token');
        const resp = await axios.get(`${BASE_URL}/myadmin/instructor/instructors-dropdown`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp.data.status) setInstructors(resp.data.data);
      } catch (err) {
        console.error('Failed to load instructors', err);
      }
    };
    fetchCats();
    fetchInstructors();
  }, []);

  const updateFeatureLabel = (idx, label) => {
    setFeeFeatures((prev) => prev.map((f, i) => (i === idx ? { ...f, label } : f)))
  }
  const toggleFeatureIncluded = (idx, tierIdx) => {
    setFeeFeatures((prev) => prev.map((f, i) => {
      if (i !== idx) return f
      const included = [...f.included]
      included[tierIdx] = !included[tierIdx]
      return { ...f, included }
    }))
  }
  const updateFeatureRowType = (idx, row_type) => {
    setFeeFeatures((prev) => prev.map((f, i) => (i === idx ? { ...f, row_type } : f)))
  }
  const updateFeatureValue = (idx, tierIdx, value) => {
    setFeeFeatures((prev) => prev.map((f, i) => {
      if (i !== idx) return f
      const values = [...(f.values || ['', '', ''])]
      values[tierIdx] = value
      return { ...f, values }
    }))
  }
  const addFeatureRow = () => {
    setFeeFeatures((prev) => [...prev, { label: '', row_type: 'check', included: [false, false, false], values: ['', '', ''] }])
  }
  const removeFeatureRow = (idx) => {
    setFeeFeatures((prev) => prev.filter((_, i) => i !== idx))
  }
  const toggleInstructor = (instructorId) => {
    setSelectedInstructorIds((prev) =>
      prev.includes(instructorId) ? prev.filter((id) => id !== instructorId) : [...prev, instructorId]
    )
  }

  const handleSubmit = async () => {
    const titleVal = document.getElementById('course_title')?.value?.trim();
    const categoryVal = document.getElementById('course_category')?.value;
    if (!titleVal) { await window.customAlert('❌ Course Title is required!'); return; }
    if (!categoryVal) { await window.customAlert('❌ Please select a Course Category!'); return; }
    const courseTypeVal = courseType || '1';
    if (courseTypeVal === '2' && pricingMode === '1' && (!price || Number(price) <= 0)) {
      await window.customAlert('A paid course requires a price greater than 0.');
      return;
    }
    if (courseTypeVal === '2' && pricingMode === '2') {
      const hasValidTier = feeTiers.some(t => t.tier_name?.trim() && Number(t.price) > 0);
      if (!hasValidTier) {
        await window.customAlert('Add at least one pricing tier with a name and price.');
        return;
      }
    }
    if ((durationApp && (!Number.isFinite(Number(durationApp)) || Number(durationApp) < 0)) ||
        (durationWeb && (!Number.isFinite(Number(durationWeb)) || Number(durationWeb) < 0))) {
      await window.customAlert('Course durations must be non-negative numbers.');
      return;
    }
    setLoading(true); 
    try {
      const token = localStorage.getItem('token');
      const statusApp = document.getElementById('course_status_app').value;
      const statusWeb = document.getElementById('course_status_web').value;
      
      const payload = new FormData();
      payload.append('m_course_lang', document.getElementById('course_language')?.value || '1');
      payload.append('m_course_title', titleVal);
      payload.append('m_course_category', categoryVal);
      
      // Get selected course type (1 = Free, 2 = Paid)
      payload.append('m_course_type', courseTypeVal);
      payload.append('m_course_price', price || '0');
      payload.append('m_course_offer_price', offerPrice || '0');
      payload.append('m_course_pricing_mode', pricingMode);
      if (pricingMode === '2') {
        const validTiers = feeTiers.filter(t => t.tier_name?.trim() && Number(t.price) > 0);
        payload.append('m_course_fee_tiers', JSON.stringify(validTiers));
      }
      const validFeatures = feeFeatures.filter(f => f.label.trim())
      payload.append('m_course_fee_features', JSON.stringify(validFeatures))

      selectedInstructorIds.forEach((instructorId) => payload.append('m_course_trainee', instructorId));
      // Backend expects inconsistent formats
      payload.append('m_course_status', statusApp.toLowerCase() === '1' ? '1' : '0');
      payload.append('m_course_status_web', statusWeb.toLowerCase() === '1' ? '1' : '0');
      
      const popularVal = popularShow ? '1' : '0';
      const recommendedVal = recommendedShow ? '1' : '0';
      const lifetimeVal = lifetimeShow ? '1' : '0';
      payload.append('m_course_popular', popularVal);
      payload.append('m_course_badge_text', badgeText.trim());
      payload.append('m_course_recomended', recommendedVal);
      payload.append('m_course_lifetime', lifetimeVal);
      payload.append('popular', popularVal);
      payload.append('recomended', recommendedVal);

      payload.append('m_course_description', description || '');
      payload.append('m_course_video_link', document.getElementById('course_video_link')?.value || '');
      payload.append('m_course_duration_app', durationApp || '');
      payload.append('m_course_duration_web', durationWeb || '');
      payload.append('m_course_commencement_date', commencementDate || '');
      payload.append('m_course_delivery_mode', deliveryMode || '');
      payload.append('m_course_job_assistance', jobAssistance || '');
      payload.append('m_course_order', order || '');
      payload.append('m_course_view', views || '0');
      payload.append('m_course_reviews', reviews || '0');
      payload.append('m_course_rating', ratings || '0');
      payload.append('m_course_intro', document.getElementById('course_intro')?.value || '');
      
      const certVal = certificateShow ? '1' : '2';
      const liveVal = liveClassShow ? '1' : '2';
      payload.append('m_course_certificate', certVal);
      payload.append('m_course_live_class', liveVal);
      payload.append('certificate', certVal);
      payload.append('live_class', liveVal);
      
      payload.append('m_course_app_g_link', appLink || '');
      payload.append('m_course_web_g_link', webLink || '');
      payload.append('m_course_graphy_instruction', graphyInstruction || '');

      if (bannerFile) {
        payload.append('m_course_banner', bannerFile);
      }
      if (megaBannerFile) {
        payload.append('m_course_mega_banner', megaBannerFile);
      }
      if (pdfFile) {
        payload.append('m_course_pdf', pdfFile);
      }
      if (courseTypeVal === '2' && feeStructureFile) {
        payload.append('m_course_feestructure', feeStructureFile);
      }
      partnerLogoFiles.forEach(file => {
        payload.append('m_course_partner_logos', file);
      });

      console.log('=== ADD COURSE PAYLOAD ===');
      for (let pair of payload.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }

      const response = await axios.post(`${BASE_URL}/myadmin/course/add-course`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });
      if (response.data?.status) {
        await window.customAlert(response.data.message || 'Course added successfully');
        navigate('/courses/all');
      } else {
        await window.customAlert(`Failed: ${response.data?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('ADD COURSE ERROR:', error)

      if (error.response) {
        console.log(
          "BACKEND RESPONSE:",
          JSON.stringify(error.response?.data, null, 2)
        )
      }

      const errData = error.response?.data

      const msg =
        errData?.message ||
        errData?.error ||
        JSON.stringify(errData) ||
        error.message

      await window.customAlert(`❌ Error: ${msg}`)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eaf3f8] p-4 font-sans">
      <div className="bg-white rounded shadow-sm border border-slate-200 max-w-7xl mx-auto">
        <div className="bg-[#144f36] rounded-t p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white dark:bg-[#13111c]/10 rounded-full blur-2xl group-hover:bg-white dark:bg-[#13111c]/20 transition-all duration-700 pointer-events-none"></div>
          <div className="flex items-center relative z-10">
            <div className="w-1.5 h-7 bg-white dark:bg-[#13111c]/90 rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Add New Course</h2>
          </div>
          <button onClick={() => navigate('/courses/all')} className="bg-white hover:bg-slate-50 text-[#144f36] px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 relative z-10 hover:shadow hover:-translate-y-0.5">
            <span>↩ Back</span>
          </button>
        </div>
        <div className="p-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Language</label>
              <select id="course_language" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm bg-white outline-none">
                <option value="1">English</option>
                <option value="2">Hindi</option>
                <option value="3">Hinglish</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Category</label>
              <select id="course_category" className="w-full border border-slate-300 focus:border-[#144f36] rounded px-3 py-1.5 text-sm bg-white outline-none">
                <option value="">- - - Select - - -</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.m_category_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Title</label>
              <input id="course_title" type="text" placeholder="Course Title" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
            </div>
          </div>
          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Demo Video Link</label>
              <input id="course_video_link" type="text" placeholder="https://..." className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Type</label>
              <select id="course_type" value={courseType} onChange={e => setCourseType(e.target.value)} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-[#144f36]">
                <option value="1">Free</option>
                <option value="2">Paid</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Duration (App)</label>
              <input type="number" min="0" step="any" placeholder="Course Duration In App" value={durationApp} onChange={e => setDurationApp(e.target.value)} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
            </div>
          </div>

          {courseType === '2' && (
            <div className="mb-4">
              <div className="flex items-center gap-6 mb-3">
                <label className="text-[13px] font-bold text-slate-800">Pricing Type:</label>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <input type="radio" name="pricing_mode" checked={pricingMode === '1'} onChange={() => setPricingMode('1')} /> Single Price
                </label>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <input type="radio" name="pricing_mode" checked={pricingMode === '2'} onChange={() => setPricingMode('2')} /> 3-Tier Pricing
                </label>
              </div>

              {pricingMode === '1' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Price</label>
                    <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="Required for paid courses" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-800 mb-1">Offer Price</label>
                    <input type="number" min="0" step="0.01" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} placeholder="Optional" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {feeTiers.map((tier, idx) => (
                    <div key={idx} className="border border-slate-200 rounded p-3">
                      <label className="block text-[13px] font-bold text-slate-800 mb-1">Tier Name</label>
                      <input type="text" value={tier.tier_name} onChange={e => setFeeTiers(prev => prev.map((t, i) => i === idx ? { ...t, tier_name: e.target.value } : t))} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] mb-2" />
                      <label className="block text-[13px] font-bold text-slate-800 mb-1">Price</label>
                      <input type="number" min="0" step="0.01" value={tier.price} onChange={e => setFeeTiers(prev => prev.map((t, i) => i === idx ? { ...t, price: e.target.value } : t))} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] mb-2" />
                      <label className="block text-[13px] font-bold text-slate-800 mb-1">Offer Price</label>
                      <input type="number" min="0" step="0.01" value={tier.offer_price} onChange={e => setFeeTiers(prev => prev.map((t, i) => i === idx ? { ...t, offer_price: e.target.value } : t))} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5">
                <label className="block text-[13px] font-bold text-slate-800 mb-1">Fee Feature Comparison</label>
                <p className="text-xs text-slate-500 mb-2">Shown on the course page's pricing table. A "Yes/No" row shows a check or cross per tier (unchecked ones show struck through). A "Text" row shows different text per tier instead - e.g. a duration like "6 Months" vs "2 Year".</p>
                <div className="space-y-2">
                  {feeFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 border border-slate-200 rounded p-2 flex-wrap">
                      <input
                        type="text"
                        value={feature.label}
                        onChange={e => updateFeatureLabel(idx, e.target.value)}
                        placeholder="Feature name"
                        className="flex-1 min-w-[160px] border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]"
                      />
                      <select
                        value={feature.row_type || 'check'}
                        onChange={e => updateFeatureRowType(idx, e.target.value)}
                        className="border border-slate-300 rounded px-2 py-1.5 text-xs font-semibold outline-none focus:border-[#144f36]"
                      >
                        <option value="check">Yes/No</option>
                        <option value="text">Text</option>
                      </select>
                      {feature.row_type === 'text' ? (
                        feeTiers.map((tier, tIdx) => (
                          <input
                            key={tIdx}
                            type="text"
                            value={feature.values?.[tIdx] || ''}
                            onChange={e => updateFeatureValue(idx, tIdx, e.target.value)}
                            placeholder={tier.tier_name || `Tier ${tIdx + 1}`}
                            className="w-28 border border-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-[#144f36]"
                          />
                        ))
                      ) : (
                        feeTiers.map((tier, tIdx) => (
                          <label key={tIdx} className="flex items-center gap-1 text-xs font-bold text-slate-700 whitespace-nowrap">
                            <input type="checkbox" checked={feature.included[tIdx]} onChange={() => toggleFeatureIncluded(idx, tIdx)} />
                            {tier.tier_name || `Tier ${tIdx + 1}`}
                          </label>
                        ))
                      )}
                      <button type="button" onClick={() => removeFeatureRow(idx)} className="text-red-500 hover:text-red-700 text-xs font-bold px-2">✕</button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addFeatureRow} className="mt-2 text-sm font-semibold text-[#144f36] hover:underline">
                  + Add Feature
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Duration (Web)</label>
              <input type="number" min="0" step="any" placeholder="Course Duration In Web" value={durationWeb} onChange={e => setDurationWeb(e.target.value)} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Date of Commencement</label>
              <p className="text-xs text-slate-500 mb-1">Shown as a hero stat on the course page (e.g. "5th Jan 2026" or "Batch Starts Soon").</p>
              <input type="text" placeholder="e.g. 5th Jan 2026" value={commencementDate} onChange={e => setCommencementDate(e.target.value)} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Delivery Mode</label>
              <p className="text-xs text-slate-500 mb-1">e.g. Live, Self-Paced, Hybrid.</p>
              <input type="text" placeholder="e.g. Live" value={deliveryMode} onChange={e => setDeliveryMode(e.target.value)} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Job Assistance</label>
              <p className="text-xs text-slate-500 mb-1">e.g. Included, Not Included, 100% Placement Support.</p>
              <input type="text" placeholder="e.g. Included" value={jobAssistance} onChange={e => setJobAssistance(e.target.value)} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Status (App)</label>
              <select id="course_status_app" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-[#144f36]">
                <option>1</option>
                <option>0</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Status (Web)</label>
              <select id="course_status_web" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-[#144f36]">
                <option>1</option>
                <option>0</option>  
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Order</label>
              <input type="text" placeholder="Course Order" value={order} onChange={e => setOrder(e.target.value)} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
            </div>
          </div>
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Views</label>
              <input type="text" placeholder="0" value={views} onChange={e => setViews(e.target.value)} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Reviews</label>
              <input type="text" placeholder="0" value={reviews} onChange={e => setReviews(e.target.value)} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Ratings</label>
              <input type="text" placeholder="0" value={ratings} onChange={e => setRatings(e.target.value)} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
            </div>
          </div>
          {/* Additional Options */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-2">Add to</label>
              <div className="flex flex-col gap-2">
                <ToggleSwitch id="course_popular" checked={popularShow} onChange={e => setPopularShow(e.target.checked)} label="Add to popular course" />
                <ToggleSwitch id="course_recommended" checked={recommendedShow} onChange={e => setRecommendedShow(e.target.checked)} label="Add to recommended course" />
                <ToggleSwitch id="course_lifetime" checked={lifetimeShow} onChange={e => setLifetimeShow(e.target.checked)} label="Add to lifetime courses" />
                <ToggleSwitch id="course_certificate" checked={certificateShow} onChange={e => setCertificateShow(e.target.checked)} label="Is Certificate Show" />
                <ToggleSwitch id="course_live_class" checked={liveClassShow} onChange={e => setLiveClassShow(e.target.checked)} label="Is Live Class Show" />
              </div>
              <div className="mt-3">
                <label className="block text-[13px] font-bold text-slate-800 mb-1">Card Badge Text</label>
                <p className="text-xs text-slate-500 mb-1">Shown as a small ribbon on the nav menu's course card — any text (e.g. "Popular", "New", "50% Off"). Leave empty for no ribbon.</p>
                <input type="text" maxLength={40} placeholder="e.g. Popular" value={badgeText} onChange={e => setBadgeText(e.target.value)} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Image (Thumbnail)</label>
              <input type="file" accept="image/*" onChange={e => setBannerFile(e.target.files[0])} className="w-full border border-slate-300 rounded px-3 py-1 text-sm outline-none bg-white focus:border-[#144f36]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Nav Menu Card Image</label>
              <p className="text-xs text-slate-500 mb-1">Shown in the site nav's course dropdown cards instead of the banner above. Optional — falls back to the Course Image if left empty.</p>
              <input type="file" accept="image/*" onChange={e => setMegaBannerFile(e.target.files[0])} className="w-full border border-slate-300 rounded px-3 py-1 text-sm outline-none bg-white focus:border-[#144f36]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Course PDF</label>
              <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])} className="w-full border border-slate-300 rounded px-3 py-1 text-sm outline-none bg-white focus:border-[#144f36]" />
            </div>
            <div>
              {courseType === '2' && (
                <div className="mb-4">
                  <label className="block text-[13px] font-bold text-slate-800 mb-1">Fee Structure</label>
                  <input type="file" accept=".pdf,image/*,.doc,.docx,.xls,.xlsx" onChange={e => setFeeStructureFile(e.target.files[0])} className="w-full border border-slate-300 rounded px-3 py-1 text-sm outline-none bg-white focus:border-[#144f36]" />
                </div>
              )}
              <div>
                <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Instructor(s)</label>
                <input
                  type="text"
                  value={instructorSearch}
                  onChange={(e) => setInstructorSearch(e.target.value)}
                  placeholder="Search instructors..."
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] mb-2"
                />
                <div className="border border-slate-300 rounded max-h-48 overflow-y-auto bg-white">
                  {instructors.length === 0 ? (
                    <p className="text-xs text-slate-400 p-3">Loading instructors...</p>
                  ) : (
                    instructors
                      .filter((ins) => ins.name?.toLowerCase().includes(instructorSearch.toLowerCase()))
                      .map((ins) => (
                        <label key={ins._id} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedInstructorIds.includes(ins._id)}
                            onChange={() => toggleInstructor(ins._id)}
                            className="accent-[#144f36]"
                          />
                          {ins.name}
                        </label>
                      ))
                  )}
                </div>
                {selectedInstructorIds.length > 0 && (
                  <p className="text-xs text-slate-500 mt-1">{selectedInstructorIds.length} instructor(s) selected</p>
                )}
              </div>
            </div>
          </div>

          {/* Collaboration / Certification Partner Logos */}
          <div className="mb-6">
            <label className="block text-[13px] font-bold text-slate-800 mb-1">Collaboration / Certification Partner Logos</label>
            <p className="text-xs text-slate-500 mb-2">Upload logos of companies you've collaborated with for this course (e.g. Microsoft, IBM) who co-provide the certificate.</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={e => setPartnerLogoFiles(Array.from(e.target.files))}
              className="w-full border border-slate-300 rounded px-3 py-1 text-sm outline-none bg-white focus:border-[#144f36]"
            />
            {partnerLogoFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {partnerLogoFiles.map((file, idx) => (
                  <span key={idx} className="text-xs bg-slate-100 border border-slate-200 rounded px-2 py-1">{file.name}</span>
                ))}
              </div>
            )}
          </div>
          {/* Intro and Description */}
          <div className="mb-4">
            <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Intro</label>
            <textarea id="course_intro" rows="3" placeholder="Enter Course Intro" className="w-1/2 border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36]"></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Description</label>
            <textarea id="course_description" rows="6" placeholder="Enter Course Description" className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none" value={description} onChange={e => setDescription(e.target.value)}></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">App Graphy Link</label>
              <input type="text" value={appLink} onChange={e => setAppLink(e.target.value)} placeholder="App Graphy Link" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Web Graphy Link</label>
              <input type="text" value={webLink} onChange={e => setWebLink(e.target.value)} placeholder="Web Graphy Link" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Instruction</label>
              <textarea rows="2" value={graphyInstruction} onChange={e => setGraphyInstruction(e.target.value)} placeholder="Graphy Instruction" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"></textarea>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 mt-8">
            <button onClick={() => navigate('/courses/all')} className="px-6 py-1.5 border border-slate-300 text-slate-600 rounded text-sm hover:bg-slate-50">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-1.5 bg-[#144f36] text-white rounded text-sm hover:bg-[#0f3d2a] disabled:opacity-70">
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

