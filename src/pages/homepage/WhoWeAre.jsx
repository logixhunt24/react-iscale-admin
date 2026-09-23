import { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../config/api'
import { getImageUrl } from '../../utils/imageUtils'

// Single editable section (not a list) - backs the homepage's "Who We Are"
// block: pill text, heading, paragraph, and the row of 3 press/media
// highlight cards shown below it.
export default function WhoWeAre() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [backendError, setBackendError] = useState(null)

  const [pillText, setPillText] = useState('')
  const [heading, setHeading] = useState('')
  const [description, setDescription] = useState('')
  const [cards, setCards] = useState([
    { title: '', link: '', image: '' },
    { title: '', link: '', image: '' },
    { title: '', link: '', image: '' },
  ])
  const [cardFiles, setCardFiles] = useState([null, null, null])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}/myadmin/who-we-are/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = response.data?.data
        if (data) {
          setPillText(data.pill_text || '')
          setHeading(data.heading || '')
          setDescription(data.description || '')
          const loadedCards = [0, 1, 2].map((i) => ({
            title: data.cards?.[i]?.title || '',
            link: data.cards?.[i]?.link || '',
            image: data.cards?.[i]?.image || '',
          }))
          setCards(loadedCards)
        }
      } catch (err) {
        console.error('Error fetching Who We Are section', err)
      } finally {
        setFetching(false)
      }
    }
    fetchData()
  }, [])

  const updateCardField = (idx, field, value) => {
    setCards((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)))
  }

  const updateCardFile = (idx, file) => {
    setCardFiles((prev) => prev.map((f, i) => (i === idx ? file : f)))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setBackendError(null)
      const token = localStorage.getItem('token')

      const payload = new FormData()
      payload.append('m_pill_text', pillText.trim())
      payload.append('m_heading', heading.trim())
      payload.append('m_description', description.trim())
      payload.append('m_cards', JSON.stringify(cards.map((c) => ({ title: c.title, link: c.link }))))
      cardFiles.forEach((file, i) => {
        if (file) payload.append(`card_image_${i}`, file)
      })

      const response = await axios.put(`${BASE_URL}/myadmin/who-we-are/update`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data?.status) {
        await window.customAlert('Updated successfully')
        setCardFiles([null, null, null])
        const data = response.data.data
        if (data) {
          const loadedCards = [0, 1, 2].map((i) => ({
            title: data.cards?.[i]?.title || '',
            link: data.cards?.[i]?.link || '',
            image: data.cards?.[i]?.image || '',
          }))
          setCards(loadedCards)
        }
      } else {
        setBackendError(response.data?.message || 'Failed to save')
      }
    } catch (error) {
      console.error(error)
      setBackendError(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full animate-fade-in-up flex flex-col min-h-0">
      <div className="bg-[#f6f6ff] rounded-2xl shadow-md hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-shadow border border-slate-100 transition-colors overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="bg-[#144f36] rounded-t-2xl p-5 flex justify-between items-center shadow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white dark:bg-[#13111c]/10 rounded-full blur-2xl group-hover:bg-white dark:bg-[#13111c]/20 transition-all duration-700 pointer-events-none"></div>

          <div className="flex items-center relative z-10">
            <div className="w-1.5 h-7 bg-white dark:bg-[#13111c]/90 rounded-full mr-4 shadow-[0_0_12px_rgba(255,255,255,0.9)] hidden sm:block"></div>
            <h2 className="text-white font-bold tracking-wide text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
              Who We Are Section
            </h2>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {backendError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg whitespace-pre-wrap font-mono text-sm shadow-sm">
              <strong className="font-bold">Error:</strong><br />
              {backendError}
            </div>
          )}

          {fetching ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : (
            <>
              <p className="text-xs text-slate-500 mb-4">
                Controls the "Know About iScale Learning" block on the homepage — the small pill above the
                heading, the heading and paragraph, and the 3 press/media highlight cards shown below it.
              </p>

              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">Pill Text</label>
                  <input
                    type="text"
                    value={pillText}
                    onChange={(e) => setPillText(e.target.value)}
                    placeholder="e.g. Who We Are"
                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">Heading</label>
                  <input
                    type="text"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    placeholder="e.g. Know About iScale Learning"
                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-[#144f36] focus:ring-1 focus:ring-[#144f36]"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-800 mb-2">Press / Media Highlight Cards</label>
                <p className="text-xs text-slate-500 mb-3">Exactly 3 cards, shown as a row below the description. Each is an image with the title overlaid on top, linking out when clicked.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {cards.map((card, idx) => (
                    <div key={idx} className="border border-slate-200 rounded p-3">
                      <label className="block text-[13px] font-bold text-slate-800 mb-1">Card {idx + 1} Image</label>
                      <div className="flex items-center gap-2 mb-2">
                        {(cardFiles[idx] || card.image) && (
                          <img
                            src={cardFiles[idx] ? URL.createObjectURL(cardFiles[idx]) : getImageUrl(card.image)}
                            alt={`Card ${idx + 1}`}
                            className="w-14 h-14 rounded object-cover border border-slate-300 flex-shrink-0"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => updateCardFile(idx, e.target.files?.[0] || null)}
                          className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border file:border-slate-300 file:bg-white file:text-slate-700 hover:file:bg-slate-50 cursor-pointer"
                        />
                      </div>
                      <label className="block text-[13px] font-bold text-slate-800 mb-1">Title</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => updateCardField(idx, 'title', e.target.value)}
                        placeholder="Card title"
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36] mb-2"
                      />
                      <label className="block text-[13px] font-bold text-slate-800 mb-1">Link (optional)</label>
                      <input
                        type="text"
                        value={card.link}
                        onChange={(e) => updateCardField(idx, 'link', e.target.value)}
                        placeholder="https://..."
                        className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#144f36]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#144f36] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#0f3d2a] transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
