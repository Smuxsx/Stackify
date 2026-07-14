import React, { Component } from 'react'
import { Show, SignInButton, SignOutButton } from '@clerk/react'
import { Route, Routes } from "react-router"
import NavBar from './components/NavBar'
import ProductPage from './pages/ProductPage'
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import EditProductPage from './pages/EditProductPage'
import ProfilePage from './pages/ProfilePage'

export class App extends Component {

  render() {
    return (
      <div className='min-h-screen bg-base-100'>
        <NavBar />
        <main className='max-w-5xl mx-auto px-4 py-8'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/product/:id' element={<ProductPage />}/>
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/create' element={<CreatePage />} />
            <Route path='/edit/:id' element={<EditProductPage />} /> 
          </Routes>
        </main>
      </div>
    )
  }
}

export default App

