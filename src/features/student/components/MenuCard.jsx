import { useDispatch } from "react-redux";
import { addToCart } from "../../../store/cartSlice";
import AvailabilityBadge from "./AvailabilityBadge";

function MenuCard({ item }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(item));
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">

      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-5">

        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">
            {item.name}
          </h3>

          <AvailabilityBadge available={item.available} />
        </div>

        <p className="text-gray-500 mb-3">
          {item.description}
        </p>

        <div className="flex justify-between items-center">

          <span className="text-lg font-bold text-orange-500">
            ₹{item.price}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={!item.available}
            className={`px-4 py-2 rounded-lg font-medium ${
              item.available
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {item.available ? "Add to Cart" : "Unavailable"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default MenuCard;