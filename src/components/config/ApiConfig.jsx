import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function ApiConfig() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="api-key">API Key</Label>
          <Input id="api-key" type="password" placeholder="Enter your API key" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="api-secret">API Secret</Label>
          <Input id="api-secret" type="password" placeholder="Enter your API secret" />
        </div>
      </CardContent>
    </Card>
  )
}

export default ApiConfig
