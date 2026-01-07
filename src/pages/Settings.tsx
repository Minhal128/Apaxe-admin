import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Settings as SettingsIcon, Users, DollarSign, Bell, Shield } from 'lucide-react'
import { settingsApi } from '@/lib/api'
import { useApi } from '@/hooks/useApi'
import { toast } from 'sonner'

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

  // Fetch settings on mount
  const { refetch } = useApi<any>(settingsApi.getSettings, {
    immediate: true,
    onSuccess: (data) => {
      // Map backend keys to local state
      if (data) {
        setEnableMarket(data.TRADING_ENABLED ?? false)
        setAutoDeletePending(data.AUTO_DELETE_PENDING ?? false)
        setInrConversion(data.INR_CONVERSION ?? true)
        setOrderTypes(data.ORDER_TYPES_ENABLED ?? false)
        setAutoSquareOff(data.AUTO_SQUARE_OFF ?? true)

        setOverrideUserManagement(data.OVERRIDE_USER_MANAGEMENT ?? false)
        setOverrideProfitSharing(data.OVERRIDE_PROFIT_SHARING ?? false)
        setOverrideNotifications(data.OVERRIDE_NOTIFICATIONS ?? false)

        setTwoFactorAuth(data.TWO_FACTOR_AUTH ?? false)
        setAccountFreezeControl(data.ACCOUNT_FREEZE ?? false)

        if (data.NOTIFICATION_CHANNELS) setNotificationChannels(data.NOTIFICATION_CHANNELS)
        if (data.AUTO_NOTIFICATIONS) setAutoNotifications(data.AUTO_NOTIFICATIONS)
        if (data.ROLE_ACCESS) setRoleAccess(data.ROLE_ACCESS)

        setUserPermissions({
          globalMinQty: data.GLOBAL_MIN_QTY || '',
          globalMaxQty: data.GLOBAL_MAX_QTY || '',
          globalPosLimit: data.GLOBAL_POS_LIMIT || '',
          segmentMinQty: data.SEGMENT_MIN_QTY || '',
          segmentMaxQty: data.SEGMENT_MAX_QTY || '',
          segmentPosLimit: data.SEGMENT_POS_LIMIT || '',
          marginIntraday: data.MARGIN_INTRADAY || '',
          marginHolding: data.MARGIN_HOLDING || ''
        })

        setProfitSharing({
          globalAdmin: data.PROFIT_GLOBAL_ADMIN || '',
          globalSubAdmin: data.PROFIT_GLOBAL_SUBADMIN || '',
          globalClient: data.PROFIT_GLOBAL_CLIENT || '',
          minCommAdmin: data.PROFIT_MIN_COMM_ADMIN || '',
          minCommSubAdmin: data.PROFIT_MIN_COMM_SUBADMIN || '',
          minCommClient: data.PROFIT_MIN_COMM_CLIENT || '',
          commValue: data.PROFIT_COMM_VALUE || '10'
        })

        setNotificationLimits({
          maxCommAdmin: data.NOTIF_MAX_COMM_ADMIN || '',
          maxCommSubAdmin: data.NOTIF_MAX_COMM_SUBADMIN || '',
          maxCommClient: data.NOTIF_MAX_COMM_CLIENT || ''
        })

        setIpAddress(data.IP_WHITELIST || '')
      }
    }
  });

  // Generic update handler
  const handleUpdateSetting = async (key: string, value: any, category: string = 'GENERAL') => {
    try {
      await settingsApi.updateSettings({ [key]: value }, category);
      toast.success('Settings updated');
      refetch();
    } catch (error) {
      toast.error('Failed to update settings');
    }
  }

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

  // User Permission State
  const [userPermissions, setUserPermissions] = useState({
    globalMinQty: '', globalMaxQty: '', globalPosLimit: '',
    segmentMinQty: '', segmentMaxQty: '', segmentPosLimit: '',
    marginIntraday: '', marginHolding: ''
  })

  // Profit Sharing State
  const [profitSharing, setProfitSharing] = useState({
    globalAdmin: '', globalSubAdmin: '', globalClient: '',
    minCommAdmin: '', minCommSubAdmin: '', minCommClient: '',
    commValue: '10'
  })

  // Notification Limits State
  const [notificationLimits, setNotificationLimits] = useState({
    maxCommAdmin: '', maxCommSubAdmin: '', maxCommClient: ''
  })

  // IP Restriction State
  const [ipAddress, setIpAddress] = useState('')

  // Generic Blur Handler for Inputs
  const handleInputBlur = (key: string, value: string, category: string) => {
    handleUpdateSetting(key, value, category);
  }

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
              onChange={(e) => {
                const newState = { ...tradingDays, [day]: e.target.checked };
                setTradingDays(newState);
                handleUpdateSetting('TRADING_DAYS', newState, 'TRADING');
              }}
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
          <Switch
            checked={autoDeletePending}
            onCheckedChange={(checked) => {
              setAutoDeletePending(checked)
              handleUpdateSetting('AUTO_DELETE_PENDING', checked, 'TRADING')
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Enable market</h4>
            <p className="text-sm text-gray-600">Allow trading in this market</p>
          </div>
          <Switch
            checked={enableMarket}
            onCheckedChange={(checked) => {
              setEnableMarket(checked);
              handleUpdateSetting('TRADING_ENABLED', checked, 'TRADING')
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">INR Conversion</h4>
            <p className="text-sm text-gray-600">Auto-convert currency to INR</p>
          </div>
          <Switch
            checked={inrConversion}
            onCheckedChange={(checked) => {
              setInrConversion(checked);
              handleUpdateSetting('INR_CONVERSION', checked, 'TRADING')
            }}
          />
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
            <Input
              value={userPermissions.globalMinQty}
              onChange={(e) => setUserPermissions({ ...userPermissions, globalMinQty: e.target.value })}
              onBlur={(e) => handleInputBlur('GLOBAL_MIN_QTY', e.target.value, 'PERMISSIONS')}
              placeholder="Enter minimum"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Max order quantity</label>
            <Input
              value={userPermissions.globalMaxQty}
              onChange={(e) => setUserPermissions({ ...userPermissions, globalMaxQty: e.target.value })}
              onBlur={(e) => handleInputBlur('GLOBAL_MAX_QTY', e.target.value, 'PERMISSIONS')}
              placeholder="Enter maximum"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Total position limit</label>
            <Input
              value={userPermissions.globalPosLimit}
              onChange={(e) => setUserPermissions({ ...userPermissions, globalPosLimit: e.target.value })}
              onBlur={(e) => handleInputBlur('GLOBAL_POS_LIMIT', e.target.value, 'PERMISSIONS')}
              placeholder="Enter limit"
            />
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
            <Input
              value={userPermissions.segmentMinQty}
              onChange={(e) => setUserPermissions({ ...userPermissions, segmentMinQty: e.target.value })}
              onBlur={(e) => handleInputBlur('SEGMENT_MIN_QTY', e.target.value, 'PERMISSIONS')}
              placeholder="Enter minimum"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Max order quantity</label>
            <Input
              value={userPermissions.segmentMaxQty}
              onChange={(e) => setUserPermissions({ ...userPermissions, segmentMaxQty: e.target.value })}
              onBlur={(e) => handleInputBlur('SEGMENT_MAX_QTY', e.target.value, 'PERMISSIONS')}
              placeholder="Enter maximum"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Total position limit</label>
            <Input
              value={userPermissions.segmentPosLimit}
              onChange={(e) => setUserPermissions({ ...userPermissions, segmentPosLimit: e.target.value })}
              onBlur={(e) => handleInputBlur('SEGMENT_POS_LIMIT', e.target.value, 'PERMISSIONS')}
              placeholder="Enter limit"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Default margin setups</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Intra day (%)</label>
            <Input
              value={userPermissions.marginIntraday}
              onChange={(e) => setUserPermissions({ ...userPermissions, marginIntraday: e.target.value })}
              onBlur={(e) => handleInputBlur('MARGIN_INTRADAY', e.target.value, 'PERMISSIONS')}
              placeholder="Enter percentage"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Holding (%)</label>
            <Input
              value={userPermissions.marginHolding}
              onChange={(e) => setUserPermissions({ ...userPermissions, marginHolding: e.target.value })}
              onBlur={(e) => handleInputBlur('MARGIN_HOLDING', e.target.value, 'PERMISSIONS')}
              placeholder="Enter percentage"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Order types</h4>
            <p className="text-sm text-gray-600">Market, Limit, Stop Loss, Bracket, Cover</p>
          </div>
          <Switch
            checked={orderTypes}
            onCheckedChange={(checked) => {
              setOrderTypes(checked)
              handleUpdateSetting('ORDER_TYPES_ENABLED', checked, 'TRADING')
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Auto- square off</h4>
            <p className="text-sm text-gray-600">Automatically square off position at market close</p>
          </div>
          <Switch
            checked={autoSquareOff}
            onCheckedChange={(checked) => {
              setAutoSquareOff(checked)
              handleUpdateSetting('AUTO_SQUARE_OFF', checked, 'TRADING')
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Override per user in User Management tab</h4>
            <p className="text-sm text-gray-600">Market, Limit, Stop Loss, Bracket, Cover</p>
          </div>
          <Switch
            checked={overrideUserManagement}
            onCheckedChange={(checked) => {
              setOverrideUserManagement(checked)
              handleUpdateSetting('OVERRIDE_USER_MANAGEMENT', checked, 'PERMISSIONS')
            }}
          />
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
            <Input
              value={profitSharing.globalAdmin}
              onChange={(e) => setProfitSharing({ ...profitSharing, globalAdmin: e.target.value })}
              onBlur={(e) => handleInputBlur('PROFIT_GLOBAL_ADMIN', e.target.value, 'FINANCIAL')}
              placeholder="Enter percentage"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Sub-admin</label>
            <Input
              value={profitSharing.globalSubAdmin}
              onChange={(e) => setProfitSharing({ ...profitSharing, globalSubAdmin: e.target.value })}
              onBlur={(e) => handleInputBlur('PROFIT_GLOBAL_SUBADMIN', e.target.value, 'FINANCIAL')}
              placeholder="Enter percentage"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Client</label>
            <Input
              value={profitSharing.globalClient}
              onChange={(e) => setProfitSharing({ ...profitSharing, globalClient: e.target.value })}
              onBlur={(e) => handleInputBlur('PROFIT_GLOBAL_CLIENT', e.target.value, 'FINANCIAL')}
              placeholder="Enter percentage"
            />
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
        <Switch
          checked={overrideProfitSharing}
          onCheckedChange={(checked) => {
            setOverrideProfitSharing(checked)
            handleUpdateSetting('OVERRIDE_PROFIT_SHARING', checked, 'FINANCIAL')
          }}
        />
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
              onChange={(e) => {
                const newState = { ...notificationChannels, [channel]: e.target.checked };
                setNotificationChannels(newState);
                handleUpdateSetting('NOTIFICATION_CHANNELS', newState, 'NOTIFICATIONS');
              }}
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
              onChange={(e) => {
                const newState = { ...autoNotifications, [type]: e.target.checked };
                setAutoNotifications(newState);
                handleUpdateSetting('AUTO_NOTIFICATIONS', newState, 'NOTIFICATIONS');
              }}
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
            <Input
              value={notificationLimits.maxCommAdmin}
              onChange={(e) => setNotificationLimits({ ...notificationLimits, maxCommAdmin: e.target.value })}
              onBlur={(e) => handleInputBlur('NOTIF_MAX_COMM_ADMIN', e.target.value, 'NOTIFICATIONS')}
              placeholder="Enter maximum"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Sub-admin</label>
            <Input
              value={notificationLimits.maxCommSubAdmin}
              onChange={(e) => setNotificationLimits({ ...notificationLimits, maxCommSubAdmin: e.target.value })}
              onBlur={(e) => handleInputBlur('NOTIF_MAX_COMM_SUBADMIN', e.target.value, 'NOTIFICATIONS')}
              placeholder="Enter maximum"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Client</label>
            <Input
              value={notificationLimits.maxCommClient}
              onChange={(e) => setNotificationLimits({ ...notificationLimits, maxCommClient: e.target.value })}
              onBlur={(e) => handleInputBlur('NOTIF_MAX_COMM_CLIENT', e.target.value, 'NOTIFICATIONS')}
              placeholder="Enter maximum"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Override per user in User Management tab</h4>
          <p className="text-sm text-gray-600">Market, Limit, Stop Loss, Bracket, Cover</p>
        </div>
        <Switch
          checked={overrideNotifications}
          onCheckedChange={(checked) => {
            setOverrideNotifications(checked)
            handleUpdateSetting('OVERRIDE_NOTIFICATIONS', checked, 'NOTIFICATIONS')
          }}
        />
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
            onChange={(e) => {
              const newState = {
                ...roleAccess,
                supermaster: { ...roleAccess.supermaster, viewOrder: e.target.checked }
              };
              setRoleAccess(newState);
              handleUpdateSetting('ROLE_ACCESS', newState, 'SECURITY');
            }}
            label="View order"
          />
          <Checkbox
            checked={roleAccess.supermaster.editBalance}
            onChange={(e) => {
              const newState = {
                ...roleAccess,
                supermaster: { ...roleAccess.supermaster, editBalance: e.target.checked }
              };
              setRoleAccess(newState);
              handleUpdateSetting('ROLE_ACCESS', newState, 'SECURITY');
            }}
            label="Edit balance"
          />
          <Checkbox
            checked={roleAccess.supermaster.sendNotification}
            onChange={(e) => {
              const newState = {
                ...roleAccess,
                supermaster: { ...roleAccess.supermaster, sendNotification: e.target.checked }
              };
              setRoleAccess(newState);
              handleUpdateSetting('ROLE_ACCESS', newState, 'SECURITY');
            }}
            label="Send notification"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Role-Based Access (Master)</h3>
        <div className="flex flex-wrap gap-4 mb-4">
          <Checkbox
            checked={roleAccess.master.viewOrder}
            onChange={(e) => {
              const newState = {
                ...roleAccess,
                master: { ...roleAccess.master, viewOrder: e.target.checked }
              };
              setRoleAccess(newState);
              handleUpdateSetting('ROLE_ACCESS', newState, 'SECURITY');
            }}
            label="View order"
          />
          <Checkbox
            checked={roleAccess.master.editBalance}
            onChange={(e) => {
              const newState = {
                ...roleAccess,
                master: { ...roleAccess.master, editBalance: e.target.checked }
              };
              setRoleAccess(newState);
              handleUpdateSetting('ROLE_ACCESS', newState, 'SECURITY');
            }}
            label="Edit balance"
          />
          <Checkbox
            checked={roleAccess.master.sendNotification}
            onChange={(e) => {
              const newState = {
                ...roleAccess,
                master: { ...roleAccess.master, sendNotification: e.target.checked }
              };
              setRoleAccess(newState);
              handleUpdateSetting('ROLE_ACCESS', newState, 'SECURITY');
            }}
            label="Send notification"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Role-Based Access (Client)</h3>
        <div className="flex flex-wrap gap-4 mb-6">
          <Checkbox
            checked={roleAccess.client.viewOrder}
            onChange={(e) => {
              const newState = {
                ...roleAccess,
                client: { ...roleAccess.client, viewOrder: e.target.checked }
              };
              setRoleAccess(newState);
              handleUpdateSetting('ROLE_ACCESS', newState, 'SECURITY');
            }}
            label="View order"
          />
          <Checkbox
            checked={roleAccess.client.editBalance}
            onChange={(e) => {
              const newState = {
                ...roleAccess,
                client: { ...roleAccess.client, editBalance: e.target.checked }
              };
              setRoleAccess(newState);
              handleUpdateSetting('ROLE_ACCESS', newState, 'SECURITY');
            }}
            label="Edit balance"
          />
          <Checkbox
            checked={roleAccess.client.sendNotification}
            onChange={(e) => {
              const newState = {
                ...roleAccess,
                client: { ...roleAccess.client, sendNotification: e.target.checked }
              };
              setRoleAccess(newState);
              handleUpdateSetting('ROLE_ACCESS', newState, 'SECURITY');
            }}
            label="Send notification"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">IP & Device Restrictions</h3>
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">IP</label>
          <div className="flex gap-2">
            <Input
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              onBlur={(e) => handleInputBlur('IP_WHITELIST', e.target.value, 'SECURITY')}
              placeholder="192.168.1.1"
              className="flex-1"
            />
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
          <Switch
            checked={twoFactorAuth}
            onCheckedChange={(checked) => {
              setTwoFactorAuth(checked)
              handleUpdateSetting('TWO_FACTOR_AUTH', checked, 'SECURITY')
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Account Freeze Control</h4>
            <p className="text-sm text-gray-600">Freezes all user logins until re-enabled (useful for maintenance or audits)</p>
          </div>
          <Switch
            checked={accountFreezeControl}
            onCheckedChange={(checked) => {
              setAccountFreezeControl(checked)
              handleUpdateSetting('ACCOUNT_FREEZE', checked, 'SECURITY')
            }}
          />
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
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === item.id
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
