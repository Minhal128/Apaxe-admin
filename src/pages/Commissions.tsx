import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MoreHorizontal, TrendingUp, X } from 'lucide-react'
import { commissionApi, dashboardApi } from '@/lib/api'
import { useApiMutation, useApi } from '@/hooks/useApi'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'

export default function Commissions() {
  const [isSetCommissionOpen, setIsSetCommissionOpen] = useState(false)
  const [adminCommission, setAdminCommission] = useState('')
  const [subAdminCommission, setSubAdminCommission] = useState('')
  const [clientCommission, setClientCommission] = useState('')
  const [currentPage] = useState(1)

  const { data: dashboardData } = useApi<any>(
    () => dashboardApi.getDashboard(),
    {
      revalidateOnFocus: true
    }
  );

  const stats = dashboardData?.stats || {};

  const { data: commissionData, refetch, loading: loadingHistory } = useApi<any>(
    () => commissionApi.getCommissionHistory({
      page: currentPage,
      limit: 50
    }),
    {
      onSuccess: (_data) => {
        // console.log("The data is real", _data)
      },
      onError: (error) => {
        console.error('Commission API error:', error)
      }
    }
  )

  const { mutate: setCommission, loading: settingCommission } = useApiMutation(
    (data: {
      adminCommission: number;
      subAdminCommission: number;
      clientCommission: number;
    }) =>
      commissionApi.setCommission(data),
    {
      onSuccess: () => {
        toast.success('Commission updated successfully')
        setIsSetCommissionOpen(false)
        refetch()
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update commission')
      }
    }
  )

  useEffect(() => {
    refetch()
  }, [currentPage])

  const commissionHistory = Array.isArray(commissionData) ? commissionData : (commissionData?.logs || [])



  const handleSetCommission = () => {
    if (!adminCommission || !subAdminCommission || !clientCommission) {
      toast.error('All commission fields are required')
      return
    }
    setCommission({
      adminCommission: parseFloat(adminCommission),
      subAdminCommission: parseFloat(subAdminCommission),
      clientCommission: parseFloat(clientCommission)
    })
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val || 0)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Commission (Admins) */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
              Total Commission (Admins)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalAdminCommission)}
                </div>
                <div className="mt-1 sm:mt-2">
                  <svg width="60" height="16" viewBox="0 0 80 20" className="text-green-500 sm:w-20 sm:h-5">
                    <path
                      d="M0 15 Q 10 10 20 12 T 40 8 T 60 10 T 80 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Commission (Sub-Admins) */}
        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
              Total Commission (Sub-Admins)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalSubAdminCommission)}
                </div>
                <div className="mt-1 sm:mt-2">
                  <svg width="60" height="16" viewBox="0 0 80 20" className="text-cyan-500 sm:w-20 sm:h-5">
                    <path
                      d="M0 15 Q 10 8 20 10 T 40 12 T 60 8 T 80 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-cyan-500 rounded flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending settlements */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
              Pending settlements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.pendingSettlements)}
                </div>
                <div className="mt-1 sm:mt-2">
                  <svg width="60" height="16" viewBox="0 0 80 20" className="text-purple-500 sm:w-20 sm:h-5">
                    <path
                      d="M0 12 Q 10 15 20 10 T 40 14 T 60 11 T 80 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total profit distributed */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
              Total profit distributed
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalProfitDistributed)}
                </div>
                <div className="mt-1 sm:mt-2">
                  <svg width="60" height="16" viewBox="0 0 80 20" className="text-emerald-500 sm:w-20 sm:h-5">
                    <path
                      d="M0 16 Q 10 12 20 14 T 40 10 T 60 12 T 80 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Ratio */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Commission ratio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Admin Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Admin - 30%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>

            {/* Master Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Master - 40%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            {/* Client Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Client - 30%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commission History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg font-semibold">Commission history</CardTitle>
            <Button
              onClick={() => setIsSetCommissionOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Set commission
            </Button>
          </div>
        </CardHeader>
        <Dialog open={isSetCommissionOpen} onOpenChange={setIsSetCommissionOpen}>
          <DialogContent className="w-full sm:w-[600px] mx-4">
            <button
              onClick={() => setIsSetCommissionOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Set commission</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Admin commission (%)
                </label>
                <Input
                  type="number"
                  value={adminCommission}
                  onChange={(e) => setAdminCommission(e.target.value)}
                  placeholder="Enter admin commission"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Sub-Admin commission (%)
                </label>
                <Input
                  type="number"
                  value={subAdminCommission}
                  onChange={(e) => setSubAdminCommission(e.target.value)}
                  placeholder="Enter sub-admin commission"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Client commission (%)
                </label>
                <Input
                  type="number"
                  value={clientCommission}
                  onChange={(e) => setClientCommission(e.target.value)}
                  placeholder="Enter client commission"
                  className="w-full"
                />
              </div>
              <Button
                onClick={handleSetCommission}
                disabled={settingCommission}
                className="w-full bg-green-600 hover:bg-green-700 text-white mt-6"
              >
                {settingCommission ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : 'Confirm'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Button variant="outline" className="bg-gray-800 text-white hover:bg-gray-700 text-sm">
                All
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="block sm:hidden space-y-3">
            {loadingHistory ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : commissionHistory.length === 0 ? (
              <div className="text-center p-8 text-gray-500">No commission history found</div>
            ) : (
              commissionHistory.map((item: any) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.user?.username || `${item.user?.firstName || ''} ${item.user?.lastName || ''}`.trim() || 'N/A'}
                        </h3>
                        <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                      <div>
                        <span className="text-gray-500">Commission:</span>
                        <span className="ml-1 font-medium text-green-600">{item.details?.commission || '0%'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Profit Split:</span>
                        <span className="ml-1 font-medium">{item.details?.profitSplit || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-500">Applied by:</span>
                        <span className="ml-1 font-medium">{item.action}</span>
                      </div>
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {item.status || 'Active'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block">
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-600 font-medium">Date</TableHead>
                    <TableHead className="text-gray-600 font-medium">Sub-admins</TableHead>
                    <TableHead className="text-gray-600 font-medium">Commissions</TableHead>
                    <TableHead className="text-gray-600 font-medium">Profit split</TableHead>
                    <TableHead className="text-gray-600 font-medium">Applied by</TableHead>
                    <TableHead className="text-gray-600 font-medium">Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingHistory ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary inline mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : commissionHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No commission history found
                      </TableCell>
                    </TableRow>
                  ) : (
                    commissionHistory.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-gray-900">{new Date(item.createdAt).toLocaleString()}</TableCell>
                        <TableCell className="text-gray-900">
                          {item.user?.username || `${item.user?.firstName || ''} ${item.user?.lastName || ''}`.trim() || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <span className="text-green-600 font-medium">{item.details?.commission || '0%'}</span>
                        </TableCell>
                        <TableCell className="text-gray-900">{item.details?.profitSplit || 'N/A'}</TableCell>
                        <TableCell className="text-gray-900">{item.action}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            {item.status || 'Active'}
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
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
