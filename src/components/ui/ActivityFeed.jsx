import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'


export default function ActivityFeed({ apiData }) {
  // Helper to format date to relative time
  const getRelativeTime = (dateInput) => {
    if (!dateInput) return 'Just now';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return dateInput;

    const now = new Date();
    const diffMs = now - date;
    
    if (diffMs < 0) return 'Just now';
    if (diffMs < 10000) return 'Just now';

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  let displayActivities = [];

  if (apiData && typeof apiData === 'object') {
    const dataSource = apiData.data || apiData;
    const latestCandidates = dataSource.latestCandidates || [];
    const latestEnrollments = dataSource.latestEnrollments || [];

    if (Array.isArray(latestCandidates) && Array.isArray(latestEnrollments) && (latestCandidates.length > 0 || latestEnrollments.length > 0)) {
      const fullName = (first, last) => [first, last].filter(Boolean).join(' ').trim();

      const candActivities = latestCandidates.map(cand => ({
        id: cand._id || `cand-${cand.c_email}`,
        type: 'user',
        title: 'New Student Registered',
        desc: `${cand.c_display_name || fullName(cand.c_first_name, cand.c_last_name) || 'A new student'} registered (${cand.c_email || 'no email'})`,
        time: getRelativeTime(cand.c_register_date),
        date: new Date(cand.c_register_date || Date.now()),
        icon: 'User',
        color: 'text-[#22c55e] bg-green-50'
      }));

      const enrollActivities = latestEnrollments.map(enroll => ({
        id: enroll._id || `enroll-${enroll.enrolled_on}`,
        type: 'course',
        title: 'Course Purchased',
        desc: `${enroll.user_id?.c_display_name || fullName(enroll.user_id?.c_first_name, enroll.user_id?.c_last_name) || 'A student'} purchased ${enroll.course_id?.m_course_title || 'a course'}`,
        time: getRelativeTime(enroll.enrolled_on),
        date: new Date(enroll.enrolled_on || Date.now()),
        icon: 'ShoppingCart',
        color: 'text-blue-500 bg-blue-50'
      }));

      displayActivities = [...candActivities, ...enrollActivities].sort((a, b) => b.date.getTime() - a.date.getTime());
    } else if (Array.isArray(apiData) && apiData.length > 0) {
      displayActivities = apiData.map((act, index) => {
        let iconName = act.icon || 'Bell';
        if (!Icons[iconName]) {
          if (act.type === 'user' || act.type === 'registration') iconName = 'User';
          else if (act.type === 'course' || act.type === 'purchase') iconName = 'ShoppingCart';
          else if (act.type === 'quiz') iconName = 'FileText';
          else if (act.type === 'live_class' || act.type === 'class') iconName = 'Video';
          else iconName = 'Bell';
        }

        let colorClass = act.color || 'text-indigo-500 bg-indigo-50';
        if (!act.color) {
          if (iconName === 'User') colorClass = 'text-[#22c55e] bg-green-50';
          else if (iconName === 'ShoppingCart') colorClass = 'text-blue-500 bg-blue-50';
          else if (iconName === 'FileText') colorClass = 'text-orange-500 bg-orange-50';
          else if (iconName === 'Video') colorClass = 'text-purple-500 bg-purple-50';
        }

        return {
          id: act._id || act.id || index,
          title: act.title || act.name || 'New Activity',
          desc: act.desc || act.description || act.message || 'A new action was logged',
          time: getRelativeTime(act.time || act.date || act.createdAt),
          date: new Date(act.time || act.date || act.createdAt || Date.now()),
          icon: iconName,
          color: colorClass
        };
      });
    }
  }

  return (
    <div className="bg-gradient-to-b from-white to-[#fcfcfd] rounded-2xl border border-white ring-1 ring-black/[0.02] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] h-full flex flex-col hover:shadow-[0_15px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-300">
      <div className="p-5 border-b border-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-[15px]">Recent Activities</h3>
        <button className="text-[#22c55e] hover:text-[#16a34a] text-xs font-bold transition-colors">View All</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="flex flex-col gap-4">
          {displayActivities.length === 0 ? (
            <div className="text-center text-slate-400 text-sm py-4">No recent activities</div>
          ) : (
            displayActivities.map((activity, i) => {
              const IconComp = Icons[activity.icon] || Icons.Bell
              return (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  key={activity.id} 
                  className="flex items-start gap-4 cursor-pointer group"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${activity.color} group-hover:scale-110 transition-transform duration-300`}>
                    <IconComp size={16} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0 border-b border-slate-50 pb-3 group-last:border-0 group-last:pb-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <p className="text-[13px] font-bold text-slate-800 truncate">{activity.title}</p>
                      <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap ml-2">{activity.time}</span>
                    </div>
                    <p className="text-[12px] text-slate-500 truncate">{activity.desc}</p>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
