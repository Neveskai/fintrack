import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { pageTransition, easeTransition } from './variants'

interface AnimatedPageProps {
  children: ReactNode
  className?: string
}

export const AnimatedPage = ({ children, className }: AnimatedPageProps) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      transition={easeTransition}
      className={className}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  )
}
