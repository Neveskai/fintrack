import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { staggerContainer, staggerItem, easeTransition } from './variants'

interface AnimatedListProps {
  children: ReactNode
  className?: string
}

export const AnimatedList = ({ children, className }: AnimatedListProps) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedListItemProps {
  children: ReactNode
  className?: string
}

export const AnimatedListItem = ({ children, className }: AnimatedListItemProps) => {
  return (
    <motion.div
      initial={staggerItem.initial}
      animate={staggerItem.animate}
      transition={easeTransition}
      className={className}
    >
      {children}
    </motion.div>
  )
}
