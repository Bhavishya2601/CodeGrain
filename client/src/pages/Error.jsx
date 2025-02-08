import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Error = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/404')
  },[])
  
  return (
    <div>
      404
    </div>
  )
}

export default Error
