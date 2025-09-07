import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function SessionScheduler({ config, onConfigChange }) {
  const handleChange = (e) => {
    onConfigChange(e.target.id, e.target.value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Scheduler</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="sessionStartTime">Start time</Label>
          <Input id="sessionStartTime" type="time" value={config.sessionStartTime || ''} onChange={handleChange} />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="sessionEndTime">End time</Label>
          <Input id="sessionEndTime" type="time" value={config.sessionEndTime || ''} onChange={handleChange} />
        </div>
      </CardContent>
    </Card>
  );
}

export default SessionScheduler;
