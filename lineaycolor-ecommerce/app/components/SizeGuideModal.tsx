'use client'

import { motion, AnimatePresence } from 'framer-motion'
import FocusTrap from 'focus-trap-react'
import { useEffect } from 'react'

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
  category?: string
}

const sizeCharts = {
  default: {
    title: 'General Size Guide',
    headers: ['Size', 'US', 'UK', 'EU', 'Chest (in)', 'Waist (in)', 'Hip (in)'],
    rows: [
      ['XS', '0-2', '4-6', '32-34', '31-32', '24-25', '34-35'],
      ['S', '4-6', '8-10', '36-38', '33-34', '26-27', '36-37'],
      ['M', '8-10', '12-14', '40-42', '35-36', '28-29', '38-39'],
      ['L', '12-14', '16-18', '44-46', '37-38', '30-31', '40-41'],
      ['XL', '16-18', '20-22', '48-50', '39-40', '32-33', '42-43'],
      ['XXL', '20-22', '24-26', '52-54', '41-42', '34-35', '44-45']
    ]
  },
  evening: {
    title: 'Evening Wear Size Guide',
    headers: ['Size', 'US', 'UK', 'EU', 'Bust (in)', 'Waist (in)', 'Hip (in)', 'Length (in)'],
    rows: [
      ['XS', '0-2', '4-6', '32-34', '31-32', '24-25', '34-35', '58'],
      ['S', '4-6', '8-10', '36-38', '33-34', '26-27', '36-37', '59'],
      ['M', '8-10', '12-14', '40-42', '35-36', '28-29', '38-39', '60'],
      ['L', '12-14', '16-18', '44-46', '37-38', '30-31', '40-41', '61'],
      ['XL', '16-18', '20-22', '48-50', '39-40', '32-33', '42-43', '62']
    ]
  }
}

export default function SizeGuideModal({ isOpen, onClose, category = 'default' }: SizeGuideModalProps) {
  const chart = sizeCharts[category as keyof typeof sizeCharts] || sizeCharts.default

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <FocusTrap>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-4xl mx-auto bg-white rounded-lg shadow-2xl z-50 max-h-[90vh] overflow-hidden md:inset-x-auto md:left-1/2 md:-translate-x-1/2"
            >
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">{chart.title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close size guide"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 overflow-x-auto">
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">How to Measure</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Chest/Bust:</strong> Measure around the fullest part of your chest</li>
                    <li><strong>Waist:</strong> Measure around your natural waistline</li>
                    <li><strong>Hip:</strong> Measure around the fullest part of your hips</li>
                  </ul>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        {chart.headers.map((header, index) => (
                          <th key={index} className="border border-gray-200 px-4 py-2 text-left font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {chart.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border border-gray-200 px-4 py-2">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> These measurements are approximate. For the best fit, we recommend checking the specific measurements provided for each product.
                  </p>
                </div>
              </div>
            </motion.div>
          </FocusTrap>
        </>
      )}
    </AnimatePresence>
  )
}