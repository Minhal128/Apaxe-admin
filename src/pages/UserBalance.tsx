import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ArrowLeft, MoreVertical, User, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { userApi, reportsApi } from '@/lib/api'
import { useApi } from '@/hooks/useApi'

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
  marginUsed?: number;
  lockedFunds?: number;
  creditLimit?: number;
  exposureLimit?: number;
  exposureUsed?: number;
  profitSharePercentage?: number;
}

interface LedgerEntry {
  id: string;
  createdAt: string;
  type: string;
  amount: number;
  description?: string;
  referenceId?: string;
}

export default function UserBalance() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [showDeductFunds, setShowDeductFunds] = useState(false)
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch user data
  const { data: userData, loading: userLoading, error: userError, refetch: refetchUser } = useApi<any>(
    () => userApi.getUser(id!),
    { immediate: !!id }
  )

  // Fetch ledger entries for this user
  const { data: ledgerData, loading: ledgerLoading, refetch: refetchLedger } = useApi<any>(
    () => reportsApi.getLedgerEntries({ userId: id, limit: 10 }),
    { immediate: !!id }
  )

  const user: UserData | null = userData?.data || userData || null
  const transactions: LedgerEntry[] = ledgerData?.data || ledgerData || []

  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return '₹0'
    return `₹${Number(value).toLocaleString('en-IN')}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleAddFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (!reason.trim()) {
      toast.error('Please enter a reason')
      return
    }

    setIsSubmitting(true)
    try {
      await userApi.adjustBalance(id!, {
        amount: parseFloat(amount),
        type: 'CREDIT',
        reason: reason.trim()
      })
      toast.success(`Successfully added ₹${parseFloat(amount).toLocaleString('en-IN')}`)
      setShowAddFunds(false)
      setAmount('')
      setReason('')
      refetchUser()
      refetchLedger()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add funds')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeductFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (!reason.trim()) {
      toast.error('Please enter a reason')
      return
    }

    setIsSubmitting(true)
    try {
      await userApi.adjustBalance(id!, {
        amount: parseFloat(amount),
        type: 'DEBIT',
        reason: reason.trim()
      })
      toast.success(`Successfully deducted ₹${parseFloat(amount).toLocaleString('en-IN')}`)
      setShowDeductFunds(false)
      setAmount('')
      setReason('')
      refetchUser()
      refetchLedger()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to deduct funds')
    } finally {
      setIsSubmitting(false)
    }
  }

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
            onClick={() => navigate('/balances')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">User Balance</h1>
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
  const exposurePercent = user.exposureLimit ? Math.round((user.exposureUsed || 0) / user.exposureLimit * 100) : 0
  const profitSharePercent = user.profitSharePercentage || 70

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/balances')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">User Balance</h1>
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
                <p className="text-gray-500">{user.role} · ID: #{user.id.slice(-8)}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
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
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowAddFunds(true)}
                className="bg-primary hover:bg-primary/90"
              >
                + Add funds
              </Button>
              <Button 
                onClick={() => setShowDeductFunds(true)}
                variant="outline"
              >
                − Deduct funds
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-600 text-sm mb-1">Available Balance</p>
              <p className="text-2xl font-bold">{formatCurrency(user.availableBalance || user.balance)}</p>
              <div className="mt-2">
                <svg className="w-full h-6" viewBox="0 0 100 20">
                  <polyline points="0,15 25,12 50,14 75,8 100,6" fill="none" stroke="#18B451" strokeWidth="2"/>
                  <polyline points="0,15 25,12 50,14 75,8 100,6 100,20 0,20" fill="rgba(24,180,81,0.1)"/>
                </svg>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-600 text-sm mb-1">Margin Used</p>
              <p className="text-2xl font-bold">{formatCurrency(user.marginUsed || 0)}</p>
              <div className="mt-2">
                <svg className="w-full h-6" viewBox="0 0 100 20">
                  <polyline points="0,15 25,13 50,10 75,12 100,8" fill="none" stroke="#18B451" strokeWidth="2"/>
                  <polyline points="0,15 25,13 50,10 75,12 100,8 100,20 0,20" fill="rgba(24,180,81,0.1)"/>
                </svg>
              </div>
            </div>

            <div className="p-4 border border-pink-200 rounded-lg bg-pink-50">
              <p className="text-gray-600 text-sm mb-1">Total Balance</p>
              <p className="text-2xl font-bold">{formatCurrency(user.balance)}</p>
              <div className="mt-2">
                <svg className="w-full h-6" viewBox="0 0 100 20">
                  <polyline points="0,16 25,14 50,12 75,10 100,8" fill="none" stroke="#EC4899" strokeWidth="2"/>
                  <polyline points="0,16 25,14 50,12 75,10 100,8 100,20 0,20" fill="rgba(236,72,153,0.1)"/>
                </svg>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-600 text-sm mb-1">Credit Limit</p>
              <p className="text-2xl font-bold">{formatCurrency(user.creditLimit || 0)}</p>
              <div className="mt-2">
                <svg className="w-full h-6" viewBox="0 0 100 20">
                  <polyline points="0,18 25,16 50,14 75,10 100,6" fill="none" stroke="#18B451" strokeWidth="2"/>
                  <polyline points="0,18 25,16 50,14 75,10 100,6 100,20 0,20" fill="rgba(24,180,81,0.1)"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Exposure and Profit Sharing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Exposure utilization: {exposurePercent}%</h3>
                <div className="mb-2">
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(exposurePercent, 100)}%` }}></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Current: {formatCurrency(user.exposureUsed || 0)} / Max: {formatCurrency(user.exposureLimit || 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Profit sharing</h3>
                <div className="mb-2">
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${profitSharePercent}%` }}></div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">User: {profitSharePercent}%</span>
                  <span className="text-gray-600">Admin: {100 - profitSharePercent}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <div>
            <h3 className="font-semibold mb-4">Recent transactions</h3>
            {ledgerLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No transactions found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-gray-700">{formatDate(transaction.createdAt)}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            transaction.type === 'CREDIT' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className={`py-4 px-4 font-medium ${
                          transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                        </td>
                        <td className="py-4 px-4 text-gray-700">{transaction.description || '-'}</td>
                        <td className="py-4 px-4">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Funds Modal */}
      <Dialog open={showAddFunds} onOpenChange={setShowAddFunds}>
        <DialogContent>
          <DialogClose onClose={() => setShowAddFunds(false)} />
          <DialogHeader>
            <DialogTitle>Add funds</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={24} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{displayName}</p>
                <p className="text-sm text-gray-500">{user.role} · ID: #{user.id.slice(-8)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatCurrency(user.balance)}</p>
                <p className="text-xs text-gray-500">Current Balance</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter funds amount
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <Input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for adding funds"
              />
            </div>

            <Button 
              onClick={handleAddFunds}
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              + Add funds
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deduct Funds Modal */}
      <Dialog open={showDeductFunds} onOpenChange={setShowDeductFunds}>
        <DialogContent>
          <DialogClose onClose={() => setShowDeductFunds(false)} />
          <DialogHeader>
            <DialogTitle>Deduct funds</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={24} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{displayName}</p>
                <p className="text-sm text-gray-500">{user.role} · ID: #{user.id.slice(-8)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatCurrency(user.balance)}</p>
                <p className="text-xs text-gray-500">Current Balance</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter amount to deduct
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <Input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for deducting funds"
              />
            </div>

            <Button 
              onClick={handleDeductFunds}
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              − Deduct funds
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
