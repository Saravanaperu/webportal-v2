import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getConfig, updateConfig } from '../../services/configService';

function IndicatorSettings() {
  const [settings, setSettings] = useState({ ema: 0, atr: 0, rsi: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getConfig();
        setSettings(data.strategyParams); // Assuming strategy params are nested
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.id]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // We need to update the whole config object
      const currentConfig = await getConfig();
      const updatedConfig = { ...currentConfig, strategyParams: settings };
      await updateConfig(updatedConfig);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Indicator Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="ema">EMA Period</Label>
              <Input id="ema" type="number" value={settings.ema} onChange={handleChange} />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="atr">ATR Period</Label>
              <Input id="atr" type="number" value={settings.atr} onChange={handleChange} />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="rsi">RSI Period</Label>
              <Input id="rsi" type="number" value={settings.rsi} onChange={handleChange} />
            </div>
            <Button onClick={handleSave}>Save</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default IndicatorSettings;
