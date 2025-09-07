import { Button } from '@/components/ui/button'

function StrategyControl() {
  return (
    <div className="bg-card p-4 rounded-lg flex items-center justify-between">
      <h3 className="text-lg font-semibold">Strategy Control</h3>
      <div className="flex gap-2">
        <Button>Start</Button>
        <Button variant="destructive">Stop</Button>
      </div>
    </div>
  )
}

export default StrategyControl
