import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, MoreHorizontal, Plus, X } from 'lucide-react'

export default function Notifications() {
  const [isAddNotificationOpen, setIsAddNotificationOpen] = useState(false)
  const [notificationTitle, setNotificationTitle] = useState('')
  const [messageBody, setMessageBody] = useState('')
  const [scheduleNotifications, setScheduleNotifications] = useState(false)

  // Mock data for notifications
  const notifications = [
    {
      id: '#1535457663',
      date: '23 Sep, 25 | 09:00 AM',
      recipients: 'Super admin',
      message: 'Good news, our trade has hit take profit...',
      type: 'Trading'
    },
    {
      id: '#1535457663',
      date: '23 Sep, 25 | 09:00 AM',
      recipients: 'Super admin',
      message: 'Good news, our trade has hit take profit...',
      type: 'Trading'
    },
    {
      id: '#1535457663',
      date: '23 Sep, 25 | 09:00 AM',
      recipients: 'Super admin',
      message: 'Good news, our trade has hit take profit...',
      type: 'Trading'
    },
    {
      id: '#1535457663',
      date: '23 Sep, 25 | 09:00 AM',
      recipients: 'Super admin',
      message: 'Good news, our trade has hit take profit...',
      type: 'Trading'
    },
    {
      id: '#1535457663',
      date: '23 Sep, 25 | 09:00 AM',
      recipients: 'Super admin',
      message: 'Good news, our trade has hit take profit...',
      type: 'Trading'
    },
    {
      id: '#1535457663',
      date: '23 Sep, 25 | 09:00 AM',
      recipients: 'Super admin',
      message: 'Good news, our trade has hit take profit...',
      type: 'Trading'
    },
    {
      id: '#1535457663',
      date: '23 Sep, 25 | 09:00 AM',
      recipients: 'Super admin',
      message: 'Good news, our trade has hit take profit...',
      type: 'Trading'
    }
  ]

  const handleCreateNotification = () => {
    // Handle notification creation logic here
    setIsAddNotificationOpen(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Notifications</h1>
        <Dialog open={isAddNotificationOpen} onOpenChange={setIsAddNotificationOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add notifications
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md mx-4">
            <button
              onClick={() => setIsAddNotificationOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Add notifications</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Notification Title
                </label>
                <Input
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  placeholder="Enter notification title"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Message body
                </label>
                <textarea
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder="Enter message body"
                  className="w-full min-h-[80px] px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Select Recipient
                  </label>
                  <Select defaultValue="" className="w-full">
                    <option value="">Choose recipient</option>
                    <option value="super-admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Select Channel
                  </label>
                  <Select defaultValue="" className="w-full">
                    <option value="">Choose channel</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push</option>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={scheduleNotifications}
                  onChange={(e) => setScheduleNotifications(e.target.checked)}
                />
                <span className="text-sm text-gray-700">Schedule notifications</span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Date and Time
                </label>
                <Select defaultValue="" className="w-full">
                  <option value="">Select date and time</option>
                  <option value="now">Now</option>
                  <option value="later">Schedule for later</option>
                </Select>
              </div>
              <Button 
                onClick={handleCreateNotification}
                className="w-full bg-green-600 hover:bg-green-700 text-white mt-6"
              >
                Create notifications
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
            <option value="trading">Trading</option>
            <option value="system">System</option>
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

      {/* Mobile Cards */}
      <div className="block sm:hidden space-y-3">
        {notifications.map((notification, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{notification.id}</h3>
                  <p className="text-sm text-gray-500">{notification.date}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="text-sm">
                  <span className="text-gray-500">Recipients:</span>
                  <span className="ml-1 font-medium">{notification.recipients}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Type:</span>
                  <span className="ml-1 font-medium">{notification.type}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-700">
                <span className="text-gray-500">Message:</span>
                <p className="mt-1">{notification.message}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block">
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-600 font-medium">Notification ID</TableHead>
                    <TableHead className="text-gray-600 font-medium">Date</TableHead>
                    <TableHead className="text-gray-600 font-medium">Recipients</TableHead>
                    <TableHead className="text-gray-600 font-medium">Message</TableHead>
                    <TableHead className="text-gray-600 font-medium">Type</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-gray-900">{notification.id}</TableCell>
                      <TableCell className="text-gray-900">{notification.date}</TableCell>
                      <TableCell className="text-gray-900">{notification.recipients}</TableCell>
                      <TableCell className="text-gray-900 max-w-xs truncate">{notification.message}</TableCell>
                      <TableCell className="text-gray-900">{notification.type}</TableCell>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
