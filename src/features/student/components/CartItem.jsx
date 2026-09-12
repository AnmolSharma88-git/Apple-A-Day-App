import { useDispatch } from "react-redux";

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../../store/cartSlice";

function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center justify-between">

      <div className="flex items-center gap-4">

        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
        />

        <div>
          <h3 className="font-semibold text-lg">
            {item.name}
          </h3>

          <p className="text-orange-500 font-medium">
            ₹{item.price}
          </p>
        </div>

      </div>

      <div className="flex items-center gap-3">

        <button
          onClick={() => dispatch(decreaseQuantity(item.id))}
          className="w-8 h-8 bg-gray-200 rounded"
        >
          -
        </button>

        <span className="font-semibold">
          {item.quantity}
        </span>

        <button
          onClick={() => dispatch(increaseQuantity(item.id))}
          className="w-8 h-8 bg-gray-200 rounded"
        >
          +
        </button>

        <button
          onClick={() => dispatch(removeFromCart(item.id))}
          className="ml-4 text-red-500 hover:text-red-700"
        >
          Remove
        </button>

      </div>

    </div>
  );
}

export default CartItem;