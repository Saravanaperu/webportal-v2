import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getConfig, updateConfig } from '../../services/configService';

function DiscordConfig() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getConfig();
        setWebhookUrl(data.discordWebhookUrl);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    try {
      const currentConfig = await getConfig();
      const updatedConfig = { ...currentConfig, discordWebhookUrl: webhookUrl };
      await updateConfig(updatedConfig);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discord Alert Webhook</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="Enter your Discord webhook URL"
              />
            </div>
            <Button onClick={handleSave}>Save</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default DiscordConfig;
