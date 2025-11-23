import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, MoreHorizontal, TrendingUp, X } from 'lucide-react'

export default function Commissions() {
  const [isSetCommissionOpen, setIsSetCommissionOpen] = useState(false)
  const [adminCommission, setAdminCommission] = useState('')
  const [subAdminCommission, setSubAdminCommission] = useState('')
  const [clientCommission, setClientCommission] = useState('')

  // Mock data for commission history
  const commissionHistory = [
    {
      id: 1,
      date: '23 Sep, 25 | 09:00 AM',
      subAdmin: 'Josh',
      commission: '10%',
      profitSplit: '70%',
      appliedBy: 'Martin Luther',
      status: 'Active'
    },
    {
      id: 2,
      date: '23 Sep, 25 | 09:00 AM',
      subAdmin: 'Josh',
      commission: '10%',
      profitSplit: '70%',
      appliedBy: 'Martin Luther',
      status: 'Active'
    },
    {
      id: 3,
      date: '23 Sep, 25 | 09:00 AM',
      subAdmin: 'Josh',
      commission: '10%',
      profitSplit: '70%',
      appliedBy: 'Martin Luther',
      status: 'Active'
    },
    {
      id: 4,
      date: '23 Sep, 25 | 09:00 AM',
      subAdmin: 'Josh',
      commission: '10%',
      profitSplit: '70%',
      appliedBy: 'Martin Luther',
      status: 'Active'
    },
    {
      id: 5,
      date: '23 Sep, 25 | 09:00 AM',
      subAdmin: 'Josh',
      commission: '10%',
      profitSplit: '70%',
      appliedBy: 'Martin Luther',
      status: 'Active'
    }
  ]

  const handleSetCommission = () => {
    // Handle commission setting logic here
    setIsSetCommissionOpen(false)
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
                <div className="text-xl sm:text-2xl font-bold text-gray-900">$11,320</div>
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
                <div className="text-xl sm:text-2xl font-bold text-gray-900">$3,200</div>
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
                <div className="text-xl sm:text-2xl font-bold text-gray-900">$1,300</div>
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
                <div className="text-xl sm:text-2xl font-bold text-gray-900">$200k</div>
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
            <Dialog open={isSetCommissionOpen} onOpenChange={setIsSetCommissionOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                  Set commission
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md mx-4">
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
                    className="w-full bg-green-600 hover:bg-green-700 text-white mt-6"
                  >
                    Confirm
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Button variant="outline" className="bg-gray-800 text-white hover:bg-gray-700 text-sm">
                All
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
              <Select defaultValue="" className="w-full sm:w-auto">
                <option value="">Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
              <Select defaultValue="" className="w-full sm:w-auto">
                <option value="">Category</option>
                <option value="admin">Admin</option>
                <option value="sub-admin">Sub-Admin</option>
              </Select>
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search users"
                  className="pl-10 w-full"
                />
              </div>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="block sm:hidden space-y-3">
            {commissionHistory.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.subAdmin}</h3>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                      <span className="text-gray-500">Commission:</span>
                      <span className="ml-1 font-medium text-green-600">{item.commission}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Profit Split:</span>
                      <span className="ml-1 font-medium">{item.profitSplit}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-500">Applied by:</span>
                      <span className="ml-1 font-medium">{item.appliedBy}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      {item.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                  {commissionHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-gray-900">{item.date}</TableCell>
                      <TableCell className="text-gray-900">{item.subAdmin}</TableCell>
                      <TableCell>
                        <span className="text-green-600 font-medium">{item.commission}</span>
                      </TableCell>
                      <TableCell className="text-gray-900">{item.profitSplit}</TableCell>
                      <TableCell className="text-gray-900">{item.appliedBy}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700">
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
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
