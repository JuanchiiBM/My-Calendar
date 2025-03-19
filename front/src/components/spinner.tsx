import React from 'react'
import { Spinner } from "@heroui/react"

const SpinnerComponent = ({text}: {text?: string}) => {
  return (
    <div className='bg-default-500/[0.5] fixed top-0 left-0 w-full h-full flex justify-center align-center z-[60]'>
      <div className='flex flex-col justify-center items-center'>
        <Spinner color='white' />
        <span className='text-white'>{text ? text : 'Cargando...'}</span>
      </div>
    </div>
  )
}

export default SpinnerComponent