import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import PageHeader from '../../components/ui/PageHeader'
import { ArrowLeft, User, Phone, Mail, BookOpen, MapPin, Calendar, Briefcase, GraduationCap } from 'lucide-react'

export default function AnalyticsDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${BASE_URL}/myadmin/data-analytics/details/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.data?.status && res.data.data) {
          setData(res.data.data)
        }
      } catch (err) {
        console.error("Failed to load details", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
  }, [id])

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#144f36] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading details...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-xl text-slate-600 dark:text-slate-400">Record not found.</p>
        <Link 
          to={'/analytics'}
          className="inline-block mt-4 bg-[#144f36] text-white px-6 py-2 rounded-full font-bold hover:bg-[#0f3d2a] transition-colors"
        >
          Back to Analytics
        </Link>
      </div>
    )
  }

  return (
    <div className="h-full animate-fade-in-up flex flex-col gap-6">
      <div className="flex items-center gap-4 mb-2">
        <Link 
          to={'/analytics'}
          className="inline-block p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft size={24} />
        </Link>
        <PageHeader
          title="Analytics Details"
          subtitle="View complete lead information"
          breadcrumbs={[{ label: 'Analytics', path: '/analytics' }, { label: 'Details' }]}
        />
      </div>

      <div className="bg-white dark:bg-[#13111c] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 max-w-4xl mx-auto w-full">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
          <h3 className="text-2xl font-bold text-[#144f36] dark:text-emerald-500 mb-2">
            {data.m_lg_title || 'Lead Entry Details'}
          </h3>
          <p className="text-slate-500 text-sm">Submitted on: {new Date(data.createdAt).toLocaleString('en-IN')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Full Name</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{data.data_name || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Mobile Number</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{data.data_mobile || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-xl text-green-600">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5 opacity-70" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">WhatsApp Number</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{data.data_whatsapp || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-600">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Email Address</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{data.data_email || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-600">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">College/Institute</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{data.data_college_name || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600">
                <GraduationCap size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Education / Field</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">
                  {[data.data_qualification, data.data_study_field, data.data_branch].filter(Boolean).join(' - ') || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Passing Year</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{data.data_passing_year || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-50 dark:bg-teal-500/10 rounded-xl text-teal-600">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">State / Status</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">
                  {data.data_state || 'N/A'} {data.data_status ? `(Status: ${data.data_status})` : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
