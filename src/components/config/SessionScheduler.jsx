import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function SessionScheduler() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Scheduler</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="start-time">Start time</Label>
          <Input id="start-time" type="time" />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="end-time">End time</Label>
          <Input id="end-time" type="time" />
        </div>
      </CardContent>
    </Card>
  )
}

export default SessionScheduler
