import React from 'react'
import  {Assistant}  from 'next/font/google'
const layout = ({children}) => {
  return (
   <div className="min-h-dvh grid place-items-center p-4">
  {children}
</div>

  )
}

export default layout
