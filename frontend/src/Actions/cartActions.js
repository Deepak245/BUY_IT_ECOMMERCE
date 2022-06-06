import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../Constants/cartConstants";

import axios from "axios";

// we should pass id of the product and quantity like six or seven we should pass then getState is for getting current state
// Returns the current state tree of your application. It is equal to the last value returned by the store's reducer
export const addItemToCart = (id, quantity) => async (dispatch, getState) => {
  //   console.log(getState()); here we get all the state of application using getState method of thunk. the below is example.
  // authDetails: {loading: false, isAuthenticated: true, user: {…}}
  // cart:
  // cartItems: Array(1)
  // 0: {product: '623ca78506c6c3202be08d57', name: 'Bose QuietComfort 35 II Wireless Bluetooth Headphones', price: 299, image: 'https://res.cloudinary.com/dzpltdic8/image/upload/…uyIt-Images/Products/headphones_t2afnb_ubynik.jpg', stock: 11, …}
  // length: 1
  // [[Prototype]]: Array(0)
  // [[Prototype]]: Object
  // forgetPassword: {}
  // productDetails: {loading: false, product: {…}}
  // products:
  // filteredProductsCount: 10
  // loading: false
  // productCount: 10
  // products: (4) [{…}, {…}, {…}, {…}]
  // resPerPage: 4
  // [[Prototype]]: Object
  // profileDetails: {}
  // [[Prototype]]: Object
  const { data } = await axios.get(`/api/v1/product/${id}`); // here we are searching the product with id.
  dispatch({
    type: ADD_TO_CART,
    payload: {
      product: data.product._id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0].url,
      stock: data.product.stock,
      quantity: quantity, // this is value from the parameter we are passing from above arguments.
    },
  }); // here payload is an object in this case.

  // here we should store data from the local storage, once after dispatch so we will save cart items to local storage and then extract them from the local storage
  // why? if we do refresh we should not loose the data. so we store it in local store so that even if we do reload the page data will not get lost.
  // here we are taking the current state item i.e from getState(what ever in current state) from that navigate to cart from that go to cartItems
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeItemFromCart = (id) => async (dispatch, getState) => {
  //   console.log(getState()); here we get all the state of application using getState method of thunk. the below is example.

  // const { data } = await axios.get(`/api/v1/product/${id}`); // here we are searching the product with id.
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: id,
  }); // here payload is an object in this case.

  // here we should store data from the local storage, once after dispatch so we will save cart items to local storage and then extract them from the local storage
  // why? if we do refresh we should not loose the data. so we store it in local store so that even if we do reload the page data will not get lost.
  // here we are taking the current state item i.e from getState(what ever in current state) from that navigate to cart from that go to cartItems
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const saveShippingInfo = (data) => async (dispatch) => {
  //   console.log(getState()); here we get all the state of application using getState method of thunk. the below is example.

  // const { data } = await axios.get(`/api/v1/product/${id}`); // here we are searching the product with id.
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  }); // here payload is an object in this case.

  // here we should store data from the local storage, once after dispatch so we will save cart items to local storage and then extract them from the local storage
  // why? if we do refresh we should not loose the data. so we store it in local store so that even if we do reload the page data will not get lost.
  // here we are taking the current state item i.e from getState(what ever in current state) from that navigate to cart from that go to cartItems
  localStorage.setItem("shippingInfo", JSON.stringify(data));
};
