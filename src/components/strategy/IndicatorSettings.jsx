import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function IndicatorSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Indicator Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="ema">EMA Period</Label>
          <Input id="ema" type="number" placeholder="e.g., 20" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="atr">ATR Period</Label>
          <Input id="atr" type="number" placeholder="e.g., 14" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="rsi">RSI Period</Label>
          <Input id="rsi" type="number" placeholder="e.g., 14" />
        </div>
      </CardContent>
    </Card>
  )
}

export default IndicatorSettings
