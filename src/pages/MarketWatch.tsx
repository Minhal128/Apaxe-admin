import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, ArrowLeft, Filter, RefreshCw, Activity, ShieldAlert, Zap, Clock, Loader2 } from 'lucide-react'
import { useApi, useApiMutation } from '@/hooks/useApi'
import { dashboardApi, instrumentApi } from '@/lib/api'

interface MarketInstrument {
  id: string;
  symbol: string;
  name: string;
  segment: string | { name: string };
  lastPrice: number;
  bidPrice?: number;
  askPrice?: number;
  highPrice?: number;
  lowPrice?: number;
  openPrice?: number;
  closePrice?: number;
  change: number;
  changePercent: number;
  volume: number;
  status: string;
  updatedAt: string;
}

interface OHLCCandle {
  timestamp: string | number | Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time?: string;
}

interface MarketData {
  instruments: MarketInstrument[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function MarketWatch() {
  const [activeView, setActiveView] = useState('main') // 'main' or 'chart'
  const [activeTab, setActiveTab] = useState('All')
  const [selectedSegment, setSelectedSegment] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedInstrument, setSelectedInstrument] = useState<any>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h')

  const { data: marketData, loading, error, execute } = useApi<MarketData>(
    () => dashboardApi.getMarketWatch(selectedSegment, {
      search: searchTerm,
      limit: 50,
      page: currentPage
    }),
    {
      immediate: true, // Auto-call on mount
      onSuccess: () => {
        // Data is real
      },
      onError: (error) => {
        console.error('Market data API error:', error)
      }
    }
  )

  const { data: ohlcData, loading: ohlcLoading, execute: fetchOHLC } = useApi<any>(
    () => instrumentApi.getOHLC(selectedInstrument?.id, { period: selectedTimeframe }),
    { immediate: false }
  )

  const { mutate: updateStatus, loading: updateLoading } = useApiMutation(
    instrumentApi.updateInstrument,
    {
      onSuccess: (data) => {
        const updatedInstrument = data.instrument || data;
        setSelectedInstrument(updatedInstrument);
        // Also update in marketData if possible for immediate list consistency
        execute();
      }
    }
  )

  const handleStatusUpdate = (newStatus: string) => {
    if (!selectedInstrument?.id) return;
    updateStatus(selectedInstrument.id, {
      status: newStatus,
      isActive: newStatus === 'ACTIVE'
    });
  }

  // Refetch data when filters change
  useEffect(() => {
    execute()
  }, [selectedSegment, searchTerm, currentPage])

  // Sync selected instrument with fresh market data
  useEffect(() => {
    if (marketData?.instruments && selectedInstrument) {
      const freshData = marketData.instruments.find((i: MarketInstrument) => i.id === selectedInstrument.id)
      if (freshData) {
        setSelectedInstrument(freshData)
      }
    }
  }, [marketData])

  // Periodic refresh for both market data and chart data
  useEffect(() => {
    const interval = setInterval(() => {
      execute()
      if (activeView === 'chart' && selectedInstrument?.id) {
        fetchOHLC()
      }
    }, 5000) // Refresh every 5 seconds for "real-time" feel

    return () => clearInterval(interval)
  }, [activeView, selectedInstrument?.id, selectedSegment, searchTerm, currentPage, selectedTimeframe])

  // Fetch OHLC when instrument or timeframe changes
  useEffect(() => {
    if (selectedInstrument?.id && activeView === 'chart') {
      fetchOHLC()
    }
  }, [selectedInstrument?.id, activeView, selectedTimeframe])

  const marketTabs = ['All', 'Crypto', 'NSE', 'MCX', 'Equity', 'Commodity', 'Stocks']

  // Use real data if available, otherwise fall back to mock data
  const instruments = marketData?.instruments || []

  const candlestickData = (ohlcData as any)?.ohlc || []

  const handleSegmentChange = (segment: string) => {
    setSelectedSegment(segment)
    setCurrentPage(1)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const renderMainView = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Real-time Ticker */}
      <div className="bg-white border-y border-gray-100 py-2 -mx-4 sm:mx-0 sm:rounded-lg sm:border overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-8">
          {instruments.length > 0 ? [...instruments, ...instruments, ...instruments].map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center gap-2 text-sm font-medium">
              <span className="text-gray-400">📈</span>
              <span className="text-gray-900 font-bold uppercase">
                {item.symbol}/{typeof item.segment === 'string' ? item.segment : item.segment?.name || 'NSE'}:
              </span>
              <span className="text-gray-700 font-semibold">₹{item.lastPrice?.toFixed(2)}</span>
              <span className={item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                ({item.changePercent >= 0 ? '+' : ''}{item.changePercent?.toFixed(2)}%)
              </span>
            </div>
          )) : (
            <div className="flex items-center gap-2 text-sm text-gray-400 px-4">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Connecting to live price feed...
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Active Scripts */}
        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Active Scripts</p>
              <h3 className="text-2xl font-bold text-gray-900 leading-none">
                {marketData?.pagination?.total || instruments.length}
              </h3>
            </div>
            <div className="p-2 bg-green-500 rounded-lg shadow-sm">
              <Activity className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Banned Scripts */}
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Banned Scripts</p>
              <h3 className="text-2xl font-bold text-gray-900 leading-none">12</h3>
            </div>
            <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Live Feeds */}
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">Live Feeds</p>
              <h3 className="text-2xl font-bold text-gray-900 leading-none">
                {instruments.filter(i => i.status === 'ACTIVE').length}
              </h3>
            </div>
            <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Feed Delay */}
        <Card className="bg-cyan-50 border-cyan-100">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wider mb-1">Feed Delay</p>
              <h3 className="text-2xl font-bold text-gray-900 leading-none">
                0.25s <span className="text-sm font-normal text-gray-400">avg</span>
              </h3>
            </div>
            <div className="p-2 bg-cyan-500 rounded-lg shadow-sm">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant={selectedSegment === 'ALL' ? 'default' : 'outline'}
            className={selectedSegment === 'ALL' ? 'bg-gray-800 text-white hover:bg-gray-700' : ''}
            onClick={() => handleSegmentChange('ALL')}
          >
            All
          </Button>
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
          <Select
            value={selectedSegment}
            onChange={(e) => handleSegmentChange(e.target.value)}
            className="w-full sm:w-auto"
          >
            <option value="NSE">NSE</option>
            <option value="BSE">BSE</option>
            <option value="MCX">MCX</option>
            <option value="MCX2">MCX2</option>
            <option value="FOREX">FOREX</option>
            <option value="CRYPTO">CRYPTO</option>
            <option value="OTHERS">OTHERS</option>
            <option value="USSTOCKS">USSTOCKS</option>
          </Select>
          <Select defaultValue="" className="w-full sm:w-auto">
            <option value="">Market</option>
            <option value="equity">Equity</option>
            <option value="commodity">Commodity</option>
          </Select>
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search instruments"
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600 text-sm">
              Error loading market data: {error}. Please try again.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Market Data - Mobile Cards */}
      <div className="block sm:hidden space-y-3">
        {instruments.map((item, index) => (
          <Card key={item.id || index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.symbol}</h3>
                  <p className="text-sm text-gray-500">
                    {typeof item.segment === 'string' ? item.segment : item.segment?.name || 'NSE'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{item.lastPrice?.toFixed(2) || '0.00'}</p>
                  <p className={`text-sm ${item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent?.toFixed(2) || '0.00'}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div>
                  <span className="text-gray-500">Volume:</span>
                  <span className="ml-1 font-medium">{item.volume?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex items-center">
                  <Badge className={`text-xs ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    <div className={`w-2 h-2 rounded-full mr-1 ${item.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    {item.status || 'Active'}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'Live'}
                </p>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs"
                  onClick={() => {
                    setSelectedInstrument(item)
                    setActiveView('chart')
                  }}
                >
                  View chart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Data - Desktop Table */}
      <div className="hidden sm:block">
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Bid</TableHead>
                    <TableHead>Ask</TableHead>
                    <TableHead>LTP</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Change (%)</TableHead>
                    <TableHead>High</TableHead>
                    <TableHead>Low</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instruments.map((item, index) => (
                    <TableRow key={item.id || index}>
                      <TableCell className="font-medium">{item.symbol}</TableCell>
                      <TableCell>
                        {typeof item.segment === 'string' ? item.segment : item.segment?.name || 'NSE'}
                      </TableCell>
                      <TableCell>₹{item.bidPrice?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>₹{item.askPrice?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell className="font-semibold">₹{item.lastPrice?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell className={item.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {item.change >= 0 ? '+' : ''}{item.change?.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell className={item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {item.changePercent >= 0 ? '+' : ''}{item.changePercent?.toFixed(2) || '0.00'}%
                      </TableCell>
                      <TableCell>₹{item.highPrice?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>₹{item.lowPrice?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>{item.volume?.toLocaleString() || '0'}</TableCell>
                      <TableCell>
                        <Badge className={
                          item.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'BANNED'
                              ? 'bg-red-100 text-red-700 font-bold'
                              : 'bg-gray-100 text-gray-700'
                        }>
                          <div className={`w-2 h-2 rounded-full mr-2 ${item.status === 'ACTIVE'
                              ? 'bg-green-500'
                              : item.status === 'BANNED'
                                ? 'bg-red-500'
                                : 'bg-gray-500'
                            }`}></div>
                          {item.status || 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'Live'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => {
                            setSelectedInstrument(item)
                            setActiveView('chart')
                          }}
                        >
                          View chart
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Pagination */}
      {marketData?.pagination && marketData.pagination.totalPages > 1 && (
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
            Page {currentPage} of {marketData.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(marketData.pagination.totalPages, prev + 1))}
            disabled={currentPage === marketData.pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )

  const renderChartView = () => (
    <div className="bg-white min-h-screen">
      {/* Market Tabs */}
      <div className="border-b border-gray-200 px-4 pt-4">
        <div className="flex space-x-8 overflow-x-auto">
          {marketTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === tab
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Stock Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedInstrument(null)
                setActiveView('main')
              }}
              className="p-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold">{selectedInstrument?.symbol || 'Instrument'}</h1>
                <span className="text-xs sm:text-sm text-gray-600">{selectedInstrument?.name || selectedInstrument?.symbol || ''} {typeof selectedInstrument?.segment === 'string' ? selectedInstrument.segment : selectedInstrument?.segment?.name || ''}</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 ${selectedInstrument?.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'} rounded-full animate-pulse`}></div>
                  <Badge variant={selectedInstrument?.status === 'ACTIVE' ? 'default' : 'destructive'} className="text-[10px] py-0 px-1.5 uppercase h-5">
                    {selectedInstrument?.status || 'UNKNOWN'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 text-sm disabled:opacity-50"
              onClick={() => handleStatusUpdate('BANNED')}
              disabled={updateLoading || selectedInstrument?.status === 'BANNED'}
            >
              {updateLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Ban
            </Button>
            <Button
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 sm:px-6 py-2 text-sm disabled:opacity-50"
              onClick={() => handleStatusUpdate('ACTIVE')}
              disabled={updateLoading || selectedInstrument?.status === 'ACTIVE'}
            >
              {updateLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Unban
            </Button>
          </div>
        </div>

        {/* Price and Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-12 gap-4 mb-6">
          {/* Main Price */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-3">
            <div className="text-3xl sm:text-4xl font-bold text-black">₹{selectedInstrument?.lastPrice?.toFixed(2) || '0.00'}</div>
            <div className={`text-sm font-medium ${selectedInstrument?.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {selectedInstrument?.change >= 0 ? '+' : ''}{selectedInstrument?.change?.toFixed(2) || '0.00'}
            </div>
            <div className={`text-sm ${selectedInstrument?.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {selectedInstrument?.changePercent >= 0 ? '+' : ''}{selectedInstrument?.changePercent?.toFixed(2) || '0.00'}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Last updated: {selectedInstrument?.updatedAt ? new Date(selectedInstrument.updatedAt).toLocaleTimeString() : 'Live'}
            </div>
          </div>

          {/* Stats Columns */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Open</div>
              <div className="text-gray-900 font-medium text-sm">₹{selectedInstrument?.openPrice?.toFixed(2) || '0.00'}</div>
              <div className="text-xs text-gray-500 mt-2">Low</div>
              <div className="text-red-500 font-medium text-sm">₹{selectedInstrument?.lowPrice?.toFixed(2) || '0.00'}</div>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Volume</div>
              <div className="text-gray-700 font-medium text-sm">{selectedInstrument?.volume?.toLocaleString() || '0'}</div>
              <div className="text-xs text-gray-500 mt-2">High</div>
              <div className="text-green-500 font-medium text-sm">₹{selectedInstrument?.highPrice?.toFixed(2) || '0.00'}</div>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Bid</div>
              <div className="text-gray-700 font-medium text-sm">₹{selectedInstrument?.bidPrice?.toFixed(2) || '0.00'}</div>
              <div className="text-xs text-gray-500 mt-2">Ask</div>
              <div className="text-gray-700 font-medium text-sm">₹{selectedInstrument?.askPrice?.toFixed(2) || '0.00'}</div>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            {/* Right side content can be added here */}
          </div>
        </div>

        {/* Price Row */}
        <div className="overflow-x-auto -mx-4 px-4 mb-6">
          <div className="flex gap-2 sm:gap-4 min-w-max sm:grid sm:grid-cols-5 text-center">
            <div className="bg-gray-50 p-2 sm:p-3 rounded min-w-[80px] sm:min-w-0">
              <div className="text-xs sm:text-sm font-medium">₹{selectedInstrument?.bidPrice?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="bg-gray-50 p-2 sm:p-3 rounded min-w-[80px] sm:min-w-0">
              <div className="text-xs sm:text-sm font-medium">₹{selectedInstrument?.askPrice?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="bg-gray-50 p-2 sm:p-3 rounded min-w-[80px] sm:min-w-0">
              <div className="text-xs sm:text-sm font-medium">₹{selectedInstrument?.openPrice?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="bg-gray-50 p-2 sm:p-3 rounded min-w-[120px] sm:min-w-0">
              <div className={`text-xs sm:text-sm font-medium ${selectedInstrument?.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{selectedInstrument?.lastPrice?.toFixed(2)} {selectedInstrument?.change >= 0 ? '+' : ''}{selectedInstrument?.changePercent?.toFixed(2)}%
              </div>
            </div>
            <div className="bg-gray-50 p-2 sm:p-3 rounded min-w-[100px] sm:min-w-0">
              <div className="text-xs sm:text-sm font-medium">{selectedInstrument?.volume?.toLocaleString() || '0'}</div>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="bg-white border rounded-lg p-2 sm:p-4 overflow-hidden">
          {/* Chart Area */}
          <div className="h-[300px] sm:h-[400px] lg:h-[500px] relative bg-gray-50 rounded mb-4 overflow-hidden">
            <div className="absolute inset-0 p-4">
              {/* Price Scale on Right */}
              <div className="absolute right-2 top-4 bottom-16 flex flex-col justify-between text-xs text-gray-500 z-10">
                {candlestickData.length > 0 ? (() => {
                  const minPrice = Math.min(...candlestickData.map((d: OHLCCandle) => d.low)) - 5
                  const maxPrice = Math.max(...candlestickData.map((d: OHLCCandle) => d.high)) + 5
                  const priceStep = (maxPrice - minPrice) / 9
                  const currentPrice = candlestickData[candlestickData.length - 1]?.close || 0

                  return Array.from({ length: 10 }, (_, i) => {
                    const price = maxPrice - (i * priceStep)
                    const isCurrentPrice = Math.abs(price - currentPrice) < priceStep / 2

                    return (
                      <span
                        key={i}
                        className={isCurrentPrice ? "text-green-600 font-medium bg-green-50 px-1 rounded" : ""}
                      >
                        {price.toFixed(2)}
                      </span>
                    )
                  })
                })() : (
                  <div className="h-full flex items-center justify-center text-gray-400">...</div>
                )}
              </div>

              {/* Candlestick Chart */}
              <div className="absolute inset-0 pt-4 pb-12 pl-4 pr-16">
                <svg width="100%" height="100%" className="overflow-visible">
                  {/* Grid lines */}
                  {Array.from({ length: 6 }, (_, i) => (
                    <line
                      key={`grid-${i}`}
                      x1="0"
                      y1={`${(i * 20)}%`}
                      x2="100%"
                      y2={`${(i * 20)}%`}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  ))}

                  {ohlcLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-green-500" />
                    </div>
                  ) : candlestickData.length > 0 ? candlestickData.slice(-100).map((entry: OHLCCandle, index: number) => {
                    const minPrice = Math.min(...candlestickData.map((d: OHLCCandle) => d.low)) - 5
                    const maxPrice = Math.max(...candlestickData.map((d: OHLCCandle) => d.high)) + 5
                    const priceRange = maxPrice - minPrice

                    // Calculate SVG coordinates (SVG Y is inverted)
                    const svgHeight = 100 // percentage
                    const highY = svgHeight - ((entry.high - minPrice) / priceRange) * svgHeight
                    const lowY = svgHeight - ((entry.low - minPrice) / priceRange) * svgHeight
                    const openY = svgHeight - ((entry.open - minPrice) / priceRange) * svgHeight
                    const closeY = svgHeight - ((entry.close - minPrice) / priceRange) * svgHeight

                    const isGreen = entry.close > entry.open
                    const color = isGreen ? '#22c55e' : '#ef4444'

                    const x = (index / Math.max(candlestickData.slice(-100).length - 1, 1)) * 95 + 2
                    const candleWidth = 0.8 / (candlestickData.slice(-100).length / 100)

                    return (
                      <g key={index}>
                        {/* High-Low line (wick) */}
                        <line
                          x1={`${x}%`}
                          y1={`${highY}%`}
                          x2={`${x}%`}
                          y2={`${lowY}%`}
                          stroke={color}
                          strokeWidth="1"
                        />

                        {/* Candlestick body */}
                        <rect
                          x={`${x - candleWidth / 2}%`}
                          y={`${Math.min(openY, closeY)}%`}
                          width={`${candleWidth}%`}
                          height={`${Math.max(Math.abs(openY - closeY), 0.5)}%`}
                          fill={isGreen ? color : 'white'}
                          stroke={color}
                          strokeWidth="1"
                        />
                      </g>
                    )
                  }) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      No chart data available for this instrument
                    </div>
                  )}
                </svg>
              </div>

              {/* Time Scale */}
              <div className="absolute bottom-0 left-4 right-16 flex justify-between text-xs text-gray-500">
                {candlestickData.length > 0 ? (() => {
                  const labels = [];
                  const count = 6;
                  const step = Math.floor(candlestickData.length / count);

                  for (let i = 0; i < count; i++) {
                    const entry = candlestickData[Math.min(i * step, candlestickData.length - 1)];
                    const date = new Date(entry.timestamp);
                    const label = ['D', 'W', 'M'].includes(selectedTimeframe)
                      ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                    labels.push(<span key={i}>{label}</span>);
                  }
                  return labels;
                })() : (
                  <>
                    <span>Loading...</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Volume Chart */}
          <div className="h-20 relative bg-gray-50 rounded mb-4">
            <svg width="100%" height="100%" className="absolute inset-0 p-2">
              {!ohlcLoading && candlestickData.slice(-100).map((entry: OHLCCandle, index: number) => {
                const maxVolume = Math.max(...candlestickData.map((d: OHLCCandle) => d.volume), 1)
                const volumePercent = (entry.volume / maxVolume) * 80
                const isGreen = entry.close > entry.open
                const color = isGreen ? '#22c55e' : '#ef4444'

                const x = (index / Math.max(candlestickData.slice(-100).length - 1, 1)) * 95 + 2
                const barWidth = 0.8

                return (
                  <rect
                    key={index}
                    x={`${x - barWidth / 2}%`}
                    y={`${100 - volumePercent}%`}
                    width={`${barWidth}%`}
                    height={`${Math.max(volumePercent, 2)}%`}
                    fill={color}
                    opacity="0.6"
                  />
                )
              })}
            </svg>
            <div className="absolute bottom-1 left-2 text-xs text-gray-500">Volume</div>
          </div>

          {/* Time Frame Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Time frame:</span>
              <div className="flex space-x-1">
                {['1m', '5m', '15m', '30m', '1h', '2h', '4h', 'D', 'W', 'M'].map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-3 py-1 text-xs rounded transition-colors ${selectedTimeframe === timeframe
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600">2m</span>
              <Button variant="outline" size="sm" className="text-xs">▼</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {activeView === 'main' ? renderMainView() : renderChartView()}
    </div>
  )
}
