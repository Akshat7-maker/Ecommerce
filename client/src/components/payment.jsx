import CartPage from '@/pages/CartPage'
import React, { useState , useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import useLoader from '../customHooks/loader'
import api from '@/api/api'
import Loader from './Loader'
import { myCartActions } from '../store/myCartSlice'
import toast from 'react-hot-toast'
import { API } from '@/api/api'





export default function PaymentPage() {

    // const {cartItems, totalAmount, totalQuantity, shippingInfo} = useSelector(state => state.cart)
    const {shippingInfo} = useSelector(state => state.cart)

    // const location = useLocation()

    const {user} = useSelector(state => state.auth)
    const {name, email} = user
    const {cart} = useSelector(state => state.myCart)
    const dispatch = useDispatch()
    const {cartItems=[], totalAmount=0, totalQuantity=0} = cart || {}

    const {loading, error, withLoader} = useLoader()

    // fetch cart from db
    const getCart = async () => {
        await withLoader(async () => {
            const cart = await api.getCart(user._id);
            console.log("cart ", cart);
            if (cart) {
                dispatch(myCartActions.setCart(cart));
            }
        });
    };

    // reset cart after payment
    const resetCart = async () => {
        await withLoader(async () => {
            const cart = await api.resetCart(user._id);
            console.log("cart ", cart);
            if (cart) {
                dispatch(myCartActions.setCart(cart));
            }
        });
    };


    const navigate = useNavigate()

    // const shippingInfo = location.state



    const orderItems = cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price,
    }));

    console.log(orderItems);

    const handlePayment = async () => {
        // Handle payment logic here
        try {
            // create order in backend
            const { data } = await API.post('payments/create-order', {
                amount: totalAmount,
                currency: 'INR',
            })
            const { order } = data

            // redirect user to razorpay checkout page
            const options = {
                key: "rzp_test_FJ1wrNgR4uhcS2",
                amount: order.amount,
                currency: order.currency,
                name: "e-commerce",
                description: "Test payment",
                order_id: order.id,
                // callback_url: "http://localhost:8000/api/v1/payments/verify-payment",
                handler: async(response)=>{
                   // This function executes when the payment is successful
                   alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                   const paymentDetails = {
                    payment_id: response.razorpay_payment_id,
                    order_id: response.razorpay_order_id,
                    signature: response.razorpay_signature,
                  };

                  try {
                    // 1. check payment status in backend
                    const { data } = await API.post('/api/v1/payments/verify-payment', paymentDetails);
                    console.log( "data",data);
                    const { success } = data;
                    console.log("success",success);
                    if (!success) {
                        throw new Error('Payment verification failed');
                      // 2. if payment is successful, create order in backend
                      
                    }else{
                        // 3. if payment is successful, create order in backend
                        console.log({
                            paymentDetails,
                            shippingInfo,
                            orderItems,
                            totalAmount,
                            totalQuantity,
                            paymentMethod : 'online',
                            paymentStatus : 'completed',
                            user: user._id
                          });
                        const { data } = await API.post('/api/v1/orders/create-order', {
                            paymentDetails,
                            shippingInfo,
                            orderItems,
                            totalAmount,
                            totalQuantity,
                            paymentMethod : 'online',
                            paymentStatus : 'completed',
                            user: user._id
                          });

                          console.log("data",data);
                          const { data:order } = data;

                          // 4. redirect user to order page
                          // if(order) navigate(`/order/${order._id}`)
                          if(order) {
                            resetCart();
                            navigate(`/order-summary/${order._id}`)
                          }

                          // console.log(order);
                    }
                    
                  } catch (error) {
                    console.log(error);
                    
                  }


        
                },
                prefill: {
                  name: name,
                  email: email,
                  contact: "8279562786"
                },
                theme: {
                  color: "#3399cc"
                }
              }
              const razorpay = new window.Razorpay(options);
              razorpay.on('payment.failed', (response) => {
                console.error('Payment failed:', response.error);
                alert('Payment failed. Reason: ' + response.error.description);
                // toast.error('Payment failed. Reason: ' + response.error.description);
                navigate('/payment')
                // Optional: Redirect user to retry payment
            });
              razorpay.open();


        } catch (error) {
          // setError(error.message);
          
          console.log(error);
        alert('Unable to initiate payment. Please try again later.');
        navigate('/')
        }
    }

    
    useEffect(() => {
      if(user?._id) getCart();
    },[user])
    
    if(loading) return <Loader />
    if(error) return <div>{error}</div>
    return (

    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Itmes</h2>
        <div className="space-y-4">
          {cartItems?.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-gray-200 py-4">
              <div className="flex items-center">
                <img src={item.productId.images.coverPic} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-gray-500">₹{item.price.toFixed(2)} each</p>
                </div>
              </div>
              <div className="text-gray-700">
                Quantity: {item.quantity}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <div className="flex justify-between items-center border-t border-gray-200 pt-4">
            <span className="text-lg font-medium text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900">₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-8">
          <button
            onClick={handlePayment}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  </div>
      
  )
}