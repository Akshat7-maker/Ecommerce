import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0)

  const payNow = async () => {


    try {
      // 1.create order in backend
      const { data } = await axios.post('https://ecommerce-k2yn.onrender.com/api/v1/payments/create-order', {
        amount: 1000,
        currency: 'INR',

      })

      const { order } = data

      // 2. redirect user to razorpay checkout page
      const options = {
        key: "rzp_test_FJ1wrNgR4uhcS2",
        amount: order.amount,
        currency: order.currency,
        name: "e-commerce",
        description: "Test payment",
        order_id: order.id,
        callback_url: "https://ecommerce-k2yn.onrender.com/api/v1/payments/verify-payment",
        // handler: (response)=>{
        //    // This function executes when the payment is successful
        //    alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

        // },
        prefill: {
          name: "Gaurav Kumar",
          email: "0tH9o@example.com",
          contact: "8279562786"
        },
        theme: {
          color: "#3399cc"
        }
      }
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      razorpay.on('payment.failed', function (response) {
        const errorMessage = `
        Error Code: ${response.error.code}
        Description: ${response.error.description}
        Source: ${response.error.source}
        Step: ${response.error.step}
        Reason: ${response.error.reason}
        Order ID: ${response.error.metadata.order_id}
        Payment ID: ${response.error.metadata.payment_id}
        `;
        alert('Payment Failed:\n' + errorMessage);
        console.error('Payment Failed:', response);
      });
      } catch (error) {
      console.error('Payment Failed:', error.message);

    }



  }

  return (
    <>
      <button onClick={payNow}>
        payNow
      </button>


    </>
  )
}

export default App
