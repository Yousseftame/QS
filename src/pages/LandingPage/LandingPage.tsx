import { useState, useCallback } from 'react'
import { Upload, FileText, Loader2, CheckCircle2, XCircle } from 'lucide-react'

interface AnalysisResult {
  area?: number
  length?: number
  quantities?: {
    walls?: number
    doors?: number
    windows?: number
    columns?: number
  }
  fileName?: string
}

function LandingPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): boolean => {
    const validExtensions = ['.dwg', '.DWG']
    const fileName = file.name.toLowerCase()
    const isValid = validExtensions.some(ext => fileName.endsWith(ext.toLowerCase()))
    
    if (!isValid) {
      setError('Please upload a valid DWG file')
      return false
    }
    
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      setError('File size must be less than 50MB')
      return false
    }
    
    return true
  }

  const handleFileSelect = (selectedFile: File) => {
    setError(null)
    setResult(null)
    
    if (validateFile(selectedFile)) {
      setFile(selectedFile)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleAnalyze = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError(null)

    try {
      // Simulate API call - replace with actual API endpoint
      const formData = new FormData()
      formData.append('file', file)

      // TODO: Replace with your actual API endpoint
      // const response = await fetch('YOUR_API_ENDPOINT/analyze', {
      //   method: 'POST',
      //   body: formData,
      // })
      // const data = await response.json()
      // setResult(data)

      // Simulated delay and response
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      setResult({
        fileName: file.name,
        area: 1250.75,
        length: 485.30,
        quantities: {
          walls: 24,
          doors: 8,
          windows: 12,
          columns: 6
        }
      })
    } catch (err) {
      setError('Failed to analyze file. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetUpload = () => {
    setFile(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">


        {/* Top Left Logo */}
<div className="absolute md:top-6 md:left-16 z-50  sm:top-6 sm:left-6 ">
  <a
    href="https://www.hassanallam.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3"
  >
    <img
      src="/public/hs-logo.png"
      alt="Hassan Allam Holding"
      className="h-30 w-auto object-contain sm:h-10
        md:h-12
        lg:h-30
        "
    />
  </a>
</div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.08),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center items-center gap-3 animate-fade-in">

              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 rotate-3 hover:rotate-6 transition-transform duration-300">
                <a href="https://thinkstudio.ai/ " target="_blank" rel="noopener noreferrer">
                <img src="/public/images-removebg-preview.png" className="w-16 h-16 text-white" alt="HAH Logo" />
                </a>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4 animate-slide-up">
              <h1 className="text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  HAH AI
                </span>
                <br />
                <span className="text-slate-800">
                  Quantity Survey
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-slate-600 max-w-2xl mx-auto font-light">
                Upload your DWG and get instant quantity takeoff
              </p>
            </div>

            {/* Features */}
            {/* <div className="flex flex-wrap justify-center gap-6 pt-4 animate-fade-in-delay">
              {['AI-Powered Analysis', 'Instant Results', 'DWG Compatible'].map((feature, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-200"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-slate-700">{feature}</span>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="relative max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 lg:p-12 border border-slate-100">
          {!result ? (
            <div className="space-y-6">
              {/* Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                  relative border-2 border-dashed rounded-2xl p-12 lg:p-16 text-center
                  transition-all duration-300 cursor-pointer group
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' 
                    : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/50'
                  }
                `}
              >
                <input
                  type="file"
                  accept=".dwg,.DWG"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="space-y-6">
                  <div className={`
                    mx-auto w-20 h-20 rounded-2xl flex items-center justify-center
                    transition-all duration-300
                    ${isDragging 
                      ? 'bg-blue-600 scale-110' 
                      : 'bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-blue-100 group-hover:to-indigo-100'
                    }
                  `}>
                    <Upload className={`w-10 h-10 ${isDragging ? 'text-white' : 'text-slate-600 group-hover:text-blue-600'}`} />
                  </div>
                  
                  {file ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <p className="font-medium">{file.name}</p>
                      </div>
                      <p className="text-sm text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-slate-700">
                        Drop your DWG file here
                      </p>
                      <p className="text-sm text-slate-500">
                        or click to browse • Max 50MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-shake">
                  <XCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
                className={`
                  w-full py-4 px-6 rounded-xl font-semibold text-white
                  transition-all duration-300 transform
                  ${file && !isAnalyzing
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-300 cursor-not-allowed'
                  }
                `}
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Drawing...
                  </span>
                ) : (
                  'Analyze DWG File'
                )}
              </button>
            </div>
          ) : (
            /* Results Section */
            <div className="space-y-8 animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Analysis Complete</h2>
                  <p className="text-sm text-slate-500 mt-1">{result.fileName}</p>
                </div>
                <button
                  onClick={resetUpload}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Upload New File
                </button>
              </div>

              {/* Main Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700 mb-1">Total Area</p>
                      <p className="text-3xl font-bold text-blue-900">{result.area?.toFixed(2)}</p>
                      <p className="text-sm text-blue-600 mt-1">m²</p>
                    </div>
                    <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="group p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700 mb-1">Total Length</p>
                      <p className="text-3xl font-bold text-purple-900">{result.length?.toFixed(2)}</p>
                      <p className="text-sm text-purple-600 mt-1">m</p>
                    </div>
                    <div className="w-14 h-14 bg-purple-600/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantities Grid */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Component Quantities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Walls', value: result.quantities?.walls, color: 'emerald' },
                    { label: 'Doors', value: result.quantities?.doors, color: 'amber' },
                    { label: 'Windows', value: result.quantities?.windows, color: 'cyan' },
                    { label: 'Columns', value: result.quantities?.columns, color: 'rose' }
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className={`
                        p-5 bg-${item.color}-50 rounded-xl border border-${item.color}-100
                        hover:shadow-md transition-all duration-300 hover:-translate-y-1
                      `}
                      style={{
                        animationDelay: `${idx * 50}ms`
                      }}
                    >
                      <p className={`text-xs font-medium text-${item.color}-700 mb-2`}>{item.label}</p>
                      <p className={`text-2xl font-bold text-${item.color}-900`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div className="pt-6 border-t border-slate-200">
                <button className="w-full py-3 px-6 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition-colors duration-300">
                  Export Report
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default LandingPage