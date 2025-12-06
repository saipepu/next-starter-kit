"use client"
import React from 'react'
import AdminView from './views/AdminView'
import { useAdminViewModel } from './viewModels/useAdminViewModel'

const AdminViewContainer = () => {
  const vm = useAdminViewModel()
  return (
    <AdminView vm={vm} />
  )
}

export default AdminViewContainer