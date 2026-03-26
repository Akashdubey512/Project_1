export default function Loader({ size = 'md', center = false }) {
    const sizeClasses = {
      sm: 'w-4 h-4 border-2',
      md: 'w-8 h-8 border-4',
      lg: 'w-12 h-12 border-4',
    }
  
    const loader = (
      <div className={`${sizeClasses[size]} border-gray-300 border-t-blue-600 rounded-full animate-spin`} />
    )
  
    return center ? (
      <div className="flex justify-center items-center w-full h-full min-h-[100px]">
        {loader}
      </div>
    ) : loader
  }
