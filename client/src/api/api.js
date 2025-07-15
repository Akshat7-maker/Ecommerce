import axios from "axios";


export const API = axios.create({
    baseURL:"https://ecommerce-k2yn.onrender.com",
    // baseURL:"http://localhost:8000",
    withCredentials: true
});

// function to set Authorization header
const setAuthHeader = (token) => {
    if(token) {
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }else {
        delete API.defaults.headers.common["Authorization"];
    }
}

// user login
const login = async (email, password) => {
    try {
        const {data} = await API.post("/api/v1/users/login", {email, password});

        const {data:user} = data

        // store token in local storage
        localStorage.setItem("token", user.refreshToken)

        // set auth header
        setAuthHeader(user.refreshToken)
        return user;
    } catch (error) {
        throw error
    }
}

// user signup
const register = async (name, email, password,gender, coverPic) => {
    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);        
        formData.append("password", password);
        formData.append("gender", gender);
        formData.append("coverPic", coverPic);
        // console.log({name, email, password,gender, coverPic});
        const {data} = await API.post("/api/v1/users/register", formData);

        const {data:user} = data
        return user;
    } catch (error) {
        throw error
    }
}

// get all products

const getAllProducts = async () => {
    try {
        console.log("hello");
        const {data} = await API.get("/api/v1/products/get-all-products");
        const {data:products} = data
        return products
    } catch (error) {
        throw error
    }
}

// get latest products

const getLatestProducts = async () => {
    try {
        const {data} = await API.get("/api/v1/products/get-latest-products");
        const {data:products} = data
        return products
    } catch (error) {
        throw error 
    }
}
// get product by id

const getProductById = async (id) => {
    try {
        const {data} = await API.get(`/api/v1/products/${id}`);
        const {data:product} = data
        return product
    } catch (error) {
        throw error
    }
}

// get all reviews
const getAllReviews = async (id) => {
    try {
        const {data} = await API.get(`/api/v1/reviews/get-all-reviews/${id}`);
        const {data:reviews} = data
        return reviews
    } catch (error) {
        throw error
    }
}

// get user review for a particular product

const getUserReview = async (productId) => {
    try {
        const {data} = await API.get(`/api/v1/reviews/get-review-of-user/${productId}`);
        const {data:review} = data
        return review
    } catch (error) {
        throw error
    }
}

// create review
const createReview = async (productId, rating, comment) => {
    try {
        const {data} = await API.post(`/api/v1/reviews/create-review/${productId}`, {rating, comment});
        const {data:review} = data
        return review
    } catch (error) {
        throw error
    }
}

// update review
const updateReview = async (reviewId, rating, comment) => {
    try {
        const {data} = await API.put(`/api/v1/reviews/update-review/${reviewId}`, {rating, comment});
        const {data:review} = data
        return review
    } catch (error) {
        throw error
    }
}

// delete review
const deleteReview = async (reviewId) => {
    try {
        const {data} = await API.delete(`/api/v1/reviews/delete-review/${reviewId}`);
        const {data:review} = data
        return review
    } catch (error) {
        throw error
    }
}

const getAllOrders = async (page, limit) => {
    try {
        const {data} = await API.get(`/api/v1/orders/my-order/`,
        {
            params: {
                page: page,
                limit: 5
            }
        }        
        );
        // console.log(data);
        const {data:myData} = data
        return myData
    } catch (error) {
        throw error
    }
}

const getOrderById = async (orderId) => {
    console.log("orderId",orderId);
    try {
        const {data} = await API.get(`/api/v1/orders/get-order/${orderId}`);
        console.log("order-data",data);
        const {data:order} = data
        return order
    } catch (error) {
        throw error
    }
}

// get oders of admin

const getAllOrdersOfAdmin = async () => {
    try {
        const {data} = await API.get(`/api/v1/orders/get-all-orders-of-admin`);
        const {data:orders} = data
        return orders
    } catch (error) {
        throw error
    }
}

// get cart
const getCart = async () => {
    try {
        const {data} = await API.get("/api/v1/cart/get-cart");
        const {data:cart} = data
        // console.log("cart",cart);
        return cart
    } catch (error) {
        throw error
    }
}

// reset cart
const resetCart = async () => {
    try {
        const {data} = await API.delete("/api/v1/cart/reset-cart");
        const {data:cart} = data
        return cart
    } catch (error) {
        throw error
    }
}

// add to cart
const addToCart = async ( productId, quantity=1) => {
    try {
        const {data} = await API.post(`/api/v1/cart/add-to-cart`, {productId, quantity});
        const {data:cart} = data
        return cart
    } catch (error) {
        throw error
    }
}

// delete from cart
const deleteFromCart = async (productId) => {
    try {
        const {data} = await API.delete(`/api/v1/cart/delete-from-cart/${productId}`);
        const {data:cart} = data
        return cart
    } catch (error) {
        throw error
    }
}

// remove from cart
const removeFromCart = async (productId) => {
    try {
        const {data} = await API.patch(`/api/v1/cart/remove-from-cart/${productId}`);
        const {data:cart} = data
        return cart
    } catch (error) {
        throw error
    }
}

const api = {
    login,
    register,
    getAllProducts,
    getProductById,
    getAllReviews,
    getAllOrders,
    getOrderById,
    getCart,
    addToCart,
    deleteFromCart,
    resetCart,
    removeFromCart,
    getAllOrdersOfAdmin,
    getUserReview,
    createReview,
    updateReview,
    deleteReview,
    getLatestProducts
}

export default api