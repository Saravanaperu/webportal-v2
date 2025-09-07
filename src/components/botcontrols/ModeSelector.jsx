import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function ModeSelector() {
  return (
    <div className="bg-card p-4 rounded-lg flex items-center justify-between">
      <h3 className="text-lg font-semibold">Mode</h3>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto">Auto</SelectItem>
          <SelectItem value="manual">Manual</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default ModeSelector
