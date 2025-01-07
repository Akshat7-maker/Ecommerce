import React, { useEffect, useState } from "react";
import Card from "./AdminDashboardUi.jsx/Card";
import axios from "axios";
import useLoader from "@/customHooks/loader";
import BarChart from "./AdminDashboardUi.jsx/Charts";
import { DoughnutChart } from "./AdminDashboardUi.jsx/Charts";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const { loading, error, withLoader } = useLoader();
  const [orders, setOrder] = useState([]);
  const today = new Date();

  // get last six months
  const lastSixMonths = [];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let i = 0; i <= 5; i++) {
    const month = (today.getMonth() - i + 12) % 12;
    lastSixMonths.unshift(months[month]);
  }

  // call api to get dashboard stats
  const getDashboardStats = async () => {
    await withLoader(async () => {
      const { data } = await axios.get(
        "http://localhost:8000/api/v1/stats/get-all-stats"
      );
      // console.log(data);
      if (!data) {
        return;
      }
      const { data: stats } = data;
      setStats(stats);
    });
  };

  const getRecentOrders = async () => {
    await withLoader(async () => {
      const { data } = await axios.get("http://localhost:8000/api/v1/orders/get-recent-orders-of-admin");
      // console.log(data);
      if (!data) {
        return;
      }
      const { data: orders } = data;
      setOrder(orders);
    });
  };

  useEffect(() => {
    getDashboardStats();
    getRecentOrders();
  }, []);

  const myarr = new Array(4).fill(0);

  const cardData = [
    {
      heading: "Users",
      count: stats?.count?.users,
      percentage: stats?.changePercentage?.user,
    },
    {
      heading: "Orders",
      count: stats?.count?.orders,
      percentage: stats?.changePercentage?.order,
    },
    {
      heading: "Products",
      count: stats?.count?.products,
      percentage: stats?.changePercentage?.product,
    },
    {
      heading: "Revenue",
      count: stats?.count?.revenue,
      percentage: stats?.changePercentage?.revenue,
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-10">
      {/* cards */}
      {cardData?.map((item, index) => (
        <div key={index} className="col-span-3">
          <Card
           {...item}
          />
        </div>
      ))}
      {/* barChart */}
      <div className="col-span-9">
        <BarChart
          labels={lastSixMonths}
          label_1={"Orders"}
          data1={stats?.chart?.order || []}
          label_2={"Revenue"}
          data2={stats?.chart?.revenue || []}
        />
      </div>

      {/* Inventory */}
      <div className="col-span-3 bg-white p-4">
        <h2 className="font-bold text-2xl text-center">INVENTORY STATUS</h2>
        {stats?.modifiedCategoryFormmat?.map((item, index) => {
          const [heading, value] = Object.entries(item)[0];
          return (
            <div key={index}>
              <h3 className="font-bold text-lg mt-2 ">{heading}</h3>

              <div class="w-full  bg-gray-100 rounded-3xl h-3.5 ">
                <div
                  className="bg-green-600 h-3.5 rounded-3xl text-xs text-white text-center"
                  role="progressbar"
                  aria-valuenow="50"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ width: `${Math.floor(value)}%` }}
                >
                  {Math.floor(value)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* gender ratio */}
      <div className="col-span-3 bg-slate-600 p-6">
        <h2 className="font-bold text-2xl text-center text-white">GENDER RATIO</h2>
        <DoughnutChart
          labels={["Male", "Female"]}
          data={[
            stats?.genderRatio?.male || 0,
            stats?.genderRatio?.female || 0,
          ]}
          color={['rgb(54, 162, 235)',
          'rgb(255, 99, 132)',]}
        /> 
      </div>

      {/* latest transactions */}
      <div className="col-span-9 bg-white p-4">
        <h2 className="font-bold text-2xl text-center">LATEST TRANSACTIONS</h2>
        <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                  Order ID
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                  Order Amount
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                  Payment Method
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                  Payment Status
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                  Order Date
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                  Order Status
                </th>
                
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr
                  key={order?._id || Math.random()}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-600 border-b">
                    {order?._id || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-b">
                    ₹{order?.totalAmount || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-b">
                    {order?.paymentMethod || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-b">
                    {order?.paymentStatus || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-b">
                    {new Date(order?.orderDate).toLocaleDateString() || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-b">
                    {order?.orderDeliveryStatus || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}

export default AdminDashboard;


// {myarr.map((item, index) => (
//   <div key={index} className="col-span-2">
//     <div className="bg-gray-100 p-4 rounded-lg">
//       <h3 className="font-bold text-lg">Order ID: 12345</h3>
//       <p className="text-gray-600">Date: 2023-08-01</p>
//       <p className="text-gray-600">Amount: $100</p> <p className="text-gray-600">Status: Delivered</p>
//     </div>
//   </div>
// ))}

{/* <div className="grid grid-cols-6 gap-4">
          {myarr.map((item, index) => (
            <div key={index} className="col-span-2">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold text-lg">Order ID: 12345</h3>
                <p className="text-gray-600">Date: 2023-08-01</p>
                <p className="text-gray-600">Amount: $100</p> <p className="text-gray-600">Status: Delivered</p>
              </div>
            </div>
          ))}  
        </div> */}