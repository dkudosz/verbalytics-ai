export default function StatsBar() {
  return (
    <div className="mt-20 bg-gradient-secondary rounded-2xl p-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            10K+
          </div>
          <div className="text-muted-foreground">Active Users</div>
        </div>
        <div>
          <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            99.9%
          </div>
          <div className="text-muted-foreground">Uptime</div>
        </div>
        <div>
          <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            150+
          </div>
          <div className="text-muted-foreground">Countries</div>
        </div>
        <div>
          <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            4.9/5
          </div>
          <div className="text-muted-foreground">Customer Rating</div>
        </div>
      </div>
    </div>
  );
}


