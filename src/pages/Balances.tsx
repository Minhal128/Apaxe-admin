import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { User, MoreVertical } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { userApi, dashboardApi } from '@/lib/api'

interface UserData {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  status: string;
  balance: number;
  availableBalance?: number;
  availableMargin?: number;
  marginUsed?: number;
  lockedFunds?: number;
  lockedMargin?: number;
}


export default function Balances() {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState('Clients')
  const [currentPage, setCurrentPage] = useState(1)

  const { data: usersData, meta, loading, error, refetch } = useApi<any>(
    () => {
      const roleMap: Record<string, string> = {
        'Clients': 'CLIENT',
        'Sub-admins': 'SUPER_MASTER',
        'Masters': 'MASTER'
      };

      return userApi.getUsers({
        role: roleMap[selectedTab],
        page: currentPage,
        limit: 50
      });
    },
    {
      onSuccess: (data) => {
        console.log("The data is real", data)
      },
      onError: (error) => {
        console.error('Balances API error:', error)
      }
    }
  )

  const { data: dashboardStats } = useApi<any>(
    () => dashboardApi.getDashboard(),
    { immediate: true }
  );

  useEffect(() => {
    refetch()
  }, [selectedTab, currentPage])

  const tabs = ['Clients', 'Sub-admins', 'Masters']
  const users = Array.isArray(usersData) ? usersData : (usersData?.users || [])
  const totalUsers = meta?.total || usersData?.total || 0

  const stats = dashboardStats?.stats || {
    totalSystemFunds: 0,
    totalAvailableFunds: 0,
    lockedFunds: 0,
    pendingWithdrawals: 0
  };


  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary bg-primary/5">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total system funds</p>
            <p className="text-3xl font-bold">₹{stats.totalBalance?.toLocaleString() || '0'}</p>
            <div className="mt-4">
              <svg className="w-full h-8" viewBox="0 0 100 30">
                <polyline points="0,20 20,15 40,18 60,12 80,10 100,8" fill="none" stroke="#18B451" strokeWidth="2" />
                <polyline points="0,20 20,15 40,18 60,12 80,10 100,8 100,30 0,30" fill="rgba(24,180,81,0.1)" />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary bg-primary/5">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total available funds</p>
            <p className="text-3xl font-bold">₹{stats.totalAvailableMargin?.toLocaleString() || '0'}</p>
            <div className="mt-4">
              <svg className="w-full h-8" viewBox="0 0 100 30">
                <polyline points="0,22 20,20 40,18 60,16 80,12 100,10" fill="none" stroke="#18B451" strokeWidth="2" />
                <polyline points="0,22 20,20 40,18 60,16 80,12 100,10 100,30 0,30" fill="rgba(24,180,81,0.1)" />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-pink-400 bg-pink-50">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Locked funds</p>
            <p className="text-3xl font-bold">₹{stats.totalLockedMargin?.toLocaleString() || '0'}</p>
            <div className="mt-4">
              <svg className="w-full h-8" viewBox="0 0 100 30">
                <polyline points="0,15 20,18 40,14 60,16 80,12 100,10" fill="none" stroke="#EC4899" strokeWidth="2" />
                <polyline points="0,15 20,18 40,14 60,16 80,12 100,10 100,30 0,30" fill="rgba(236,72,153,0.1)" />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary bg-primary/5">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Pending withdrawals</p>
            <p className="text-3xl font-bold">₹0</p>
            <div className="mt-4">
              <svg className="w-full h-8" viewBox="0 0 100 30">
                <polyline points="0,18 20,16 40,14 60,12 80,10 100,8" fill="none" stroke="#18B451" strokeWidth="2" />
                <polyline points="0,18 20,16 40,14 60,12 80,10 100,8 100,30 0,30" fill="rgba(24,180,81,0.1)" />
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-4 sm:space-x-8 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`pb-3 text-sm font-medium whitespace-nowrap ${selectedTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
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
                  Error loading balances: {error}. Please try again.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Mobile Cards View */}
          <div className="block sm:hidden space-y-3">
            {users.map((user: UserData) => (
              <div
                key={user.id}
                className="border border-gray-100 rounded-lg p-4 space-y-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/user-balance/${user.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'}</p>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Net Balance:</span>
                    <p className="font-medium text-gray-900 mt-1">₹{user.balance?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Available:</span>
                    <p className="text-gray-700 mt-1">₹{(user.availableMargin || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Margin Used:</span>
                    <p className="text-gray-700 mt-1">₹{user.marginUsed?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Locked:</span>
                    <p className="text-gray-700 mt-1">₹{(user.lockedMargin || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block">
            <ScrollArea className="h-[500px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Net Balance</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Available balance</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Margin used</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Locked funds</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: UserData) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/user-balance/${user.id}`)}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={18} className="text-gray-600" />
                          </div>
                          <span className="font-medium">{user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{user.role}</td>
                      <td className="py-4 px-4 font-medium">₹{user.balance?.toLocaleString() || '0'}</td>
                      <td className="py-4 px-4 text-gray-700">₹{(user.availableMargin || 0).toLocaleString()}</td>
                      <td className="py-4 px-4 text-gray-700">₹{user.marginUsed?.toLocaleString() || '0'}</td>
                      <td className="py-4 px-4 text-gray-700">₹{(user.lockedMargin || 0).toLocaleString()}</td>
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
