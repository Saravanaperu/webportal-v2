import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

function TradeSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="multi-timeframe">Multi-timeframe</Label>
          <Switch id="multi-timeframe" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="trailing-sl">Trailing SL</Label>
          <Switch id="trailing-sl" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="hedging">Hedging</Label>
          <Switch id="hedging" />
        </div>
      </CardContent>
    </Card>
  )
}

export default TradeSettings
