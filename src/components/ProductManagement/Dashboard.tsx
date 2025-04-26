
import { StatCards } from "./Dashboard/StatCards"
import { RecentTrackingList } from "./Dashboard/RecentTrackingList"
import { RecentMovementsList } from "./Dashboard/RecentMovementsList"

export function Dashboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <StatCards />
      <RecentTrackingList />
      <RecentMovementsList />
    </div>
  )
}
