function Analytics() {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Analytics
        </h1>

        <p className="mt-2 text-slate-500">
          View café performance and analytics.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Orders
          </p>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Revenue
          </p>

          <p className="mt-2 text-3xl font-bold">
            ₹0
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Pickup Orders
          </p>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Delivery Orders
          </p>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </div>
      </div>
    </section>
  )
}

export default Analytics;