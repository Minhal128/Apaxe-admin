import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { MoreVertical, User, X, Plus } from 'lucide-react'

const users = [
  { id: 1, userId: 'User #102634', name: 'Kennedy', role: 'User', group: 'Primary', status: 'Active', lastLogin: 'Last 5 hours' },
  { id: 2, userId: 'User #102634', name: 'Moses', role: 'User', group: 'Primary', status: 'Active', lastLogin: 'Last 5 hours' },
  { id: 3, userId: 'User #102634', name: 'Moses', role: 'User', group: 'Primary', status: 'Active', lastLogin: 'Last 5 hours' },
  { id: 4, userId: 'User #102634', name: 'Moses', role: 'User', group: 'Primary', status: 'Active', lastLogin: 'Last 5 hours' },
  { id: 5, userId: 'User #102634', name: 'Moses', role: 'User', group: 'Primary', status: 'Active', lastLogin: 'Last 5 hours' },
  { id: 6, userId: 'User #102634', name: 'Moses', role: 'User', group: 'Primary', status: 'Active', lastLogin: 'Last 5 hours' },
]

export default function UserManagement() {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState('Clients')
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    group: '',
    password: ''
  })

  const tabs = ['Clients', 'Sub-admins', 'Masters', 'Clients', 'View only']

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddUser = () => {
    // Handle user creation logic here
    console.log('Adding user:', formData)
    setIsAddUserOpen(false)
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      group: '',
      password: ''
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add user
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md mx-4">
            <button
              onClick={() => setIsAddUserOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Full Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Role
                  </label>
                  <Select 
                    value={formData.role} 
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full"
                  >
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="sub-admin">Sub Admin</option>
                    <option value="user">User</option>
                    <option value="master">Master</option>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Group
                  </label>
                  <Select 
                    value={formData.group} 
                    onChange={(e) => handleInputChange('group', e.target.value)}
                    className="w-full"
                  >
                    <option value="">Select group</option>
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="premium">Premium</option>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Password
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter password"
                  className="w-full"
                />
              </div>
              <Button 
                onClick={handleAddUser}
                className="w-full bg-primary hover:bg-primary/90 text-white mt-6"
              >
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Manage users</h2>
          <p className="text-gray-500 text-sm mb-4 sm:mb-6">View and manage all users account across different roles</p>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4 sm:mb-6">
            <ScrollArea className="w-full">
              <div className="flex space-x-6 sm:space-x-8 min-w-max px-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`pb-3 text-sm font-medium whitespace-nowrap ${
                      selectedTab === tab
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-500'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Mobile Cards */}
          <div className="block sm:hidden space-y-3">
            {users.map((user) => (
              <Card key={user.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/user-profile/${user.id}`)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.userId}</p>
                      </div>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-gray-600 p-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Role:</span>
                      <span className="ml-1 font-medium">{user.role}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Group:</span>
                      <span className="ml-1 font-medium">{user.group}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                      {user.status}
                    </Badge>
                    <p className="text-xs text-gray-500">{user.lastLogin}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block">
            <ScrollArea className="h-[500px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Group</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last login</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr 
                      key={user.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/user-profile/${user.id}`)}
                    >
                      <td className="py-4 px-4 text-gray-700">{user.userId}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={18} className="text-gray-600" />
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{user.role}</td>
                      <td className="py-4 px-4 text-gray-700">{user.group}</td>
                      <td className="py-4 px-4">
                        <Badge className="bg-green-100 text-green-700">
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{user.lastLogin}</td>
                      <td className="py-4 px-4">
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
