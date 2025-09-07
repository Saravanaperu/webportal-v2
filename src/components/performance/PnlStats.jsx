import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function PnlStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>P&L Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Daily P&L</span>
          <span className="text-green-500">+$500</span>
        </div>
        <div className="flex justify-between">
          <span>Weekly P&L</span>
          <span className="text-green-500">+$2,500</span>
        </div>
        <div className="flex justify-between">
          <span>Monthly P&L</span>
          <span className="text-red-500">-$1,000</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default PnlStats
