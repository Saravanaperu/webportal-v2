import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function TradeStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Win/Loss Ratio</span>
          <span>65%</span>
        </div>
        <div className="flex justify-between">
          <span>Average R:R</span>
          <span>1.5 : 1</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default TradeStats
