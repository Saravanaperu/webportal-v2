import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getConfig, updateConfig } from '../../services/configService';

function TradeSettings() {
  const [settings, setSettings] = useState({ multiTimeframe: false, trailingSl: false, hedging: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getConfig();
        setSettings(data.tradeSettings); // Assuming trade settings are nested
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSwitchChange = (id, checked) => {
    setSettings({ ...settings, [id]: checked });
  };

  const handleSave = async () => {
    try {
      const currentConfig = await getConfig();
      const updatedConfig = { ...currentConfig, tradeSettings: settings };
      await updateConfig(updatedConfig);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <Label htmlFor="multiTimeframe">Multi-timeframe</Label>
              <Switch
                id="multiTimeframe"
                checked={settings.multiTimeframe}
                onCheckedChange={(checked) => handleSwitchChange('multiTimeframe', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="trailingSl">Trailing SL</Label>
              <Switch
                id="trailingSl"
                checked={settings.trailingSl}
                onCheckedChange={(checked) => handleSwitchChange('trailingSl', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="hedging">Hedging</Label>
              <Switch
                id="hedging"
                checked={settings.hedging}
                onCheckedChange={(checked) => handleSwitchChange('hedging', checked)}
              />
            </div>
            <Button onClick={handleSave}>Save</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default TradeSettings;
