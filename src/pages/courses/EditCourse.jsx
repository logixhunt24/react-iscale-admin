import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config/api';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';
import ToggleSwitch from '../../components/common/ToggleSwitch';

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);

  // Consolidated form state
  const [courseData, setCourseData] = useState({
    m_course_lang: 1,
    m_course_title: '',
    m_course_category: '',
    m_course_type: '',
    m_course_status: 1,
    m_course_status_web: 1,
    m_course_popular: 0,
    m_course_recomended: 0,
    m_course_lifetime: 0,
    m_course_description: '',
    m_course_video_link: '',
    m_course_duration_app: '',
    m_course_duration_web: '',
    m_course_order: '',
    m_course_view: '0',
    m_course_reviews: '0',
    m_course_rating: '0',
    m_course_intro: '',
    m_course_certificate: 0,
    m_course_live_class: 0,
    m_course_app_g_link: '',
    m_course_web_g_link: '',
    m_course_graphy_instruction: '',
    m_course_fee_structure: '',
    m_course_trainee: '',
    m_course_price: '',
    m_course_offer_price: ''
  });

  const [bannerFile, setBannerFile] = useState(null);
  const [megaBannerFile, setMegaBannerFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [feeStructureFile, setFeeStructureFile] = useState(null);

  const [pricingMode, setPricingMode] = useState('1'); // 1 = single price, 2 = 3-tier pricing
  const [feeTiers, setFeeTiers] = useState([
    { tier_name: 'Basic', price: '', offer_price: '' },
    { tier_name: 'Premium', price: '', offer_price: '' },
    { tier_name: 'Pro', price: '', offer_price: '' },
  ]);
  const [existingPartnerLogos, setExistingPartnerLogos] = useState([]); // [{url, public_id}]
  const [removedPartnerLogoIds, setRemovedPartnerLogoIds] = useState([]);
  const [newPartnerLogoFiles, setNewPartnerLogoFiles] = useState([]);

  // Generic change handler for text/number inputs
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const numeric = checked ? 1 : 0;
      setCourseData((prev) => ({ ...prev, [id]: numeric }));
    } else {
      setCourseData((prev) => ({ ...prev, [id]: value }));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      let loadedCategories = [];
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BASE_URL}/myadmin/course/categories-dropdown`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.status) {
          setCategories(res.data.data);
          loadedCategories = res.data.data;
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BASE_URL}/myadmin/instructor/instructors-dropdown`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.status) setInstructors(res.data.data);
      } catch (err) {
        console.error('Failed to load instructors', err);
      }

      let course = null;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BASE_URL}/myadmin/course/course/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.data) {
          course = res.data.data;
        }
      } catch (err) {
        console.error('Failed to fetch course details', err);
      }

      if (!course && location.state?.courseData) {
        course = location.state.courseData;
      }

      if (course) {
        populateForm(course, loadedCategories);
      }
    };

    const populateForm = (course, categoriesList) => {
      const normStatus = (val) => {
        if (val === 0 || val === "0" || val === "inactive" || val === false || val === "false") {
          return "0";
        }
        return "1";
      };

      const isTruthy = (val) => {
        if (val === 1 || val === "1" || val === true || val === "true" || String(val).toLowerCase() === "yes" || String(val).toLowerCase() === "active") {
          return 1;
        }
        return 0;
      };

      let categoryId = course.category ?? course.m_course_category ?? '';
      if (categoryId && !categoriesList.find(c => c._id === categoryId)) {
        const found = categoriesList.find(c => c.m_category_name === categoryId);
        if (found) categoryId = found._id;
      }

      let typeVal = course.course_type ?? course.type ?? course.m_course_type ?? '';
      if (typeVal === 'Paid') typeVal = '2';
      if (typeVal === 'Free') typeVal = '1';

      setCourseData({
        m_course_lang: course.lang ?? course.m_course_lang ?? 1,
        m_course_title: course.title ?? course.m_course_title ?? '',
        m_course_category: categoryId,
        m_course_type: typeVal,
        m_course_status: normStatus(course.status ?? course.m_course_status),
        m_course_status_web: normStatus(course.status_web ?? course.m_course_status_web),
        m_course_popular: isTruthy(course.popular ?? course.m_course_popular),
        m_course_recomended: isTruthy(course.recomended ?? course.recommended ?? course.m_course_recomended),
        m_course_lifetime: isTruthy(course.lifetime ?? course.m_course_lifetime),
        m_course_description: course.description ?? course.m_course_description ?? '',
        m_course_video_link: course.video_link ?? course.m_course_video_link ?? '',
        m_course_duration_app: course.duration_app ?? course.m_course_duration_app ?? '',
        m_course_duration_web: course.duration_web ?? course.m_course_duration_web ?? '',
        m_course_order: course.order ?? course.m_course_order ?? '',
        m_course_view: course.view ?? course.m_course_view ?? '0',
        m_course_reviews: course.reviews ?? course.m_course_reviews ?? '0',
        m_course_rating: course.rating ?? course.m_course_rating ?? '0',
        m_course_intro: course.intro ?? course.m_course_intro ?? '',
        m_course_certificate: isTruthy(course.certificate ?? course.m_course_certificate),
        m_course_live_class: isTruthy(course.live_class ?? course.m_course_live_class),
        m_course_app_g_link: course.app_g_link ?? course.m_course_app_g_link ?? '',
        m_course_web_g_link: course.web_g_link ?? course.m_course_web_g_link ?? '',
        m_course_graphy_instruction: course.graphy_instruction ?? course.m_course_graphy_instruction ?? '',
        m_course_fee_structure: course.fee_structure ?? course.m_course_fee_structure ?? '',
        m_course_trainee: course.trainees?.[0]?.trainee_id ?? course.m_course_trainee?.[0]?._id ?? course.m_course_trainee?.[0] ?? '',
        m_course_price: course.price ?? course.m_course_price ?? '',
        m_course_offer_price: course.offer_price ?? course.m_course_offer_price ?? ''
      });

      const tiers = course.fee_tiers ?? course.m_course_fee_tiers ?? [];
      setPricingMode(String(course.pricing_mode ?? course.m_course_pricing_mode ?? 1));
      if (Array.isArray(tiers) && tiers.length > 0) {
        setFeeTiers([0, 1, 2].map(i => ({
          tier_name: tiers[i]?.tier_name ?? ['Basic', 'Premium', 'Pro'][i],
          price: tiers[i]?.price ?? '',
          offer_price: tiers[i]?.offer_price ?? '',
        })));
      }
      setExistingPartnerLogos(course.partner_logos ?? course.m_course_partner_logos ?? []);
    };

    loadData();
  }, [id, location.state]);

  const handleSubmit = async () => {
    setLoading(true); 
    try {
      const token = localStorage.getItem('token');
      const payload = new FormData();
      Object.entries(courseData).forEach(([key, val]) => {
        if (key === "m_course_status" || key === "m_course_status_web") {
          const statusVal = (val === "1" || val === 1 || val === true || String(val) === "true") ? "1" : "0";
          payload.append(key, statusVal);
          // Also append flat version to be safe
          if (key === "m_course_status") payload.append("status", statusVal);
          if (key === "m_course_status_web") payload.append("status_web", statusVal);
        } else if (
          [
            "m_course_popular",
            "m_course_recomended",
            "m_course_lifetime"
          ].includes(key)
        ) {
          const boolVal = (val === "1" || val === 1 || val === true || String(val) === "true") ? "1" : "0";
          payload.append(key, boolVal);
          // Also append flat version to be safe
          if (key === "m_course_popular") payload.append("popular", boolVal);
          if (key === "m_course_recomended") payload.append("recomended", boolVal);
        } else if (
          [
            "m_course_certificate",
            "m_course_live_class"
          ].includes(key)
        ) {
          const boolVal = (val === "1" || val === 1 || val === true || String(val) === "true") ? "1" : "2";
          payload.append(key, boolVal);
          // Also append flat version to be safe
          if (key === "m_course_certificate") payload.append("certificate", boolVal);
          if (key === "m_course_live_class") payload.append("live_class", boolVal);
        } else if (
          [
            "m_course_price",
            "m_course_offer_price",
            "m_course_lang",
            "m_course_type",
            "m_course_order"
          ].includes(key)
        ) {
          const num = Number(val);
          if (val === "" || val === null || val === undefined) {
            payload.append(key, 0);
          } else if (isNaN(num)) {
            if (key === "m_course_type" && ["Self Paced", "Live", "Hybrid"].includes(val)) {
              payload.append(key, val);
            } else {
              payload.append(key, 0);
            }
          } else {
            payload.append(key, num);
          }
        } else {
          payload.append(key, val ?? "");
        }
      });
      payload.append('m_course_pricing_mode', pricingMode);
      if (pricingMode === '2') {
        const validTiers = feeTiers.filter(t => t.tier_name?.trim() && Number(t.price) > 0);
        payload.append('m_course_fee_tiers', JSON.stringify(validTiers));
      }

      if (bannerFile) payload.append('m_course_banner', bannerFile);
      if (megaBannerFile) payload.append('m_course_mega_banner', megaBannerFile);
      if (pdfFile) payload.append('m_course_pdf', pdfFile);
      if (String(courseData.m_course_type) === '2' && feeStructureFile) payload.append('m_course_feestructure', feeStructureFile);
      newPartnerLogoFiles.forEach(file => payload.append('m_course_partner_logos', file));
      if (removedPartnerLogoIds.length) {
        payload.append('m_course_partner_logos_remove', JSON.stringify(removedPartnerLogoIds));
      }
      for (let pair of payload.entries()) {
        console.log(pair[0], pair[1]);
      }
      const response = await axios.put(`${BASE_URL}/myadmin/course/update-course/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.status) {
        await window.customAlert(response.data.message || 'Course updated successfully');
        navigate('/courses/all');
      } else {
        await window.customAlert('Failed to update course');
      }
    } catch (error) {
      console.error('UPDATE COURSE ERROR:', error);
      const msg = error.response?.data?.message || error.message || 'Unknown error';
      await window.customAlert(`❌ Error: ${msg}`);
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
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Edit Course</h2>
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
              <select id="m_course_lang" value={courseData.m_course_lang} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm bg-white outline-none">
                <option value="1">English</option>
                <option value="2">Hindi</option>
                <option value="3">Hinglish</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Category</label>
              <select id="m_course_category" value={courseData.m_course_category} onChange={handleChange} className="w-full border border-slate-300 focus:border-[#144f36] rounded px-3 py-1.5 text-sm bg-white outline-none">
                <option value="">- - - Select - - -</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.m_category_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Title</label>
              <input id="m_course_title" type="text" value={courseData.m_course_title} onChange={handleChange} placeholder="Course Title" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Demo Video Link</label>
              <input id="m_course_video_link" type="text" value={courseData.m_course_video_link} onChange={handleChange} placeholder="https://..." className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Type</label>
              <select id="m_course_type" value={courseData.m_course_type} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-[#144f36]">
                <option value="">Select Type</option>
                <option value="1">Free</option>
                <option value="2">Paid</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Duration (App)</label>
              <input id="m_course_duration_app" type="number" min="0" step="any" value={courseData.m_course_duration_app} onChange={handleChange} placeholder="Course Duration In App" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
            </div>
          </div>

          {String(courseData.m_course_type) === '2' && (
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
                    <input id="m_course_price" type="number" value={courseData.m_course_price} onChange={handleChange} placeholder="Course Price" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-slate-800 mb-1">Offer Price</label>
                    <input id="m_course_offer_price" type="number" value={courseData.m_course_offer_price} onChange={handleChange} placeholder="Offer Price" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
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
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Duration (Web)</label>
              <input id="m_course_duration_web" type="number" min="0" step="any" value={courseData.m_course_duration_web} onChange={handleChange} placeholder="Course Duration In Web" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Status (App)</label>
              <select id="m_course_status" value={courseData.m_course_status} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-[#144f36]">
                <option value= "1">Active</option>
                <option value= "0">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Status (Web)</label>
              <select id="m_course_status_web" value={courseData.m_course_status_web} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-[#144f36]">
                <option value= "1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Order</label>
              <input id="m_course_order" type="text" value={courseData.m_course_order} onChange={handleChange} placeholder="Course Order" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Views</label>
              <input id="m_course_view" type="text" value={courseData.m_course_view} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Reviews</label>
              <input id="m_course_reviews" type="text" value={courseData.m_course_reviews} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Ratings</label>
              <input id="m_course_rating" type="text" value={courseData.m_course_rating} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]" />
            </div>
          </div>

          {/* Additional Options */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-2">Add to</label>
              <div className="flex flex-col gap-2">
                <ToggleSwitch id="m_course_popular" checked={courseData.m_course_popular === 1} onChange={handleChange} label="Add to popular course" />
                <ToggleSwitch id="m_course_recomended" checked={courseData.m_course_recomended === 1} onChange={handleChange} label="Add to recommended course" />
                <ToggleSwitch id="m_course_lifetime" checked={courseData.m_course_lifetime === 1} onChange={handleChange} label="Add to lifetime courses" />
                <ToggleSwitch id="m_course_certificate" checked={courseData.m_course_certificate === 1} onChange={handleChange} label="Certificate Show" />
                <ToggleSwitch id="m_course_live_class" checked={courseData.m_course_live_class === 1} onChange={handleChange} label="Live Class Show" />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Image (Thumbnail)</label>
              <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files[0])} className="w-full border border-slate-300 rounded px-3 py-1 text-sm outline-none bg-white focus:border-[#144f36]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Nav Menu Card Image</label>
              <p className="text-xs text-slate-500 mb-1">Shown in the site nav's course dropdown cards instead of the banner above. Optional — falls back to the Course Image if left empty.</p>
              <input type="file" accept="image/*" onChange={(e) => setMegaBannerFile(e.target.files[0])} className="w-full border border-slate-300 rounded px-3 py-1 text-sm outline-none bg-white focus:border-[#144f36]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Course PDF</label>
              <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} className="w-full border border-slate-300 rounded px-3 py-1 text-sm outline-none bg-white focus:border-[#144f36]" />
            </div>
            <div>
              {String(courseData.m_course_type) === '2' && (
                <div className="mb-4">
                  <label className="block text-[13px] font-bold text-slate-800 mb-1">Fee Structure</label>
                  <input type="file" accept=".pdf,image/*,.doc,.docx,.xls,.xlsx" onChange={(e) => setFeeStructureFile(e.target.files[0])} className="w-full border border-slate-300 rounded px-3 py-1 text-sm outline-none bg-white focus:border-[#144f36]" />
                  {courseData.m_course_fee_structure && (
                    <a href={getImageUrl(courseData.m_course_fee_structure)} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline block mt-1">
                      📄 View Existing Fee Structure
                    </a>
                  )}
                </div>
              )}
              <div>
                <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Instructor</label>
                <select id="m_course_trainee" value={courseData.m_course_trainee} onChange={handleChange} className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm bg-white outline-none">
                  <option value="">- - - Select - - -</option>
                  {instructors.map((ins) => (
                    <option key={ins._id} value={ins._id}>{ins.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Collaboration / Certification Partner Logos */}
          <div className="mb-6">
            <label className="block text-[13px] font-bold text-slate-800 mb-1">Collaboration / Certification Partner Logos</label>
            <p className="text-xs text-slate-500 mb-2">Logos of companies you've collaborated with for this course (e.g. Microsoft, IBM) who co-provide the certificate.</p>
            {existingPartnerLogos.filter(logo => !removedPartnerLogoIds.includes(logo.public_id)).length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {existingPartnerLogos.filter(logo => !removedPartnerLogoIds.includes(logo.public_id)).map((logo) => (
                  <div key={logo.public_id} className="relative border border-slate-200 rounded p-1.5">
                    <img src={getImageUrl(logo.url)} alt="Partner logo" className="h-12 w-auto object-contain" />
                    <button
                      type="button"
                      onClick={() => setRemovedPartnerLogoIds(prev => [...prev, logo.public_id])}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                      title="Remove logo"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={e => setNewPartnerLogoFiles(Array.from(e.target.files))}
              className="w-full border border-slate-300 rounded px-3 py-1 text-sm outline-none bg-white focus:border-[#144f36]"
            />
            {newPartnerLogoFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newPartnerLogoFiles.map((file, idx) => (
                  <span key={idx} className="text-xs bg-slate-100 border border-slate-200 rounded px-2 py-1">{file.name}</span>
                ))}
              </div>
            )}
          </div>

          {/* Intro and Description */}
          <div className="mb-4">
            <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Intro</label>
            <textarea rows="3" id="m_course_intro" value={courseData.m_course_intro} onChange={handleChange} placeholder="Enter Course Intro" className="w-1/2 border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">App Graphy Link</label>
              <input id="m_course_app_g_link" type="text" value={courseData.m_course_app_g_link} onChange={handleChange} placeholder="App Graphy Link" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Web Graphy Link</label>
              <input id="m_course_web_g_link" type="text" value={courseData.m_course_web_g_link} onChange={handleChange} placeholder="Web Graphy Link" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-slate-800 mb-1">Instruction</label>
              <textarea id="m_course_graphy_instruction" rows="2" value={courseData.m_course_graphy_instruction} onChange={handleChange} placeholder="Graphy Instruction" className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"></textarea>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-bold text-slate-800 mb-1">Course Description</label>
            <textarea id="m_course_description" rows="6" value={courseData.m_course_description} onChange={handleChange} placeholder="Enter Course Description" className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 mt-8">
            <button onClick={() => navigate('/courses/all')} className="px-6 py-1.5 border border-slate-300 text-slate-600 rounded text-sm hover:bg-slate-50">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-1.5 bg-[#144f36] text-white rounded text-sm hover:bg-[#0f3d2a] disabled:opacity-70">
              {loading ? 'Updating...' : 'Update Course'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

