export default function FileIcon({ fileName, fileType, className = "w-5 h-5" }) {
  const getExt = () => {
    if (!fileName) return ''
    const parts = fileName.split('.')
    return parts.length > 1 ? parts.pop().toLowerCase() : ''
  }

  const ext = getExt()
  const type = fileType || ''

  if (['pdf'].includes(ext) || type.includes('pdf')) {
    return <span className={`${className} flex items-center justify-center text-red-400 font-bold text-[10px]`}>PDF</span>
  }
  if (['doc', 'docx'].includes(ext) || type.includes('word')) {
    return <span className={`${className} flex items-center justify-center text-blue-400 font-bold text-[10px]`}>DOC</span>
  }
  if (['xls', 'xlsx', 'csv'].includes(ext) || type.includes('sheet') || type.includes('excel') || type.includes('csv')) {
    return <span className={`${className} flex items-center justify-center text-emerald-400 font-bold text-[10px]`}>XLS</span>
  }
  if (['ppt', 'pptx'].includes(ext) || type.includes('presentation') || type.includes('powerpoint')) {
    return <span className={`${className} flex items-center justify-center text-orange-400 font-bold text-[10px]`}>PPT</span>
  }
  if (['zip', 'rar', '7z'].includes(ext) || type.includes('zip') || type.includes('rar')) {
    return (
      <svg className={`${className} text-yellow-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    )
  }
  if (['mp4', 'webm', 'mov', 'avi'].includes(ext) || type.startsWith('video/')) {
    return (
      <svg className={`${className} text-pink-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  }
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext) || type.startsWith('audio/')) {
    return (
      <svg className={`${className} text-purple-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    )
  }
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext) || type.startsWith('image/')) {
    return (
      <svg className={`${className} text-indigo-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  }

  return (
    <svg className={`${className} text-slate-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}