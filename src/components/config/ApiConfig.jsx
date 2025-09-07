import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function ApiConfig({ config, onConfigChange }) {
  const handleChange = (e) => {
    onConfigChange(e.target.id, e.target.value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="brokerApiKey">API Key</Label>
          <Input id="brokerApiKey" type="password" value={config.brokerApiKey || ''} onChange={handleChange} />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="brokerApiSecret">API Secret</Label>
          <Input id="brokerApiSecret" type="password" value={config.brokerApiSecret || ''} onChange={handleChange} />
        </div>
      </CardContent>
    </Card>
  );
}

export default ApiConfig;
