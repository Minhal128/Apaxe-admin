import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ArrowLeft, MoreVertical, User } from 'lucide-react'
import { toast } from 'react-toastify'

const transactions = [
  { id: 1, date: '23 Sep, 25 | 09:00 AM', type: 'Credit', amount: '$1,682.09', transactionId: '26EG372AC29023' },
  { id: 2, date: '23 Sep, 25 | 09:00 AM', type: 'Credit', amount: '$1,682.09', transactionId: '26EG372AC29023' },
  { id: 3, date: '23 Sep, 25 | 09:00 AM', type: 'Credit', amount: '$1,682.09', transactionId: '26EG372AC29023' },
  { id: 4, date: '23 Sep, 25 | 09:00 AM', type: 'Credit', amount: '$1,682.09', transactionId: '26EG372AC29023' },
]

export default function UserBalance() {
  const navigate = useNavigate()
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [amount, setAmount] = useState('')

  const handleAddFunds = () => {
    if (!amount) {
      toast.error('Please enter an amount')
      return
    }
    toast.success(`Successfully added $${amount}`)
    setShowAddFunds(false)
    setAmount('')
  }

  const handleDeductFunds = () => {
    toast.info('Deduct funds functionality')
  }

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
                <h2 className="text-xl font-bold">Kabiru Michael</h2>
                <p className="text-gray-500">User · ID: #4657584</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Active
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
                onClick={handleDeductFunds}
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
              <p className="text-2xl font-bold">₹11,320</p>
              <div className="mt-2">
                <svg className="w-full h-6" viewBox="0 0 100 20">
                  <polyline points="0,15 25,12 50,14 75,8 100,6" fill="none" stroke="#18B451" strokeWidth="2"/>
                  <polyline points="0,15 25,12 50,14 75,8 100,6 100,20 0,20" fill="rgba(24,180,81,0.1)"/>
                </svg>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-600 text-sm mb-1">Margin used</p>
              <p className="text-2xl font-bold">₹3,200</p>
              <div className="mt-2">
                <svg className="w-full h-6" viewBox="0 0 100 20">
                  <polyline points="0,15 25,13 50,10 75,12 100,8" fill="none" stroke="#18B451" strokeWidth="2"/>
                  <polyline points="0,15 25,13 50,10 75,12 100,8 100,20 0,20" fill="rgba(24,180,81,0.1)"/>
                </svg>
              </div>
            </div>

            <div className="p-4 border border-pink-200 rounded-lg bg-pink-50">
              <p className="text-gray-600 text-sm mb-1">Total Balance</p>
              <p className="text-2xl font-bold">₹1,300</p>
              <div className="mt-2">
                <svg className="w-full h-6" viewBox="0 0 100 20">
                  <polyline points="0,16 25,14 50,12 75,10 100,8" fill="none" stroke="#EC4899" strokeWidth="2"/>
                  <polyline points="0,16 25,14 50,12 75,10 100,8 100,20 0,20" fill="rgba(236,72,153,0.1)"/>
                </svg>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-600 text-sm mb-1">Credit Limit</p>
              <p className="text-2xl font-bold">₹200k</p>
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
                <h3 className="font-semibold mb-4">Exposure utilization : 65%</h3>
                <div className="mb-2">
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Current: ₹250,000 / Max: ₹400,000</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Profit sharing</h3>
                <div className="mb-2">
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">User: 70% (₹65,000)</span>
                  <span className="text-gray-600">Admin: 30% (₹18,000)</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <div>
            <h3 className="font-semibold mb-4">Recent transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Transaction ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-700">{transaction.date}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {transaction.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium">{transaction.amount}</td>
                      <td className="py-4 px-4 text-gray-700">{transaction.transactionId}</td>
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
                <p className="font-semibold">Kabiru Michael</p>
                <p className="text-sm text-gray-500">User · ID: #4657584</p>
              </div>
              <div className="text-right">
                <p className="font-bold">₹200k</p>
                <p className="text-xs text-gray-500">Available Balance</p>
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
              />
            </div>

            <Button 
              onClick={handleAddFunds}
              className="w-full"
            >
              + Add funds
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
