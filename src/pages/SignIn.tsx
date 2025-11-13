import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password || !role) {
      toast.error('Please fill in all fields')
      return
    }
    
    toast.success('Login successful!')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary to-primary/80 p-4 relative overflow-hidden">
      {/* Decorative Circles - Responsive */}
      <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#B3E7D7] rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute top-10 right-5 sm:top-20 sm:right-10 w-32 h-32 sm:w-64 sm:h-64 bg-[#B3E7D7] rounded-full opacity-15 blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-[#B3E7D7] rounded-full opacity-20 translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      <div className="absolute bottom-10 left-10 sm:bottom-20 sm:left-20 w-32 h-32 sm:w-48 sm:h-48 bg-[#B3E7D7] rounded-full opacity-10 blur-xl"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        
        
        <h1 className="text-white text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 px-2">
          APEX ADMIN SIGN IN
        </h1>
        
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          <h2 className="text-gray-700 text-center mb-6 text-sm sm:text-base px-2">
            Please fill in your unique admin login details below
          </h2>
          
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Email address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Role
              </label>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="sub-admin">Sub Admin</option>
                <option value="master">Master</option>
              </Select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => navigate('/reset-password')}
                  className="text-gray-500 text-sm hover:text-gray-700"
                >
                  forgot password?
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
