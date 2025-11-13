import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User, DollarSign } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

const accountData = [
  { month: 'Jan', value: 2000 },
  { month: 'Feb', value: 4000 },
  { month: 'Mar', value: 3000 },
  { month: 'Apr', value: 7000 },
]

const transactions = [
  { text: 'Deposited $40,000', time: '2 days ago', status: 'Completed', color: 'bg-green-100' },
  { text: 'Opened a position 0.09 lots', time: '12 days ago', status: 'Wait', color: 'bg-yellow-100' },
  { text: 'Stop loss hit', time: '12 days ago', status: 'Loss', color: 'bg-red-100' },
]

export default function UserProfile() {
  const navigate = useNavigate()
  const { id } = useParams()

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
              <p className="text-2xl font-bold">$1,320</p>
              <div className="mt-2">
                <svg className="w-full h-6" viewBox="0 0 100 20">
                  <polyline points="0,15 25,12 50,14 75,8 100,6" fill="none" stroke="#18B451" strokeWidth="2"/>
                  <polyline points="0,15 25,12 50,14 75,8 100,6 100,20 0,20" fill="rgba(24,180,81,0.1)"/>
                </svg>
              </div>
            </div>

            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <p className="text-gray-600 text-sm mb-1">Total trades</p>
              <p className="text-2xl font-bold">256</p>
              <div className="mt-2">
                <svg className="w-full h-6" viewBox="0 0 100 20">
                  <polyline points="0,15 25,13 50,10 75,12 100,8" fill="none" stroke="#3B82F6" strokeWidth="2"/>
                  <polyline points="0,15 25,13 50,10 75,12 100,8 100,20 0,20" fill="rgba(59,130,246,0.1)"/>
                </svg>
              </div>
            </div>

            <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
              <p className="text-gray-600 text-sm mb-1">Margins used</p>
              <p className="text-2xl font-bold">$123k</p>
              <div className="mt-2">
                <svg className="w-full h-6" viewBox="0 0 100 20">
                  <polyline points="0,16 25,14 50,12 75,10 100,8" fill="none" stroke="#F59E0B" strokeWidth="2"/>
                  <polyline points="0,16 25,14 50,12 75,10 100,8 100,20 0,20" fill="rgba(245,158,11,0.1)"/>
                </svg>
              </div>
            </div>

            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
              <p className="text-gray-600 text-sm mb-1">Total P&L</p>
              <p className="text-2xl font-bold">$200k</p>
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
              <button className="pb-3 text-sm font-medium text-primary border-b-2 border-primary">
                Overview
              </button>
              <button className="pb-3 text-sm font-medium text-gray-500">
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
                  <p className="font-medium">Kabiru Michael Marshall</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">User ID</p>
                  <p className="font-medium">#4657584</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Role</p>
                  <p className="font-medium">Client</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">BK</p>
                  <p className="font-medium">BK</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Email address</p>
                  <p className="font-medium">kabimarsh@gmail.com</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">6K</p>
                  <p className="font-medium">6K</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Phone number</p>
                  <p className="font-medium">+243.38362923</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">4K</p>
                  <p className="font-medium">4K</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Group</p>
                  <p className="font-medium">Primary</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">2K</p>
                  <p className="font-medium">2K</p>
                </div>
              </div>

              {/* Recent Transactions */}
              <div>
                <h3 className="font-semibold mb-4">Recent transactions</h3>
                <div className="space-y-3">
                  {transactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg ${transaction.color} flex items-center justify-center`}>
                          <DollarSign size={20} className="text-gray-700" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.text}</p>
                          <p className="text-xs text-gray-500">{transaction.time}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'Completed' ? 'bg-primary text-white' :
                        transaction.status === 'Wait' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Account Overview Chart */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Account Overview</h3>
                <button className="text-xs text-gray-500">▼</button>
              </div>
              <p className="text-xs text-gray-500 mb-2">Total amount raised across all projects</p>
              
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={accountData}>
                  <Line type="monotone" dataKey="value" stroke="#18B451" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>

              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">8K</span>
                  <div className="h-px flex-1 bg-gray-200 mx-3"></div>
                  <span className="text-primary font-semibold text-lg">2.5k</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">6K</span>
                  <div className="h-px flex-1 bg-gray-200 mx-3"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">4K</span>
                  <div className="h-px flex-1 bg-gray-200 mx-3"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">2K</span>
                  <div className="h-px flex-1 bg-gray-200 mx-3"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
