import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Lock } from 'lucide-react'
import { toast } from 'react-toastify'

export default function AddMarket() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    marketName: '',
    openingTime: '',
    closingTime: '',
    intraDayMargin: '',
    holdingMargin: '',
    expiryAutoClose: true,
    autoDeletePending: false,
    enableMarket: false,
    inrConversion: true,
    preMarket: false,
    afterHours: false,
    holidays: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.marketName) {
      toast.error('Please enter market name')
      return
    }
    toast.success('Market created successfully!')
    navigate('/market-management')
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Market Name
              </label>
              <div className="relative">
                <Input
                  value={formData.marketName}
                  onChange={(e) => setFormData({ ...formData, marketName: e.target.value })}
                  placeholder=""
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
              <p className="text-xs text-gray-500 mt-1">Name cannot be changed</p>
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
                  onChange={(e) => setFormData({ ...formData, expiryAutoClose: e.target.checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Auto- delete pending orders</p>
                  <p className="text-sm text-gray-500">Automatically orders pending at market close</p>
                </div>
                <Switch 
                  checked={formData.autoDeletePending}
                  onChange={(e) => setFormData({ ...formData, autoDeletePending: e.target.checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Enable market</p>
                  <p className="text-sm text-gray-500">Allow trading in this market</p>
                </div>
                <Switch 
                  checked={formData.enableMarket}
                  onChange={(e) => setFormData({ ...formData, enableMarket: e.target.checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">INR Conversion</p>
                  <p className="text-sm text-gray-500">Auto-convert currency to INR</p>
                </div>
                <Switch 
                  checked={formData.inrConversion}
                  onChange={(e) => setFormData({ ...formData, inrConversion: e.target.checked })}
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
                  onChange={(e) => setFormData({ ...formData, preMarket: e.target.checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">After hours trading</p>
                  <p className="text-sm text-gray-500">Enable after market hours trading</p>
                </div>
                <Switch 
                  checked={formData.afterHours}
                  onChange={(e) => setFormData({ ...formData, afterHours: e.target.checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Holidays trading</p>
                  <p className="text-sm text-gray-500">Allow trading on market holidays</p>
                </div>
                <Switch 
                  checked={formData.holidays}
                  onChange={(e) => setFormData({ ...formData, holidays: e.target.checked })}
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
              <Button type="submit" className="flex-1">
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
