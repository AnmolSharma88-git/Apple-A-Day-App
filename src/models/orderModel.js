export const createOrderModel = ({
  userId,
  items,
  totalAmount,
  orderType,
  paymentMethod,
}) => {
  return {
    userId,
    items,
    totalAmount,
    orderType,
    paymentMethod,

    orderStatus: "pending",
    paymentStatus: "pending",

    createdAt: new Date(),
  };
};