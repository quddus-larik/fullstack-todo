import React, { Suspense } from 'react'
import Dashboard from '../custom/components/DashboardClient'
import { LoaderOne } from '@/components/ui/loader'

const page = () => {
  return (
    <div>
        <Suspense fallback={<LoaderOne/>}>
            <Dashboard/>
        </Suspense>
    </div>
  )
}

export default page