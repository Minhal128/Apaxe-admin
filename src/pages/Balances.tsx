import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { MoreVertical } from 'lucide-react'

const balances = [
  { id: 1, userId: 'User #102634', role: 'User', netBalance: '₹1,682.09', available: '$120.09', marginUsed: '$120,098.09', locked: '$400' },
  { id: 2, userId: 'User #102834', role: 'User', netBalance: '₹1,682.09', available: '$120.09', marginUsed: '$120,098.09', locked: '$400' },
  { id: 3, userId: 'User #102834', role: 'User', netBalance: '₹1,682.09', available: '$120.09', marginUsed: '$120,098.09', locked: '$400' },
  { id: 4, userId: 'User #102834', role: 'User', netBalance: '₹1,682.09', available: '$120.09', marginUsed: '$120,098.09', locked: '$400' },
  { id: 5, userId: 'User #102834', role: 'User', netBalance: '₹1,682.09', available: '$120.09', marginUsed: '$120,098.09', locked: '$400' },
  { id: 6, userId: 'User #102834', role: 'User', netBalance: '₹1,682.09', available: '$120.09', marginUsed: '$120,098.09', locked: '$400' },
  { id: 7, userId: 'User #102834', role: 'User', netBalance: '$1,682.09', available: '$120.09', marginUsed: '$120,098.09', locked: '$400' },
  { id: 8, userId: 'User #102834', role: 'User', netBalance: '$1,682.09', available: '$120.09', marginUsed: '$120,098.09', locked: '$400' },
  { id: 9, userId: 'User #102834', role: 'User', netBalance: '$1,682.09', available: '$120.09', marginUsed: '$120,098.09', locked: '$400' },
]

export default function Balances() {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState('Clients')

  const tabs = ['Clients', 'Sub-admins', 'Masters', 'Clients', 'View only']

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary bg-primary/5">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total system funds</p>
            <p className="text-3xl font-bold">$1,320</p>
            <div className="mt-4">
              <svg className="w-full h-8" viewBox="0 0 100 30">
                <polyline points="0,20 20,15 40,18 60,12 80,10 100,8" fill="none" stroke="#18B451" strokeWidth="2"/>
                <polyline points="0,20 20,15 40,18 60,12 80,10 100,8 100,30 0,30" fill="rgba(24,180,81,0.1)"/>
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary bg-primary/5">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total available funds</p>
            <p className="text-3xl font-bold">$3,200</p>
            <div className="mt-4">
              <svg className="w-full h-8" viewBox="0 0 100 30">
                <polyline points="0,22 20,20 40,18 60,16 80,12 100,10" fill="none" stroke="#18B451" strokeWidth="2"/>
                <polyline points="0,22 20,20 40,18 60,16 80,12 100,10 100,30 0,30" fill="rgba(24,180,81,0.1)"/>
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-pink-400 bg-pink-50">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Locked funds</p>
            <p className="text-3xl font-bold">$1,300</p>
            <div className="mt-4">
              <svg className="w-full h-8" viewBox="0 0 100 30">
                <polyline points="0,15 20,18 40,14 60,16 80,12 100,10" fill="none" stroke="#EC4899" strokeWidth="2"/>
                <polyline points="0,15 20,18 40,14 60,16 80,12 100,10 100,30 0,30" fill="rgba(236,72,153,0.1)"/>
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary bg-primary/5">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Pending withdrawals</p>
            <p className="text-3xl font-bold">$200k</p>
            <div className="mt-4">
              <svg className="w-full h-8" viewBox="0 0 100 30">
                <polyline points="0,18 20,16 40,14 60,12 80,10 100,8" fill="none" stroke="#18B451" strokeWidth="2"/>
                <polyline points="0,18 20,16 40,14 60,12 80,10 100,8 100,30 0,30" fill="rgba(24,180,81,0.1)"/>
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
          </div>

          {/* Mobile Cards View */}
          <div className="block sm:hidden space-y-3">
            {balances.map((balance) => (
              <div 
                key={balance.id} 
                className="border border-gray-100 rounded-lg p-4 space-y-3"
                onClick={() => navigate(`/user-balance/${balance.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{balance.userId}</p>
                    <p className="text-sm text-gray-500">{balance.role}</p>
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
                    <p className="font-medium text-gray-900 mt-1">{balance.netBalance}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Available:</span>
                    <p className="text-gray-700 mt-1">{balance.available}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Margin Used:</span>
                    <p className="text-gray-700 mt-1">{balance.marginUsed}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Locked:</span>
                    <p className="text-gray-700 mt-1">{balance.locked}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Net Balance</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Available balance</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Margin used</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Locked funds</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {balances.map((balance) => (
                  <tr 
                    key={balance.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/user-balance/${balance.id}`)}
                  >
                    <td className="py-4 px-4 text-gray-700">{balance.userId}</td>
                    <td className="py-4 px-4 text-gray-700">{balance.role}</td>
                    <td className="py-4 px-4 font-medium">{balance.netBalance}</td>
                    <td className="py-4 px-4 text-gray-700">{balance.available}</td>
                    <td className="py-4 px-4 text-gray-700">{balance.marginUsed}</td>
                    <td className="py-4 px-4 text-gray-700">{balance.locked}</td>
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
