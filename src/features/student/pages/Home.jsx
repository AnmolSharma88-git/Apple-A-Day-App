import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-[#fff8ef]">

      {/* HERO SECTION */}
      <section className="text-center px-6 pt-16 pb-14">

        <h1 className="text-5xl font-bold text-gray-800">
          Welcome to Apple A Day ☕
        </h1>

        <p className="text-lg text-gray-600 mt-5">
          Order your favourite food from the campus café
          without standing in long queues.
        </p>

        <Link
          to="/menu"
          className="inline-block mt-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg transition"
        >
          Explore Menu
        </Link>

      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 pb-16">

        <div className="grid md:grid-cols-3 gap-6">

          {/* EASY ORDERING */}
          <Link
            to="/menu"
            className="group bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center hover:shadow-lg hover:-translate-y-1 transition duration-300"
          >
            <div className="text-5xl mb-5 group-hover:scale-110 transition">
              🍔
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Easy Ordering
            </h2>

            <p className="text-gray-500 mt-3">
              Order food directly from your phone.
            </p>

            <div className="mt-5 text-orange-500 font-semibold">
              Order Now →
            </div>
          </Link>

          {/* LIVE ORDER STATUS */}
          <Link
            to="/orders"
            className="group bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center hover:shadow-lg hover:-translate-y-1 transition duration-300"
          >
            <div className="text-5xl mb-5 group-hover:scale-110 transition">
              ⏱️
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Live Order Status
            </h2>

            <p className="text-gray-500 mt-3">
              Track your order from preparation to delivery.
            </p>

            <div className="mt-5 text-orange-500 font-semibold">
              Track Order →
            </div>
          </Link>

          {/* CAMPUS DELIVERY */}
          <Link
            to="/checkout"
            state={{ orderType: "delivery" }}
            className="group bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center hover:shadow-lg hover:-translate-y-1 transition duration-300"
          >
            <div className="text-5xl mb-5 group-hover:scale-110 transition">
              🚴
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Campus Delivery
            </h2>

            <p className="text-gray-500 mt-3">
              Get your food delivered to your campus location.
            </p>

            <div className="mt-5 text-orange-500 font-semibold">
              Get Delivery →
            </div>
          </Link>

        </div>

      </section>

      {/* CABIN BOOKING */}
      <section className="max-w-6xl mx-auto px-6 pb-16">

        <Link
          to="/cabin-booking"
          className="block bg-white border border-gray-100 rounded-2xl shadow-sm p-7 hover:shadow-lg transition"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">

            <div className="flex items-center gap-5">

              <div className="text-5xl">
                🛋️
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Book Apple A Day Cabin
                </h2>

                <p className="text-gray-500 mt-1">
                  Enjoy your food in our private cabin.
                </p>
              </div>

            </div>

            <span className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold">
              Book Cabin →
            </span>

          </div>
        </Link>

      </section>

    </div>
  );
}

export default Home;