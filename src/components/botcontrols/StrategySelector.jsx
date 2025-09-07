import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import socket from '../../services/socket';

function StrategySelector() {
  const handleStrategyChange = (strategy) => {
    socket.connect();
    socket.emit('set_strategy', { name: strategy });
  };

  return (
    <div className="bg-card p-4 rounded-lg flex items-center justify-between">
      <h3 className="text-lg font-semibold">Strategy</h3>
      <Select onValueChange={handleStrategyChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select strategy" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Scalper V1">Scalper V1</SelectItem>
          <SelectItem value="Momentum V2">Momentum V2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default StrategySelector
