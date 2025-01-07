import { useEffect, useState } from "react"
import { ArrowRightIcon, ShoppingBagIcon, CreditCardIcon, HeartIcon, BellIcon, MapPinIcon, UserIcon, CogIcon } from 'lucide-react'
import useLoader from "@/customHooks/loader"
import { useSelector } from "react-redux"
import axios from "axios"
import { useNavigate } from "react-router-dom"


export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("orders")
  const { loading, error, withLoader } = useLoader()
  const user = useSelector(state => state.auth.user)
  const [orders, setOrders] = useState([])

  const navigate = useNavigate()
  // console.log(user)


  // const [user] = useState({
  //   name: "Sarah Johnson",
  //   email: "sarah.johnson@example.com",
  //   avatar: "/placeholder.svg?height=100&width=100",
  //   memberSince: "March 2023",
  //   orders: 12,
  //   wishlist: 5,
  //   recentOrders: [
  //     {
  //       id: "#12345",
  //       date: "Nov 15, 2023",
  //       status: "Delivered",
  //       total: "$239.00",
  //       items: 3,
  //     },
  //     {
  //       id: "#12344",
  //       date: "Nov 12, 2023",
  //       status: "In Transit",
  //       total: "$159.00",
  //       items: 2,
  //     },
  //     {
  //       id: "#12343",
  //       date: "Nov 5, 2023",
  //       status: "Delivered",
  //       total: "$349.00",
  //       items: 4,
  //     },
  //   ],
  // })

  const getTotalOrders = async() => {

    await withLoader(async() => {
    const {data} = await axios.get(`http://localhost:8000/api/v1/orders/get-recent-orders/${user._id}`)

    const {data: orders} = data
    console.log(orders)

    setOrders(orders)
    })
    
  }

  useEffect(() => {
    getTotalOrders()
    
  }, [user])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!user) {
    navigate("/login")
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 flex-shrink-0 sm:h-32 sm:w-32">
            <img
              src={user?.coverPic || "/placeholder.svg?height=100&width=100"}
              alt={user?.name || "User"}
              className="h-full w-full rounded-full border-4 border-white object-cover shadow-lg"
            />
            <button className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-1.5 text-white shadow-sm">
              <UserIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{user.name}</h1>
            <p className="text-gray-600">{user?.email || "example@example.com"}</p>
            <p className="text-sm text-gray-500">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-4">
            <button 
            onClick={()=> navigate("/edit-profile")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Edit Profile
            </button>
            <button 
            onClick={()=> navigate("/my-orders")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">

              View Orders
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center gap-4">
              <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{orders?.totalOrders}</p>
                <p className="text-sm text-gray-500">Total Orders</p>
              </div>
            </div>
          </div>
          {/* <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center gap-4">
              <CreditCardIcon className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-500">Saved Cards</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center gap-4">
              <HeartIcon className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{user.wishlist}</p>
                <p className="text-sm text-gray-500">Wishlist Items</p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex space-x-4 border-b border-gray-200">
          {["orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rounded-lg bg-white p-6 shadow">
          {activeTab === "orders" && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Orders</h3>
              <div className="divide-y divide-gray-200">
                {orders?.orders?.map((order) => (
                  <div key={order.id} className="flex items-center gap-4 py-4">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Order {order?._id}</p>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900"> ₹{order.totalAmount}</p>
                      <p className="text-sm text-gray-500">{order?.orderItems?.length} items</p>
                    </div>
                    <div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600">
                        {order?.orderDeliveryStatus}
                      </span>
                    </div>
                    {/* <ArrowRightIcon className="h-5 w-5 text-gray-400" /> */}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* {activeTab === "personal" && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">+1 (555) 000-0000</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">New York, USA</p>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Add New Card
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Visa ending in 1234</p>
                    <p className="text-sm text-gray-500">Expires 12/24</p>
                  </div>
                  <button className="text-sm text-gray-600 hover:text-gray-900">Edit</button>
                </div>
                <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Mastercard ending in 5678</p>
                    <p className="text-sm text-gray-500">Expires 08/25</p>
                  </div>
                  <button className="text-sm text-gray-600 hover:text-gray-900">Edit</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                  <BellIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Notifications</p>
                    <p className="text-sm text-gray-500">Manage notification preferences</p>
                  </div>
                </div>
                <button className="text-sm text-gray-600 hover:text-gray-900">Configure</button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Addresses</p>
                    <p className="text-sm text-gray-500">Manage delivery addresses</p>
                  </div>
                </div>
                <button className="text-sm text-gray-600 hover:text-gray-900">Manage</button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                  <CogIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Account Settings</p>
                    <p className="text-sm text-gray-500">Manage account settings</p>
                  </div>
                </div>
                <button className="text-sm text-gray-600 hover:text-gray-900">Edit</button>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}


