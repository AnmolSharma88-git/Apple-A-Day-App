import OrderStatusControl from "./OrderStatusControl"

function OrderTable({ orders, onOrderUpdated }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full text-left">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="px-5 py-4">Token</th>
            <th className="px-5 py-4">Customer</th>
            <th className="px-5 py-4">Type</th>
            <th className="px-5 py-4">Total</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Update</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b last:border-0"
            >
              <td className="px-5 py-4 font-semibold">
                {order.token}
              </td>

              <td className="px-5 py-4">
                {order.customerName}
              </td>

              <td className="px-5 py-4">
                {order.orderType}
              </td>

              <td className="px-5 py-4">
                ₹{order.total}
              </td>

              <td className="px-5 py-4">
                {order.status}
              </td>

              <td className="px-5 py-4">
                <OrderStatusControl
                  order={order}
                  onStatusUpdated={onOrderUpdated}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderTable;