import { useState, useCallback } from 'react'
import { Upload, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import logoImg from "../../assets/images-removebg-preview.png"
import topLeftImg from "../../assets/hs-logo.png"

interface Pipe {
  diameter: number | null
  type: string | null
  length: number
  is_insulated: boolean
  insulation_thickness: number | null
  insulation_area: number | null
}

interface Fitting {
  diameter: number | null
  type: string | null
  count: number
}

interface AnalysisResult {
  metadata: {
    filename: string
    total_straight_length: number
    total_arc_length: number
  }
  pipes: Pipe[]
  itemized_pipes: Pipe[]
  fittings: {
    elbows: Fitting[]
    tees: Fitting[]
    reducers: Fitting[]
  }
  // Additional computed fields for display
  totalPipes?: number
  totalElbows?: number
  totalTees?: number
  totalReducers?: number
  // totalFittings?: number
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
      const formData = new FormData()
      formData.append('file', file)

      // Real API call
      const response = await fetch('http://18.234.150.83:8001/extract', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()

      // Process the API response
      const processedResult: AnalysisResult = {
        metadata: data.metadata,
        pipes: data.pipes || [],
        itemized_pipes: data.itemized_pipes || [],
        fittings: {
          elbows: data.fittings?.elbows || [],
          tees: data.fittings?.tees || [],
          reducers: data.fittings?.reducers || [],
        },
        // Compute totals for display
        totalPipes: data.pipes?.length || 0,
        totalElbows: data.fittings?.elbows?.length || 0,
        totalTees: data.fittings?.tees?.length || 0,
        totalReducers: data.fittings?.reducers?.length || 0,
      }

      setResult(processedResult)
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze file. Please try again.')
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
              src={topLeftImg}
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
                <a href="https://thinkstudio.ai/" target="_blank" rel="noopener noreferrer">
                  <img src={logoImg} className="w-16 h-16 text-white" />
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
                  <p className="text-sm text-slate-500 mt-1">{result.metadata.filename}</p>
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
                      <p className="text-sm font-medium text-blue-700 mb-1">Total Straight Length</p>
                      <p className="text-3xl font-bold text-blue-900">{result.metadata.total_straight_length.toFixed(2)}</p>
                      <p className="text-sm text-blue-600 mt-1">units</p>
                    </div>
                    <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="group p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700 mb-1">Total Arc Length</p>
                      <p className="text-3xl font-bold text-purple-900">{result.metadata.total_arc_length.toFixed(2)}</p>
                      <p className="text-sm text-purple-600 mt-1">units</p>
                    </div>
                    <div className="w-14 h-14 bg-purple-600/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Component Counts */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Drawing Analysis</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Pipes Types', value: result.totalPipes, color: 'emerald', icon: '|' },
                    { label: 'Elbows Types', value: result.totalElbows, color: 'amber', icon: '⌐' },
                    { label: 'Tees Types', value: result.totalTees, color: 'cyan', icon: '⊢' },
                    { label: 'Reducers Types', value: result.totalReducers, color: 'rose', icon: '◿' }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <p className="text-xs font-medium text-slate-600 mb-2">{item.label}</p>
                      <p className="text-3xl font-bold text-slate-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Pipes List */}
              {result.pipes.length > 0 && (() => {
                // Group pipes by type
                const typeColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
                  CWP: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', dot: 'bg-blue-500' },
                  HWP: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200', dot: 'bg-orange-500' },
                  SAN: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200', dot: 'bg-green-500' },
                  FP: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200', dot: 'bg-red-500' },
                  GAS: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200', dot: 'bg-yellow-500' },
                  AC: { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200', dot: 'bg-cyan-500' },
                }
                const defaultColor = { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-400' }

                const grouped: Record<string, Pipe[]> = {}
                for (const pipe of result.pipes) {
                  const key = pipe.type ?? 'Unknown'
                  if (!grouped[key]) grouped[key] = []
                  grouped[key].push(pipe)
                }
                const sortedTypes = Object.keys(grouped).sort()

                return (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-800">Pipe Schedule</h3>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {result.pipes.length} entries · {sortedTypes.length} types
                      </span>
                    </div>

                    <div className="space-y-4">
                      {sortedTypes.map((typeName) => {
                        const pipes = grouped[typeName].sort((a, b) => (a.diameter ?? 0) - (b.diameter ?? 0))
                        const color = typeColors[typeName] ?? defaultColor
                        const totalLength = pipes.reduce((sum, p) => sum + p.length, 0)
                        const hasInsulation = pipes.some(p => p.is_insulated)

                        return (
                          <div key={typeName} className={`rounded-xl border ${color.border} overflow-hidden`}>
                            {/* Group Header */}
                            <div className={`flex items-center justify-between px-4 py-3 ${color.bg}`}>
                              <div className="flex items-center gap-2">
                                <span className={`inline-block w-2.5 h-2.5 rounded-full ${color.dot}`} />
                                <span className={`text-sm font-bold tracking-wide ${color.text}`}>{typeName}</span>
                                {hasInsulation && (
                                  <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full ml-1">
                                    INSULATED
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span>{pipes.length} DN sizes</span>
                                <span className="font-semibold text-slate-700">{(totalLength / 1000).toFixed(2)} m total</span>
                              </div>
                            </div>

                            {/* Pipe rows */}
                            <div className="divide-y divide-slate-100 bg-white">
                              {pipes.map((pipe, idx) => (
                                <div key={idx} className="flex items-center px-4 py-2.5 hover:bg-slate-50 transition-colors group">
                                  {/* Diameter chip */}
                                  <div className="w-24 flex-shrink-0">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${color.bg} ${color.text} border ${color.border}`}>
                                      <span className="opacity-60 font-normal">DN</span>
                                      {pipe.diameter ?? '—'}
                                    </span>
                                  </div>

                                  {/* Length bar */}
                                  <div className="flex-1 mx-4">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <div
                                          className={`h-full rounded-full ${color.dot} opacity-60`}
                                          style={{ width: `${Math.min(100, (pipe.length / (Math.max(...pipes.map(p => p.length)) || 1)) * 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Length value */}
                                  <div className="w-32 text-right">
                                    <span className="text-sm font-semibold text-slate-800">
                                      {(pipe.length / 1000).toFixed(3)}
                                    </span>
                                    <span className="text-xs text-slate-400 ml-1">m</span>
                                  </div>

                                  {/* Insulation badge */}
                                  <div className="w-28 text-right ml-2">
                                    {pipe.is_insulated ? (
                                      <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                                        {pipe.insulation_thickness ? `${pipe.insulation_thickness}mm ins.` : 'Insulated'}
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-slate-300">—</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}

              {/* Detailed Elbows List */}
              {result.fittings.elbows.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Elbow Fittings</h3>
                  <div className="bg-amber-50 rounded-xl border border-amber-200 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-amber-100 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-amber-900 uppercase">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-amber-900 uppercase">Diameter</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-amber-900 uppercase">count</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-200">
                          {result.fittings.elbows.slice(0, 30).map((elbow, idx) => (
                            <tr key={idx} className="hover:bg-white transition-colors">
                              <td className="px-4 py-3 text-sm text-amber-700">{idx + 1}</td>
                              <td className="px-4 py-3 text-sm font-medium text-amber-900">{elbow.diameter}</td>
                              <td className="px-4 py-3 text-sm text-amber-700">{elbow.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {result.fittings.elbows.length > 30 && (
                      <div className="px-4 py-3 bg-amber-100 text-center text-sm text-amber-700">
                        Showing 30 of {result.fittings.elbows.length} elbows
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Detailed Tee Fittings List */}
              {result.fittings.tees.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Tee Fittings</h3>
                  <div className="bg-cyan-50 rounded-xl border border-cyan-200 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-cyan-100 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-900 uppercase">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-900 uppercase">Diameter</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-900 uppercase">Count</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-cyan-200">
                          {result.fittings.tees.slice(0, 30).map((tee, idx) => (
                            <tr key={idx} className="hover:bg-white transition-colors">
                              <td className="px-4 py-3 text-sm text-cyan-700">{idx + 1}</td>
                              <td className="px-4 py-3 text-sm font-medium text-cyan-900">{tee.diameter}</td>
                              <td className="px-4 py-3 text-sm text-cyan-700">{tee.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {result.fittings.tees.length > 30 && (
                      <div className="px-4 py-3 bg-cyan-100 text-center text-sm text-cyan-700">
                        Showing 30 of {result.fittings.tees.length} tees
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Detailed Reducer Fittings List */}
              {result.fittings.reducers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Reducer Fittings</h3>
                  <div className="bg-rose-50 rounded-xl border border-rose-200 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-rose-100 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-rose-900 uppercase">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-rose-900 uppercase">Diameter</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-rose-900 uppercase">Count</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-rose-200">
                          {result.fittings.reducers.slice(0, 30).map((reducer, idx) => (
                            <tr key={idx} className="hover:bg-white transition-colors">
                              <td className="px-4 py-3 text-sm text-rose-700">{idx + 1}</td>
                              <td className="px-4 py-3 text-sm font-medium text-rose-900">{reducer.diameter}</td>
                              <td className="px-4 py-3 text-sm text-rose-700">{reducer.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {result.fittings.reducers.length > 30 && (
                      <div className="px-4 py-3 bg-rose-100 text-center text-sm text-rose-700">
                        Showing 30 of {result.fittings.reducers.length} reducers
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Export Options */}
              <div className="pt-6 border-t border-slate-200">
                <button
                  onClick={() => {
                    // Export functionality - download as JSON
                    const dataStr = JSON.stringify(result, null, 2)
                    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
                    const exportFileDefaultName = `analysis_${result.metadata.filename}_${new Date().getTime()}.json`
                    const linkElement = document.createElement('a')
                    linkElement.setAttribute('href', dataUri)
                    linkElement.setAttribute('download', exportFileDefaultName)
                    linkElement.click()
                  }}
                  className="w-full py-3 px-6 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition-colors duration-300"
                >
                  Export Report as JSON
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