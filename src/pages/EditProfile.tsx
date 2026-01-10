import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select } from '@/components/ui/select'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { userApi } from '@/lib/api'
import { useApi } from '@/hooks/useApi'

interface UserData {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  balance?: number;
  profitSharePercentage?: number;
  exposureLimit?: number;
  creditLimit?: number;
}

export default function EditProfile() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'CLIENT',
    status: 'ACTIVE',
    userStatus: true,
    twoFactor: false,
    readOnly: false,
    profitShare: 70,
    exposureLimit: 0,
    creditLimit: 0,
  })

  // Fetch user data
  const { data: userData, loading: userLoading, error: userError } = useApi<any>(
    () => userApi.getUser(id!),
    { immediate: !!id }
  )

  const user: UserData | null = userData?.user || userData?.data || userData || null

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'CLIENT',
        status: user.status || 'ACTIVE',
        userStatus: user.status === 'ACTIVE',
        twoFactor: false,
        readOnly: false,
        profitShare: user.profitSharePercentage || 70,
        exposureLimit: user.exposureLimit || 0,
        creditLimit: user.creditLimit || 0,
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await userApi.updateUser(id!, {
        email: formData.email,
        status: formData.userStatus ? 'ACTIVE' : 'INACTIVE',
        role: formData.role,
      })
      toast.success('Profile updated successfully!')
      navigate(`/user-profile/${id}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    setIsResettingPassword(true)
    try {
      await userApi.resetPassword(id!, newPassword)
      toast.success('Password reset successfully!')
      setShowResetPasswordModal(false)
      setNewPassword('')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password')
    } finally {
      setIsResettingPassword(false)
    }
  }

  const displayName = user?.username || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (userError || !user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/user-management')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Edit profile</h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-600">Failed to load user data. {userError}</p>
            <Button onClick={() => navigate('/user-management')} className="mt-4">Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate(`/user-profile/${id}`)}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Edit profile</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-2">Edit user profile</h2>
          <p className="text-gray-500 text-sm mb-6">Update user information for {displayName}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  value={`${formData.firstName} ${formData.lastName}`.trim()}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">Name cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <Input
                  value={`#${user.id?.slice(-8) || 'N/A'}`}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone number
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="CLIENT">Client</option>
                  <option value="MASTER">Master</option>
                  <option value="SUPER_MASTER">Super Master</option>
                  <option value="ADMIN">Admin</option>
                </Select>
              </div>
            </div>

            {/* User Status */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">User status</p>
                  <p className="text-sm text-gray-500">
                    Current status: <span className={formData.userStatus ? 'text-green-600' : 'text-red-600'}>
                      {formData.userStatus ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <Switch 
                  checked={formData.userStatus}
                  onChange={(e) => setFormData({ ...formData, userStatus: e.target.checked })}
                />
              </div>
            </div>

            {/* Account Settings */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Account settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">Reset password</p>
                  <Button 
                    type="button"
                    onClick={() => setShowResetPasswordModal(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Reset password
                  </Button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <Switch 
                    checked={formData.twoFactor}
                    onChange={(e) => setFormData({ ...formData, twoFactor: e.target.checked })}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Read-only Mode</p>
                    <p className="text-sm text-gray-500">User can only view, not trade</p>
                  </div>
                  <Switch 
                    checked={formData.readOnly}
                    onChange={(e) => setFormData({ ...formData, readOnly: e.target.checked })}
                  />
                </div>
              </div>
            </div>

            {/* Profit Share */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Profit share</h3>
              <div className="mb-2">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={formData.profitShare}
                  onChange={(e) => setFormData({ ...formData, profitShare: parseInt(e.target.value) })}
                  className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #18B451 0%, #18B451 ${formData.profitShare}%, #E5E7EB ${formData.profitShare}%, #E5E7EB 100%)`
                  }}
                />
              </div>
              <p className="text-sm text-gray-600">
                User share: <span className="font-semibold">{formData.profitShare}%</span> | 
                Admin share: <span className="font-semibold">{100 - formData.profitShare}%</span>
              </p>
            </div>

            {/* Trading Limits */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Trading limits</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exposure Limit
                  </label>
                  <Input
                    type="number"
                    value={formData.exposureLimit}
                    onChange={(e) => setFormData({ ...formData, exposureLimit: parseInt(e.target.value) || 0 })}
                    placeholder="Enter exposure limit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credit Limit
                  </label>
                  <Input
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: parseInt(e.target.value) || 0 })}
                    placeholder="Enter credit limit"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/user-profile/${id}`)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Reset Password</h3>
              <p className="text-sm text-gray-500 mb-4">
                Enter a new password for {displayName}
              </p>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                className="mb-4"
              />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowResetPasswordModal(false)
                    setNewPassword('')
                  }}
                  className="flex-1"
                  disabled={isResettingPassword}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleResetPassword}
                  className="flex-1"
                  disabled={isResettingPassword}
                >
                  {isResettingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
