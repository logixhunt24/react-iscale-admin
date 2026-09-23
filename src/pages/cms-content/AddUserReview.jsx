import Button from '../../components/common/Button'
import { useNavigate, Link } from 'react-router-dom'

export default function AddUserReview() {
  const navigate = useNavigate()

  return (
    <div className="h-full animate-fade-in-up">
      <div className="bg-[#eef5fa] p-4 min-h-screen">
        <div className="bg-white dark:bg-[#13111c] rounded-lg p-4 mb-4 shadow-sm border border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-medium text-slate-700 dark:text-slate-300">Add User Review</h2>
          <Link 
            to={'/home-page-reviews'}
            className="bg-[#428bca] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#3071a9] transition-colors flex items-center gap-1"
          >
            <span>↩ Back</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-[#13111c] rounded-lg shadow-sm border border-slate-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">User Name</label>
              <input 
                type="text" 
                placeholder="User Name"
                className="w-full border border-slate-300 dark:border-[#1f1b2e] rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white dark:bg-[#13111c]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">User Designation</label>
              <input 
                type="text" 
                placeholder="User Designation..."
                className="w-full border border-slate-300 dark:border-[#1f1b2e] rounded px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white dark:bg-[#13111c]"
              />
            </div>
          </div>

          <div className="mb-5 md:w-1/2 md:pr-2.5">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">User Image</label>
            <button className="bg-[#428bca] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#3071a9] transition-colors w-full flex items-center justify-center gap-2">
              <span>📷</span> Partner Image
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">User Review</label>
            {/* Mock Rich Text Editor */}
            <div className="border border-slate-300 dark:border-[#1f1b2e] rounded bg-white dark:bg-[#13111c]">
              <div className="bg-slate-100 dark:bg-[#1f1b2e]/50 border-b border-slate-300 dark:border-[#1f1b2e] p-2 flex flex-wrap gap-1 text-slate-600 dark:text-slate-400">
                <button className="px-2 py-1 hover:bg-slate-200 rounded text-sm font-bold">B</button>
                <button className="px-2 py-1 hover:bg-slate-200 rounded text-sm italic">I</button>
                <button className="px-2 py-1 hover:bg-slate-200 rounded text-sm underline">U</button>
                <span className="w-px h-6 bg-slate-300 mx-1"></span>
                <select className="border border-slate-300 dark:border-[#1f1b2e] rounded text-sm px-1 py-1 bg-white dark:bg-[#13111c]">
                  <option>Paragraph</option>
                </select>
                <select className="border border-slate-300 dark:border-[#1f1b2e] rounded text-sm px-1 py-1 bg-white dark:bg-[#13111c]">
                  <option>Styles</option>
                </select>
                <select className="border border-slate-300 dark:border-[#1f1b2e] rounded text-sm px-1 py-1 bg-white dark:bg-[#13111c]">
                  <option>Format</option>
                </select>
              </div>
              <textarea 
                placeholder="Enter User Review"
                rows={10}
                className="w-full p-3 text-sm outline-none resize-none"
              ></textarea>
              <div className="bg-slate-50 dark:bg-[#1f1b2e]/50 border-t border-slate-300 dark:border-[#1f1b2e] p-1 flex justify-between items-center text-xs text-slate-400">
                <span>p</span>
                <span className="flex items-center gap-1"><span className="text-red-500 font-bold">tiny</span></span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="bg-[#428bca] text-white px-10 py-2 rounded-lg text-sm font-medium hover:bg-[#3071a9] transition-colors flex-1">
              Submit
            </button>
            <Link 
              to={'/home-page-reviews'}
              className="inline-block bg-[#d87025] text-white px-10 py-2 rounded-lg text-sm font-medium hover:bg-[#c2621f] transition-colors flex-1"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
