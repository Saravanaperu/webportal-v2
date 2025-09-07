import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import socket from '../../services/socket';

function ModeSelector() {
  const handleModeChange = (mode) => {
    socket.connect();
    socket.emit('set_mode', { mode });
  };

  return (
    <div className="bg-card p-4 rounded-lg flex items-center justify-between">
      <h3 className="text-lg font-semibold">Mode</h3>
      <Select onValueChange={handleModeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AUTO">Auto</SelectItem>
          <SelectItem value="MANUAL">Manual</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default ModeSelector
