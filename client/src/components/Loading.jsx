import React from 'react'
import './Loading.css'

const Loading = ({fullHeight = true}) => {
  return (
    <div className={`${fullHeight ? "min-h-screen" : "h-full" } flex w-full justify-center items-center`}>
      <div className="loader"></div>
    </div>
  )
}

export default Loading