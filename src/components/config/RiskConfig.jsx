import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function RiskConfig() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="risk">Risk per trade (%)</Label>
          <Input id="risk" type="number" placeholder="e.g., 1" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="max-position">Max position size ($)</Label>
          <Input id="max-position" type="number" placeholder="e.g., 10000" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="capital">Total capital ($)</Label>
          <Input id="capital" type="number" placeholder="e.g., 100000" />
        </div>
      </CardContent>
    </Card>
  )
}

export default RiskConfig
