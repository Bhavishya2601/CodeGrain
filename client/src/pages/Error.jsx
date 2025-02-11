import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Error = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/404')
  },[])
  
  return (
    <div className='text-5xl font-semibold bg-black text-white min-h-screen flex justify-center items-center'>
      <div className='font-manrope'>
        404 - Page not Found
      </div>
    </div>
  )
}

export default Error
