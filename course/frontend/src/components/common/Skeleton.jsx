const Skeleton = ({ className = '', lines = 1 }) => {
  const base = `animate-pulse rounded bg-slate-200 ${className}`

  if (lines === 1) {
    return <div className={base}></div>
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={base}></div>
      ))}
    </div>
  )
}

export default Skeleton

