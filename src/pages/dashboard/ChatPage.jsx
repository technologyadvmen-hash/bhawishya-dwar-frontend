import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, Loader, Hand, Sparkles } from 'lucide-react'
import { aiService } from '../../services'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const SUGGESTED = [
  'What does my life line say about my vitality and health?',
  'What are my career and financial strengths according to my palm lines?',
  'What does my heart line reveal about emotional relationships?',
  'Can you explain the meaning of mounts on my palm?',
  'What is my Vedic elemental constitution and personality type?',
]

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
        language: user?.language || 'en'
      })
      setSessionId(res.data.sessionId)
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.reply }])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Chat failed. Please try again.')
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Apologies, I encountered an error connecting to the stars. Please try again.' }
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
                Vedic Wisdom Engine • Dual Hindi & English
              </p>
            </div>
          </div>
          <span className="badge-purple hidden sm:inline-flex">
            ✦ AI Advisor Active
          </span>
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
              Ask Bhawishya Dwar
            </h3>
            <p className="text-[#35243B]/60 text-sm max-w-md mx-auto mb-6">
              Ask anything about your detected palm lines, planetary transits, relationships, career, or life insights.
            </p>
            <div className="space-y-2 max-w-lg mx-auto">
              {SUGGESTED.map((q, i) => (
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
                className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
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
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#641A78]/70 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span className="text-xs text-[#35243B]/50 ml-1">Consulting the cosmos...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="card p-2.5 sm:p-3 flex gap-2 sm:gap-3 items-end shadow-md flex-shrink-0">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          placeholder="Ask a question about your palm or horoscope..."
          rows={1}
          className="flex-1 bg-transparent text-[#35243B] placeholder-[#35243B]/40 text-sm resize-none focus:outline-none max-h-32 px-2 py-1.5"
          style={{ minHeight: '26px' }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center flex-shrink-0 p-0 disabled:opacity-40"
        >
          {loading ? (
            <Loader size={16} className="text-white animate-spin" />
          ) : (
            <Send size={16} className="text-white" />
          )}
        </button>
      </div>

      <p className="text-[#35243B]/40 text-[11px] text-center mt-2 flex-shrink-0">
        ✦ Bhawishya Dwar interpretations are provided for self-reflection and personal insight.
      </p>
    </div>
  )
}
