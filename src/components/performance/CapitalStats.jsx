import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

function CapitalStats({ deployment }) {
  const deployed = deployment?.deployed || 0;
  const available = deployment?.available || 0;
  const total = deployed + available;
  const progress = total > 0 ? (deployed / total) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Capital Deployment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Deployed</span>
          <span>${deployed.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Available</span>
          <span>${available.toLocaleString()}</span>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardContent>
    </Card>
  )
}

export default CapitalStats
