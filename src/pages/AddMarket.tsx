import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Lock, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { useApiMutation } from '@/hooks/useApi'
import { segmentApi } from '@/lib/api'

export default function AddMarket() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    marketName: '',
    displayName: '',
    marketType: 'NSE', // Default
    openingTime: '09:15',
    closingTime: '15:30',
    intraDayMargin: '10',
    holdingMargin: '100',
    expiryAutoClose: true,
    autoDeletePending: false,
    enableMarket: true,
    inrConversion: true,
    preMarket: false,
    afterHours: false,
    holidays: false,
  })

  const { mutate: createSegment, loading } = useApiMutation(
    segmentApi.createSegment,
    {
      onSuccess: () => {
        toast.success('Market created successfully!')
        navigate('/market-management')
      },
      onError: (err: any) => {
        toast.error(err.message || 'Failed to create market')
      }
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.marketName || !formData.displayName) {
      toast.error('Please enter market name and display name')
      return
    }

    // Default timings for weekdays (1-5) if times are selected
    const marketTimings = formData.openingTime && formData.closingTime
      ? [1, 2, 3, 4, 5].map(day => ({
        dayOfWeek: day,
        openTime: formData.openingTime,
        closeTime: formData.closingTime,
        isActive: true
      }))
      : [];

    createSegment({
      name: formData.marketName,
      displayName: formData.displayName,
      type: formData.marketType,
      intradayMarginPercent: parseFloat(formData.intraDayMargin) || 10,
      holdingMarginPercent: parseFloat(formData.holdingMargin) || 100,
      isActive: formData.enableMarket,
      expiryAutoClose: formData.expiryAutoClose,
      autoDeletePending: formData.autoDeletePending,
      inrConversion: formData.inrConversion,
      preMarket: formData.preMarket,
      afterHours: formData.afterHours,
      holidaysTrading: formData.holidays,
      status: 'Open',
      marketTimings,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/market-management')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Create market</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-2">Configure new market</h2>
          <p className="text-gray-500 text-sm mb-6">Create new market</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Identifier (e.g. NSE_FO)
                </label>
                <div className="relative">
                  <Input
                    value={formData.marketName}
                    onChange={(e) => setFormData({ ...formData, marketName: e.target.value.toUpperCase() })}
                    placeholder="NSE_FO"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
                <p className="text-xs text-gray-500 mt-1">Unique system name, cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <Input
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="NSE Futures & Options"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Market Type
              </label>
              <select
                className="w-full h-12 rounded-md border border-gray-200 bg-gray-50 px-4 text-sm"
                value={formData.marketType}
                onChange={(e) => setFormData({ ...formData, marketType: e.target.value })}
              >
                <option value="NSE">NSE</option>
                <option value="BSE">BSE</option>
                <option value="MCX">MCX</option>
                <option value="NCDEX">NCDEX</option>
                <option value="FOREX">FOREX</option>
                <option value="GLOBAL">GLOBAL</option>
                <option value="CRYPTO">CRYPTO</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opening time
                </label>
                <select
                  className="w-full h-12 rounded-md border border-gray-200 bg-gray-50 px-4 text-sm"
                  value={formData.openingTime}
                  onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                >
                  <option value="">Select time</option>
                  <option value="8:00">8:00 AM</option>
                  <option value="9:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Closing time
                </label>
                <select
                  className="w-full h-12 rounded-md border border-gray-200 bg-gray-50 px-4 text-sm"
                  value={formData.closingTime}
                  onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                >
                  <option value="">Select time</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="23:50">11:50 PM</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intra-day margin
                </label>
                <Input
                  value={formData.intraDayMargin}
                  onChange={(e) => setFormData({ ...formData, intraDayMargin: e.target.value })}
                  placeholder=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Holding margin
                </label>
                <Input
                  value={formData.holdingMargin}
                  onChange={(e) => setFormData({ ...formData, holdingMargin: e.target.value })}
                  placeholder=""
                />
              </div>
            </div>

            {/* Market Rules */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Market rules</h3>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Expiry day auto-close position</p>
                  <p className="text-sm text-gray-500">Automatically close all position on expiry day</p>
                </div>
                <Switch
                  checked={formData.expiryAutoClose}
                  onCheckedChange={(checked) => setFormData({ ...formData, expiryAutoClose: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Auto- delete pending orders</p>
                  <p className="text-sm text-gray-500">Automatically orders pending at market close</p>
                </div>
                <Switch
                  checked={formData.autoDeletePending}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoDeletePending: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Enable market</p>
                  <p className="text-sm text-gray-500">Allow trading in this market</p>
                </div>
                <Switch
                  checked={formData.enableMarket}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableMarket: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">INR Conversion</p>
                  <p className="text-sm text-gray-500">Auto-convert currency to INR</p>
                </div>
                <Switch
                  checked={formData.inrConversion}
                  onCheckedChange={(checked) => setFormData({ ...formData, inrConversion: checked })}
                />
              </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Additional Settings</h3>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Pre-market session</p>
                  <p className="text-sm text-gray-500">Enable pre-market trading</p>
                </div>
                <Switch
                  checked={formData.preMarket}
                  onCheckedChange={(checked) => setFormData({ ...formData, preMarket: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">After hours trading</p>
                  <p className="text-sm text-gray-500">Enable after market hours trading</p>
                </div>
                <Switch
                  checked={formData.afterHours}
                  onCheckedChange={(checked) => setFormData({ ...formData, afterHours: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Holidays trading</p>
                  <p className="text-sm text-gray-500">Allow trading on market holidays</p>
                </div>
                <Switch
                  checked={formData.holidays}
                  onCheckedChange={(checked) => setFormData({ ...formData, holidays: checked })}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/market-management')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
