import React, { Component } from 'react'
import { Show, SignInButton, SignOutButton, useAuth } from '@clerk/react'
import { Navigate, Route, Routes } from "react-router"
import NavBar from './components/NavBar'
import ProductPage from './pages/ProductPage'
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import EditProductPage from './pages/EditProductPage'
import ProfilePage from './pages/ProfilePage'
import useAuthRequest from './hooks/useAuthRequest'
import useUserSync from './hooks/useUserSync'



function App(){
    const {isClerkLoaded, isSignedIn} = useAuthRequest()
    useUserSync()
    if (!isClerkLoaded) return null;
    return (
      <div className='min-h-screen bg-base-100'>
        <NavBar />
        <main className='max-w-5xl mx-auto px-4 py-8'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/product/:id' element={<ProductPage />}/>
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/create' element={ isSignedIn ? <CreatePage /> : <Navigate to="/"/>} />
            <Route path='/edit/:id' element={<EditProductPage />} /> 
          </Routes>
        </main>
      </div>
    )
  }

export default App

