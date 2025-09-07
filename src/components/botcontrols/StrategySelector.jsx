import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function StrategySelector() {
  return (
    <div className="bg-card p-4 rounded-lg flex items-center justify-between">
      <h3 className="text-lg font-semibold">Strategy</h3>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select strategy" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="strategy1">Scalper V1</SelectItem>
          <SelectItem value="strategy2">Momentum V2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default StrategySelector
