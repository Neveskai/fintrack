import { Box, Text } from '@/common/ui'
import { useOnlineStatus } from '@/common/hooks'
import { FiWifiOff } from 'react-icons/fi'
import { AnimatePresence, motion } from 'framer-motion'

const MotionBox = motion.create(Box)

export const OfflineBanner = () => {
  const isOnline = useOnlineStatus()

  return (
    <AnimatePresence>
      {!isOnline && (
        <MotionBox
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          bg="orange.500"
          color="white"
          py={2}
          px={4}
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
          zIndex={9999}
        >
          <FiWifiOff size={16} />
          <Text fontSize="sm" fontWeight="medium">
            Modo offline — dados podem estar desatualizados
          </Text>
        </MotionBox>
      )}
    </AnimatePresence>
  )
}
