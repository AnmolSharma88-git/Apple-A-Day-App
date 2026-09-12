import { Routes, Route } from "react-router-dom";
import Navbar from "./components/user/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/menu" element={<h1>Menu</h1>} />
        <Route
          path="/cabin-booking"
          element={<h1>Cabin Booking</h1>}
        />
        <Route
          path="/notifications"
          element={<h1>Notifications</h1>}
        />
        <Route path="/orders" element={<h1>Orders</h1>} />
        <Route path="/profile" element={<h1>Profile</h1>} />
        <Route path="/cart" element={<h1>Cart</h1>} />
      </Routes>
    </>
  );
}

export default App;