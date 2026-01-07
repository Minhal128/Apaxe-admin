import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, MoreHorizontal, TrendingUp, ChevronDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts'
import { useApi } from '@/hooks/useApi'
import { dashboardApi, reportsApi, tradingApi, segmentApi } from '@/lib/api'
import { useMemo } from 'react'
import { BarChart3 } from 'lucide-react'

export default function Reports() {
  const [activeTab, setActiveTab] = useState('pnl-report')
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    role: '',
    market: '',
    dateRange: 'today',
    startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
    endDate: new Date().toISOString()
  });

  // Fetch Segments for Market Filter
  const { data: segmentsData } = useApi<{ segments: any[] }>(segmentApi.getSegments, {
    immediate: true
  });
  const segments = segmentsData?.segments || [];

  // Fetch Dashboard Stats
  const { data: dashboardData, refetch: refetchDashboard } = useApi<any>(dashboardApi.getDashboard, {
    immediate: true
  });
  const stats = dashboardData?.data?.stats || dashboardData?.stats || {};
  const volumeData = dashboardData?.data?.profitData || dashboardData?.profitData || [];

  // Fetch Trades for history report
  const { data: tradesData, refetch: refetchTrades, loading: loadingTrades } = useApi<any>(
    () => tradingApi.getTrades({
      page: currentPage,
      limit: 50,
      segmentId: filters.market || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined
    }),
    {
      immediate: activeTab === 'trade-history',
      onSuccess: (data) => console.log("The data is real (Trades)", data)
    }
  )

  // Fetch PnL Report
  const { data: pnlReportData, refetch: refetchPnL, loading: loadingPnL } = useApi<any>(
    () => reportsApi.generatePnLReport({
      page: currentPage,
      limit: 50,
      segmentId: filters.market || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined
    }),
    {
      immediate: activeTab === 'pnl-report',
      onSuccess: (data) => console.log("The data is real (PnL)", data)
    }
  )

  // Fetch Profit Sharing Report
  const { data: profitShareData, refetch: refetchProfitShare, loading: loadingProfitShare } = useApi<any>(
    () => reportsApi.getLedgerEntries({
      category: 'PROFIT_SHARE',
      page: currentPage,
      limit: 50,
      startDate: filters.startDate,
      endDate: filters.endDate
    }),
    {
      immediate: activeTab === 'profit-sharing',
      onSuccess: (data) => console.log("The data is real (Profit Share)", data)
    }
  )

  // Fetch Balance Report
  const { data: balanceReportData, refetch: refetchBalance, loading: loadingBalance } = useApi<any>(
    () => reportsApi.getLedgerEntries({
      page: currentPage,
      limit: 50,
      startDate: filters.startDate,
      endDate: filters.endDate
    }),
    {
      immediate: activeTab === 'balance-report',
      onSuccess: (data) => console.log("The data is real (Balance)", data)
    }
  )

  // Handle Filter Changes
  const handleFilterChange = (key: string, value: string) => {
    let newFilters = { ...filters, [key]: value };

    if (key === 'dateRange') {
      const end = new Date();
      const start = new Date();
      if (value === 'today') start.setHours(0, 0, 0, 0);
      else if (value === 'week') start.setDate(start.getDate() - 7);
      else if (value === 'month') start.setMonth(start.getMonth() - 1);

      newFilters.startDate = start.toISOString();
      newFilters.endDate = end.toISOString();
    }

    setFilters(newFilters);
    setCurrentPage(1); // Reset page on filter change
  }

  // Refetch when tab or filters change
  useEffect(() => {
    // Initial fetch on tab/filter change
    if (activeTab === 'trade-history') refetchTrades()
    if (activeTab === 'pnl-report') refetchPnL()
    if (activeTab === 'profit-sharing') refetchProfitShare()
    if (activeTab === 'balance-report') refetchBalance()

    // Polling interval for real-time updates
    const intervalId = setInterval(() => {
      // Always refresh dashboard stats
      refetchDashboard();

      // Refresh active tab data
      if (activeTab === 'trade-history') refetchTrades()
      if (activeTab === 'pnl-report') refetchPnL()
      if (activeTab === 'profit-sharing') refetchProfitShare()
      if (activeTab === 'balance-report') refetchBalance()
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [activeTab, currentPage, filters])

  const trades = tradesData?.data || []
  const pnlReports = pnlReportData?.data || []
  const profitSharingReports = profitShareData?.data || []
  const balanceReports = balanceReportData?.data || []

  const tabs = [
    { id: 'pnl-report', label: 'P&L Report' },
    { id: 'trade-history', label: 'Trade history report' },
    { id: 'profit-sharing', label: 'Profit sharing report' },
    { id: 'balance-report', label: 'Balance Report' }
  ]

  // Prepare chart data
  const pnlOverviewData = pnlReports.length > 0
    ? pnlReports.slice(0, 10).map((item: any) => ({
      date: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A',
      value: Number(item.netPnL) || 0,
      gray: 0
    })).reverse()
    : [{ date: 'No Data', value: 0, gray: 0 }];

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

      <div className="relative h-64 w-full">
         <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={volumeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#areaGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  // Process data for the chart (moved to top level to avoid hook violation)
  const profitSharingChartData = useMemo(() => {
    if (!profitSharingReports.length) return [];

    // Group by month
    const grouped = profitSharingReports.reduce((acc: any, item: any) => {
      const date = new Date(item.createdAt);
      const month = date.toLocaleString('default', { month: 'short' });

      if (!acc[month]) {
        acc[month] = { month, admin: 0, subAdmin: 0, client: 0 };
      }

      const amount = Number(item.amount) || 0;
      const role = item.user?.role || 'USER';

      if (role === 'ADMIN') acc[month].admin += amount;
      else if (role === 'SUPER_MASTER') acc[month].subAdmin += amount;
      else acc[month].client += amount;

      return acc;
    }, {});

    return Object.values(grouped);
  }, [profitSharingReports]);

  const renderStackedBarChart = () => {
    if (profitSharingChartData.length === 0) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 mb-2">No profit sharing data available for chart</p>
          <BarChart3 className="w-12 h-12 text-gray-300" />
        </div>
      )
    }

    return (
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

        <div className="relative h-64 w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={profitSharingChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="admin" stackId="a" fill="#4ade80" />
              <Bar dataKey="subAdmin" stackId="a" fill="#16a34a" />
              <Bar dataKey="client" stackId="a" fill="#166534" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pnl-report':
        return (
          <div className="space-y-6">
            <div className="rounded-md border">
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
                  {loadingPnL ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">Loading report...</TableCell>
                    </TableRow>
                  ) : pnlReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">No data available for selected filters</TableCell>
                    </TableRow>
                  ) : (
                    pnlReports.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.user}</TableCell>
                        <TableCell>{item.market}</TableCell>
                        <TableCell className={Number(item.realizedPnL) >= 0 ? "text-green-600" : "text-red-600"}>{Number(item.realizedPnL).toFixed(2)}</TableCell>
                        <TableCell>{Number(item.unrealizedPnL).toFixed(2)}</TableCell>
                        <TableCell className={Number(item.netPnL) >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{Number(item.netPnL).toFixed(2)}</TableCell>
                        <TableCell>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {/* {renderBarChart()} */}
          </div>
        )

      case 'trade-history':
        return (
          <div className="space-y-6">
            <div className="rounded-md border">
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
                  {loadingTrades ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">Loading trades...</TableCell>
                    </TableRow>
                  ) : trades.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">No trades found</TableCell>
                    </TableRow>
                  ) : (
                    trades.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-xs">{item.id.substring(0, 8)}...</TableCell>
                        <TableCell>{item.user?.username || item.user?.firstName || item.userId}</TableCell>
                        <TableCell>{item.instrument?.symbol}</TableCell>
                        <TableCell>
                          <span className={item.side === 'BUY' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                            {item.side}
                          </span>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={item.status === 'COMPLETED' || item.status === 'CLOSED' ? 'border-green-500 text-green-700 bg-green-50' : 'border-gray-500 text-gray-700'}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {renderAreaChart()}
          </div>
        )

      case 'profit-sharing':
        return (
          <div className="space-y-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingProfitShare ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">Loading profit share data...</TableCell>
                    </TableRow>
                  ) : profitSharingReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">No profit sharing records found</TableCell>
                    </TableRow>
                  ) : (
                    profitSharingReports.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.user?.username || item.user?.firstName || item.userId}</TableCell>
                        <TableCell>{item.user?.role || 'USER'}</TableCell>
                        <TableCell className="font-medium text-green-700">₹{item.amount}</TableCell>
                        <TableCell>{item.description || 'Profit Share'}</TableCell>
                        <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {renderStackedBarChart()}
          </div>
        )

      case 'balance-report':
        return (
          <div className="space-y-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingBalance ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">Loading balance history...</TableCell>
                    </TableRow>
                  ) : balanceReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">No balance records found</TableCell>
                    </TableRow>
                  ) : (
                    balanceReports.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.user?.username || item.user?.firstName || item.userId}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={item.type === 'CREDIT' ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'}>
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell className={item.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}>
                          {item.type === 'CREDIT' ? '+' : '-'}₹{item.amount}
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
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
              <p className="text-2xl font-bold text-gray-900">{stats.totalTrades || 0}</p>
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
              <p className={`text-2xl font-bold ${stats.totalPnL >= 0 ? "text-green-700" : "text-red-700"}`}>
                {stats.totalPnL ? `₹${stats.totalPnL.toFixed(2)}` : '₹0.00'}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalCommission?.toFixed(2) || '0.00'}</p>
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

        {/* Total Payouts (Profit Distributed) */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Profit Distributed</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalProfitDistributed?.toFixed(2) || '0.00'}</p>
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
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
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
        <Button variant="outline" className="bg-gray-800 text-white hover:bg-gray-700" onClick={() => setFilters({ role: '', market: '', dateRange: 'all', startDate: '', endDate: '' })}>
          Reset Filters
        </Button>
        <Select value={filters.role} onChange={(e) => handleFilterChange('role', e.target.value)}>
          <option value="">Role</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_MASTER">Sub-Admin</option>
          <option value="USER">User</option>
        </Select>
        <Select value={filters.market} onChange={(e) => handleFilterChange('market', e.target.value)}>
          <option value="">All Markets</option>
          {segments.map((segment: any) => (
            <option key={segment.id} value={segment.id}>{segment.name}</option>
          ))}
        </Select>
        <Select value={filters.dateRange} onChange={(e) => handleFilterChange('dateRange', e.target.value)}>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </Select>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search notifications"
            className="pl-10"
          />
        </div>
      </div>

      {/* P&L Overview Chart */}


      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {renderTabContent()}
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">P&L Overview</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Summary</span>
              <button className="px-3 py-1.5 text-sm text-green-500 bg-green-50 rounded flex items-center gap-1">
                Market Type
                <ChevronDown size={14} />
              </button>
            </div>
            <button className="px-3 py-1.5 text-sm text-gray-600 rounded flex items-center gap-1">
              Last 14 Days
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="h-48 lg:h-64">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={pnlOverviewData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                ticks={[0, 10, 20, 30, 40, 50]}
              />
              <Bar dataKey="gray" fill="#e5e7eb" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
