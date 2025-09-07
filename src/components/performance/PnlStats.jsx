import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function PnlStats({ pnl }) {
  const pnlColor = pnl >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <Card>
      <CardHeader>
        <CardTitle>P&L Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>P&L</span>
          <span className={pnlColor}>
            {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default PnlStats
