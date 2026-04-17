import React from "react";
import { useNavigate } from "react-router-dom";

const Upgrade = () => {
  const navigate = useNavigate();

  const handleSelectPackage = (pkg) => {
    navigate("/payment", { state: pkg });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e8ff] via-[#e0f2fe] to-[#fde68a] px-6 py-20">

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-900">
          Choose Your Dalali Package
        </h1>
        <p className="mt-6 text-lg text-gray-700">
          Upgrade your account and unlock powerful tools to grow your property business.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="mt-20 grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">

        {/* Primary */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition">
          <div>
            <h2 className="text-2xl font-semibold text-blue-900">
              Primary Package
            </h2>
            <p className="text-4xl font-bold mt-4 text-gray-900">
              Tsh 5,000 <span className="text-lg text-gray-600">/month</span>
            </p>

            <ul className="mt-8 space-y-4 text-gray-700">
              <li>✔ 5 property listings</li>
              <li>✔ Basic support</li>
              <li>✔ Email notifications</li>
              <li>✔ Booking management</li>
              <li>✔ Standard visibility</li>
            </ul>
          </div>

          <button
            onClick={() =>
              handleSelectPackage({
                name: "Primary",
                price: 5000,
              })
            }
            className="mt-10 w-full py-3 rounded-full bg-blue-900 text-white font-semibold hover:bg-blue-800"
          >
            Subscribe
          </button>
        </div>

        {/* Secondary */}
        <div className="relative bg-white rounded-3xl shadow-2xl p-8 flex flex-col justify-between border-2 border-blue-900 scale-105">
          <div className="absolute top-0 right-0 bg-blue-900 text-white text-sm px-4 py-1 rounded-bl-2xl">
            Most Popular
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-900">
              Secondary Package
            </h2>
            <p className="text-4xl font-bold mt-4 text-gray-900">
              Tsh 15,000 <span className="text-lg text-gray-600">/month</span>
            </p>

            <ul className="mt-8 space-y-4 text-gray-700">
              <li>✔ 20 listings</li>
              <li>✔ Priority support</li>
              <li>✔ SMS + Email alerts</li>
              <li>✔ Analytics dashboard</li>
              <li>✔ Enhanced visibility</li>
            </ul>
          </div>

          <button
            onClick={() =>
              handleSelectPackage({
                name: "Secondary",
                price: 15000,
              })
            }
            className="mt-10 w-full py-3 rounded-full bg-blue-900 text-white font-semibold hover:bg-blue-800"
          >
            Subscribe
          </button>
        </div>

        {/* Premium */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition">
          <div>
            <h2 className="text-2xl font-semibold text-blue-900">
              Premium Package
            </h2>
            <p className="text-4xl font-bold mt-4 text-gray-900">
              Tsh 50,000 <span className="text-lg text-gray-600">/month</span>
            </p>

            <ul className="mt-8 space-y-4 text-gray-700">
              <li>✔ Unlimited listings</li>
              <li>✔ VIP support</li>
              <li>✔ Featured properties</li>
              <li>✔ Advanced analytics</li>
              <li>✔ Dedicated manager</li>
            </ul>
          </div>

          <button
            onClick={() =>
              handleSelectPackage({
                name: "Premium",
                price: 50000,
              })
            }
            className="mt-10 w-full py-3 rounded-full bg-blue-900 text-white font-semibold hover:bg-blue-800"
          >
            Subscribe
          </button>
        </div>

      </div>
    </div>
  );
};

export default Upgrade;