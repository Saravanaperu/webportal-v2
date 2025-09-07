function SystemStatus() {
  return (
    <div className="bg-card p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">System Status</h3>
      <div className="flex items-center">
        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
        <p>All systems normal</p>
      </div>
    </div>
  )
}

export default SystemStatus
