function AvailabilityBadge({ available }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        available
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {available ? "Available" : "Unavailable"}
    </span>
  );
}

export default AvailabilityBadge;