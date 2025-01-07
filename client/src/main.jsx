import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App  from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Login from './components/Login'
import SignUp from './components/SignUp'
import SingleProductInfo from './components/SingleProductInfo'
import CartPage from './pages/CartPage'
import ShippingPage from './components/Shipping'
import PaymentPage from './components/payment'
import HomeLayout from './layouts/HomeLayout'
import MyOrderPage from './pages/MyOrderPage'
import OrderSummary from './components/OrderSummary'
import AdminLayout from './pages/AdminPage/AdminLayout'
import AdminOrderTable from './components/Admin/AdminOrderTable'
import AdminProducts from './components/Admin/AdminProducts'
import AdminAddProductForm from './components/Admin/AdminAddProductForm'
import ShowDetailsOfProduct from './components/Admin/ShowDetailsOfProduct'
import AdminUpdateProductForm from './components/Admin/AdminUpdateProductForm'
import AdminDashboard from './components/Admin/AdminDashboard'
import AllProductsPage from './pages/AllProductsPage'
import UserProfile from './components/UserProfile'
import EditProfile from './components/EditProfile'
import AdminCharts from './components/Admin/AdminCharts'
import AdminUserTable from './components/Admin/AdminUserTable'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<HomeLayout />} />
      <Route path='user-profile' element={<UserProfile />} />
      <Route path='about-us' element={<AboutUs />} />
      <Route path='contact-us' element={<ContactUs />} />
      <Route path='edit-profile' element={<EditProfile />} />
      <Route path="all-products" element={<AllProductsPage />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="product-info/:productId" element={<SingleProductInfo />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="shipping" element={<ShippingPage />} />
      <Route path="payment" element={<PaymentPage />} />
      <Route path="my-orders" element={<MyOrderPage />} />
      <Route path='order-summary/:orderId' element={<OrderSummary />} />

      {/* admin routes */}
      <Route path='admin-panel' element={<AdminLayout />}>
      <Route path='' element={<AdminDashboard />} />
      <Route path='users' element={<AdminUserTable />} />
      <Route path='orders' element={<AdminOrderTable />} />
      <Route path='charts' element={<AdminCharts />} />
      <Route path='products' element={<AdminProducts />} />
      <Route path='add-product' element={<AdminAddProductForm />} />
      <Route path='show-product-details/:productId' element={<ShowDetailsOfProduct />} />
      <Route path='update-product/:productId' element={<AdminUpdateProductForm />} />
      
      </Route>



      
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
