import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'

export default function EditProfile() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    fullName: 'Kabiru Michael Marshall',
    chartId: '#4657584',
    phoneNumber: '+243.38362923',
    email: 'kabimarsh@gmail.com',
    role: 'client',
    userStatus: true,
    twoFactor: false,
    readOnly: true,
    parentAccount: '',
    reassignParent: '',
    profitShare: 70,
    orderQuantity: '',
    maxExposure: '',
    marginType: 'market',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Profile updated successfully!')
    navigate(`/user-profile/${id}`)
  }

  const handleResetPassword = () => {
    toast.success('Password reset email sent!')
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
          <p className="text-gray-500 text-sm mb-6">Create new market</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Name cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chart ID
                </label>
                <Input
                  value={formData.chartId}
                  onChange={(e) => setFormData({ ...formData, chartId: e.target.value })}
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
                <select className="w-full h-12 rounded-md border border-gray-200 bg-gray-50 px-4 text-sm">
                  <option>{formData.phoneNumber}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                  <option value="sub-admin">Sub Admin</option>
                </Select>
              </div>
            </div>

            {/* User Status */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">User status</p>
                  <p className="text-sm text-gray-500">Enable current user status</p>
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
                    onClick={handleResetPassword}
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
                    <p className="font-medium text-gray-900">Allowed Login devices / IP Whitelist</p>
                    <p className="text-sm text-gray-500">Add an extra security layer</p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Read-only as Trade</p>
                    <p className="text-sm text-gray-500">Decide whether this account can view market data</p>
                  </div>
                  <Switch 
                    checked={formData.readOnly}
                    onChange={(e) => setFormData({ ...formData, readOnly: e.target.checked })}
                  />
                </div>
              </div>
            </div>

            {/* Hierarchy Relationship */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Hierarchy relationship</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent account
                  </label>
                  <Select
                    value={formData.parentAccount}
                    onChange={(e) => setFormData({ ...formData, parentAccount: e.target.value })}
                  >
                    <option value="">Select parent</option>
                    <option value="parent1">Parent 1</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reassign parent
                  </label>
                  <Select
                    value={formData.reassignParent}
                    onChange={(e) => setFormData({ ...formData, reassignParent: e.target.value })}
                  >
                    <option value="">Select parent</option>
                    <option value="parent1">Parent 1</option>
                  </Select>
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
              <p className="text-sm text-gray-600">Current: 70% (25, 45,000)</p>
            </div>

            {/* Trading Permissions */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Trading permissions and limit</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Quantity (Min)
                  </label>
                  <Select
                    value={formData.orderQuantity}
                    onChange={(e) => setFormData({ ...formData, orderQuantity: e.target.value })}
                  >
                    <option value="">Select quantity</option>
                    <option value="1">1 lot</option>
                    <option value="10">10 lots</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max
                  </label>
                  <Select
                    value={formData.maxExposure}
                    onChange={(e) => setFormData({ ...formData, maxExposure: e.target.value })}
                  >
                    <option value="">Select max</option>
                    <option value="100">100 lots</option>
                    <option value="1000">1000 lots</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Margin type
                  </label>
                  <Select
                    value={formData.marginType}
                    onChange={(e) => setFormData({ ...formData, marginType: e.target.value })}
                  >
                    <option value="market">Market</option>
                    <option value="limit">Limit</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Exposure Limit
                  </label>
                  <Select>
                    <option value="">Select limit</option>
                  </Select>
                </div>
              </div>

              <div className="mt-4">
                <p className="font-medium text-gray-900 mb-2">Order types</p>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Market</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Limit</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Stoploss</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/user-profile/${id}`)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
