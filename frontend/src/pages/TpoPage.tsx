import TPODashboard from '../features/tpo/TPODashboard'
import MarketIntelligence from '../features/analytics/MarketIntelligence'
import ChatWindow from '../features/shared/placementBot/components/ChatWindow'

export default function TpoPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Placement Officer (TPO) Dashboard</h2>
      <TPODashboard />
      <MarketIntelligence />
      <ChatWindow context="tpo" />
    </div>
  )
}