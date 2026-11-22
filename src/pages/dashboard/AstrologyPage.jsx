import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Loader, Calendar, Hash, Sparkles } from 'lucide-react'
import { astrologyService } from '../../services'
import toast from 'react-hot-toast'

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

const PERIODS = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' }
]

export default function AstrologyPage() {
  const [tab, setTab] = useState('horoscope')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  // Horoscope state
  const [zodiac, setZodiac] = useState('')
  const [period, setPeriod] = useState('daily')

  // Birth chart state
  const [birthForm, setBirthForm] = useState({
    day: '', month: '', year: '', hour: '12', min: '0', lat: '', lon: '', tzone: '5.5'
  })

  // Numerology state
  const [numForm, setNumForm] = useState({ day: '', month: '', year: '', name: '' })

  const handleTab = (t) => {
    setTab(t)
    setResult(null)
  }

  const getHoroscope = async () => {
    if (!zodiac) return toast.error('Please select your zodiac sign')
    setLoading(true)
    setResult(null)
    try {
      const res = await astrologyService.getHoroscope({ zodiacSign: zodiac, period })
      setResult({ type: 'horoscope', data: res.data.report.content })
      toast.success('Horoscope loaded!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch horoscope')
    } finally {
      setLoading(false)
    }
  }

  const getBirthChart = async () => {
    const { day, month, year, lat, lon } = birthForm
    if (!day || !month || !year || !lat || !lon) return toast.error('Please fill all required fields')
    setLoading(true)
    setResult(null)
    try {
      const res = await astrologyService.getBirthChart({
        ...birthForm,
        day: +birthForm.day,
        month: +birthForm.month,
        year: +birthForm.year,
        hour: +birthForm.hour,
        min: +birthForm.min,
        lat: +birthForm.lat,
        lon: +birthForm.lon,
        tzone: +birthForm.tzone,
      })
      setResult({ type: 'birthchart', data: res.data.report.content })
      toast.success('Birth chart generated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate birth chart')
    } finally {
      setLoading(false)
    }
  }

  const getNumerology = async () => {
    const { day, month, year, name } = numForm
    if (!day || !month || !year || !name) return toast.error('Please fill all fields')
    setLoading(true)
    setResult(null)
    try {
      const res = await astrologyService.getNumerology({
        day: +day,
        month: +month,
        year: +year,
        name
      })
      setResult({ type: 'numerology', data: res.data.report.content })
      toast.success('Numerology report ready!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to get numerology')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-[#F5EAF7] flex items-center justify-center">
            <Star size={18} className="text-[#641A78]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Astrology & <span className="gold-text">Kundli</span>
          </h1>
        </div>
        <p className="text-[#35243B]/60 text-sm">Real-time planetary alignments, Vedic birth charts & numerological cycles.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'horoscope', label: 'Horoscope', icon: Star },
          { key: 'birthchart', label: 'Birth Chart (Kundli)', icon: Calendar },
          { key: 'numerology', label: 'Numerology', icon: Hash },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => handleTab(t.key)}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              tab === t.key
                ? 'btn-primary'
                : 'card hover:bg-[#F5EAF7] text-[#35243B]/70 hover:text-[#641A78]'
            }`}
          >
            <t.icon size={15} className={tab === t.key ? 'text-[#D9A441]' : 'text-[#641A78]'} />
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Horoscope Tab */}
      {tab === 'horoscope' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 sm:p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#641A78] mb-3">
              Select Your Zodiac Sign
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {ZODIAC_SIGNS.map((sign) => (
                <button
                  key={sign}
                  onClick={() => setZodiac(sign)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    zodiac === sign
                      ? 'bg-[#641A78] text-white shadow-sm'
                      : 'bg-[#FFF9F0] border border-[#EADFED] text-[#35243B]/70 hover:border-[#641A78] hover:text-[#641A78]'
                  }`}
                >
                  {sign}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#641A78] mb-2.5">
              Forecast Horizon
            </label>
            <div className="flex gap-3">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    period === p.key
                      ? 'bg-[#F5EAF7] text-[#641A78] border border-[#641A78]'
                      : 'bg-[#FFF9F0] border border-[#EADFED] text-[#35243B]/60 hover:text-[#641A78]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={getHoroscope}
            disabled={loading}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base font-semibold"
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin text-white" />
                Reading Cosmic Transits...
              </>
            ) : (
              <>
                <Star size={16} className="text-[#D9A441]" />
                Unveil {period.charAt(0).toUpperCase() + period.slice(1)} Horoscope
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Birth Chart Tab */}
      {tab === 'birthchart' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 sm:p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#641A78] mb-2">
              Date of Birth
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                ['day', 'Day', 'DD'],
                ['month', 'Month', 'MM'],
                ['year', 'Year', 'YYYY'],
              ].map(([k, l, p]) => (
                <div key={k}>
                  <label className="block text-xs text-[#35243B]/60 mb-1">{l}</label>
                  <input
                    type="number"
                    value={birthForm[k]}
                    onChange={(e) => setBirthForm({ ...birthForm, [k]: e.target.value })}
                    className="input-field"
                    placeholder={p}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#641A78] mb-2">
              Exact Time of Birth (24h)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['hour', 'Hour (0-23)'],
                ['min', 'Minute (0-59)'],
              ].map(([k, l]) => (
                <div key={k}>
                  <label className="block text-xs text-[#35243B]/60 mb-1">{l}</label>
                  <input
                    type="number"
                    value={birthForm[k]}
                    onChange={(e) => setBirthForm({ ...birthForm, [k]: e.target.value })}
                    className="input-field"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#641A78] mb-2">
              Birth Location Coordinates
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#35243B]/60 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={birthForm.lat}
                  onChange={(e) => setBirthForm({ ...birthForm, lat: e.target.value })}
                  className="input-field"
                  placeholder="e.g. 28.6139 (Delhi)"
                />
              </div>
              <div>
                <label className="block text-xs text-[#35243B]/60 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={birthForm.lon}
                  onChange={(e) => setBirthForm({ ...birthForm, lon: e.target.value })}
                  className="input-field"
                  placeholder="e.g. 77.2090"
                />
              </div>
            </div>
            <p className="text-[#35243B]/45 text-xs mt-2">
              ✦ Coordinates are used to calculate precise ascendant degrees. (Timezone default: IST UTC+5:30)
            </p>
          </div>

          <button
            onClick={getBirthChart}
            disabled={loading}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base font-semibold"
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin text-white" />
                Calculating Vedic Chart...
              </>
            ) : (
              <>
                <Calendar size={16} className="text-[#D9A441]" />
                Generate Vedic Kundli Chart
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Numerology Tab */}
      {tab === 'numerology' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 sm:p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#641A78] mb-1.5">
              Full Legal Name
            </label>
            <input
              type="text"
              value={numForm.name}
              onChange={(e) => setNumForm({ ...numForm, name: e.target.value })}
              className="input-field"
              placeholder="As per official documents"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#641A78] mb-2">
              Date of Birth
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                ['day', 'Day', 'DD'],
                ['month', 'Month', 'MM'],
                ['year', 'Year', 'YYYY'],
              ].map(([k, l, p]) => (
                <div key={k}>
                  <label className="block text-xs text-[#35243B]/60 mb-1">{l}</label>
                  <input
                    type="number"
                    value={numForm[k]}
                    onChange={(e) => setNumForm({ ...numForm, [k]: e.target.value })}
                    className="input-field"
                    placeholder={p}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={getNumerology}
            disabled={loading}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base font-semibold"
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin text-white" />
                Computing Numerology Vibrations...
              </>
            ) : (
              <>
                <Hash size={16} className="text-[#D9A441]" />
                Calculate Destiny & Radical Numbers
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Results Block */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Horoscope Result */}
          {result.type === 'horoscope' && (
            <div className="card p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-[#EADFED] pb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {zodiac} — {period.charAt(0).toUpperCase() + period.slice(1)} Forecast
                  </h3>
                  <p className="text-xs text-[#641A78] font-semibold mt-0.5">Vedic Transit Interpretation</p>
                </div>
                <span className="badge-gold">Verified Transit</span>
              </div>

              <p className="text-[#35243B]/80 text-sm leading-relaxed">{result.data.overview}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  ['💛 Love & Relationships', result.data.love],
                  ['💼 Career & Finance', result.data.career],
                  ['🌿 Health & Vitality', result.data.health],
                ].map(([label, text]) => (
                  <div key={label} className="bg-[#FFF9F0] border border-[#EADFED] rounded-xl p-4">
                    <p className="text-[#641A78] text-xs font-bold mb-1.5">{label}</p>
                    <p className="text-[#35243B]/70 text-xs leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#EADFED]">
                <div className="bg-[#F5EAF7] p-3 rounded-xl border border-[#EADFED]">
                  <p className="text-[#35243B]/50 text-xs">Lucky Color</p>
                  <p className="text-[#641A78] text-sm font-bold mt-0.5">{result.data.luckyColor}</p>
                </div>
                <div className="bg-[#F5EAF7] p-3 rounded-xl border border-[#EADFED]">
                  <p className="text-[#35243B]/50 text-xs">Lucky Number</p>
                  <p className="text-[#D9A441] text-sm font-bold mt-0.5">{result.data.luckyNumber}</p>
                </div>
                <div className="bg-[#F5EAF7] p-3 rounded-xl border border-[#EADFED]">
                  <p className="text-[#35243B]/50 text-xs">Cosmic Advice</p>
                  <p className="text-[#35243B]/80 text-xs mt-0.5 leading-snug">{result.data.advice}</p>
                </div>
              </div>
            </div>
          )}

          {/* Birth Chart Result */}
          {result.type === 'birthchart' && (
            <div className="space-y-4">
              {result.data.astroDetails && (
                <div className="card p-6">
                  <h3 className="text-lg font-bold text-[#641A78] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Astro Kundli Details
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      ['Ascendant (Lagna)', result.data.astroDetails.ascendant],
                      ['Moon Sign (Rashi)', result.data.astroDetails.sign],
                      ['Nakshatra', result.data.astroDetails.Naksahtra],
                      ['Nakshatra Lord', result.data.astroDetails.NaksahtraLord],
                      ['Tithi', result.data.astroDetails.Tithi],
                      ['Yog', result.data.astroDetails.Yog],
                      ['Gan', result.data.astroDetails.Gan],
                      ['Tatva (Element)', result.data.astroDetails.tatva],
                    ].map(([k, v]) => v && (
                      <div key={k} className="bg-[#FFF9F0] border border-[#EADFED] rounded-xl p-3">
                        <p className="text-[#35243B]/50 text-[11px] font-medium">{k}</p>
                        <p className="text-[#641A78] text-sm font-bold mt-0.5">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.data.ascReport?.asc_report && (
                <div className="card p-6">
                  <h3 className="text-lg font-bold text-[#641A78] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Ascendant Reading — {result.data.ascReport.asc_report.ascendant}
                  </h3>
                  <p className="text-[#35243B]/75 text-sm leading-relaxed">{result.data.ascReport.asc_report.report}</p>
                </div>
              )}

              {result.data.planets && (
                <div className="card p-6">
                  <h3 className="text-lg font-bold text-[#641A78] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Planetary House Positions
                  </h3>
                  <div className="space-y-2">
                    {result.data.planets.map((p) => (
                      <div key={p.name} className="flex items-center justify-between bg-[#FFF9F0] border border-[#EADFED] rounded-xl px-4 py-2.5">
                        <span className="text-[#35243B] text-sm font-bold w-28">{p.name}</span>
                        <span className="text-[#641A78] font-semibold text-sm">{p.sign}</span>
                        <span className="text-[#35243B]/60 text-xs">House {p.house}</span>
                        <span className="text-[#35243B]/60 text-xs">{p.nakshatra}</span>
                        {p.isRetro === 'true' && <span className="badge-gold text-[10px]">Retrograde ℞</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Numerology Result */}
          {result.type === 'numerology' && (
            <div className="card p-6 sm:p-8">
              <h3 className="text-xl font-bold text-[#35243B] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                Numerology Core Cycles
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  ['Destiny', result.data.destiny_number],
                  ['Radical', result.data.radical_number],
                  ['Name', result.data.name_number],
                ].map(([l, v]) => (
                  <div key={l} className="bg-[#F5EAF7] border border-[#EADFED] rounded-2xl p-4 text-center">
                    <p className="text-[#641A78] text-xs font-semibold mb-1">{l} Number</p>
                    <p className="text-3xl font-extrabold text-[#D9A441]">{v}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  ['Radical Ruler', result.data.radical_ruler],
                  ['Fav Color', result.data.fav_color],
                  ['Fav Metal', result.data.fav_metal],
                  ['Fav Stone', result.data.fav_stone],
                  ['Fav Days', result.data.fav_day],
                  ['Fav Mantra', result.data.fav_mantra],
                  ['Harmonious Numbers', result.data.friendly_num],
                  ['Challenging Numbers', result.data.evil_num],
                ].map(([k, v]) => v && (
                  <div key={k} className="bg-[#FFF9F0] border border-[#EADFED] rounded-xl p-3">
                    <p className="text-[#35243B]/50 text-[11px]">{k}</p>
                    <p className="text-[#35243B] text-xs font-bold mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
