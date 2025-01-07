import React, { useState } from 'react'
import api from '../api/api' 
import { useNavigate } from 'react-router-dom'

export default function SignUp() {
  const [formData, setFormData] = useState({
    name:  '',
    email: '',
    password: '',
    gender: '',
  })
  const [coverPic, setCoverPic] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const handleChange = (e) => {
    // console.log(e.target)
    const { name, value } = e.target
    // console.log(name, value)
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    // console.log(e.target.files) 
    const file = e.target.files[0]
    setCoverPic(file)
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    
    console.log('Sign up attempted with:', { ...formData, coverPic }) 
    console.log(coverPic)
    
    try {
        setError('')
      const user = await api.register(formData.name, formData.email, formData.password, formData.gender, coverPic)
      console.log(user)
      if(user) {
        navigate('/login')
      }
      
    } catch (error) {
      setError(error.response.data.message)
      
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="gender" className="sr-only">Gender</label>
              <select
                id="gender"
                name="gender"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="coverPic" className="block text-sm font-medium text-gray-700">
              Cover Picture(optional)
            </label>
            <input
              id="coverPic"
              name="coverPic"
              type="file"
              accept="image/*"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={!formData.name || !formData.email || !formData.password || !formData.gender}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}