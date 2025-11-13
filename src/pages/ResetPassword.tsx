import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    toast.success('Password reset successful!')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary to-primary/80 p-4 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#B3E7D7] rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#B3E7D7] rounded-full opacity-15 blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#B3E7D7] rounded-full opacity-20 translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#B3E7D7] rounded-full opacity-10 blur-xl"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-16 w-auto object-contain" />
        </div>
        
        <h1 className="text-white text-3xl font-bold text-center mb-8">
          RESET PASSWORD
        </h1>
        
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-gray-700 text-center mb-6">
            Please fill in your unique admin login details below
          </h2>
          
          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Create new password
              </label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder=""
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder=""
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Confirm
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
