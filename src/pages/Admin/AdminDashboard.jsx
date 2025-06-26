import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import { DollarSign, Users, ShoppingBag, BarChart2 } from "lucide-react";
import {
  useGetOrdersQuery,
  useDeliverOrderMutation,
} from "../../redux/api/orderApiSlice";
import { toast } from "react-toastify";
import { CheckCircle, Clock, Eye, CheckSquare } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  // For OrderList functionality
  const {
    data: ordersList,
    isLoading: ordersLoading,
    error: ordersError,
    refetch,
  } = useGetOrdersQuery(
    {},
    {
      pollingInterval: 15000,
      refetchOnMountOrArgChange: true,
    }
  );
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const confirmOrderHandler = async (orderId) => {
    const toastId = toast.loading("Confirming order...");

    try {
      await deliverOrder(orderId).unwrap();
      await refetch();
      toast.update(toastId, {
        render: "Order confirmed successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (err) {
      toast.update(toastId, {
        render: err?.data?.message || "Failed to confirm order",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
        background: "transparent",
        foreColor: "#4b5563", // text color
      },
      tooltip: {
        theme: "light",
      },
      colors: ["#8b5cf6"], // purple-500
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#4b5563"],
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      title: {
        text: "Sales Trend",
        align: "left",
        style: {
          fontSize: "18px",
          fontWeight: "bold",
          color: "#1f2937",
        },
      },
      grid: {
        borderColor: "#e5e7eb",
        row: {
          colors: ["#f9fafb", "transparent"],
          opacity: 0.5,
        },
      },
      markers: {
        size: 5,
        colors: ["#8b5cf6"],
        strokeColors: "#ffffff",
        strokeWidth: 2,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: {
            fontSize: "14px",
            color: "#4b5563",
          },
        },
        labels: {
          style: {
            colors: "#4b5563",
          },
        },
      },
      yaxis: {
        title: {
          text: "Sales",
          style: {
            fontSize: "14px",
            color: "#4b5563",
          },
        },
        min: 0,
        labels: {
          style: {
            colors: "#4b5563",
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
        labels: {
          colors: "#4b5563",
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: ["#3b82f6"], // blue-500
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0.5,
          stops: [0, 100],
        },
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
          },
        },

        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <div
      className="min-h-screen py-6"
      style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
    >
      <div className="container mx-auto pl-[5%] md:pl-[6%] lg:pl-[8%] xl:pl-[16%] pr-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <BarChart2 className="mr-2 text-purple-500" size={28} />
            Dashboard Overview
          </h1>
        </div>

        <div className="flex flex-wrap gap-6 mb-8">
          {/* Sales Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg flex-1 min-w-[250px]">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-gray-600 font-medium">Total Sales</p>
                <h1 className="text-2xl font-bold text-gray-800">
                  {isLoading ? (
                    <Loader />
                  ) : (
                    `$${sales?.totalSales?.toFixed(2) || "0.00"}`
                  )}
                </h1>
              </div>
            </div>
          </div>

          {/* Customers Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg flex-1 min-w-[250px]">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <Users size={24} />
              </div>
              <div>
                <p className="text-gray-600 font-medium">Total Customers</p>
                <h1 className="text-2xl font-bold text-gray-800">
                  {loading ? <Loader /> : customers?.length || 0}
                </h1>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg flex-1 min-w-[250px]">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-gray-600 font-medium">Total Orders</p>
                <h1 className="text-2xl font-bold text-gray-800">
                  {loadingTwo ? <Loader /> : orders?.totalOrders || 0}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Recent Orders
          </h2>

          {/* Integrated OrderList */}
          <div className="w-full">
            {ordersLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : ordersError ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-600">
                {ordersError?.data?.message || "Error loading orders"}
              </div>
            ) : ordersList && ordersList.length > 0 ? (
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
                    {ordersList.slice(0, 5).map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <img
                            src={
                              order.orderItems[0].image || "/placeholder.svg"
                            }
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
                          {order.createdAt
                            ? order.createdAt.substring(0, 10)
                            : "N/A"}
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
                              <CheckCircle size={14} className="mr-1" />{" "}
                              Delivered
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
            ) : (
              <div className="bg-white rounded-lg p-6 text-center">
                <p className="text-gray-700">No orders found</p>
              </div>
            )}

            {ordersList && ordersList.length > 5 && (
              <div className="mt-4 text-center">
                <Link
                  to="/admin/orderlist"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-md transition-colors text-sm font-medium"
                >
                  View All Orders
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
