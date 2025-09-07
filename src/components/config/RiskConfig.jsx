import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function RiskConfig({ config, onConfigChange }) {
  const handleChange = (e) => {
    // We convert the value to a number before passing it up
    onConfigChange(e.target.id, Number(e.target.value));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="risk">Risk per trade (%)</Label>
          <Input id="risk" type="number" value={config.risk || ''} onChange={handleChange} />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="maxPosition">Max position size ($)</Label>
          <Input id="maxPosition" type="number" value={config.maxPosition || ''} onChange={handleChange} />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="capital">Total capital ($)</Label>
          <Input id="capital" type="number" value={config.capital || ''} onChange={handleChange} />
        </div>
        {/* The Save button is now in the parent component */}
      </CardContent>
    </Card>
  );
}

export default RiskConfig;
