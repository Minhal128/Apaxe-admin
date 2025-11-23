import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { MoreVertical, Search, BarChart3, TrendingUp, Package, FileText } from 'lucide-react'

const marketIcons = [BarChart3, TrendingUp, Package, FileText]

const markets = [
  { id: 1, name: 'Nifty 500', status: 'Open', openTime: '8:00 A.M', closeTime: '11:50 PM', autoSquareOff: true, enabled: false, iconIndex: 0 },
  { id: 2, name: 'SenSex', status: 'Open', openTime: '8:00 A.M', closeTime: '11:50 PM', autoSquareOff: true, enabled: false, iconIndex: 1 },
  { id: 3, name: 'Commodity', status: 'Open', openTime: '8:00 A.M', closeTime: '11:50 PM', autoSquareOff: true, enabled: false, iconIndex: 2 },
  { id: 4, name: 'Currency', status: 'Closed', openTime: '8:00 A.M', closeTime: '11:50 PM', autoSquareOff: true, enabled: false, iconIndex: 3 },
]

export default function MarketManagement() {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [marketList, setMarketList] = useState(markets)

  const handleAutoSquareOffToggle = (marketId: number) => {
    setMarketList(prev => 
      prev.map(market => 
        market.id === marketId 
          ? { ...market, autoSquareOff: !market.autoSquareOff }
          : market
      )
    )
  }

  const handleEnabledToggle = (marketId: number) => {
    setMarketList(prev => 
      prev.map(market => 
        market.id === marketId 
          ? { ...market, enabled: !market.enabled }
          : market
      )
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
        <Button onClick={() => navigate('/add-market')} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
          + Add Market
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-2">Market list</h2>
          <p className="text-gray-500 text-sm mb-6">Manage all trading assets and their configurations</p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {['All', 'Status', 'Category'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                    selectedTab === tab
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-700'
                  }`}
                >
                  {tab}
                  {tab !== 'All' && ' ▼'}
                </button>
              ))}
            </div>
            <div className="flex-1 sm:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search routes"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="block sm:hidden space-y-3">
            {marketList.map((market) => {
              const IconComponent = marketIcons[market.iconIndex];
              return (
                <div key={market.id} className="border border-gray-100 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <IconComponent size={20} className="text-primary" />
                      </div>
                      <span className="font-medium">{market.name}</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                        market.status === 'Open' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-1 ${
                          market.status === 'Open' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        {market.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Opening:</span>
                      <span className="ml-2 text-gray-700">{market.openTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Closing:</span>
                      <span className="ml-2 text-gray-700">{market.closeTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Auto square off:</span>
                      <Switch 
                        checked={market.autoSquareOff} 
                        onChange={() => handleAutoSquareOffToggle(market.id)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Enable:</span>
                      <Switch 
                        checked={market.enabled} 
                        onChange={() => handleEnabledToggle(market.id)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Market Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Opening time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Closing time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Auto square off</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Enable/disable</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {marketList.map((market) => {
                  const IconComponent = marketIcons[market.iconIndex];
                  return (
                    <tr key={market.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconComponent size={20} className="text-primary" />
                          </div>
                          <span className="font-medium">{market.name}</span>
                        </div>
                      </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        market.status === 'Open' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          market.status === 'Open' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        {market.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{market.openTime}</td>
                    <td className="py-4 px-4 text-gray-700">{market.closeTime}</td>
                    <td className="py-4 px-4">
                      <Switch 
                        checked={market.autoSquareOff} 
                        onChange={() => handleAutoSquareOffToggle(market.id)}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <Switch 
                        checked={market.enabled} 
                        onChange={() => handleEnabledToggle(market.id)}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
