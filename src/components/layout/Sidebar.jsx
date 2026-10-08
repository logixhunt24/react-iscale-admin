import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from 'lucide-react'
import { useTheme } from '../../store/ThemeContext'
import { menuItems } from '../../utils/menuItems'

const Icon = ({ name, size = 18, className = '' }) => {
  const LucideIcon = Icons[name]
  if (!LucideIcon) return null
  return <LucideIcon size={size} strokeWidth={2} className={className} />
}

function MenuItem({ item, collapsed }) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const isActive = location.pathname === item.path ||
    (item.children && item.children.some(c => c.path === location.pathname))
  const hasChildren = item.children && item.children.length > 0

  const handleClick = (e) => {
    if (!hasChildren) return
    // Let the browser handle ctrl/cmd/shift/middle-click as a normal
    // link open (new tab / new window) instead of just toggling the submenu.
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return
    e.preventDefault()
    setOpen(o => !o)
  }

  if (item.isHeader) {
    if (collapsed) return <div className="border-t border-white/10 mx-4 my-3" />
    return (
      <div className="px-6 pt-5 pb-2">
        <span className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase">{item.label}</span>
      </div>
    )
  }

  // Luxury sidebar styles
  const baseStyle = "flex items-center w-full text-left py-2.5 px-4 transition-all duration-300 rounded-r-lg group border-l-4 border-transparent hover:translate-x-2"
  const activeStyle = isActive 
    ? "text-white font-bold bg-white/10 border-l-white" 
    : "text-white/70 hover:text-white hover:bg-white/5 font-medium"

  return (
    <div className="mb-1 pr-3">
      {hasChildren ? (
        <Link
          to={item.path}
          onClick={handleClick}
          title={collapsed ? item.label : ''}
          className={`${baseStyle} ${activeStyle}`}
        >
          <span className={`shrink-0 mr-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-white text-[#144f36]' : 'bg-black/10 text-white/70 group-hover:bg-white/20 group-hover:text-white'}`}>
            <Icon name={item.icon} size={16} />
          </span>
          {!collapsed && (
            <>
              <span className="flex-1 truncate text-[13px]">{item.label}</span>
              <span className="shrink-0 text-white/50">
                <Icons.ChevronRight size={14} className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`} />
              </span>
            </>
          )}
        </Link>
      ) : (
        <Link
          to={item.path}
          title={collapsed ? item.label : ''}
          className={`${baseStyle} ${activeStyle}`}
        >
          <span className={`shrink-0 mr-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-white text-[#144f36]' : 'bg-black/10 text-white/70 group-hover:bg-white/20 group-hover:text-white'}`}>
            <Icon name={item.icon} size={16} />
          </span>
          {!collapsed && <span className="truncate text-[13px]">{item.label}</span>}
        </Link>
      )}

      <AnimatePresence initial={false}>
        {hasChildren && open && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="py-1 ml-[52px]">
              {item.children.map(child => (
                <Link
                  key={child.id}
                  to={child.path}
                  className={`block py-2 text-xs transition-colors ${
                    location.pathname === child.path
                      ? 'text-white font-semibold'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useTheme()

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#144f36] text-white">
      {/* Logo */}
      <div className={`flex pt-6 pb-6 ${sidebarCollapsed ? 'flex-col items-center gap-3 px-2' : 'items-center justify-between gap-3 px-4'}`}>
        {!sidebarCollapsed ? (
          <img src="/logo.png" alt="iScale Logo" className="h-10 object-contain bg-white rounded px-2 shadow-lg" />
        ) : (
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shrink-0 shadow-lg">
             <img src="/logo.png" alt="iScale" className="h-6 object-contain" />
          </div>
        )}

        {/* Collapse toggle (desktop only; the mobile drawer has its own close button) */}
        <button
          onClick={() => setSidebarCollapsed(c => !c)}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex shrink-0 w-8 h-8 items-center justify-center rounded-lg bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
        >
          {sidebarCollapsed ? <Icons.ChevronsRight size={18} /> : <Icons.ChevronsLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 pb-4">
        {!sidebarCollapsed && (
          <div className="px-6 py-2 mb-2">
            <span className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase">MAIN MENU</span>
          </div>
        )}
        
        {/* Restored the original menuItems mapping */}
        {menuItems.map(item => (
          <MenuItem key={item.id} item={item} collapsed={sidebarCollapsed} />
        ))}
      </div>
    </div>
  )

  return (
    <>
      <motion.aside
        animate={{ width: sidebarCollapsed ? 80 : 250 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex flex-col relative h-full bg-[#144f36] z-30 overflow-hidden shadow-2xl"
        style={{ minWidth: sidebarCollapsed ? 80 : 250 }}
      >
        {sidebarContent}
      </motion.aside>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-screen w-[250px] bg-[#144f36] z-50 lg:hidden overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Icons.X size={16} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
