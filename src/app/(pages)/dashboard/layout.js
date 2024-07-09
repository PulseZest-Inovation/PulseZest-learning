import React from 'react'
import Link from 'next/link'

export default function DashboardLayout() {

    const path = "/about-us"
    const ProfileNumber = 9;

  return (
    <div> 
        <nav>
            <li >
                <Link href="/about-us">
                My course
                </Link>
                
              
            </li>

            <li>
                My Certificate
            </li>

            <li>
                <Link href={`/dashboard/profile/${ProfileNumber}`}  >
                    My profile
                </Link>
            
            </li>

        </nav>

    </div>
  )
}
