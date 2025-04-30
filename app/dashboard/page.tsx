"use client";
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import React from 'react'

const DocsIntro = () => {
  return (
    <div className='w-full min-h-full'>
      <h1 className='text-4xl font-bold mt-5'>Introduction</h1>
      <p className='text-gray-500 mt-2'>
        This is the introduction to the documentation. Here you can find information about the project, its features, and how to get started.
      </p>
      <Button
        variant='default'
        className='mt-4'
        onClick={() => signOut()}
      >
        Sign Out
      </Button>
    </div>
  )
}

export default DocsIntro