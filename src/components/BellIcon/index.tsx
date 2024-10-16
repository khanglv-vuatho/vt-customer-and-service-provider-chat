import React from 'react'
import { ButtonOnlyIcon } from '../Buttons'
import { motion } from 'framer-motion'
import { Notification } from 'iconsax-react'

const BellIcon = () => {
  return (
    <ButtonOnlyIcon className='bg-primary-blue text-white'>
      <motion.div animate={{ rotate: [0, -30, 30, 0] }} transition={{ duration: 0.3, delay: 0.2 }}>
        <Notification size={24} />
      </motion.div>
    </ButtonOnlyIcon>
  )
}

export default BellIcon
