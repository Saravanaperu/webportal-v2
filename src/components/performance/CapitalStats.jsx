import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

function CapitalStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Capital Deployment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Deployed</span>
          <span>$50,000</span>
        </div>
        <div className="flex justify-between">
          <span>Available</span>
          <span>$50,000</span>
        </div>
        <Progress value={50} className="mt-2" />
      </CardContent>
    </Card>
  )
}

export default CapitalStats
