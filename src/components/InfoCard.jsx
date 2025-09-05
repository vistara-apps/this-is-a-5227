import React from 'react'

const InfoCard = ({ title, children, variant = 'default', className = '' }) => {
  const baseClasses = 'glass-effect rounded-xl p-6 border border-white/20'
  const variantClasses = {
    default: '',
    script: 'bg-accent/10'
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      {children}
    </div>
  )
}

export default InfoCard