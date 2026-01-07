import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wifi, RefreshCw, CheckCircle, XCircle } from 'lucide-react'
import { dashboardApi } from '@/lib/api'

export default function ConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'failed'>('idle')
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setConnectionStatus('testing')
    setError(null)

    try {
      await dashboardApi.healthCheck()
      setConnectionStatus('connected')
    } catch (err: any) {
      setConnectionStatus('failed')
      setError(err.message || 'Connection failed')
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
      case 'connected':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'failed':
        return <XCircle className="h-6 w-6 text-red-500" />
      default:
        return <Wifi className="h-6 w-6 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'testing':
        return 'Testing connection...'
      case 'connected':
        return 'Backend connected successfully!'
      case 'failed':
        return 'Backend connection failed'
      default:
        return 'Ready to test connection'
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'border-green-200 bg-green-50'
      case 'failed':
        return 'border-red-200 bg-red-50'
      case 'testing':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Backend Connection Test</h1>
        <p className="text-gray-600">Test the connection between admin frontend and backend API</p>
      </div>

      <Card className={getStatusColor()}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {getStatusIcon()}
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg">{getStatusText()}</span>
            <Badge variant={connectionStatus === 'connected' ? 'default' : connectionStatus === 'failed' ? 'destructive' : 'secondary'}>
              {connectionStatus.toUpperCase()}
            </Badge>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm font-medium">Error Details:</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button
              onClick={testConnection}
              disabled={connectionStatus === 'testing'}
              className="w-full"
            >
              {connectionStatus === 'testing' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Wifi className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">API Base URL:</span>
              <p className="text-gray-600 mt-1 font-mono text-xs break-all">
                {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">WebSocket URL:</span>
              <p className="text-gray-600 mt-1 font-mono text-xs break-all">
                {import.meta.env.VITE_WS_URL || 'ws://localhost:5000'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Environment:</span>
              <p className="text-gray-600 mt-1">
                {import.meta.env.VITE_NODE_ENV || 'development'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Backend URL:</span>
              <p className="text-gray-600 mt-1 font-mono text-xs break-all">
                {import.meta.env.VITE_BACKEND_URL || 'Not configured'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <div>
            <p className="font-medium text-gray-700 mb-2">To start the backend:</p>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-xs">
              cd backend<br />
              npm run dev
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-2">Backend should be running on:</p>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-xs">
              http://localhost:5000
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}