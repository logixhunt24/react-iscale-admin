import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

// Same numbering the backend and the old site use.
export const COUPON_TYPES = [
  { value: '1', label: 'Course', noun: 'Course', all: 'All courses' },
  { value: '2', label: 'Test Series', noun: 'Test Series Package', all: 'All test series packages' },
  { value: '3', label: 'Notes', noun: 'Notes', all: 'All notes' },
]

export const couponTypeLabel = (value) =>
  COUPON_TYPES.find((t) => t.value === String(value))?.label || (value ? String(value) : '-')

const inputCls =
  'w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36] bg-[#f6f6ff] text-slate-700'

const money = (n) => (n || n === 0 ? `₹ ${Number(n).toLocaleString('en-IN')}` : '')

// "Coupon Type" + the matching item picker + read-only prices, as on the old admin form.
// Controlled by the parent: value = { type, itemId }, onChange({ type, itemId, amount, offerAmount }).
export default function CouponTargetFields({ type, itemId, onChange }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

  const meta = COUPON_TYPES.find((t) => t.value === String(type)) || COUPON_TYPES[0]

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLoadError('')
    axios
      .get(`${BASE_URL}/myadmin/coupons/items`, {
        params: { type: meta.value },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => { if (!cancelled) setItems(res.data?.data || []) })
      .catch((err) => {
        if (!cancelled) {
          setItems([])
          setLoadError(err.response?.data?.message || 'Could not load the list')
        }
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [meta.value])

  const selected = items.find((i) => String(i._id) === String(itemId))

  // keep the parent's stored prices in step with the chosen item
  useEffect(() => {
    onChange({ type: meta.value, itemId, amount: selected?.price ?? 0, offerAmount: selected?.offer_price ?? 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?._id, selected?.price, selected?.offer_price])

  const changeType = (e) => onChange({ type: e.target.value, itemId: '', amount: 0, offerAmount: 0 })
  const changeItem = (e) => {
    const picked = items.find((i) => String(i._id) === e.target.value)
    onChange({ type: meta.value, itemId: e.target.value, amount: picked?.price ?? 0, offerAmount: picked?.offer_price ?? 0 })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
      <div>
        <label className="block text-sm font-bold text-slate-800 mb-1">Coupon Type</label>
        <select value={meta.value} onChange={changeType} className={inputCls}>
          {COUPON_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      <div className="lg:col-span-2">
        <label className="block text-sm font-bold text-slate-800 mb-1">{meta.noun}</label>
        <select value={itemId || ''} onChange={changeItem} disabled={loading} className={inputCls}>
          <option value="">{loading ? 'Loading...' : `${meta.all} (no restriction)`}</option>
          {items.map((i) => <option key={i._id} value={i._id}>{i.title}</option>)}
          {itemId && !selected && !loading && !loadError && <option value={itemId}>(saved item - no longer active)</option>}
        </select>
        {loadError && <p className="text-xs text-red-600 mt-1">{loadError}</p>}
        {!loadError && !itemId && !loading && (
          <p className="text-xs text-slate-500 mt-1">Leave as “{meta.all}” to let this coupon work on any {meta.noun.toLowerCase()}.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1">{meta.noun} Amount</label>
          <input readOnly value={selected ? money(selected.price) : ''} placeholder="—" className={`${inputCls} cursor-not-allowed`} />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1">Offer Amount</label>
          <input readOnly value={selected ? money(selected.offer_price) : ''} placeholder="—" className={`${inputCls} cursor-not-allowed`} />
        </div>
      </div>
    </div>
  )
}
