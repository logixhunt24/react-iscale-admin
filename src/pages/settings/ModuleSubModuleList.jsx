import { useNavigate, Link } from 'react-router-dom'
import { Lock, ArrowLeft } from 'lucide-react'

export default function ModuleSubModuleList() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 md:p-8 animate-fade-in-up">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#144f36]/5 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative bg-white/80 dark:bg-[#13111c]/80 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-[0_20px_50px_rgba(20,79,54,0.1)] transition-all duration-500 border border-slate-100 dark:border-slate-800/80 p-10 md:p-16 w-full max-w-lg mx-auto flex flex-col items-center text-center overflow-hidden">
        
        {/* Pulsing Icon Ring */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 mb-8">
          <div className="absolute inset-0 rounded-full bg-[#144f36]/10 animate-ping"></div>
          <div className="absolute inset-2 rounded-full bg-[#144f36]/20 animate-pulse"></div>
          <Lock className="w-10 h-10 text-[#144f36] dark:text-emerald-400 relative z-10" />
        </div>

        {/* Coming Soon Heading */}
        <h2 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mb-3">
          Coming Soon
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-sm leading-relaxed mb-8">
          The Permissions and Access Control page is currently under development.
        </p>

        {/* Back Button */}
        <Link
          to={'/dashboard'}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#144f36] dark:text-slate-400 dark:hover:text-emerald-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Dashboard</span>
        </Link>

      </div>
    </div>
  )
}
