import React from 'react'
import { LoaderCircle } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div className='flex flex-col items-center justify-center py-20 gap-4'>
    <LoaderCircle className='size-10 text-primary animate-spin'/>
    </div>
  )
}

export default LoadingSpinner;