import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Settings as SettingsIcon, Users, DollarSign, Bell, Shield } from 'lucide-react'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('market-settings')
  const [autoDeletePending, setAutoDeletePending] = useState(false)
  const [enableMarket, setEnableMarket] = useState(false)
  const [inrConversion, setInrConversion] = useState(true)
  const [orderTypes, setOrderTypes] = useState(false)
  const [autoSquareOff, setAutoSquareOff] = useState(true)
  const [overrideUserManagement, setOverrideUserManagement] = useState(false)
  const [overrideProfitSharing, setOverrideProfitSharing] = useState(false)
  const [overrideNotifications, setOverrideNotifications] = useState(false)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [accountFreezeControl, setAccountFreezeControl] = useState(false)

  // Trading days checkboxes
  const [tradingDays, setTradingDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false
  })

  // Notification channels
  const [notificationChannels, setNotificationChannels] = useState({
    push: true,
    email: false,
    sms: false,
    friday: false
  })

  // Auto notifications
  const [autoNotifications, setAutoNotifications] = useState({
    marginCall: true,
    tradeConfirm: false,
    systemAlerts: false
  })

  // Role-based access
  const [roleAccess, setRoleAccess] = useState({
    supermaster: { viewOrder: true, editBalance: false, sendNotification: false },
    master: { viewOrder: true, editBalance: false, sendNotification: false },
    client: { viewOrder: true, editBalance: false, sendNotification: false }
  })

  const menuItems = [
    { id: 'market-settings', label: 'Market settings', icon: SettingsIcon },
    { id: 'user-permission', label: 'User permission', icon: Users },
    { id: 'profit-sharing', label: 'Profit sharing', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security-controls', label: 'Security & controls', icon: Shield },
  ]

  const renderMarketSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Market timing</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Opening time</label>
            <Select defaultValue="">
              <option value="">Select opening time</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Closing time</label>
            <Select defaultValue="">
              <option value="">Select closing time</option>
              <option value="15:30">03:30 PM</option>
              <option value="16:00">04:00 PM</option>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Trading days</h3>
        <div className="flex flex-wrap gap-4 mb-6">
          {Object.entries(tradingDays).map(([day, checked]) => (
            <Checkbox
              key={day}
              checked={checked}
              onChange={(e) => setTradingDays(prev => ({ ...prev, [day]: e.target.checked }))}
              label={day.charAt(0).toUpperCase() + day.slice(1)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Auto- delete pending orders</h4>
            <p className="text-sm text-gray-600">Automatically orders pending at market close</p>
          </div>
          <Switch checked={autoDeletePending} onChange={(e) => setAutoDeletePending(e.target.checked)} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Enable market</h4>
            <p className="text-sm text-gray-600">Allow trading in this market</p>
          </div>
          <Switch checked={enableMarket} onChange={(e) => setEnableMarket(e.target.checked)} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">INR Conversion</h4>
            <p className="text-sm text-gray-600">Auto-convert currency to INR</p>
          </div>
          <Switch checked={inrConversion} onChange={(e) => setInrConversion(e.target.checked)} />
        </div>
      </div>
    </div>
  )

  const renderUserPermission = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Order quantity limit per role</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant="outline" className="bg-gray-600 text-white">Super Admin</Button>
          <Button variant="outline">Master</Button>
          <Button variant="outline">User</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Min order quantity</label>
            <Input placeholder="Enter minimum" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Max order quantity</label>
            <Input placeholder="Enter maximum" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Total position limit</label>
            <Input placeholder="Enter limit" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Order quantity per segment</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant="outline" className="bg-gray-600 text-white">Equity</Button>
          <Button variant="outline">Forex</Button>
          <Button variant="outline">Commodity</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Min order quantity</label>
            <Input placeholder="Enter minimum" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Max order quantity</label>
            <Input placeholder="Enter maximum" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Total position limit</label>
            <Input placeholder="Enter limit" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Default margin setups</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Intra day (%)</label>
            <Input placeholder="Enter percentage" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Holding (%)</label>
            <Input placeholder="Enter percentage" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Order types</h4>
            <p className="text-sm text-gray-600">Market, Limit, Stop Loss, Bracket, Cover</p>
          </div>
          <Switch checked={orderTypes} onChange={(e) => setOrderTypes(e.target.checked)} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Auto- square off</h4>
            <p className="text-sm text-gray-600">Automatically square off position at market close</p>
          </div>
          <Switch checked={autoSquareOff} onChange={(e) => setAutoSquareOff(e.target.checked)} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Override per user in User Management tab</h4>
            <p className="text-sm text-gray-600">Market, Limit, Stop Loss, Bracket, Cover</p>
          </div>
          <Switch checked={overrideUserManagement} onChange={(e) => setOverrideUserManagement(e.target.checked)} />
        </div>
      </div>
    </div>
  )

  const renderProfitSharing = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Global default profit-sharing ratios</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Admin</label>
            <Input placeholder="Enter percentage" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Sub-admin</label>
            <Input placeholder="Enter percentage" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Client</label>
            <Input placeholder="Enter percentage" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Minimum commission ranges allowed</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant="outline" className="bg-gray-600 text-white">Min</Button>
          <Button variant="outline">Max</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Admin</label>
            <Input placeholder="Enter minimum" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Sub-admin</label>
            <Input placeholder="Enter minimum" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Client</label>
            <Input placeholder="Enter minimum" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Commission per segment</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant="outline" className="bg-gray-600 text-white">NSE</Button>
          <Button variant="outline">MCX</Button>
          <Button variant="outline">Global</Button>
          <Button variant="outline">Equity</Button>
          <Button variant="outline">NSC</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
            <Select defaultValue="percentage">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount</option>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Value</label>
            <Input placeholder="10" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Unit</label>
            <Select defaultValue="per-lot">
              <option value="per-lot">Per lot</option>
              <option value="per-trade">Per trade</option>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Override per user in User Management tab</h4>
          <p className="text-sm text-gray-600">Market, Limit, Stop Loss, Bracket, Cover</p>
        </div>
        <Switch checked={overrideProfitSharing} onChange={(e) => setOverrideProfitSharing(e.target.checked)} />
      </div>
    </div>
  )

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Default notification channel</h3>
        <div className="flex flex-wrap gap-4 mb-6">
          {Object.entries(notificationChannels).map(([channel, checked]) => (
            <Checkbox
              key={channel}
              checked={checked}
              onChange={(e) => setNotificationChannels(prev => ({ ...prev, [channel]: e.target.checked }))}
              label={channel.charAt(0).toUpperCase() + channel.slice(1)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Auto - notification</h3>
        <div className="flex flex-wrap gap-4 mb-6">
          {Object.entries(autoNotifications).map(([type, checked]) => (
            <Checkbox
              key={type}
              checked={checked}
              onChange={(e) => setAutoNotifications(prev => ({ ...prev, [type]: e.target.checked }))}
              label={type === 'marginCall' ? 'Margin call' : type === 'tradeConfirm' ? 'Trade confirm' : 'System alerts'}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Maximum commission ranges allowed</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Admin</label>
            <Input placeholder="Enter maximum" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Sub-admin</label>
            <Input placeholder="Enter maximum" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Client</label>
            <Input placeholder="Enter maximum" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Override per user in User Management tab</h4>
          <p className="text-sm text-gray-600">Market, Limit, Stop Loss, Bracket, Cover</p>
        </div>
        <Switch checked={overrideNotifications} onChange={(e) => setOverrideNotifications(e.target.checked)} />
      </div>
    </div>
  )

  const renderSecurityControls = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Role-Based Access (Super master)</h3>
        <div className="flex flex-wrap gap-4 mb-4">
          <Checkbox
            checked={roleAccess.supermaster.viewOrder}
            onChange={(e) => setRoleAccess(prev => ({ 
              ...prev, 
              supermaster: { ...prev.supermaster, viewOrder: e.target.checked }
            }))}
            label="View order"
          />
          <Checkbox
            checked={roleAccess.supermaster.editBalance}
            onChange={(e) => setRoleAccess(prev => ({ 
              ...prev, 
              supermaster: { ...prev.supermaster, editBalance: e.target.checked }
            }))}
            label="Edit balance"
          />
          <Checkbox
            checked={roleAccess.supermaster.sendNotification}
            onChange={(e) => setRoleAccess(prev => ({ 
              ...prev, 
              supermaster: { ...prev.supermaster, sendNotification: e.target.checked }
            }))}
            label="Send notification"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Role-Based Access (Master)</h3>
        <div className="flex flex-wrap gap-4 mb-4">
          <Checkbox
            checked={roleAccess.master.viewOrder}
            onChange={(e) => setRoleAccess(prev => ({ 
              ...prev, 
              master: { ...prev.master, viewOrder: e.target.checked }
            }))}
            label="View order"
          />
          <Checkbox
            checked={roleAccess.master.editBalance}
            onChange={(e) => setRoleAccess(prev => ({ 
              ...prev, 
              master: { ...prev.master, editBalance: e.target.checked }
            }))}
            label="Edit balance"
          />
          <Checkbox
            checked={roleAccess.master.sendNotification}
            onChange={(e) => setRoleAccess(prev => ({ 
              ...prev, 
              master: { ...prev.master, sendNotification: e.target.checked }
            }))}
            label="Send notification"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Role-Based Access (Client)</h3>
        <div className="flex flex-wrap gap-4 mb-6">
          <Checkbox
            checked={roleAccess.client.viewOrder}
            onChange={(e) => setRoleAccess(prev => ({ 
              ...prev, 
              client: { ...prev.client, viewOrder: e.target.checked }
            }))}
            label="View order"
          />
          <Checkbox
            checked={roleAccess.client.editBalance}
            onChange={(e) => setRoleAccess(prev => ({ 
              ...prev, 
              client: { ...prev.client, editBalance: e.target.checked }
            }))}
            label="Edit balance"
          />
          <Checkbox
            checked={roleAccess.client.sendNotification}
            onChange={(e) => setRoleAccess(prev => ({ 
              ...prev, 
              client: { ...prev.client, sendNotification: e.target.checked }
            }))}
            label="Send notification"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">IP & Device Restrictions</h3>
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">IP</label>
          <div className="flex gap-2">
            <Input placeholder="192.168.1.1" className="flex-1" />
            <Button className="bg-green-600 hover:bg-green-700 text-white">Add devices</Button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Session Timeout Settings</h3>
        <Select defaultValue="30-mins">
          <option value="30-mins">30 mins</option>
          <option value="1-hour">1 hour</option>
          <option value="2-hours">2 hours</option>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Two-factor authentication</h4>
            <p className="text-sm text-gray-600">If enabled, all users (or selected roles) must verify login with OTP/Authenticator</p>
          </div>
          <Switch checked={twoFactorAuth} onChange={(e) => setTwoFactorAuth(e.target.checked)} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Account Freeze Control</h4>
            <p className="text-sm text-gray-600">Freezes all user logins until re-enabled (useful for maintenance or audits)</p>
          </div>
          <Switch checked={accountFreezeControl} onChange={(e) => setAccountFreezeControl(e.target.checked)} />
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'market-settings':
        return renderMarketSettings()
      case 'user-permission':
        return renderUserPermission()
      case 'profit-sharing':
        return renderProfitSharing()
      case 'notifications':
        return renderNotifications()
      case 'security-controls':
        return renderSecurityControls()
      default:
        return renderMarketSettings()
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Mobile Dropdown Navigation */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Settings</h1>
        <Select 
          value={activeTab} 
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full"
        >
          {menuItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-white border-r border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  )
}
