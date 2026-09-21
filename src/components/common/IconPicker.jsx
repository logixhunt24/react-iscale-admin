import { useState } from 'react'
import * as Icons from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { ICON_OPTIONS } from '../../utils/iconOptions'

// Small dropdown grid for picking a lucide-react icon by name, used
// wherever an admin needs to assign an icon to something without uploading
// an image (e.g. Career Fit's feature chips). Stores/returns just the
// icon's string name — the consuming page resolves it back to the actual
// component both here and on the public frontend.
export default function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const SelectedIcon = Icons[value] || Icons.Sparkles
  const filtered = ICON_OPTIONS.filter((name) => name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 border border-slate-300 dark:border-gray-700 bg-[#f6f6ff] dark:bg-[#13111c] text-slate-700 dark:text-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] w-full"
      >
        <SelectedIcon size={16} />
        <span className="flex-1 text-left">{value || 'Sparkles'}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-64 border border-slate-300 dark:border-gray-700 rounded bg-white dark:bg-[#13111c] shadow-lg">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search icons..."
            autoFocus
            className="w-full border-b border-slate-200 dark:border-gray-800 px-3 py-2 text-sm outline-none bg-transparent"
          />
          <div className="grid grid-cols-6 gap-1 p-2 max-h-48 overflow-y-auto">
            {filtered.map((name) => {
              const Icon = Icons[name]
              if (!Icon) return null
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => { onChange(name); setOpen(false); setSearch('') }}
                  className={`flex items-center justify-center p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1f1b2e] transition-colors ${name === value ? 'bg-[#144f36]/10 text-[#144f36]' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  <Icon size={16} />
                </button>
              )
            })}
            {filtered.length === 0 && (
              <p className="col-span-6 text-xs text-slate-400 p-2">No icons match "{search}"</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
