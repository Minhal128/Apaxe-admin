import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, TrendingUp, ArrowLeft, Filter } from 'lucide-react'

export default function MarketWatch() {
  const [activeView, setActiveView] = useState('main') // 'main' or 'chart'
  const [activeTab, setActiveTab] = useState('All')

  // Mock market data
  const marketData = [
    {
      symbol: 'NIFTY 500',
      segment: 'NSE',
      ltp: '43620',
      change: '2.71%',
      volume: '3,190',
      status: 'Active',
      date: '23 Sep, 25 | 09:00 AM'
    },
    {
      symbol: 'NIFTY 500',
      segment: 'NSE',
      ltp: '43620',
      change: '2.71%',
      volume: '3,190',
      status: 'Active',
      date: '23 Sep, 25 | 09:00 AM'
    },
    {
      symbol: 'NIFTY 500',
      segment: 'NSE',
      ltp: '43620',
      change: '2.71%',
      volume: '3,190',
      status: 'Active',
      date: '23 Sep, 25 | 09:00 AM'
    },
    {
      symbol: 'NIFTY 500',
      segment: 'NSE',
      ltp: '43620',
      change: '2.71%',
      volume: '3,190',
      status: 'Active',
      date: '23 Sep, 25 | 09:00 AM'
    },
    {
      symbol: 'NIFTY 500',
      segment: 'NSE',
      ltp: '43620',
      change: '2.71%',
      volume: '3,190',
      status: 'Active',
      date: '23 Sep, 25 | 09:00 AM'
    },
    {
      symbol: 'NIFTY 500',
      segment: 'NSE',
      ltp: '43620',
      change: '2.71%',
      volume: '3,190',
      status: 'Active',
      date: '23 Sep, 25 | 09:00 AM'
    },
    {
      symbol: 'NIFTY 500',
      segment: 'NSE',
      ltp: '43620',
      change: '2.71%',
      volume: '3,190',
      status: 'Active',
      date: '23 Sep, 25 | 09:00 AM'
    },
    {
      symbol: 'NIFTY 500',
      segment: 'NSE',
      ltp: '43620',
      change: '2.71%',
      volume: '3,190',
      status: 'Active',
      date: '23 Sep, 25 | 09:00 AM'
    },
    {
      symbol: 'NIFTY 500',
      segment: 'NSE',
      ltp: '43620',
      change: '2.71%',
      volume: '3,190',
      status: 'Active',
      date: '23 Sep, 25 | 09:00 AM'
    }
  ]

  const marketTabs = ['All', 'Crypto', 'NSE', 'MCX', 'Equity', 'Commodity', 'Stocks']

  // Mock candlestick data for forex/crypto - More realistic data
  const generateCandlestickData = () => {
    const data = []
    let basePrice = 320 // Starting from a lower price to show the trend
    const now = new Date()
    
    // Create a more realistic price movement pattern with bigger ranges
    const trendPoints = [
      { price: 300, volatility: 0.025 },
      { price: 340, volatility: 0.03 },
      { price: 390, volatility: 0.035 },
      { price: 430, volatility: 0.03 },
      { price: 460, volatility: 0.025 },
      { price: 440, volatility: 0.032 },
      { price: 400, volatility: 0.028 },
      { price: 406, volatility: 0.025 }
    ]
    
    for (let i = 0; i < 120; i++) {
      const time = new Date(now.getTime() - (120 - i) * 60 * 60 * 1000) // Hourly intervals
      const trendIndex = Math.floor((i / 120) * trendPoints.length)
      const currentTrend = trendPoints[Math.min(trendIndex, trendPoints.length - 1)]
      
      // Create more realistic price movements
      const trendDirection = i < 80 ? 1 : (i < 100 ? -1 : 0.2) // Uptrend, then downtrend, then sideways
      const volatility = currentTrend.volatility
      
      // Generate OHLC with realistic relationships
      const open = basePrice
      const priceChange = (Math.random() - 0.4) * basePrice * volatility * trendDirection
      const close = Math.max(300, Math.min(460, open + priceChange))
      
      // High and low should make sense relative to open and close - create longer wicks
      const bodyHigh = Math.max(open, close)
      const bodyLow = Math.min(open, close)
      const wickRange = Math.abs(open - close) * (1 + Math.random() * 4) // Increased wick range
      
      // Create more dramatic wicks that extend further
      const upperWickExtension = Math.random() * wickRange * 1.5
      const lowerWickExtension = Math.random() * wickRange * 1.5
      
      const high = Math.min(480, bodyHigh + upperWickExtension)
      const low = Math.max(280, bodyLow - lowerWickExtension)
      
      const volume = Math.floor(Math.random() * 2000000) + 500000
      
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: time.getTime(),
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
        isGreen: close > open
      })
      
      basePrice = close * (0.98 + Math.random() * 0.04) // Add some noise for next candle
    }
    
    return data
  }

  const candlestickData = generateCandlestickData()


  const renderMainView = () => (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Market Watch</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Active Scripts */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Active Scripts</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">146</p>
                <div className="mt-2">
                  <svg width="50" height="16" viewBox="0 0 60 20" className="text-green-500 sm:w-[60px] sm:h-[20px]">
                    <path
                      d="M0 15 Q 10 10 20 12 T 40 8 T 60 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Banned Scripts */}
        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Banned Scripts</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">12</p>
                <div className="mt-2">
                  <svg width="50" height="16" viewBox="0 0 60 20" className="text-cyan-500 sm:w-[60px] sm:h-[20px]">
                    <path
                      d="M0 15 Q 10 8 20 10 T 40 12 T 60 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
              <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Feeds */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Live Feeds</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">303</p>
                <div className="mt-2">
                  <svg width="50" height="16" viewBox="0 0 60 20" className="text-purple-500 sm:w-[60px] sm:h-[20px]">
                    <path
                      d="M0 12 Q 10 15 20 10 T 40 14 T 60 11"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
              <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feed Delay */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Feed Delay</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">0.25s avg</p>
                <div className="mt-2">
                  <svg width="50" height="16" viewBox="0 0 60 20" className="text-emerald-500 sm:w-[60px] sm:h-[20px]">
                    <path
                      d="M0 16 Q 10 12 20 14 T 40 10 T 60 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
              <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="outline" className="bg-gray-800 text-white hover:bg-gray-700 text-sm">
            All
          </Button>
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
          <Select defaultValue="" className="w-full sm:w-auto">
            <option value="">Segment</option>
            <option value="nse">NSE</option>
            <option value="bse">BSE</option>
          </Select>
          <Select defaultValue="" className="w-full sm:w-auto">
            <option value="">Market</option>
            <option value="equity">Equity</option>
            <option value="commodity">Commodity</option>
          </Select>
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search notifications"
              className="pl-10 w-full"
            />
          </div>
        </div>
      </div>

      {/* Market Data - Mobile Cards */}
      <div className="block sm:hidden space-y-3">
        {marketData.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.symbol}</h3>
                  <p className="text-sm text-gray-500">{item.segment}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{item.ltp}</p>
                  <p className="text-green-600 text-sm">+{item.change}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div>
                  <span className="text-gray-500">Volume:</span>
                  <span className="ml-1 font-medium">{item.volume}</span>
                </div>
                <div className="flex items-center">
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    {item.status}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{item.date}</p>
                <Button 
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs"
                  onClick={() => {
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
                    <TableHead>LTP</TableHead>
                    <TableHead>Change (%)</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.symbol}</TableCell>
                      <TableCell>{item.segment}</TableCell>
                      <TableCell>{item.ltp}</TableCell>
                      <TableCell className="text-green-600">+{item.change}</TableCell>
                      <TableCell>{item.volume}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => {
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
              className={`pb-3 px-1 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
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
              onClick={() => setActiveView('main')}
              className="p-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold">MSFT</h1>
                <span className="text-xs sm:text-sm text-gray-600">Microsoft Corp NASDAQ</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 text-sm">
              Ban
            </Button>
            <Button className="bg-gray-400 hover:bg-gray-500 text-white px-4 sm:px-6 py-2 text-sm">
              Unban
            </Button>
          </div>
        </div>

        {/* Price and Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-12 gap-4 mb-6">
          {/* Main Price */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-3">
            <div className="text-3xl sm:text-4xl font-bold text-black">406.32</div>
            <div className="text-green-600 font-medium">+2.24</div>
            <div className="text-green-600 text-sm">+0.26%</div>
            <div className="text-xs text-gray-500 mt-1">
              After hours: <span className="text-red-500">406.83 -0.27 -0.07%</span> | 19:59 04/26 EDT
            </div>
          </div>

          {/* Stats Columns */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Open</div>
              <div className="text-red-500 font-medium text-sm">401.23</div>
              <div className="text-xs text-gray-500 mt-2">Low</div>
              <div className="text-red-500 font-medium text-sm">400.10</div>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Avg Vol (3M)</div>
              <div className="text-gray-700 font-medium text-sm">Shares Outstanding</div>
              <div className="text-xs text-gray-500 mt-2">High</div>
              <div className="text-green-500 font-medium text-sm">408.36</div>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Mkt Cap</div>
              <div className="text-gray-700 font-medium text-sm">Div Yield</div>
              <div className="text-xs text-gray-500 mt-2">52 wk high</div>
              <div className="text-gray-700 font-medium text-sm">52 wk low</div>
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
              <div className="text-xs sm:text-sm font-medium">408.36</div>
            </div>
            <div className="bg-gray-50 p-2 sm:p-3 rounded min-w-[80px] sm:min-w-0">
              <div className="text-xs sm:text-sm font-medium">408.36</div>
            </div>
            <div className="bg-gray-50 p-2 sm:p-3 rounded min-w-[80px] sm:min-w-0">
              <div className="text-xs sm:text-sm font-medium">408.36</div>
            </div>
            <div className="bg-gray-50 p-2 sm:p-3 rounded min-w-[120px] sm:min-w-0">
              <div className="text-xs sm:text-sm font-medium text-green-600">408.36 +8.90 +2.14%</div>
            </div>
            <div className="bg-gray-50 p-2 sm:p-3 rounded min-w-[100px] sm:min-w-0">
              <div className="text-xs sm:text-sm font-medium">56,254,781</div>
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
                {(() => {
                  const minPrice = Math.min(...candlestickData.map(d => d.low)) - 5
                  const maxPrice = Math.max(...candlestickData.map(d => d.high)) + 5
                  const priceStep = (maxPrice - minPrice) / 9
                  const currentPrice = candlestickData[candlestickData.length - 1]?.close || 406.32
                  
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
                })()}
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
                  
                  {candlestickData.slice(-100).map((entry, index) => {
                    const minPrice = Math.min(...candlestickData.map(d => d.low)) - 5
                    const maxPrice = Math.max(...candlestickData.map(d => d.high)) + 5
                    const priceRange = maxPrice - minPrice
                    
                    // Calculate SVG coordinates (SVG Y is inverted)
                    const svgHeight = 100 // percentage
                    const highY = svgHeight - ((entry.high - minPrice) / priceRange) * svgHeight
                    const lowY = svgHeight - ((entry.low - minPrice) / priceRange) * svgHeight
                    const openY = svgHeight - ((entry.open - minPrice) / priceRange) * svgHeight
                    const closeY = svgHeight - ((entry.close - minPrice) / priceRange) * svgHeight
                    
                    const isGreen = entry.close > entry.open
                    const color = isGreen ? '#22c55e' : '#ef4444'
                    
                    const x = (index / 99) * 95 + 2 // Position as percentage
                    const candleWidth = 0.8 // Width as percentage - slightly wider
                    
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
                          x={`${x - candleWidth/2}%`}
                          y={`${Math.min(openY, closeY)}%`}
                          width={`${candleWidth}%`}
                          height={`${Math.max(Math.abs(openY - closeY), 0.5)}%`}
                          fill={isGreen ? color : 'white'}
                          stroke={color}
                          strokeWidth="1"
                        />
                      </g>
                    )
                  })}
                </svg>
              </div>
              
              {/* Time Scale */}
              <div className="absolute bottom-0 left-4 right-16 flex justify-between text-xs text-gray-500">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
              </div>
            </div>
          </div>

          {/* Volume Chart */}
          <div className="h-20 relative bg-gray-50 rounded mb-4">
            <svg width="100%" height="100%" className="absolute inset-0 p-2">
              {candlestickData.slice(-100).map((entry, index) => {
                const maxVolume = Math.max(...candlestickData.map(d => d.volume))
                const volumePercent = (entry.volume / maxVolume) * 80
                const isGreen = entry.close > entry.open
                const color = isGreen ? '#22c55e' : '#ef4444'
                
                const x = (index / 99) * 95 + 2
                const barWidth = 0.8
                
                return (
                  <rect
                    key={index}
                    x={`${x - barWidth/2}%`}
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
                {['1m', '5m', '15m', '30m', '1h', '2h', '4h', 'D', 'W', 'M', 'All'].map((timeframe) => (
                  <button
                    key={timeframe}
                    className={`px-3 py-1 text-xs rounded ${
                      timeframe === '1h' 
                        ? 'bg-green-500 text-white' 
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
