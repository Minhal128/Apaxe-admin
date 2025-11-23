import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, MoreHorizontal, TrendingUp } from 'lucide-react'

export default function Reports() {
  const [activeTab, setActiveTab] = useState('pnl-report')

  // Mock data
  const tradeHistoryData = [
    {
      tradeId: '#1535457663',
      userId: '#1535457663',
      instrument: 'S & P 500',
      orderType: 'Buy',
      quantity: '100',
      price: '₹1190',
      time: '09:00 AM',
      status: 'Active'
    },
    {
      tradeId: '#1535457663',
      userId: '#1535457663',
      instrument: 'S & P 500',
      orderType: 'Sell',
      quantity: '100',
      price: '₹1190',
      time: '09:00 AM',
      status: 'Active'
    },
    {
      tradeId: '#1535457663',
      userId: '#1535457663',
      instrument: 'S & P 500',
      orderType: 'Buy',
      quantity: '100',
      price: '₹1190',
      time: '09:00 AM',
      status: 'Active'
    },
    {
      tradeId: '#1535457663',
      userId: '#1535457663',
      instrument: 'S & P 500',
      orderType: 'Sell',
      quantity: '100',
      price: '₹1190',
      time: '09:00 AM',
      status: 'Active'
    }
  ]

  const pnlData = [
    {
      user: '#1535457663',
      market: 'Nifty 500',
      realizedPnl: '₹25,000',
      unrealizedPnl: '₹1190',
      netPnl: '₹190',
      date: '23 Sep, 25 | 09:00 AM'
    },
    {
      user: '#1535457663',
      market: 'Nifty 500',
      realizedPnl: '₹25,000',
      unrealizedPnl: '₹1190',
      netPnl: '₹190',
      date: '23 Sep, 25 | 09:00 AM'
    },
    {
      user: '#1535457663',
      market: 'Nifty 500',
      realizedPnl: '₹25,000',
      unrealizedPnl: '₹1190',
      netPnl: '₹190',
      date: '23 Sep, 25 | 09:00 AM'
    },
    {
      user: '#1535457663',
      market: 'Nifty 500',
      realizedPnl: '₹25,000',
      unrealizedPnl: '₹1190',
      netPnl: '₹190',
      date: '23 Sep, 25 | 09:00 AM'
    }
  ]

  const profitSharingData = [
    {
      userId: '#1535457663',
      role: 'Admin',
      commission: '25',
      adminShare: '₹1190',
      amountEarned: '₹1190',
      date: '23/09/2025',
      status: 'Active'
    },
    {
      userId: '#1535457663',
      role: 'Admin',
      commission: '25',
      adminShare: '₹1190',
      amountEarned: '₹1190',
      date: '23/09/2025',
      status: 'Active'
    },
    {
      userId: '#1535457663',
      role: 'Admin',
      commission: '25',
      adminShare: '₹1190',
      amountEarned: '₹1190',
      date: '23/09/2025',
      status: 'Active'
    },
    {
      userId: '#1535457663',
      role: 'Admin',
      commission: '25',
      adminShare: '₹1190',
      amountEarned: '₹1190',
      date: '23/09/2025',
      status: 'Active'
    }
  ]

  const balanceData = [
    {
      userId: '#1535457663',
      credit: '₹1190',
      debit: '₹1190',
      marginUsed: '₹1190',
      availableBalance: '₹1190',
      lockedFunds: '₹1190'
    },
    {
      userId: '#1535457663',
      credit: '₹1190',
      debit: '₹1190',
      marginUsed: '₹1190',
      availableBalance: '₹1190',
      lockedFunds: '₹1190'
    },
    {
      userId: '#1535457663',
      credit: '₹1190',
      debit: '₹1190',
      marginUsed: '₹1190',
      availableBalance: '₹1190',
      lockedFunds: '₹1190'
    },
    {
      userId: '#1535457663',
      credit: '₹1190',
      debit: '₹1190',
      marginUsed: '₹1190',
      availableBalance: '₹1190',
      lockedFunds: '₹1190'
    }
  ]

  const tabs = [
    { id: 'pnl-report', label: 'P&L Report' },
    { id: 'trade-history', label: 'Trade history report' },
    { id: 'profit-sharing', label: 'Profit sharing report' },
    { id: 'balance-report', label: 'Balance Report' }
  ]

  const renderAreaChart = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Total traded volume over time</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-900 font-medium">Summary</span>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-green-600">Market Type</span>
              <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <span>Last 14 Days</span>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-4">
          <span>100k</span>
          <span>80k</span>
          <span>60k</span>
          <span>40k</span>
          <span>20k</span>
          <span>5k</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-8 h-full relative">
          <svg viewBox="0 0 600 200" className="w-full h-full">
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path
              d="M 0 150 Q 50 120 100 140 Q 150 160 200 120 Q 250 100 300 110 Q 350 130 400 100 Q 450 90 500 80 Q 550 60 600 120 L 600 200 L 0 200 Z"
              fill="url(#areaGradient)"
            />
            {/* Line */}
            <path
              d="M 0 150 Q 50 120 100 140 Q 150 160 200 120 Q 250 100 300 110 Q 350 130 400 100 Q 450 90 500 80 Q 550 60 600 120"
              stroke="#10b981"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
        
        {/* Blue line at bottom */}
        <div className="absolute bottom-0 left-8 right-0 h-1 bg-blue-500 rounded"></div>
      </div>
    </div>
  )

  const renderStackedBarChart = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Profit sharing chart</h3>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-gray-700">Admin</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-gray-700">Sub-Admin</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-800 rounded-full"></div>
            <span className="text-gray-700">Client</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-56">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 pr-4">
          <span>1,000</span>
          <span>800</span>
          <span>600</span>
          <span>400</span>
          <span>200</span>
          <span>0</span>
        </div>
        
        {/* Stacked bars */}
        <div className="ml-12 h-full flex items-end justify-between pb-8">
          {[
            { admin: 30, subAdmin: 40, client: 30, month: 'Jan' },
            { admin: 35, subAdmin: 45, client: 35, month: 'Feb' },
            { admin: 25, subAdmin: 35, client: 25, month: 'Mar' },
            { admin: 40, subAdmin: 50, client: 40, month: 'Apr' },
            { admin: 30, subAdmin: 40, client: 30, month: 'May' },
            { admin: 45, subAdmin: 55, client: 45, month: 'Jun' },
            { admin: 35, subAdmin: 45, client: 35, month: 'Jul' },
            { admin: 40, subAdmin: 50, client: 40, month: 'Aug' },
            { admin: 35, subAdmin: 45, client: 35, month: 'Sep' },
            { admin: 50, subAdmin: 60, client: 50, month: 'Oct' },
            { admin: 45, subAdmin: 55, client: 45, month: 'Nov' },
            { admin: 40, subAdmin: 50, client: 40, month: 'Dec' }
          ].map((data, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-12 flex flex-col">
                <div 
                  className="bg-green-400 w-full"
                  style={{ height: `${data.admin}px` }}
                />
                <div 
                  className="bg-green-600 w-full"
                  style={{ height: `${data.subAdmin}px` }}
                />
                <div 
                  className="bg-green-800 w-full"
                  style={{ height: `${data.client}px` }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-2">{data.month}</span>
            </div>
          ))}
        </div>
        
        {/* X-axis label */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">
          Month
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pnl-report':
        return (
          <div className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Market</TableHead>
                  <TableHead>Realized P&L</TableHead>
                  <TableHead>Unrealized P&L</TableHead>
                  <TableHead>Net P&L</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pnlData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.user}</TableCell>
                    <TableCell>{item.market}</TableCell>
                    <TableCell>{item.realizedPnl}</TableCell>
                    <TableCell>{item.unrealizedPnl}</TableCell>
                    <TableCell>{item.netPnl}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* {renderBarChart()} */}
          </div>
        )

      case 'trade-history':
        return (
          <div className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trade ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Instrument</TableHead>
                  <TableHead>Order type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tradeHistoryData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.tradeId}</TableCell>
                    <TableCell>{item.userId}</TableCell>
                    <TableCell>{item.instrument}</TableCell>
                    <TableCell>
                      <span className={item.orderType === 'Buy' ? 'text-green-600' : 'text-red-600'}>
                        {item.orderType}
                      </span>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.time}</TableCell>
                    <TableCell>
                      <Badge variant="success" className="bg-green-100 text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {renderAreaChart()}
          </div>
        )

      case 'profit-sharing':
        return (
          <div className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Commission (%)</TableHead>
                  <TableHead>Admin share</TableHead>
                  <TableHead>Amount Earned</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profitSharingData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.userId}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell>{item.commission}</TableCell>
                    <TableCell>{item.adminShare}</TableCell>
                    <TableCell>{item.amountEarned}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <Badge variant="success" className="bg-green-100 text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {renderStackedBarChart()}
          </div>
        )

      case 'balance-report':
        return (
          <div className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Credit</TableHead>
                  <TableHead>Debit</TableHead>
                  <TableHead>Margin used</TableHead>
                  <TableHead>Available Balance</TableHead>
                  <TableHead>Locked funds</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balanceData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.userId}</TableCell>
                    <TableCell>{item.credit}</TableCell>
                    <TableCell>{item.debit}</TableCell>
                    <TableCell>{item.marginUsed}</TableCell>
                    <TableCell>{item.availableBalance}</TableCell>
                    <TableCell>{item.lockedFunds}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Trades Executed */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Trades Executed</p>
              <p className="text-2xl font-bold text-gray-900">146</p>
              <div className="mt-2">
                <svg width="60" height="20" viewBox="0 0 60 20" className="text-green-500">
                  <path
                    d="M0 15 Q 10 10 20 12 T 40 8 T 60 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Total System P&L */}
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total System P&L</p>
              <p className="text-2xl font-bold text-gray-900">₹5,200</p>
              <div className="mt-2">
                <svg width="60" height="20" viewBox="0 0 60 20" className="text-cyan-500">
                  <path
                    d="M0 15 Q 10 8 20 10 T 40 12 T 60 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
            <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Total Commission Paid */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Commission Paid</p>
              <p className="text-2xl font-bold text-gray-900">₹1,300</p>
              <div className="mt-2">
                <svg width="60" height="20" viewBox="0 0 60 20" className="text-purple-500">
                  <path
                    d="M0 12 Q 10 15 20 10 T 40 14 T 60 11"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
            <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Total Funds in the system */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Funds in the system</p>
              <p className="text-2xl font-bold text-gray-900">₹200k</p>
              <div className="mt-2">
                <svg width="60" height="20" viewBox="0 0 60 20" className="text-emerald-500">
                  <path
                    d="M0 16 Q 10 12 20 14 T 40 10 T 60 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" className="bg-gray-800 text-white hover:bg-gray-700">
          All
        </Button>
        <Select defaultValue="">
          <option value="">Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </Select>
        <Select defaultValue="">
          <option value="">Market</option>
          <option value="nifty">Nifty</option>
          <option value="sensex">Sensex</option>
        </Select>
        <Select defaultValue="">
          <option value="">Date range</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </Select>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search notifications"
            className="pl-10"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {renderTabContent()}
      </div>
    </div>
  )
}
