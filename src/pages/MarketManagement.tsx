import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { MoreVertical, Search, BarChart3, TrendingUp, Package, FileText, Loader2, ChevronRight } from 'lucide-react'
import { useApi, useApiMutation } from '@/hooks/useApi'
import { segmentApi } from '@/lib/api'
import { toast } from 'react-toastify'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const marketIcons = [BarChart3, TrendingUp, Package, FileText]
const CATEGORIES = ['All', 'NSE', 'BSE', 'MCX', 'NCDEX', 'FOREX', 'GLOBAL', 'CRYPTO']
const STATUSES = ['All', 'Open', 'Closed']

export default function MarketManagement() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const { data: segmentsData, loading, execute: fetchSegments } = useApi<{ segments: any[] }>(
    () => segmentApi.getSegments(),
    { immediate: true }
  )

  const { mutate: updateSegment } = useApiMutation(
    segmentApi.updateSegment,
    {
      onSuccess: () => {
        toast.success('Market updated')
        fetchSegments()
      },
      onError: (err: any) => {
        toast.error(err.message || 'Failed to update market')
      }
    }
  )

  const segments = segmentsData?.segments || []

  const handleAutoSquareOffToggle = (marketId: string, current: boolean) => {
    updateSegment(marketId, { autoSquareOff: !current })
  }

  const handleEnabledToggle = (marketId: string, current: boolean) => {
    updateSegment(marketId, { isActive: !current })
  }

  const filteredMarkets = segments.filter(m => {
    const matchesSearch = m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || m.type === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  })

  const getMarketTimings = (market: any) => {
    if (!market.marketTimings || market.marketTimings.length === 0) return { open: '-', close: '-' };
    // Get today's timing or first available
    const today = new Date().getDay();
    const timing = market.marketTimings.find((t: any) => t.dayOfWeek === today) || market.marketTimings[0];
    return {
      open: timing.openTime,
      close: timing.closeTime
    }
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
              <Button
                variant={statusFilter === 'All' && categoryFilter === 'All' ? 'default' : 'outline'}
                onClick={() => {
                  setStatusFilter('All');
                  setCategoryFilter('All');
                }}
                size="sm"
              >
                All
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={statusFilter !== 'All' ? 'default' : 'outline'} size="sm" className="gap-1">
                    {statusFilter === 'All' ? 'Status' : statusFilter}
                    <ChevronRight className="rotate-90 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {STATUSES.map(status => (
                    <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={categoryFilter !== 'All' ? 'default' : 'outline'} size="sm" className="gap-1">
                    {categoryFilter === 'All' ? 'Category' : categoryFilter}
                    <ChevronRight className="rotate-90 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {CATEGORIES.map(cat => (
                    <DropdownMenuItem key={cat} onClick={() => setCategoryFilter(cat)}>
                      {cat}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex-1 sm:max-w-md ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search markets"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-10"
                />
              </div>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="block sm:hidden space-y-3">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredMarkets.length === 0 ? (
              <div className="text-center py-10 text-gray-500">No markets found</div>
            ) : filteredMarkets.map((market, idx) => {
              const IconComponent = marketIcons[idx % 4];
              const timings = getMarketTimings(market);
              return (
                <div key={market.id} className="border border-gray-100 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <IconComponent size={20} className="text-primary" />
                      </div>
                      <span className="font-medium">{market.displayName}</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <Badge variant={market.status === 'Open' ? 'default' : 'destructive'} className="ml-2">
                        {market.status || 'Closed'}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-500">Opening:</span>
                      <span className="ml-2 text-gray-700">{timings.open}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Closing:</span>
                      <span className="ml-2 text-gray-700">{timings.close}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Auto square off:</span>
                      <Switch
                        checked={market.autoSquareOff}
                        onCheckedChange={() => handleAutoSquareOffToggle(market.id, market.autoSquareOff)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Enable:</span>
                      <Switch
                        checked={market.isActive}
                        onCheckedChange={() => handleEnabledToggle(market.id, market.isActive)}
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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    </td>
                  </tr>
                ) : filteredMarkets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-500">
                      No markets found
                    </td>
                  </tr>
                ) : filteredMarkets.map((market, idx) => {
                  const IconComponent = marketIcons[idx % 4];
                  const timings = getMarketTimings(market);
                  return (
                    <tr key={market.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconComponent size={20} className="text-primary" />
                          </div>
                          <span className="font-medium">{market.displayName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={market.status === 'Open' ? 'default' : 'destructive'}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${market.status === 'Open' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                          {market.status || 'Closed'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{timings.open}</td>
                      <td className="py-4 px-4 text-gray-700">{timings.close}</td>
                      <td className="py-4 px-4">
                        <Switch
                          checked={market.autoSquareOff}
                          onCheckedChange={() => handleAutoSquareOffToggle(market.id, market.autoSquareOff)}
                        />
                      </td>
                      <td className="py-4 px-4">
                        <Switch
                          checked={market.isActive}
                          onCheckedChange={() => handleEnabledToggle(market.id, market.isActive)}
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
