import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User, DollarSign, Loader2 } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { userApi, reportsApi, tradingApi } from '@/lib/api'
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
  balance: number;
  availableBalance?: number;
  marginUsed?: number;
  totalPnL?: number;
  group?: string;
  createdAt?: string;
}

interface LedgerEntry {
  id: string;
  createdAt: string;
  type: string;
  amount: number;
  description?: string;
}

export default function UserProfile() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch user data
  const { data: userData, loading: userLoading, error: userError, refetch: refetchUser } = useApi<any>(
    () => userApi.getUser(id!),
    { immediate: !!id }
  )

  // Fetch ledger entries for transactions
  const { data: ledgerData, loading: ledgerLoading } = useApi<any>(
    () => reportsApi.getLedgerEntries({ userId: id, limit: 5 }),
    { immediate: !!id }
  )

  // Fetch trades count
  const { data: tradesData } = useApi<any>(
    () => tradingApi.getTrades({ userId: id, limit: 1 }),
    { immediate: !!id }
  )

  const user: UserData | null = userData?.user || userData?.data || userData || null
  const transactions: LedgerEntry[] = ledgerData?.data || ledgerData || []
  const totalTrades = tradesData?.meta?.total || tradesData?.total || 0

  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return '₹0'
    return `₹${Number(value).toLocaleString('en-IN')}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })
  }

  const getTransactionColor = (type: string) => {
    if (type === 'CREDIT' || type === 'DEPOSIT') return 'bg-green-100'
    if (type === 'DEBIT' || type === 'WITHDRAWAL') return 'bg-red-100'
    return 'bg-yellow-100'
  }

  const getTransactionStatus = (type: string) => {
    if (type === 'CREDIT' || type === 'DEPOSIT') return { text: 'Completed', class: 'bg-primary text-white' }
    if (type === 'DEBIT' || type === 'WITHDRAWAL') return { text: 'Completed', class: 'bg-primary text-white' }
    return { text: 'Pending', class: 'bg-yellow-100 text-yellow-700' }
  }

  // Mock chart data - in production, fetch from API
  const accountData = [
    { month: 'Jan', value: Number(user?.balance || 0) * 0.6 },
    { month: 'Feb', value: Number(user?.balance || 0) * 0.75 },
    { month: 'Mar', value: Number(user?.balance || 0) * 0.85 },
    { month: 'Apr', value: Number(user?.balance || 0) },
  ]

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
          <h1 className="text-2xl font-bold">User profile</h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-600">Failed to load user data. {userError}</p>
            <Button onClick={() => refetchUser()} className="mt-4">Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const displayName = user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || displayName

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/user-management')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">User profile</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={40} className="text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{displayName}</h2>
                <p className="text-gray-500">{user.role} · ID: #{user.id?.slice(-8) || 'N/A'}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    {user.status}
                  </span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => navigate(`/edit-profile/${id}`)}
              className="bg-primary hover:bg-primary/90"
            >
              + Edit profile
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
              <p className="text-gray-600 text-sm mb-1">Available Balance</p>
              <p className="text-2xl font-bold">{formatCurrency(user.availableBalance || user.balance)}</p>
              <div className="mt-2">
                <svg className="w-full h-6" viewBox="0 0 100 20">
                  <polyline points="0,15 25,12 50,14 75,8 100,6" fill="none" stroke="#18B451" strokeWidth="2"/>
                  <polyline points="0,15 25,12 50,14 75,8 100,6 100,20 0,20" fill="rgba(24,180,81,0.1)"/>
                </svg>
              </div>
            </div>

            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <p className="text-gray-600 text-sm mb-1">Total trades</p>
              <p className="text-2xl font-bold">{totalTrades}</p>
              <div className="mt-2">
                <svg className="w-full h-6" viewBox="0 0 100 20">
                  <polyline points="0,15 25,13 50,10 75,12 100,8" fill="none" stroke="#3B82F6" strokeWidth="2"/>
                  <polyline points="0,15 25,13 50,10 75,12 100,8 100,20 0,20" fill="rgba(59,130,246,0.1)"/>
                </svg>
              </div>
            </div>

            <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
              <p className="text-gray-600 text-sm mb-1">Margins used</p>
              <p className="text-2xl font-bold">{formatCurrency(user.marginUsed || 0)}</p>
              <div className="mt-2">
                <svg className="w-full h-6" viewBox="0 0 100 20">
                  <polyline points="0,16 25,14 50,12 75,10 100,8" fill="none" stroke="#F59E0B" strokeWidth="2"/>
                  <polyline points="0,16 25,14 50,12 75,10 100,8 100,20 0,20" fill="rgba(245,158,11,0.1)"/>
                </svg>
              </div>
            </div>

            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
              <p className="text-gray-600 text-sm mb-1">Total P&L</p>
              <p className="text-2xl font-bold">{formatCurrency(user.totalPnL || 0)}</p>
              <div className="mt-2">
                <svg className="w-full h-6" viewBox="0 0 100 20">
                  <polyline points="0,18 25,16 50,14 75,10 100,6" fill="none" stroke="#18B451" strokeWidth="2"/>
                  <polyline points="0,18 25,16 50,14 75,10 100,6 100,20 0,20" fill="rgba(24,180,81,0.1)"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`pb-3 text-sm font-medium ${
                  activeTab === 'overview' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-500'
                }`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('activity')}
                className={`pb-3 text-sm font-medium ${
                  activeTab === 'activity' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-500'
                }`}
              >
                Activity log
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Details */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Full name</p>
                  <p className="font-medium">{fullName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">User ID</p>
                  <p className="font-medium">#{user.id?.slice(-8) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Role</p>
                  <p className="font-medium">{user.role}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Status</p>
                  <p className="font-medium">{user.status}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Email address</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Balance</p>
                  <p className="font-medium">{formatCurrency(user.balance)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Phone number</p>
                  <p className="font-medium">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Joined</p>
                  <p className="font-medium">
                    {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-IN', { 
                          day: '2-digit', month: 'short', year: 'numeric' 
                        }) 
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Group</p>
                  <p className="font-medium">{user.group || 'Default'}</p>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="mt-6">
                <h3 className="font-semibold mb-4">Recent transactions</h3>
                {ledgerLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No transactions found</p>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((transaction) => {
                      const status = getTransactionStatus(transaction.type)
                      return (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg ${getTransactionColor(transaction.type)} flex items-center justify-center`}>
                              <DollarSign size={20} className="text-gray-700" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {transaction.type === 'CREDIT' ? 'Deposited' : 'Withdrew'} {formatCurrency(Math.abs(transaction.amount))}
                              </p>
                              <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.class}`}>
                            {status.text}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Account Overview Chart */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Account Overview</h3>
                <button className="text-xs text-gray-500">▼</button>
              </div>
              <p className="text-xs text-gray-500 mb-2">Balance trend over time</p>
              
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={accountData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Balance']}
                    labelStyle={{ color: '#666' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#18B451" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Balance</span>
                  <span className="text-primary font-semibold text-lg">{formatCurrency(user.balance)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
