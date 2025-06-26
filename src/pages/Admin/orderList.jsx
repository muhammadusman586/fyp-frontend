import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import {
  useGetOrdersQuery,
  useDeliverOrderMutation,
} from "../../redux/api/orderApiSlice";
import { toast } from "react-toastify";
import { CheckCircle, Clock, Eye, CheckSquare } from "lucide-react";

const OrderList = () => {
  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useGetOrdersQuery(
    {},
    {
      // Polling interval for real-time updates (every 15 seconds)
      pollingInterval: 15000,
      refetchOnMountOrArgChange: true,
    }
  );
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const confirmOrderHandler = async (orderId) => {
    // Show loading toast
    const toastId = toast.loading("Confirming order...");

    try {
      // Mark the order as delivered
      await deliverOrder(orderId).unwrap();

      // Immediate refetch to update the UI
      await refetch();

      // Update toast to success
      toast.update(toastId, {
        render: "Order confirmed successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Force another refetch after a delay to ensure data is completely synchronized
      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (err) {
      // Update toast to show error
      toast.update(toastId, {
        render: err?.data?.message || "Failed to confirm order",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="error">{error?.data?.message || error.error}</Message>
    );

  return (
    <div className="w-full pl-[5%] md:pl-[6%] lg:pl-[8%] xl:pl-[16%] pr-4 py-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Order Management
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Paid
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Delivered
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <img
                      src={order.orderItems[0].image || "/placeholder.svg"}
                      alt={order._id}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className="truncate max-w-[100px] inline-block">
                      {order._id}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.user ? order.user.username : "N/A"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {order.isPaid ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircle size={14} className="mr-1" /> Paid
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        <Clock size={14} className="mr-1" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {order.isDelivered ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircle size={14} className="mr-1" /> Delivered
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        <Clock size={14} className="mr-1" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link to={`/order/${order._id}`}>
                        <button className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors w-full justify-center">
                          <Eye size={14} className="mr-1" /> Details
                        </button>
                      </Link>
                      {!order.isDelivered && (
                        <button
                          onClick={() => confirmOrderHandler(order._id)}
                          disabled={loadingDeliver}
                          className={`inline-flex items-center px-3 py-1.5 rounded-md transition-colors w-full justify-center ${
                            loadingDeliver
                              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          <CheckSquare size={14} className="mr-1" />
                          {loadingDeliver ? "Processing..." : "Confirm"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
