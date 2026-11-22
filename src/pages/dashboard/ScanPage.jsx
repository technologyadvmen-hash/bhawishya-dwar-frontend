import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Webcam from 'react-webcam'
import { Camera, Upload, Hand, RefreshCw, Loader, CheckCircle, AlertCircle, Sparkles, CheckCircle2, FlipHorizontal } from 'lucide-react'
import { palmService, aiService } from '../../services'
import toast from 'react-hot-toast'
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

const PALM_CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
  [5,9],[9,13],[13,17],
]

export default function ScanPage() {
  const navigate = useNavigate()
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const fileInputRef = useRef(null)
  const handLandmarkerRef = useRef(null)
  const animFrameRef = useRef(null)
  const detectingRef = useRef(false)

  const [step, setStep] = useState('setup')
  const [handType, setHandType] = useState('right')
  const [capturedImage, setCapturedImage] = useState(null)
  const [capturedBlob, setCapturedBlob] = useState(null)
  const [cameraFacing, setCameraFacing] = useState('environment') // back camera default for palm
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [mpReady, setMpReady] = useState(false)
  const [mpError, setMpError] = useState(false)
  const [handDetected, setHandDetected] = useState(false)

  // Initialize MediaPipe — try GPU first, fallback CPU
  useEffect(() => {
    let cancelled = false
    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.3/wasm'
        )
        const opts = (delegate) => ({
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate,
          },
          runningMode: 'VIDEO',
          numHands: 1,
        })
        let landmarker
        try { landmarker = await HandLandmarker.createFromOptions(vision, opts('GPU')) }
        catch { landmarker = await HandLandmarker.createFromOptions(vision, opts('CPU')) }
        if (!cancelled) { handLandmarkerRef.current = landmarker; setMpReady(true) }
      } catch (err) {
        console.error('MediaPipe init failed:', err)
        if (!cancelled) setMpError(true)
      }
    }
    init()
    return () => { cancelled = true }
  }, [])

  // Sync canvas size to actual video element size (not videoWidth/Height)
  const syncCanvas = useCallback(() => {
    const video = webcamRef.current?.video
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const rect = video.getBoundingClientRect()
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    canvas.width = video.videoWidth || rect.width
    canvas.height = video.videoHeight || rect.height
  }, [])

  // Draw landmarks — account for mirroring on front camera
  const drawLandmarks = useCallback((landmarks) => {
    const canvas = canvasRef.current
    const video = webcamRef.current?.video
    if (!canvas || !video) return
    syncCanvas()
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (!landmarks?.length) return

    const pts = landmarks[0]
    const isMirrored = cameraFacing === 'user'

    // Mirror transform for front camera
    ctx.save()
    if (isMirrored) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }

    ctx.strokeStyle = 'rgba(217,164,65,0.9)'
    ctx.lineWidth = Math.max(2, canvas.width / 150)
    PALM_CONNECTIONS.forEach(([a, b]) => {
      ctx.beginPath()
      ctx.moveTo(pts[a].x * canvas.width, pts[a].y * canvas.height)
      ctx.lineTo(pts[b].x * canvas.width, pts[b].y * canvas.height)
      ctx.stroke()
    })

    const dotR = Math.max(4, canvas.width / 80)
    pts.forEach((pt) => {
      ctx.beginPath()
      ctx.arc(pt.x * canvas.width, pt.y * canvas.height, dotR, 0, Math.PI * 2)
      ctx.fillStyle = '#641A78'
      ctx.fill()
      ctx.strokeStyle = '#D9A441'
      ctx.lineWidth = 2
      ctx.stroke()
    })
    ctx.restore()
  }, [cameraFacing, syncCanvas])

  // Detection loop
  const detect = useCallback(() => {
    if (!detectingRef.current) return
    const landmarker = handLandmarkerRef.current
    const video = webcamRef.current?.video
    if (!landmarker || !video || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(detect)
      return
    }
    try {
      const result = landmarker.detectForVideo(video, performance.now())
      const detected = result.landmarks?.length > 0
      setHandDetected(detected)
      drawLandmarks(result.landmarks)
    } catch (e) {
      // ignore frame errors
    }
    animFrameRef.current = requestAnimationFrame(detect)
  }, [drawLandmarks])

  // Start/stop detection
  useEffect(() => {
    if (step === 'capture' && mpReady && cameraReady) {
      detectingRef.current = true
      animFrameRef.current = requestAnimationFrame(detect)
    }
    return () => {
      detectingRef.current = false
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      const canvas = canvasRef.current
      if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
      setHandDetected(false)
    }
  }, [step, mpReady, cameraReady, detect])

  // Reset camera ready on switch
  const switchCamera = () => {
    detectingRef.current = false
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    setCameraReady(false)
    setCameraError(false)
    setHandDetected(false)
    setCameraFacing(f => f === 'user' ? 'environment' : 'user')
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot({ width: 1280, height: 960 })
    if (!imageSrc) return toast.error('Could not capture. Try again.')
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

  // Video constraints — portrait on mobile, high res
  const videoConstraints = {
    facingMode: cameraFacing,
    width: { ideal: 1280 },
    height: { ideal: 960 },
  }

  return (
    <div className="max-w-lg mx-auto space-y-5 px-0 sm:px-2">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-[#F5EAF7] flex items-center justify-center">
            <Hand size={18} className="text-[#641A78]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
            AI Palm <span className="gold-text">Scanner</span>
          </h1>
        </div>
        <p className="text-[#35243B]/60 text-sm">Capture or upload your palm for AI analysis</p>
      </motion.div>

      {/* Hand Selection */}
      {(step === 'setup' || step === 'capture') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-4">
          <p className="text-xs font-semibold text-[#641A78] uppercase tracking-wider mb-2.5">Select hand to scan:</p>
          <div className="flex gap-3">
            {['left', 'right'].map((h) => (
              <button key={h} onClick={() => setHandType(h)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
                  handType === h ? 'btn-primary' : 'bg-white border border-[#EADFED] text-[#35243B]/70 hover:bg-[#F5EAF7]'
                }`}>
                {h} Hand
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Setup Step */}
      {step === 'setup' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="card p-5 space-y-3">
            <h3 className="text-[#35243B] font-bold text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
              Guidelines for Best Accuracy:
            </h3>
            {[
              'Use back camera — hold palm flat, facing camera',
              'Ensure bright, even lighting across your palm',
              'Keep fingers relaxed and open',
              'Remove rings or bracelets for clean detection',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-[#35243B]/70">
                <CheckCircle2 size={16} className="text-[#D9A441] flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setStep('capture')}
              className="flex flex-col items-center gap-3 p-6 card card-hover cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-[#F5EAF7] flex items-center justify-center">
                <Camera size={24} className="text-[#641A78]" />
              </div>
              <span className="text-[#35243B] font-bold text-sm">Live Camera</span>
              <span className="text-[#35243B]/50 text-xs text-center">Real-time hand detection</span>
            </button>
            <button onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-3 p-6 card card-hover cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-[#F5EAF7] flex items-center justify-center">
                <Upload size={24} className="text-[#641A78]" />
              </div>
              <span className="text-[#35243B] font-bold text-sm">Upload Photo</span>
              <span className="text-[#35243B]/50 text-xs text-center">JPG, PNG up to 10MB</span>
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </motion.div>
      )}

      {/* Camera Capture Step */}
      {step === 'capture' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Camera Container — portrait ratio for mobile */}
          <div ref={containerRef}
            className="relative rounded-2xl overflow-hidden bg-black border-2 border-[#EADFED] shadow-lg w-full"
            style={{ aspectRatio: '3/4' }}>

            {cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center bg-[#35243B]">
                <AlertCircle size={36} className="text-rose-400" />
                <p className="text-white font-medium text-sm">Camera access denied or unavailable</p>
                <button onClick={() => fileInputRef.current?.click()} className="btn-gold text-xs px-4 py-2 mt-1">
                  Upload image instead
                </button>
              </div>
            ) : (
              <>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={0.92}
                  className="absolute inset-0 w-full h-full object-cover"
                  mirrored={cameraFacing === 'user'}
                  videoConstraints={videoConstraints}
                  onUserMedia={() => { setCameraReady(true); setCameraError(false) }}
                  onUserMediaError={() => setCameraError(true)}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Palm guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-64 sm:w-56 sm:h-72 border-2 border-dashed border-[#D9A441]/50 rounded-3xl flex items-end justify-center pb-3">
                    <span className="text-[#D9A441]/70 text-[10px] font-medium">Place palm here</span>
                  </div>
                </div>

                {/* Status badge */}
                <div className="absolute top-3 left-0 right-0 flex justify-center px-4">
                  {!cameraReady ? (
                    <span className="text-xs bg-black/70 text-white/80 px-3 py-1.5 rounded-full flex items-center gap-2">
                      <Loader size={11} className="animate-spin text-[#D9A441]" /> Starting camera...
                    </span>
                  ) : !mpReady && !mpError ? (
                    <span className="text-xs bg-black/70 text-white/80 px-3 py-1.5 rounded-full flex items-center gap-2">
                      <Loader size={11} className="animate-spin text-[#D9A441]" /> Loading hand detector...
                    </span>
                  ) : mpError ? (
                    <span className="text-xs bg-amber-900/80 border border-amber-400/30 text-amber-300 px-3 py-1.5 rounded-full">
                      ⚠ Auto-detect unavailable — capture manually
                    </span>
                  ) : handDetected ? (
                    <span className="text-xs bg-emerald-900/80 border border-emerald-400/30 text-emerald-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-semibold">
                      <CheckCircle size={11} className="text-emerald-400" /> Hand detected ✓
                    </span>
                  ) : (
                    <span className="text-xs bg-black/70 text-white/70 px-3 py-1.5 rounded-full">
                      ✦ Show your palm to the camera
                    </span>
                  )}
                </div>

                {/* Camera switch */}
                <button onClick={switchCamera}
                  className="absolute bottom-3 right-3 z-10 bg-black/70 border border-white/20 text-white rounded-full p-2.5 hover:bg-[#641A78]/80 transition-colors"
                  title="Switch camera">
                  <FlipHorizontal size={16} />
                </button>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep('setup')} className="btn-secondary flex-1 py-3.5">Back</button>
            <button
              onClick={capture}
              disabled={(!handDetected && mpReady && !mpError) || !cameraReady}
              className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2 font-semibold">
              <Camera size={17} />
              {!cameraReady ? 'Starting...' : mpReady && !handDetected && !mpError ? 'Show Palm...' : 'Capture Palm'}
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </motion.div>
      )}

      {/* Preview Step */}
      {step === 'preview' && capturedImage && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="rounded-2xl overflow-hidden bg-black border border-[#EADFED] shadow-md w-full" style={{ aspectRatio: '3/4' }}>
            <img src={capturedImage} alt="Palm preview" className="w-full h-full object-contain" />
          </div>
          <div className="card p-4 flex items-center justify-between">
            <p className="text-sm text-[#35243B]/70">
              <span className="font-semibold text-[#641A78]">Hand:</span> {handType.charAt(0).toUpperCase() + handType.slice(1)}
            </p>
            <span className="badge-purple">Ready</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setCapturedImage(null); setStep('setup') }}
              className="btn-secondary px-5 py-3.5 flex items-center gap-2">
              <RefreshCw size={15} /> Retake
            </button>
            <button onClick={analyzeNow} disabled={loading}
              className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2 font-semibold">
              <Hand size={17} /> Run AI Analysis
            </button>
          </div>
        </motion.div>
      )}

      {/* Analyzing Step */}
      {step === 'analyzing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-12 text-center">
          <div className="w-14 h-14 rounded-full border-2 border-[#641A78] border-t-transparent animate-spin mx-auto mb-5" />
          <h3 className="text-xl font-bold text-[#35243B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Analyzing Your Palm
          </h3>
          <p className="text-[#35243B]/60 text-sm max-w-xs mx-auto">
            AI is detecting your Life, Heart, Head, and Fate lines...
          </p>
        </motion.div>
      )}

      {/* Done Step */}
      {step === 'done' && scanResult && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle size={20} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#35243B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Palm Features Extracted
                </h3>
                <p className="text-xs text-[#35243B]/50">AI confidence breakdown</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {['lifeLine', 'heartLine', 'headLine', 'fateLine'].map((line) => {
                const feature = scanResult.features?.[line]
                return (
                  <div key={line} className="bg-[#F5EAF7]/70 border border-[#EADFED] rounded-xl p-3">
                    <p className="text-[#641A78] text-xs font-semibold capitalize mb-1">
                      {line.replace('Line', ' Line')}
                    </p>
                    <p className={`text-sm font-bold ${feature?.detected ? 'text-emerald-700' : 'text-[#35243B]/40'}`}>
                      {feature?.detected ? `${feature.confidence}%` : 'Not detected'}
                    </p>
                  </div>
                )
              })}
            </div>

            <button onClick={generateReading} disabled={loading}
              className="btn-gold w-full py-4 text-base font-bold flex items-center justify-center gap-2 shadow-lg">
              {loading ? (
                <><Loader size={17} className="animate-spin text-[#35243B]" /> Generating Reading...</>
              ) : (
                <><Sparkles size={17} className="text-[#35243B]" /> Generate Full Reading</>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
