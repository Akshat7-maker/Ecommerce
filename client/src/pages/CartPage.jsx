import React, { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../store/cartSlice";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import Loader from "../components/Loader";
import useLoader from "../customHooks/loader";
import { myCartActions } from "../store/myCartSlice";
import toast from "react-hot-toast";

function CartPage() {
  const { user } = useSelector((state) => state.auth);
  // const [cart, setCart] = useState(null)
  // const [loading, setLoading] = useState(true)
  const { loading, error, withLoader } = useLoader();
  // const {cartItems, totalAmount, totalQuantity} = useSelector(state => state.cart)
  const { cart } = useSelector((state) => state.myCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const cartItems = useSelector(state => state.cart.cartItems)
  // const totalAmount = useSelector(state => state.cart.totalAmount)
  // const totalQuantity = useSelector(state => state.cart.totalQuantity)

  // const {cartItems, totalAmount, totalQuantity} = useSelector(state => state.cart)

  // // console.log(cartItems);

  // const dispatch = useDispatch()

  // const navigate = useNavigate()

  // const addToCart = (cartitem) => {
  //     dispatch( cartActions.addToCart({...cartitem, quantity: 1}))
  // }

  // const removeFromCart = (cartitem) => {
  //     dispatch( cartActions.removeFromCart(cartitem) )
  // }

  // const deleteFromCart = (cartitem) => {
  //     if(cartitem.quantity > 1){
  //         dispatch( cartActions.deleteFromCart(cartitem) )
  //     }

  // }

  const handleCheckout = () => {
    navigate("/shipping");
  };

  // call api to get cart
  const getCart = async () => {
    await withLoader(async () => {
      const cart = await api.getCart(user?._id);
      console.log("cart ", cart);
      if (cart) {
        dispatch(myCartActions.setCart(cart));
        
      }
    });
  };

  // add to cart
  const addToCart = async (productId, quantity) => {
    await withLoader(async () => {
      const cart = await api.addToCart( productId, quantity);
      console.log("added to cart ", cart);
      if (cart) {
        dispatch(myCartActions.setCart(cart));
        toast.success("Product added to cart");
        // getCart();
      }
    });
  };

  // remove from cart
  const removeFromCart = async (cartitem) => {
    await withLoader(async () => {
      const cart = await api.removeFromCart( cartitem);
      console.log("removed from cart ", cart);
      if (cart) {
        dispatch(myCartActions.setCart(cart));
        toast.success("Product removed from cart");
        // getCart();
      }
    });
  };

  // delete from cart
  const deleteFromCart = async (cartitem) => {
    await withLoader(async () => {
      const cart = await api.deleteFromCart( cartitem);
      console.log("deleted from cart ", cart);
      if (cart) {
        dispatch(myCartActions.setCart(cart));
        toast.success("Product deleted from cart");
        // getCart();
      }
    });
  };

  useEffect(() => {
    if (!user?._id) {
      toast.error("Please login first");
      navigate("/login");
    }
    getCart();
  }, [user?._id, dispatch]);

  

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
          <Loader fullScreen={true} text="Fetching cart..." />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-3xl font-bold text-red-600">{error}</h1>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
      </div>
    );
  }

  return (
    <>
      {cart.cartItems?.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
        </div>
      ) : (
        <div className=" h-screen">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <div className="">
            {cart?.cartItems?.map((item) => (
              <CartItem
                cartitem={item}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                deleteFromCart={deleteFromCart}
              />
            ))} 
          </div>
          {/* total amount and quantity */}

          {/* <div className="flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold">
              Total Amount: {cart.totalAmount}
            </h1>
            <h1 className="text-3xl font-bold">
              Total Quantity: {cart.totalQuantity}
            </h1>
          </div> */}

          <div className="flex justify-center mt-3">
            <button
              onClick={handleCheckout}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Proceed to buy {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"} for ₹{cart.totalAmount}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CartPage;
