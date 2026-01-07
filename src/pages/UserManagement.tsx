import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { MoreVertical, User, X, Plus } from 'lucide-react'
import { useApi, useApiMutation } from '@/hooks/useApi'
import { userApi } from '@/lib/api'

interface UserData {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  status: string;
  balance: number;
  createdAt: string;
  lastLoginAt?: string;
}


export default function UserManagement() {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState('Clients')
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'CLIENT',
    balance: 0
  })

  const { data: usersData, meta, loading, error, refetch } = useApi<any>(
    () => {
      const roleMap: Record<string, string> = {
        'Clients': 'CLIENT',
        'Sub-admins': 'SUPER_MASTER',
        'Masters': 'MASTER'
      };

      return userApi.getUsers({
        role: roleMap[selectedTab],
        search: searchTerm,
        page: currentPage,
        limit: 50
      });
    },
    {
      onSuccess: (data) => {
        console.log("The data is real", data)
      },
      onError: (error) => {
        console.error('Users API error:', error)
      }
    }
  )

  const { mutate: createUser, loading: creating } = useApiMutation(
    (userData: any) => userApi.createUser(userData),
    {
      onSuccess: () => {
        setIsAddUserOpen(false)
        setFormData({
          username: '',
          email: '',
          password: '',
          role: 'CLIENT',
          balance: 0
        })
        refetch()
      },
      onError: (error) => {
        console.error('Create user error:', error)
      }
    }
  )

  // Refetch data when filters change
  useEffect(() => {
    refetch()
  }, [selectedTab, searchTerm, currentPage])

  const tabs = ['Clients', 'Sub-admins', 'Masters']

  const users = Array.isArray(usersData) ? usersData : (usersData?.users || [])
  const totalUsers = meta?.total || usersData?.total || 0

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddUser = async () => {
    try {
      await createUser(formData)
    } catch (error) {
      // Error is handled by the mutation hook
    }
  }

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab)
    setCurrentPage(1)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const getLastLoginText = (lastLoginAt?: string) => {
    if (!lastLoginAt) return 'Never'
    const now = new Date()
    const lastLogin = new Date(lastLoginAt)
    const diffInHours = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-700'
      case 'SUSPENDED':
        return 'bg-yellow-100 text-yellow-700'
      case 'BANNED':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>
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
                  Username
                </label>
                <Input
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter username"
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
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Role
                </label>
                <Select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full"
                >
                  <option value="CLIENT">Client</option>
                  <option value="MASTER">Master</option>
                  <option value="SUPER_MASTER">Super Master</option>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Initial Balance
                </label>
                <Input
                  type="number"
                  value={formData.balance}
                  onChange={(e) => handleInputChange('balance', Number(e.target.value))}
                  placeholder="Enter initial balance"
                  className="w-full"
                />
              </div>
              <Button
                onClick={handleAddUser}
                disabled={creating}
                className="w-full bg-primary hover:bg-primary/90 text-white mt-6"
              >
                {creating ? 'Creating...' : 'Create User'}
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
                    onClick={() => handleTabChange(tab)}
                    className={`pb-3 text-sm font-medium whitespace-nowrap ${selectedTab === tab
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

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {error && (
            <Card className="border-red-200 bg-red-50 mb-4">
              <CardContent className="p-4">
                <p className="text-red-600 text-sm">
                  Error loading users: {error}. Please try again.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Mobile Cards */}
          <div className="block sm:hidden space-y-3">
            {users.map((user: UserData) => (
              <Card key={user.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/user-profile/${user.id}`)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
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
                      <span className="text-gray-500">Balance:</span>
                      <span className="ml-1 font-medium">₹{user.balance?.toLocaleString() || '0'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                      <span className={`w-2 h-2 rounded-full mr-1 ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                      {user.status}
                    </Badge>
                    <p className="text-xs text-gray-500">{getLastLoginText(user.lastLoginAt)}</p>
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
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Balance</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last login</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: UserData) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/user-profile/${user.id}`)}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={18} className="text-gray-600" />
                          </div>
                          <span className="font-medium">{user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{user.email}</td>
                      <td className="py-4 px-4 text-gray-700">{user.role}</td>
                      <td className="py-4 px-4 text-gray-700">₹{user.balance?.toLocaleString() || '0'}</td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(user.status)}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{getLastLoginText(user.lastLoginAt)}</td>
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

          {/* Pagination */}
          {totalUsers > 50 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {Math.ceil(totalUsers / 50)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalUsers / 50), prev + 1))}
                disabled={currentPage === Math.ceil(totalUsers / 50)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
