import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

function DiscordConfig() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Discord Alert Webhook</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <Input id="webhook-url" type="url" placeholder="Enter your Discord webhook URL" />
        </div>
        <Button>Save</Button>
      </CardContent>
    </Card>
  )
}

export default DiscordConfig
