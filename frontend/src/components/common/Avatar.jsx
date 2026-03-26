export default function Avatar({ src, alt, size = 'md' }) {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24'
    }
  
    const initial = alt ? alt.charAt(0).toUpperCase() : '?'
  
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center`}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-600 font-semibold">{initial}</span>
        )}
      </div>
    )
  }
