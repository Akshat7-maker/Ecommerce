import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/Admin/AdminSideBar'
import AdminOrderTable from '../../components/Admin/AdminOrderTable'

function AdminLayout() {
  return (
    <div className='grid grid-cols-5 h-screen'>
      <div className='col-span-1 bg-black'>
      <AdminSidebar />
      </div>
      <div className='col-span-4 p-5 bg-slate-700'>

      <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
