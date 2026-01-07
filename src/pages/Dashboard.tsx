import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Eye, UserX, User, TrendingUp, DollarSign, RefreshCw, WifiOff } from 'lucide-react'
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { Switch } from '@/components/ui/switch'
import { useApi } from '@/hooks/useApi'
import { dashboardApi } from '@/lib/api'
import { useState } from 'react'

interface DashboardData {
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalTrades: number;
    openPositions: number;
    totalVolume: number;
  };
  recentActivity: {
    recentTrades: Array<{
      id: string;
      user: { username: string };
      instrument: { symbol: string };
      side: string;
      quantity: number;
      value: number;
      createdAt: string;
    }>;
    recentUsers: Array<{
      id: string;
      username: string;
      role: string;
      createdAt: string;
    }>;
  };
  profitData: Array<{
    name: string;
    value: number;
  }>;
  profitSharing: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}



export default function Dashboard() {
  const [marketStatus, setMarketStatus] = useState(true)

  const { data: dashboardData, loading, error, execute } = useApi<DashboardData>(
    () => dashboardApi.getDashboard(),
    {
      immediate: true, // Auto-call on mount
      onSuccess: (data) => {
        console.log("The data is real", data)
      },
      onError: (error) => {
        console.error('Dashboard API error:', error)
      }
    }
  )

  // Use real data if available, otherwise fall back to defaults
  const systemStats = {
    totalUsers: dashboardData?.stats?.totalUsers ?? 0,
    activeUsers: dashboardData?.stats?.activeUsers ?? 0,
    totalTrades: dashboardData?.stats?.totalTrades ?? 0,
    openPositions: dashboardData?.stats?.openPositions ?? 0,
    totalVolume: dashboardData?.stats?.totalVolume ?? 0
  }

  const profitData = dashboardData?.profitData || []

  const pieData = dashboardData?.profitSharing || []

  const activities = dashboardData?.recentActivity?.recentTrades?.slice(0, 5).map((trade) => ({
    text: `${trade.user?.username || 'User'} ${trade.side?.toLowerCase() || 'traded'} ${trade.instrument?.symbol || 'instrument'}`,
    time: new Date(trade.createdAt).toLocaleString(),
    icon: trade.side === 'BUY' ? TrendingUp : trade.side === 'SELL' ? DollarSign : User,
    color: 'bg-green-100'
  })) || []

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-l-4 border-l-primary">
              <CardContent className="p-4 sm:p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Connection Status */}
      {error && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WifiOff className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-800 text-sm">
                  Backend not connected. Using demo data.
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => execute()}
                disabled={loading}
                className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Retry Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}



      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Dashboard <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">Real-time</span>
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-gray-600 text-sm">Market status</span>
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <div className="flex items-center space-x-2">
              <span className={`font-semibold ${marketStatus ? 'text-primary' : 'text-red-500'}`}>
                {marketStatus ? 'Open' : 'Closed'}
              </span>
              <Switch
                checked={marketStatus}
                onCheckedChange={setMarketStatus}
              />
            </div>
            <p className="text-gray-400 text-xs">until 12:30 AM</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-gray-600 text-sm mb-1">Total clients</p>
                <p className="text-2xl sm:text-3xl font-bold">{systemStats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <svg className="w-full h-6 sm:h-8" viewBox="0 0 100 30">
                <polyline
                  points="0,20 20,15 40,18 60,12 80,10 100,8"
                  fill="none"
                  stroke="#18B451"
                  strokeWidth="2"
                />
                <polyline
                  points="0,20 20,15 40,18 60,12 80,10 100,8 100,30 0,30"
                  fill="rgba(24, 180, 81, 0.1)"
                />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-gray-600 text-sm mb-1">Total trades</p>
                <p className="text-2xl sm:text-3xl font-bold">{systemStats.totalTrades.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <svg className="w-full h-6 sm:h-8" viewBox="0 0 100 30">
                <polyline
                  points="0,25 20,22 40,20 60,18 80,15 100,12"
                  fill="none"
                  stroke="#18B451"
                  strokeWidth="2"
                />
                <polyline
                  points="0,25 20,22 40,20 60,18 80,15 100,12 100,30 0,30"
                  fill="rgba(24, 180, 81, 0.1)"
                />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-gray-600 text-sm mb-1">Live users online</p>
                <p className="text-2xl sm:text-3xl font-bold">{systemStats.activeUsers.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <svg className="w-full h-6 sm:h-8" viewBox="0 0 100 30">
                <polyline
                  points="0,15 20,18 40,12 60,15 80,10 100,8"
                  fill="none"
                  stroke="#18B451"
                  strokeWidth="2"
                />
                <polyline
                  points="0,15 20,18 40,12 60,15 80,10 100,8 100,30 0,30"
                  fill="rgba(24, 180, 81, 0.1)"
                />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-gray-600 text-sm mb-1">Open positions</p>
                <p className="text-2xl sm:text-3xl font-bold">{systemStats.openPositions.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <UserX className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <svg className="w-full h-6 sm:h-8" viewBox="0 0 100 30">
                <polyline
                  points="0,22 20,20 40,18 60,16 80,14 100,12"
                  fill="none"
                  stroke="#18B451"
                  strokeWidth="2"
                />
                <polyline
                  points="0,22 20,20 40,18 60,16 80,14 100,12 100,30 0,30"
                  fill="rgba(24, 180, 81, 0.1)"
                />
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profit Growth Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-lg sm:text-xl">Profit Growth Overtime</CardTitle>
              <select className="text-sm border border-gray-200 rounded-md px-3 py-1 w-full sm:w-auto">
                <option>Last 14 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <p className="text-sm text-gray-500">Summary</p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {profitData.length === 0 ? (
              <div className="flex items-center justify-center h-[250px] sm:h-[300px] text-gray-500">
                <p className="text-sm">No profit data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <AreaChart data={profitData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#18B451" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#18B451" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#18B451"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Active Feeds */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Active feeds</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              {activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No recent activity</p>
                </div>
              ) : (
                activities.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-lg ${activity.color} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent size={16} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 leading-tight">{activity.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profit Sharing Chart */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Profit sharing ratio</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] sm:h-[250px] text-gray-500">
              <p className="text-sm">No profit sharing data available</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
              <div className="w-full max-w-[280px] lg:max-w-[250px]">
                <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 w-full lg:w-auto">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between lg:justify-start lg:space-x-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600 text-sm">
              Error loading dashboard data: {error}. Using fallback data.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
