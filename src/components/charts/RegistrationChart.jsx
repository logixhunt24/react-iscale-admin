import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

const FILTERS = ['7D', '30D', '90D', '1Y']
const FILTER_LABEL = { '7D': 'last 7 days', '30D': 'last 30 days', '90D': 'last 13 weeks', '1Y': 'last 12 months' }

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gradient-to-b from-white to-[#fcfcfd] border border-white ring-1 ring-black/[0.02] rounded-lg p-3 shadow-lg text-sm">
        <p className="font-semibold text-slate-500 mb-1 text-[11px] uppercase tracking-wider">{label}</p>
        <p className="font-bold text-slate-800 text-base">
          {payload[0].value.toLocaleString()} {payload[0].value === 1 ? 'registration' : 'registrations'}
        </p>
      </div>
    )
  }
  return null
}

export default function RegistrationChart() {
  const [filter, setFilter] = useState('1Y')
  const [data, setData] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    axios
      .get(`${BASE_URL}/myadmin/dashboard/graph?range=${filter}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => {
        if (cancelled) return
        setData((res.data?.data || []).map((d) => ({ name: d.name || d.month, value: d.count })))
        setStatus('ready')
      })
      .catch(() => { if (!cancelled) setStatus('error') })
    return () => { cancelled = true }
  }, [filter])

  const total = data.reduce((sum, d) => sum + d.value, 0)
  const peak = Math.max(...data.map((d) => d.value), 0)

  return (
    <div className="bg-gradient-to-b from-white to-[#fcfcfd] rounded-2xl border border-white ring-1 ring-black/[0.02] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] p-6 h-full flex flex-col hover:shadow-[0_15px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden">
      {/* Background glow behind the chart */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-green-500/5 to-transparent pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 relative z-10">
        <div>
          <h3 className="font-bold text-slate-800 text-[16px] mb-1">Registrations</h3>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {status === 'ready' ? total.toLocaleString() : '—'}
            </span>
            <span className="text-xs font-bold text-slate-500">in the {FILTER_LABEL[filter]}</span>
          </div>
        </div>

        <div className="flex items-center bg-slate-50 p-1 rounded-lg border border-white ring-1 ring-black/[0.02]">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                filter === f
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[300px] -ml-4 relative z-10">
        {status === 'error' ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">Could not load registrations.</div>
        ) : status === 'loading' ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                dy={10}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                domain={[0, Math.max(peak, 4)]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#22c55e', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorValue)"
                activeDot={{ r: 6, fill: '#22c55e', stroke: '#fff', strokeWidth: 3 }}
                animationDuration={1500}
                style={{ filter: 'url(#glow)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
