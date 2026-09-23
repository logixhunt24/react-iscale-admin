import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../config/api'

// Edit pages that build their form from the row the list page passes in
// location.state have nothing to show when opened in a new tab or refreshed.
// This wrapper loads the same list the list page uses, finds the row by the
// :id in the URL, and puts it into location.state before rendering the page.
export default function withListRow(Component, { endpoint, stateKey, params }) {
  return function WithListRow(props) {
    const location = useLocation()
    const navigate = useNavigate()
    const { id } = useParams()
    const hasRow = !!location.state?.[stateKey]
    const [error, setError] = useState('')

    useEffect(() => {
      if (hasRow) return
      let cancelled = false
      const load = async () => {
        try {
          const token = localStorage.getItem('token')
          const res = await axios.get(`${BASE_URL}${endpoint}`, {
            params,
            headers: { Authorization: `Bearer ${token}` }
          })
          const body = res.data
          const list = Array.isArray(body) ? body
            : body?.data || body?.events || body?.categories || body?.eventCategories || []
          const row = list.find(r => String(r?._id ?? r?.id) === String(id))
          if (cancelled) return
          if (row) {
            navigate(location.pathname + location.search, { replace: true, state: { ...location.state, [stateKey]: row } })
          } else {
            setError('Record not found. It may have been deleted.')
          }
        } catch (err) {
          console.error('Failed to load record:', err)
          if (!cancelled) setError('Failed to load record.')
        }
      }
      load()
      return () => { cancelled = true }
    }, [hasRow, id])

    if (hasRow) return <Component key={id} {...props} />
    return (
      <div className={`p-6 text-sm ${error ? 'text-red-600' : 'text-slate-500'}`}>
        {error || 'Loading...'}
      </div>
    )
  }
}
