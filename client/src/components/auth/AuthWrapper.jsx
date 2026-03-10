import React from 'react'
import { Outlet } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';

const AuthWrapper = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

export default AuthWrapper