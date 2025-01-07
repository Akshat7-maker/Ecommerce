import React from 'react'

export default function Loader({ size = 'medium', color = 'blue', fullScreen = false , text='Fetching...' }) {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  }

  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    gray: 'border-gray-500'
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50'
    : 'flex items-center justify-center'

  return (
    <div className={containerClasses}>
      <div 
        className={`
          ${sizeClasses[size] || sizeClasses.medium}
          ${colorClasses[color] || colorClasses.blue}
          border-4 border-t-transparent rounded-full animate-spin
        `}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading.</span>
      </div>
        <div className="flex items-center justify-center h-full">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{text}</span>
        </div>
    </div>
  )
}