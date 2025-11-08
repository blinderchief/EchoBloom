import React from 'react'

interface EmpathyResponseProps {
  response: string
}

export const EmpathyResponse: React.FC<EmpathyResponseProps> = ({ response }) => {
  return (
    <div className="p-4 bg-sunset bg-opacity-20 rounded-2xl">
      <p>{response}</p>
    </div>
  )
}