import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const sizeClasses = {
    small: 'max-w-md',
    default: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    full: 'max-w-full mx-4'
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeOnOverlayClick ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
              relative w-full ${sizeClasses[size]} mx-4 
              bg-surface border border-primary/20 rounded-xl shadow-card
              max-h-[90vh] overflow-hidden
              ${className}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-primary/10">
                {title && (
                  <h2 className="text-xl font-semibold text-primary-contrast">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="
                      p-2 rounded-lg text-secondary-contrast/60 
                      hover:text-secondary-contrast hover:bg-primary/10
                      transition-colors duration-150
                    "
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Confirmation Modal Component
export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default' // 'default', 'danger', 'warning'
}) => {
  const variantStyles = {
    default: 'bg-primary hover:bg-primary/90 text-primary-contrast',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white'
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className="space-y-4">
        <p className="text-secondary-contrast/80">
          {message}
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-lg border border-primary/20 
              text-secondary-contrast/80 hover:text-secondary-contrast
              hover:bg-primary/5 transition-colors duration-150
            "
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors duration-150
              ${variantStyles[variant]}
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// Loading Modal Component
export const LoadingModal = ({ 
  isOpen, 
  message = 'Loading...',
  showSpinner = true 
}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {}} 
      showCloseButton={false}
      closeOnOverlayClick={false}
      size="small"
    >
      <div className="flex flex-col items-center space-y-4 py-4">
        {showSpinner && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        )}
        <p className="text-secondary-contrast/80 text-center">
          {message}
        </p>
      </div>
    </Modal>
  )
}

export default Modal
