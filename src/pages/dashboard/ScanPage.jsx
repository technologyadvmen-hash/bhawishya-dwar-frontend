import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Webcam from 'react-webcam'
import { Camera, Upload, Hand, RefreshCw, Loader, CheckCircle, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react'
import { palmService, aiService } from '../../services'
import toast from 'react-hot-toast'
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

// Palm line connections from MediaPipe hand landmarks
const PALM_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],       // Index
  [0, 9], [9, 10], [10, 11], [11, 12],  // Middle
  [0, 13], [13, 14], [14, 15], [15, 16],// Ring
  [0, 17], [17, 18], [18, 19], [19, 20],// Pinky
  [5, 9], [9, 13], [13, 17],            // Palm base
]

export default function ScanPage() {
  const navigate = useNavigate()
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const handLandmarkerRef = useRef(null)
  const animFrameRef = useRef(null)

  const [step, setStep] = useState('setup')
  const [handType, setHandType] = useState('right')
  const [capturedImage, setCapturedImage] = useState(null)
  const [capturedBlob, setCapturedBlob] = useState(null)
  const [cameraError, setCameraError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [mpReady, setMpReady] = useState(false)
  const [handDetected, setHandDetected] = useState(false)

  // Initialize MediaPipe HandLandmarker
  useEffect(() => {
    let cancelled = false
    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        })
        if (!cancelled) {
          handLandmarkerRef.current = landmarker
          setMpReady(true)
        }
      } catch (err) {
        console.error('MediaPipe init failed:', err)
      }
    }
    init()
    return () => { cancelled = true }
  }, [])

  // Draw landmarks on canvas
  const drawLandmarks = useCallback((landmarks) => {
    const canvas = canvasRef.current
    const video = webcamRef.current?.video
    if (!canvas || !video) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!landmarks || landmarks.length === 0) return

    const pts = landmarks[0]

    // Draw connections with Mystic Gold
    ctx.strokeStyle = 'rgba(217, 164, 65, 0.85)'
    ctx.lineWidth = 3
    PALM_CONNECTIONS.forEach(([a, b]) => {
      ctx.beginPath()
      ctx.moveTo(pts[a].x * canvas.width, pts[a].y * canvas.height)
      ctx.lineTo(pts[b].x * canvas.width, pts[b].y * canvas.height)
      ctx.stroke()
    })

    // Draw landmark dots with Royal Purple & Gold border
    pts.forEach((pt) => {
      ctx.beginPath()
      ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#641A78'
      ctx.fill()
      ctx.strokeStyle = '#D9A441'
      ctx.lineWidth = 2
      ctx.stroke()
    })
  }, [])

  // Detection loop
  const detect = useCallback(() => {
    const landmarker = handLandmarkerRef.current
    const video = webcamRef.current?.video
    if (!landmarker || !video || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(detect)
      return
    }
    const result = landmarker.detectForVideo(video, performance.now())
    const detected = result.landmarks && result.landmarks.length > 0
    setHandDetected(detected)
    drawLandmarks(result.landmarks)
    animFrameRef.current = requestAnimationFrame(detect)
  }, [drawLandmarks])

  // Start/stop detection loop when on capture step
  useEffect(() => {
    if (step === 'capture' && mpReady) {
      animFrameRef.current = requestAnimationFrame(detect)
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      const ctx = canvasRef.current?.getContext('2d')
      if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      setHandDetected(false)
    }
  }, [step, mpReady, detect])

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (!imageSrc) return toast.error('Could not capture image. Try again.')
    setCapturedImage(imageSrc)
    fetch(imageSrc).then(r => r.blob()).then(blob => setCapturedBlob(blob))
    setStep('preview')
  }, [])

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Please select an image file')
    if (file.size > 10 * 1024 * 1024) return toast.error('Image must be under 10MB')
    setCapturedImage(URL.createObjectURL(file))
    setCapturedBlob(file)
    setStep('preview')
  }

  const analyzeNow = async () => {
    if (!capturedBlob) return
    setLoading(true)
    setStep('analyzing')
    try {
      const formData = new FormData()
      formData.append('palm', capturedBlob, 'palm.jpg')
      formData.append('handType', handType)
      const uploadRes = await palmService.upload(formData)
      const scanId = uploadRes.data.scan._id
      const analyzeRes = await palmService.analyze(scanId)
      setScanResult(analyzeRes.data)
      setStep('done')
      toast.success('Palm analyzed successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Please try again.')
      setStep('preview')
    } finally {
      setLoading(false)
    }
  }

  const generateReading = async () => {
    if (!scanResult?.scan?._id) return
    setLoading(true)
    try {
      const res = await aiService.generateReading({ scanId: scanResult.scan._id, reportType: 'general' })
      toast.success('Reading generated!')
      navigate(`/dashboard/reports/${res.data.report._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate reading')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-[#F5EAF7] flex items-center justify-center">
            <Hand size={18} className="text-[#641A78]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            AI Palm <span className="gold-text">Scanner</span>
          </h1>
        </div>
        <p className="text-[#35243B]/60 text-sm">Capture or upload your palm image for high-precision neural analysis</p>
      </motion.div>

      {/* Hand Selection */}
      {(step === 'setup' || step === 'capture') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-4">
          <p className="text-xs font-semibold text-[#641A78] uppercase tracking-wider mb-2.5">Select hand to scan:</p>
          <div className="flex gap-3">
            {['left', 'right'].map((h) => (
              <button
                key={h}
                onClick={() => setHandType(h)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
                  handType === h
                    ? 'btn-primary'
                    : 'bg-white border border-[#EADFED] text-[#35243B]/70 hover:bg-[#F5EAF7] hover:text-[#641A78]'
                }`}
              >
                {h} Hand
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Setup Step */}
      {step === 'setup' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="card p-6 space-y-3">
            <h3 className="text-[#35243B] font-bold text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
              Guidelines for Best Accuracy:
            </h3>
            {[
              'Ensure bright, even lighting across your entire palm',
              'Hold your hand flat with fingers relaxed and open',
              'Keep the palm facing directly towards the camera',
              'Remove rings, watches, or bracelets for cleanest line detection'
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-[#35243B]/70">
                <CheckCircle2 size={16} className="text-[#D9A441] flex-shrink-0" />
                <span>{tip}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setStep('capture')}
              className="flex flex-col items-center gap-3 p-7 card card-hover cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#F5EAF7] flex items-center justify-center">
                <Camera size={26} className="text-[#641A78]" />
              </div>
              <span className="text-[#35243B] font-bold text-sm">Use Live Camera</span>
              <span className="text-[#35243B]/50 text-xs">Real-time landmark guidance</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-3 p-7 card card-hover cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#F5EAF7] flex items-center justify-center">
                <Upload size={26} className="text-[#641A78]" />
              </div>
              <span className="text-[#35243B] font-bold text-sm">Upload Photo</span>
              <span className="text-[#35243B]/50 text-xs">JPG, PNG or WEBP up to 10MB</span>
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </motion.div>
      )}

      {/* Camera Capture Step */}
      {step === 'capture' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-[#35243B] aspect-video border-2 border-[#EADFED] shadow-lg">
            {cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <AlertCircle size={36} className="text-rose-400" />
                <p className="text-white font-medium text-sm">Camera access was denied or not detected</p>
                <button onClick={() => fileInputRef.current?.click()} className="btn-gold text-xs px-4 py-2 mt-2">
                  Upload an image instead
                </button>
              </div>
            ) : (
              <>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  mirrored={false}
                  onUserMediaError={() => setCameraError(true)}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ pointerEvents: 'none' }}
                />
                <div className="absolute top-4 left-0 right-0 flex justify-center px-4">
                  {!mpReady ? (
                    <span className="text-xs bg-[#35243B]/80 backdrop-blur-md text-white/80 px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                      <Loader size={12} className="animate-spin text-[#D9A441]" /> Initializing hand detector...
                    </span>
                  ) : handDetected ? (
                    <span className="text-xs bg-emerald-950/80 backdrop-blur-md border border-emerald-400/30 text-emerald-300 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 font-medium shadow-sm">
                      <CheckCircle size={12} className="text-emerald-400" /> Hand detected — ready to capture
                    </span>
                  ) : (
                    <span className="text-xs bg-[#35243B]/80 backdrop-blur-md text-white/80 px-3.5 py-1.5 rounded-full border border-white/10">
                      ✦ Position your palm inside the screen
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('setup')}
              className="btn-secondary flex-1 py-3"
            >
              Back
            </button>
            <button
              onClick={capture}
              disabled={!handDetected && mpReady}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
            >
              <Camera size={18} />
              {mpReady && !handDetected ? 'Position Hand...' : 'Capture Palm'}
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </motion.div>
      )}

      {/* Preview Step */}
      {step === 'preview' && capturedImage && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="rounded-2xl overflow-hidden aspect-video bg-[#35243B] border border-[#EADFED] shadow-md">
            <img src={capturedImage} alt="Palm preview" className="w-full h-full object-contain" />
          </div>
          <div className="card p-4 flex items-center justify-between">
            <p className="text-sm text-[#35243B]/70">
              <span className="font-semibold text-[#641A78]">Selected Hand:</span> {handType.charAt(0).toUpperCase() + handType.slice(1)} Hand
            </p>
            <span className="badge-purple">Image Ready</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setCapturedImage(null); setStep('setup') }}
              className="btn-secondary px-5 py-3 flex items-center gap-2"
            >
              <RefreshCw size={16} /> Retake
            </button>
            <button
              onClick={analyzeNow}
              disabled={loading}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 text-base font-semibold"
            >
              <Hand size={18} /> Run AI Analysis
            </button>
          </div>
        </motion.div>
      )}

      {/* Analyzing Step */}
      {step === 'analyzing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-12 text-center">
          <div className="w-16 h-16 rounded-full border-3 border-[#641A78] border-t-transparent animate-spin mx-auto mb-6" />
          <h3 className="text-xl font-bold text-[#35243B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Analyzing Your Palm Lines
          </h3>
          <p className="text-[#35243B]/60 text-sm max-w-sm mx-auto">
            MediaPipe vision engine is isolating your Life, Heart, Head, and Fate lines with confidence scoring...
          </p>
        </motion.div>
      )}

      {/* Done Step */}
      {step === 'done' && scanResult && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle size={20} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Palm Features Extracted
                </h3>
                <p className="text-xs text-[#35243B]/50">Confidence breakdown from AI computer vision</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {['lifeLine', 'heartLine', 'headLine', 'fateLine'].map((line) => {
                const feature = scanResult.features?.[line]
                return (
                  <div key={line} className="bg-[#F5EAF7]/70 border border-[#EADFED] rounded-xl p-3.5">
                    <p className="text-[#641A78] text-xs font-semibold capitalize mb-1">
                      {line.replace('Line', ' Line')}
                    </p>
                    <p className={`text-sm font-bold ${feature?.detected ? 'text-emerald-700' : 'text-[#35243B]/40'}`}>
                      {feature?.detected ? `${feature.confidence}% confidence` : 'Not detected'}
                    </p>
                  </div>
                )
              })}
            </div>

            <button
              onClick={generateReading}
              disabled={loading}
              className="btn-gold w-full py-4 text-base font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin text-[#35243B]" />
                  Generating Full AI Reading...
                </>
              ) : (
                <>
                  <Sparkles size={18} className="text-[#35243B]" />
                  Generate Comprehensive Reading
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
