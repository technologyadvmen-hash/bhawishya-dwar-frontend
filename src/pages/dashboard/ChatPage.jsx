import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, Loader, Hand, Sparkles, Upload, X, Globe } from 'lucide-react'
import { aiService, palmService } from '../../services'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const SUGGESTED = {
  en: [
    'What does my life line say about my vitality?',
    'What are my career strengths according to my palm?',
    'What does my heart line reveal about relationships?',
    'Explain the meaning of mounts on my palm.',
    'What is my personality type based on my palm?',
  ],
  hi: [
    'मेरी जीवन रेखा मेरी जीवन शक्ति के बारे में क्या कहती है?',
    'मेरी हथेली के अनुसार मेरी करियर शक्तियां क्या हैं?',
    'मेरी हृदय रेखा रिश्तों के बारे में क्या बताती है?',
    'मेरी हथेली पर पर्वतों का क्या अर्थ है?',
    'मेरी हथेली के आधार पर मेरा व्यक्तित्व कैसा है?',
  ]
}

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [language, setLanguage] = useState(user?.language || 'en')
  const [palmImage, setPalmImage] = useState(null)
  const [palmBlob, setPalmBlob] = useState(null)
  const [uploadingPalm, setUploadingPalm] = useState(false)
  const [palmContext, setPalmContext] = useState(null)
  const bottomRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handlePalmUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Please select an image file')
    if (file.size > 10 * 1024 * 1024) return toast.error('Image must be under 10MB')

    setPalmImage(URL.createObjectURL(file))
    setPalmBlob(file)
    setUploadingPalm(true)

    try {
      const formData = new FormData()
      formData.append('palm', file, 'palm.jpg')
      formData.append('handType', 'right')
      const uploadRes = await palmService.upload(formData)
      const scanId = uploadRes.data.scan._id
      const analyzeRes = await palmService.analyze(scanId)
      setPalmContext(analyzeRes.data)
      const msg = language === 'hi'
        ? '✦ हथेली की छवि अपलोड और विश्लेषण हो गई। अब आप अपनी हथेली की रेखाओं के बारे में पूछ सकते हैं।'
        : '✦ Palm image uploaded and analyzed. You can now ask about your palm lines and features.'
      setMessages(prev => [...prev, { role: 'assistant', content: msg }])
      toast.success(language === 'hi' ? 'हथेली विश्लेषण सफल!' : 'Palm analyzed successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Palm analysis failed')
      setPalmImage(null)
      setPalmBlob(null)
    } finally {
      setUploadingPalm(false)
    }
  }

  const removePalm = () => {
    setPalmImage(null)
    setPalmBlob(null)
    setPalmContext(null)
  }

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: msg }])
    setLoading(true)
    try {
      const res = await aiService.chat({
        message: msg,
        sessionId,
        language,
        palmContext: palmContext || null,
      })
      setSessionId(res.data.sessionId)
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Chat failed. Please try again.')
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: language === 'hi' ? 'क्षमा करें, कोई त्रुटि हुई। कृपया पुनः प्रयास करें।' : 'Apologies, I encountered an error. Please try again.' }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-7.5rem)]">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl purple-gradient flex items-center justify-center shadow-md">
              <MessageCircle size={20} className="text-[#D9A441]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                AI <span className="gold-text">Astrologer</span>
              </h1>
              <p className="text-xs text-[#641A78] font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Vedic Wisdom Engine • Hindi & English
              </p>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-[#641A78]" />
            <button
              onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                language === 'hi'
                  ? 'bg-[#641A78] text-white border-[#641A78]'
                  : 'bg-white text-[#641A78] border-[#EADFED] hover:bg-[#F5EAF7]'
              }`}
            >
              {language === 'hi' ? 'हिंदी' : 'English'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-thin">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 px-4">
            <div className="w-16 h-16 rounded-full bg-[#F5EAF7] flex items-center justify-center mx-auto mb-4 border border-[#EADFED]">
              <Sparkles size={28} className="text-[#641A78]" />
            </div>
            <h3 className="text-lg font-bold text-[#35243B] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              {language === 'hi' ? 'भविष्य द्वार से पूछें' : 'Ask Bhawishya Dwar'}
            </h3>
            <p className="text-[#35243B]/60 text-sm max-w-md mx-auto mb-6">
              {language === 'hi'
                ? 'अपनी हथेली की रेखाओं, ग्रह स्थिति, रिश्तों या जीवन के बारे में कुछ भी पूछें।'
                : 'Ask anything about your palm lines, planetary transits, relationships, or life insights.'}
            </p>
            <div className="space-y-2 max-w-lg mx-auto">
              {SUGGESTED[language].map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="block w-full text-left px-4 py-3 card card-hover rounded-xl text-xs sm:text-sm text-[#35243B]/80 hover:text-[#641A78] hover:bg-[#F5EAF7] transition-all cursor-pointer font-medium"
                >
                  <span className="text-[#D9A441] mr-2">✦</span>
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full purple-gradient flex items-center justify-center mr-2.5 flex-shrink-0 mt-1 shadow-sm">
                  <MessageCircle size={14} className="text-[#D9A441]" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-[#641A78] text-white rounded-tr-sm'
                    : 'card rounded-tl-sm text-[#35243B]/85 bg-white border border-[#EADFED]'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start items-center">
            <div className="w-8 h-8 rounded-full purple-gradient flex items-center justify-center mr-2.5 flex-shrink-0 shadow-sm">
              <MessageCircle size={14} className="text-[#D9A441]" />
            </div>
            <div className="card rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[#641A78]/70 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span className="text-xs text-[#35243B]/50 ml-1">
                {language === 'hi' ? 'ब्रह्मांड से परामर्श...' : 'Consulting the cosmos...'}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Palm Image Preview */}
      {palmImage && (
        <div className="flex-shrink-0 mb-2 flex items-center gap-2 px-1">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-[#D9A441]/50 shadow-sm">
            <img src={palmImage} alt="Palm" className="w-full h-full object-cover" />
            {uploadingPalm && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader size={14} className="text-white animate-spin" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#641A78]">
              {uploadingPalm
                ? (language === 'hi' ? 'हथेली विश्लेषण हो रहा है...' : 'Analyzing palm...')
                : (language === 'hi' ? 'हथेली विश्लेषित ✓' : 'Palm analyzed ✓')}
            </p>
            <p className="text-[10px] text-[#35243B]/50">
              {language === 'hi' ? 'अब अपनी हथेली के बारे में पूछें' : 'Now ask about your palm features'}
            </p>
          </div>
          <button onClick={removePalm} className="w-6 h-6 rounded-full bg-[#EADFED] flex items-center justify-center hover:bg-rose-100 transition-colors">
            <X size={12} className="text-[#35243B]" />
          </button>
        </div>
      )}

      {/* Input Bar */}
      <div className="card p-2.5 sm:p-3 flex gap-2 sm:gap-3 items-end shadow-md flex-shrink-0">
        {/* Palm Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingPalm}
          className="w-10 h-10 rounded-xl bg-[#F5EAF7] border border-[#EADFED] flex items-center justify-center flex-shrink-0 hover:bg-[#641A78]/10 transition-colors disabled:opacity-40"
          title={language === 'hi' ? 'हथेली अपलोड करें' : 'Upload palm image'}
        >
          {uploadingPalm ? <Loader size={16} className="text-[#641A78] animate-spin" /> : <Hand size={16} className="text-[#641A78]" />}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePalmUpload} />

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
          }}
          placeholder={language === 'hi' ? 'अपनी हथेली या कुंडली के बारे में पूछें...' : 'Ask about your palm or horoscope...'}
          rows={1}
          className="flex-1 bg-transparent text-[#35243B] placeholder-[#35243B]/40 text-sm resize-none focus:outline-none max-h-32 px-2 py-1.5"
          style={{ minHeight: '26px' }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center flex-shrink-0 p-0 disabled:opacity-40"
        >
          {loading ? <Loader size={16} className="text-white animate-spin" /> : <Send size={16} className="text-white" />}
        </button>
      </div>

      <p className="text-[#35243B]/40 text-[11px] text-center mt-2 flex-shrink-0">
        ✦ {language === 'hi' ? 'भविष्य द्वार की व्याख्याएं आत्म-चिंतन के लिए हैं।' : 'Bhawishya Dwar interpretations are for self-reflection.'}
      </p>
    </div>
  )
}
