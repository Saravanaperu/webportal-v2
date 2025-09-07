import { useState, useEffect } from 'react';
import RiskConfig from '../components/config/RiskConfig';
import ApiConfig from '../components/config/ApiConfig';
import SessionScheduler from '../components/config/SessionScheduler';
import { Button } from '@/components/ui/button';
import { getConfig, updateConfig } from '../services/configService';

function ConfigPanel() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getConfig();
        setConfig(data);
      } catch (error) {
        console.error("Failed to fetch config:", error);
        // Handle error (e.g., show a toast notification)
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleConfigChange = (key, value) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateConfig(config);
      // Handle success (e.g., show a toast notification)
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error("Failed to save config:", error);
      // Handle error
      alert('Failed to save configuration.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading configuration...</p>;
  }

  if (!config) {
    return <p>Could not load configuration.</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Configuration Panel</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
      <div className="space-y-6">
        <RiskConfig config={config} onConfigChange={handleConfigChange} />
        <ApiConfig config={config} onConfigChange={handleConfigChange} />
        <SessionScheduler config={config} onConfigChange={handleConfigChange} />
      </div>
    </div>
  );
}

export default ConfigPanel;
