'use client'
import React from 'react'
import { useRouter } from 'next/router'

export default function ProfilePage({params}) {

  const Route = useRouter();

console.log(Route);


  return (
    <div> 
      <h1 className='text-2xl text-orange-600'>My profile page no is {params.id}</h1>
    </div>
  )
}
