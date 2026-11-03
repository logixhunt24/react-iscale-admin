// Everything we hold about a student, for the App Users details modal.
// Profile = every field on the student record (secrets are never sent by the API);
// Orders / Learning / Activity come from GET /myadmin/app-users/overview/:id.
import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import { getImageUrl } from '../../utils/imageUtils'

// ---------- formatting ----------
const empty = (v) => v === null || v === undefined || v === '' || (typeof v === 'number' && Number.isNaN(v))

const fmtDate = (v) => {
  const d = new Date(v)
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB')
}
const fmtDateTime = (v) => {
  const d = new Date(v)
  return isNaN(d.getTime()) ? '' : d.toLocaleString('en-GB')
}
const money = (v, currency = 'INR') => (empty(v) ? '' : `${currency === 'INR' ? '₹' : currency + ' '}${Number(v).toLocaleString('en-IN')}`)

const YesNo = ({ v }) => (
  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${v ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
    {v ? 'Yes' : 'No'}
  </span>
)

// ---------- layout pieces ----------
function Section({ title, children }) {
  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
      <h4 className="text-xs font-bold tracking-wider text-[#7c3aed] uppercase mb-4">{title}</h4>
      {children}
    </div>
  )
}

function Table({ head, rows, emptyText }) {
  if (!rows.length) return <p className="text-sm text-slate-400 py-6 text-center">{emptyText}</p>
  return (
    <div className="overflow-x-auto border border-slate-100 rounded-lg">
      <table className="w-full text-left text-xs">
        <thead>
          <tr>{head.map((h) => <th key={h} className="px-3 py-2 font-bold whitespace-nowrap">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="border-t border-slate-100">
              {cells.map((c, j) => <td key={j} className="px-3 py-2 align-top text-slate-700">{c === '' || c == null ? '—' : c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const Badge = ({ ok, yes, no }) => (
  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
    {ok ? yes : no}
  </span>
)

// ---------- PROFILE ----------
// type: undefined = text, date, datetime, bool, file (link), money
const f = (label, get, type) => ({ label, get, type })

const PROFILE_SECTIONS = [
  {
    title: 'Account & Login',
    fields: [
      f('Candidate ID', (u) => u.candidate_idno),
      f('Registered on', (u) => u.c_register_date, 'datetime'),
      f('Account status', (u) => (u.c_deactivated ? `Deactivated${u.c_deactivated_at ? ' on ' + fmtDateTime(u.c_deactivated_at) : ''}` : u.c_user_status === 1 ? 'Active' : 'Inactive')),
      f('Email', (u) => u.c_email),
      f('Email verified', (u) => Boolean(u.c_email_verified), 'bool'),
      f('Mobile', (u) => u.c_contact),
      f('Mobile verified', (u) => Boolean(u.c_mobile_verified), 'bool'),
      f('Verified by admin', (u) => Boolean(u.c_admin_verified), 'bool'),
      f('Alternate mobile', (u) => u.c_alt_contact),
      f('WhatsApp', (u) => u.c_whatsapp),
      f('Other numbers', (u) => [u.c_number1, u.c_number2, u.c_number3].filter(Boolean).join(', ')),
      f('Other emails', (u) => [u.c_email1, u.c_email2, u.c_email3].filter(Boolean).join(', ')),
      f('Pending new email', (u) => u.c_new_email),
      f('Login provider', (u) => u.c_login_provider),
      f('Google account linked', (u) => Boolean(u.c_google_id), 'bool'),
      f('Password set', (u) => Boolean(u.has_password), 'bool'),
      f('Password changed by user', (u) => Boolean(u.c_password_update), 'bool'),
      f('Push notifications registered', (u) => Boolean(u.has_fcm_token), 'bool'),
      f('Number of visits', (u) => u.c_novisits),
    ],
  },
  {
    title: 'LMS & App Access',
    fields: [
      f('LMS student', (u) => (u.is_lms_student === undefined || u.is_lms_student === null ? undefined : u.is_lms_student === 1), 'bool'),
      f('Roll number', (u) => u.m_roll_number),
      f('Assigned batch', (u) => u.c_assign_batch),
      f('Mobile app lifetime access', (u) => Boolean(u.mobile_app_lifetime_access), 'bool'),
      f('Face registered (app)', (u) => Boolean(u.mobile_app_face_registered), 'bool'),
      f('Subscribed', (u) => (u.is_subscribe === undefined || u.is_subscribe === null ? undefined : Boolean(u.is_subscribe)), 'bool'),
      f('Subscription ends', (u) => u.subscription_end, 'date'),
      f('Notify date', (u) => u.notify_date, 'date'),
      f('Next apply date', (u) => u.next_apply_date, 'date'),
    ],
  },
  {
    title: 'Personal',
    fields: [
      f('First name', (u) => u.c_first_name),
      f('Last name', (u) => u.c_last_name),
      f('Display name', (u) => u.c_display_name),
      f('Gender', (u) => u.c_gender),
      f('Date of birth', (u) => u.c_dob, 'date'),
      f('Age', (u) => u.c_age),
      f('Blood group', (u) => u.m_blood_group),
      f('Category', (u) => u.c_category),
      f('Domicile', (u) => u.c_domicile),
      f('Occupation', (u) => u.m_occupation),
      f('Bio', (u) => u.c_bio),
      f('Profile image', (u) => u.c_profile_image, 'file'),
      f('Signature', (u) => u.c_sign_image, 'file'),
    ],
  },
  {
    title: 'Family & Guardian',
    fields: [
      f('Guardian', (u) => u.c_guardian),
      f('Guardian relation', (u) => u.c_guardian_relation),
      f("Father's name", (u) => u.m_father_name),
      f("Father's occupation", (u) => u.m_f_occupation),
      f("Mother's name", (u) => u.m_mother_name),
      f("Mother's occupation", (u) => u.m_m_occupation),
      f('Parent mobile', (u) => u.m_parent_mobile),
      f('Parent', (u) => u.c_user_parent),
    ],
  },
  {
    title: 'Current Address',
    fields: [
      f('Address line 1', (u) => u.c_current_address1),
      f('Address line 2', (u) => u.c_current_address2),
      f('Area', (u) => u.c_current_area),
      f('District', (u) => u.c_current_district),
      f('City', (u) => u.c_current_city?.m_city_city || u.c_current_city_name),
      f('State', (u) => u.c_current_state?.m_state_name || u.c_current_state_name),
      f('Country', (u) => u.c_current_country_name),
      f('Pincode', (u) => u.c_current_pincode),
    ],
  },
  {
    title: 'Permanent Address',
    fields: [
      f('Address line 1', (u) => u.c_permanent_address1),
      f('Address line 2', (u) => u.c_permanent_address2),
      f('City', (u) => u.c_permanent_city),
      f('State', (u) => u.c_permanent_state),
      f('Pincode', (u) => u.c_permanent_pincode),
      f('Address type', (u) => u.address_type),
    ],
  },
  {
    title: 'Identity & Documents',
    fields: [
      f('Government ID number', (u) => u.c_governmentId_number),
      f('ID proof type', (u) => u.c_idProof_type),
      f('ID proof image', (u) => u.c_idProof_image, 'file'),
      f('Aadhaar number', (u) => u.c_adhar_no),
      f('Aadhaar file', (u) => u.c_adhar_file, 'file'),
      f('PAN number', (u) => u.c_pan_number || u.c_pan_no),
      f('PAN file', (u) => u.c_pan_file, 'file'),
      f('UPI ID', (u) => u.c_upi_id),
      f('Resume', (u) => u.c_resume_upload, 'file'),
      f('Admit card', (u) => u.c_admitcard_upload, 'file'),
    ],
  },
  {
    title: 'Education',
    fields: [
      f('10th - School', (u) => u.c_10schoolName),
      f('10th - Board', (u) => u.c_10board),
      f('10th - Passing year', (u) => u.c_10passingYear),
      f('10th - Percentage', (u) => u.c_10percentage),
      f('10th - Division', (u) => u.c_10division),
      f('10th - Grade', (u) => u.c_10grade),
      f('10th - Marksheet', (u) => u.c_10marksheet_image, 'file'),
      f('12th - School', (u) => u.c_12schoolName),
      f('12th - Board', (u) => u.c_12board),
      f('12th - Passing year', (u) => u.c_12passingYear),
      f('12th - Percentage', (u) => u.c_12percentage),
      f('12th - Division', (u) => u.c_12division),
      f('12th - Grade', (u) => u.c_12grade),
      f('12th - Marksheet', (u) => u.c_12marksheet_image, 'file'),
      f('Diploma - Name', (u) => u.c_diplomaName),
      f('Diploma - College', (u) => u.c_diplomaCollege),
      f('Diploma - University', (u) => u.c_diplomaUniversity),
      f('Diploma - Passing year', (u) => u.c_diplomaPassing_year),
      f('Diploma - Percentage', (u) => u.c_diplomaPercentage),
      f('Diploma - Division', (u) => u.c_diplomaDivision),
      f('Diploma - Grade', (u) => u.c_diplomaGrade),
      f('Diploma - Marksheet', (u) => u.c_diplomaMarksheet_image, 'file'),
      f('Graduation - Course', (u) => u.c_graduationCourse),
      f('Graduation - College', (u) => u.c_graduationCollege),
      f('Graduation - University', (u) => u.c_graduationUniversity),
      f('Graduation - Passing year', (u) => u.c_graduationPass_year),
      f('Graduation - Percentage', (u) => u.c_graduationPercentage),
      f('Graduation - Division', (u) => u.c_graduationDivision),
      f('Graduation - Grade', (u) => u.c_graduationGrade),
      f('Graduation - Marksheet', (u) => u.c_graduationMarksheet_image, 'file'),
      f('Post-graduation - Course', (u) => u.c_pgCourse),
      f('Post-graduation - College', (u) => u.c_pgCollege),
      f('Post-graduation - University', (u) => u.c_pgUniversity),
      f('Post-graduation - Passing year', (u) => u.c_pgPass_year),
      f('Post-graduation - Percentage', (u) => u.c_pgPercentage),
      f('Post-graduation - Division', (u) => u.c_pgDivision),
      f('Post-graduation - Grade', (u) => u.c_pgGrade),
      f('Post-graduation - Marksheet', (u) => u.c_pgMarksheet_image, 'file'),
      // Old numeric lookup codes (the matching names are not stored on the student)
      f('Diploma - Course (code)', (u) => u.c_diploma_course),
      f('Diploma - Stream (code)', (u) => u.c_diploma_stream),
      f('Diploma - State (code)', (u) => u.c_diploma_state),
      f('Diploma - City (code)', (u) => u.c_diploma_city),
      f('Graduation - Stream (code)', (u) => u.c_graduation_stream),
      f('Graduation - State (code)', (u) => u.c_graduation_state),
      f('Graduation - City (code)', (u) => u.c_graduation_city),
      f('Post-graduation - Stream (code)', (u) => u.c_pgStream),
      f('Post-graduation - State (code)', (u) => u.c_pg_state),
      f('Post-graduation - City (code)', (u) => u.c_pg_city),
    ],
  },
  {
    title: 'Referral & Wallet',
    fields: [
      f('Referral code', (u) => u.c_user_referal_code),
      f('Users referred', (u) => u.c_user_refered_users),
      f('Referred by', (u) => (u.c_user_refer_by ? [u.c_user_refer_by.kh_admin_name, u.c_user_refer_by.kh_admin_phone].filter(Boolean).join(' - ') : '')),
      f('Wallet balance', (u) => u.c_user_wallet_amount, 'money'),
      f('Wallet added', (u) => u.c_user_wallet_added, 'money'),
      f('Wallet winnings', (u) => u.c_user_wallet_winings, 'money'),
    ],
  },
  {
    title: 'Profile Completion',
    fields: [
      f('Profile details done', (u) => (u.c_profile_updated === undefined ? undefined : Boolean(u.c_profile_updated)), 'bool'),
      f('Education details done', (u) => (u.c_eductional_updated === undefined ? undefined : Boolean(u.c_eductional_updated)), 'bool'),
      f('Professional details done', (u) => (u.c_professional_updated === undefined ? undefined : Boolean(u.c_professional_updated)), 'bool'),
      f('Documents done', (u) => (u.c_document_updated === undefined ? undefined : Boolean(u.c_document_updated)), 'bool'),
    ],
  },
]

function renderValue(field, raw) {
  switch (field.type) {
    case 'date': return fmtDate(raw)
    case 'datetime': return fmtDateTime(raw)
    case 'bool': return <YesNo v={raw} />
    case 'money': return money(raw)
    case 'file':
      return (
        <a href={getImageUrl(String(raw))} target="_blank" rel="noreferrer" className="text-blue-600 underline">
          View file
        </a>
      )
    default: return String(raw)
  }
}

export function ProfileTab({ user }) {
  const [showEmpty, setShowEmpty] = useState(false)
  let hiddenCount = 0

  const sections = PROFILE_SECTIONS.map((s) => {
    const rows = s.fields.map((fd) => ({ fd, raw: fd.get(user) })).filter(({ raw }) => !empty(raw) && raw !== '')
    hiddenCount += s.fields.length - rows.length
    return { ...s, rows }
  })

  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer w-fit">
        <input type="checkbox" checked={showEmpty} onChange={(e) => setShowEmpty(e.target.checked)} />
        Show fields with no data ({hiddenCount})
      </label>

      {sections.map((s) => {
        const list = showEmpty ? s.fields.map((fd) => ({ fd, raw: fd.get(user) })) : s.rows
        if (!list.length) return null
        return (
          <Section key={s.title} title={s.title}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              {list.map(({ fd, raw }) => (
                <div key={fd.label} className={fd.label === 'Bio' ? 'md:col-span-2' : ''}>
                  <div className="text-xs text-slate-400 font-semibold mb-0.5">{fd.label}</div>
                  <div className="text-sm text-slate-800 font-bold break-words">
                    {empty(raw) || raw === '' ? <span className="text-slate-300 font-normal">—</span> : renderValue(fd, raw)}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )
      })}
    </div>
  )
}

// ---------- OVERVIEW DATA (orders, learning, activity) ----------
export function useUserOverview(id) {
  const [state, setState] = useState({ loading: true, data: null, error: '' })
  useEffect(() => {
    if (!id) return
    let cancelled = false
    axios
      .get(`${BASE_URL}/myadmin/app-users/overview/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => { if (!cancelled) setState({ loading: false, data: res.data?.data || null, error: '' }) })
      .catch((err) => { if (!cancelled) setState({ loading: false, data: null, error: err.response?.data?.message || 'Could not load details' }) })
    return () => { cancelled = true }
  }, [id])
  return state
}

const Wrap = ({ state, children }) =>
  state.loading ? <p className="text-sm text-slate-400 py-8 text-center animate-pulse">Loading...</p>
    : state.error ? <p className="text-sm text-rose-600 py-8 text-center">{state.error}</p>
      : children(state.data)

const stars = (n) => (empty(n) ? '' : `${'★'.repeat(Math.round(n))}${'☆'.repeat(Math.max(0, 5 - Math.round(n)))} (${n})`)

export function OrdersTab({ state }) {
  return (
    <Wrap state={state}>
      {(d) => {
        const paid = d.orders.filter((o) => o.status === 'paid')
        const total = paid.reduce((s, o) => s + (Number(o.payable_amount) || 0), 0)
        return (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="border border-slate-200 rounded-lg p-3"><div className="text-xs text-slate-400 font-semibold">Orders</div><div className="text-lg font-black text-slate-800">{d.orders.length}</div></div>
              <div className="border border-slate-200 rounded-lg p-3"><div className="text-xs text-slate-400 font-semibold">Paid orders</div><div className="text-lg font-black text-slate-800">{paid.length}</div></div>
              <div className="border border-slate-200 rounded-lg p-3"><div className="text-xs text-slate-400 font-semibold">Total paid</div><div className="text-lg font-black text-slate-800">{money(total)}</div></div>
            </div>
            <Table
              emptyText="No course orders."
              head={['Date', 'Course', 'Plan', 'Price', 'Offer', 'Coupon', 'Discount', 'Paid', 'Status', 'Order ID', 'Payment ID']}
              rows={d.orders.map((o) => [
                fmtDateTime(o.createdAt), o.course, o.plan_name, money(o.original_amount, o.currency), money(o.offer_amount, o.currency),
                o.coupon_code, money(o.coupon_discount, o.currency), money(o.payable_amount, o.currency),
                <Badge key="s" ok={o.status === 'paid'} yes="Paid" no={o.status || 'Unpaid'} />, o.razorpay_order_id, o.razorpay_payment_id,
              ])}
            />
          </div>
        )
      }}
    </Wrap>
  )
}

export function LearningTab({ state }) {
  return (
    <Wrap state={state}>
      {(d) => (
        <div className="flex flex-col gap-4">
          <Section title="Course Progress">
            <Table
              emptyText="No lecture progress yet."
              head={['Course', 'Lectures completed', 'Total lectures', 'Progress', 'Last completed']}
              rows={d.course_progress.map((p) => [
                p.course, p.completed, p.total,
                <div key="b" className="flex items-center gap-2 min-w-[120px]"><div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${p.percent}%` }} /></div><span>{p.percent}%</span></div>,
                fmtDateTime(p.last_completed_at),
              ])}
            />
          </Section>
          <Section title="Recently Completed Lectures">
            <Table
              emptyText="No completed lectures."
              head={['Lecture', 'Subject', 'Course', 'Completed on']}
              rows={d.completed_lectures.map((l) => [l.lecture, l.subject, l.course, fmtDateTime(l.completed_at)])}
            />
          </Section>
          <Section title="Quiz Results">
            <Table
              emptyText="No quiz attempts."
              head={['Date', 'Quiz', 'Questions', 'Attempted', 'Correct', 'Wrong', 'Skipped', 'Marks', 'Percentage', 'Time taken']}
              rows={d.quiz_results.map((q) => [
                fmtDateTime(q.createdAt), q.quiz, q.total_questions, q.attempted, q.correct, q.wrong, q.skipped,
                `${q.marks_obtained ?? '—'} / ${q.total_marks ?? '—'}`, empty(q.percentage) ? '' : `${q.percentage}%`, q.time_taken,
              ])}
            />
          </Section>
        </div>
      )}
    </Wrap>
  )
}

export function ActivityTab({ state }) {
  return (
    <Wrap state={state}>
      {(d) => (
        <div className="flex flex-col gap-4">
          <Section title="Website Login">
            {d.web_session ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6">
                <div><div className="text-xs text-slate-400 font-semibold mb-0.5">Last login</div><div className="text-sm font-bold text-slate-800">{fmtDateTime(d.web_session.last_login) || '—'}</div></div>
                <div><div className="text-xs text-slate-400 font-semibold mb-0.5">IP address</div><div className="text-sm font-bold text-slate-800 break-all">{d.web_session.ip || '—'}</div></div>
                <div className="md:col-span-3"><div className="text-xs text-slate-400 font-semibold mb-0.5">Device / browser</div><div className="text-sm font-bold text-slate-800 break-words">{d.web_session.user_agent || '—'}</div></div>
              </div>
            ) : <p className="text-sm text-slate-400">No website login recorded.</p>}
          </Section>
          <Section title="Events & Webinars">
            <Table
              emptyText="Not registered for any events."
              head={['Event', 'Event date', 'Registered on', 'Status']}
              rows={d.events.map((e) => [e.event, fmtDate(e.event_date), fmtDateTime(e.enrolled_on), e.status])}
            />
          </Section>
          <Section title="Ratings & Reviews">
            <Table
              emptyText="No ratings or reviews."
              head={['Date', 'For', 'Item', 'Rating', 'Review', 'Status']}
              rows={d.ratings.map((r) => [fmtDateTime(r.createdAt), r.kind, r.item, stars(r.rating), r.review, r.status])}
            />
          </Section>
          <Section title="Job Applications">
            <Table
              emptyText="No job applications."
              head={['Applied on', 'Job', 'Company']}
              rows={d.job_applications.map((j) => [fmtDateTime(j.applied_at), j.job_title, j.company_name])}
            />
          </Section>
        </div>
      )}
    </Wrap>
  )
}
