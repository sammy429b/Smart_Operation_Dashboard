export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Smart Operations Dashboard</p>
      </div>

      {/* Placeholder content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Widget {i}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <div className="col-span-4 rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Analytics</h3>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Chart placeholder
          </div>
        </div>
        <div className="col-span-3 rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Live Alerts</h3>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Alerts placeholder
          </div>
        </div>
      </div>
    </div>
  );
}
