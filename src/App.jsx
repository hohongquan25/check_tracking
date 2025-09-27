import {
  CheckCircleIcon,
  CircleStackIcon,
  MapIcon,
  MapPinIcon,
} from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";

export default function App() {
  const [showDetails, setShowDetails] = useState(false);
  console.log("🚀 ~ App ~ showDetails:", showDetails);
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [detailOrder, setOrderDetails] = useState({});
  const steps = [
    { id: 1, label: "Confirmed", date: "Sep 23" },
    { id: 2, label: "On its way", date: "Sep 23" },
    { id: 3, label: "Out for delivery", date: "Sep 24" },
    { id: 4, label: "Delivered", date: "Sep 24" },
  ];
  const [currentStep, setCurrentStep] = useState(1);

  // Hàm map shipment_status sang stepId
  const getStepFromStatus = (status) => {
    switch (status) {
      case "in_transit":
        return 2;
      case "delivered": 
        return 3;
      case "complete":
        return 4;
      default:
        return 1; // mặc định hoặc rỗng
    }
  };

  useEffect(() => {
    const status = detailOrder?.fulfillments?.[0]?.shipment_status;
    setCurrentStep(getStepFromStatus(status));
  }, [detailOrder]);

  console.log(detailOrder.fulfillments?.[0]?.shipment_status);

  const handleTrack = async (e) => {
    e.preventDefault();

    let newErrors = {};

    // ✅ Validate email
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // ✅ Validate order number
    if (!orderId.trim()) {
      newErrors.orderId = "Order number is required";
    }

    setErrors(newErrors);

    // Nếu không có lỗi thì submit
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const res = await fetch(
          "https://api.numaquitas.com/v1/shopify/track-order?",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderNumber: orderId,
              email: email,
              configId: "68d6a9c6240e94756f608b0c",
            }),
          }
        );

        const data = await res.json();

        if (res.ok && data) {
          // ✅ API thành công
          setOrderDetails(data);
          console.log(data?.orderNumber);
          setShowDetails(true);
        } else {
          // ❌ API trả về lỗi hoặc không có dữ liệu
          alert("Order not found. Please check your email and order number.");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setShowDetails(false);
    setOrderId("");
    setEmail("");
  };

  const Circle = () => {
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>;
  };

  return (
    <div className="min-h-fit flex items-center justify-center bg-gray-50 p-8">
      {!showDetails ? (
        // ====== FORM INPUT ======
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
          <>
            <h1 className="text-2xl font-bold text-center mb-4">
              Track your order
            </h1>
            <h6 className="text-center text-xs mb-4">
              If you don’t have an account yet, you can still track your order
              status.
            </h6>
            <form onSubmit={handleTrack} className="space-y-4">
              {/* Email */}
              <div>
                <h5 className="text-center font-bold text-xs mb-1">
                  Email address
                </h5>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Order number */}
              <div>
                <h5 className="text-center font-bold text-xs mb-1">
                  Order number
                </h5>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    errors.orderId ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.orderId && (
                  <p className="mt-1 text-sm text-red-500">{errors.orderId}</p>
                )}
              </div>

              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 mt-4 rounded-2xl font-semibold transition border ${
                    loading
                      ? "bg-gray-200 text-gray-400 border-gray-400 cursor-not-allowed"
                      : "bg-white text-black border-black hover:bg-gray-200"
                  }`}
                >
                  {loading ? "Loading..." : "View order status"}
                </button>
              </div>
            </form>
          </>
        </div>
      ) : (
        // ====== ORDER DETAILS ======
        <>
          <div className="min-h-fit bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Nút Back */}

              {/* Header */}
              <div className="  flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="flex items-center text-sm text-blue-600 hover:underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                    />
                  </svg>
                </button>
                <div>
                  <h1 className="text-xl font-semibold">
                    Order {detailOrder?.order_number}
                  </h1>
                  <p className="text-gray-500 text-sm">Confirmed Sep 23</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Left Column - chiếm 3 phần */}
                <div className="md:col-span-3 space-y-5">
                  {/* Shipping Status */}
                  <div className="bg-white border-white rounded-lg p-4 shadow-sm">
                    <div className="ml-2">
                      <h2 className="font-semibold mb-2">Arrived Sep 24</h2>
                      <p className="text-sm text-black-600 ">
                        UPS{" "}
                        <a
                          href={detailOrder?.fulfillments?.[0]?.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {detailOrder?.fulfillments?.[0]?.tracking_number}
                        </a>
                      </p>
                    </div>

                    {/* Timeline */}
                    <div className="ml-2 mt-4">
                      {steps.map((step, index) => (
                        <div
                          key={step.id}
                          className="relative flex items-start"
                        >
                          {/* Dot + Line */}
                          <div className="flex flex-col items-center mr-4">
                            {/* Container cố định size */}
                            <div className="w-5 h-5 flex items-center justify-center">
                              {step.id === currentStep ? (
                                <MapPinIcon className="w-5 h-5 text-green-500" />
                              ) : (
                                <span className="w-2 h-2 bg-gray-400 rounded-full block"></span>
                              )}
                            </div>

                            {/* Line nối xuống */}
                            {index !== steps.length - 1 && (
                              <div className="h-10 w-px border-l-2 border-dotted border-gray-300"></div>
                            )}
                          </div>

                          {/* Nội dung */}
                          <div className="pb-6">
                            <p
                              className={`text-sm font-medium ${
                                step.id === currentStep
                                  ? "text-green-600"
                                  : "text-gray-700"
                              }`}
                            >
                              {step.label}
                            </p>
                            {/* <p className="text-xs text-gray-500">{step.date}</p> */}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* <button className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition">
                      Track order with Shop
                    </button> */}
                  </div>

                  {/* News & Offers */}
                  {/* <div className="bg-white border-white rounded-lg p-4 shadow-sm">
                    <h2 className="font-semibold mb-2">News and offers</h2>
                    <p className="text-sm text-gray-600 mb-2">
                      You’ll receive marketing emails. You can unsubscribe at
                      any time.
                    </p>
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        className="w-4 h-4 border-gray-300"
                      />
                      <span>Email me with news and offers</span>
                    </label>
                  </div> */}

                  {/* Contact & Payment Info */}
                  <div className="bg-white border-white rounded-lg p-4 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h3 className="font-semibold mb-2">
                        Contact information
                      </h3>
                      <p>
                        {detailOrder?.shipping_address?.first_name}{" "}
                        {detailOrder?.shipping_address?.last_name}
                      </p>
                      <p className="text-gray-600">{detailOrder.email}</p>

                      <h3 className="font-semibold mt-4 mb-2">
                        Shipping address
                      </h3>
                      <p>
                        {detailOrder?.shipping_address?.first_name}{" "}
                        {detailOrder?.shipping_address?.last_name}
                      </p>
                      <p>{detailOrder?.shipping_address?.address1}</p>
                      <p>
                        {detailOrder?.shipping_address?.city}{" "}
                        {detailOrder?.shipping_address?.province}{" "}
                        {detailOrder?.shipping_address?.zip}
                      </p>
                      <p>{detailOrder?.shipping_address?.country}</p>

                      <h3 className="font-semibold mt-4 mb-2">
                        Shipping method
                      </h3>
                      <p>Economy</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Payment</h3>
                      <p>Visa •••• 4242</p>
                      <p>$27.40 USD</p>
                      <p className="text-gray-600">Sep 23</p>

                      <h3 className="font-semibold mt-4 mb-2">
                        Billing address
                      </h3>
                      <p>
                        {detailOrder?.shipping_address?.first_name}{" "}
                        {detailOrder?.shipping_address?.last_name}
                      </p>
                      <p>{detailOrder?.shipping_address?.address1}</p>
                      <p>
                        {detailOrder?.shipping_address?.city}{" "}
                        {detailOrder?.shipping_address?.province}{" "}
                        {detailOrder?.shipping_address?.zip}
                      </p>
                      <p>{detailOrder?.shipping_address?.country}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - chiếm 2 phần */}
                <div className="md:col-span-2 bg-white border-white rounded-lg p-4 shadow-sm space-y-5 h-fit">
                  <div className="flex items-center space-x-3 ">
                    <img
                      src="https://satoshi.vn/cdn/shop/files/24AT001DEN.jpg?v=1708707178"
                      alt="Product"
                      className="w-16 h-16 border rounded"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        "The Heartbeat of America" Red Chevy T-shirt
                      </p>
                      <p className="text-sm text-gray-600">Black / S</p>
                      <p className="text-sm text-red-500 line-through">
                        $25.00
                      </p>
                      <p className="text-sm font-semibold">$22.50</p>
                    </div>
                  </div>

                  <div className="border-t pt-4 text-sm space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>$22.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>$4.90</span>
                    </div>
                    <div className="flex justify-between font-semibold mt-2 text-xl ">
                      <span>Total</span>
                      <span>USD $27.40</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
