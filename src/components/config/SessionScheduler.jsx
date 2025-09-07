import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getConfig, updateConfig } from '../../services/configService';

function SessionScheduler() {
  const [config, setConfig] = useState({ startTime: '', endTime: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getConfig();
        setConfig(data);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.id]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateConfig(config);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Scheduler</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="startTime">Start time</Label>
              <Input id="startTime" type="time" value={config.startTime} onChange={handleChange} />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="endTime">End time</Label>
              <Input id="endTime" type="time" value={config.endTime} onChange={handleChange} />
            </div>
            <Button onClick={handleSave}>Save</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default SessionScheduler;
