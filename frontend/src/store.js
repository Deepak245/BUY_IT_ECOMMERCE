import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
// import { configureStore } from "@reduxjs/toolkit";
// import { Reducer } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension"; // through this only we would able to see redux devtool glowoing in green

import {
  productsReducer,
  productDetailsReducer,
  newReviewReducer,
  newProductReducer,
  prodcutReducer, // this is to handle update and delete product for admin routes.
  productReviewReducer, // to display the reviews of the product in the module.
  reviewReducer, // to delete a review from admin page.
} from "./Reducers/productReducers";

import {
  authReducer,
  updateProfileReducer,
  forgetPasswordReducer,
  allUsersReducer,
  userDetailsReducer,
} from "./Reducers/userReducer.js";

import { cartReducer } from "./Reducers/cartReducer";

import {
  newOrderReducer,
  myOrdersReducer,
  orderDetailsReducer,
  allOrdersReducer,
  orderReducer,
} from "./Reducers/orderReducer";

// here we will add all our reducers to it.
// to what value we tag the reducer name that value will be the state controling object. here in our example its products.
// so if we change products to productsState it should be seen in redux dev tools as state.
const reducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer, // it will bring all the product details from state
  newProduct: newProductReducer, // fro creating new product in admin page.
  product: prodcutReducer, // for handling admin products
  productReviews: productReviewReducer, // for displaying reviews of all the products coded for admin page
  review: reviewReducer, // to delete the review from the admin page.
  authDetails: authReducer, // for getting userdetails.
  allUsers: allUsersReducer, // this is to display all the user in admin page.
  userDetails: userDetailsReducer, // this to get user details for modifing user values for admin user.
  profileDetails: updateProfileReducer, // this is for updating the user profile in video ghulam used user iam using profileDetails
  forgetPassword: forgetPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  allOrders: allOrdersReducer,
  orderDetails: orderDetailsReducer,
  order: orderReducer, // this is for updateing order to true or false based from admin page.
  newReview: newReviewReducer,
});
// this is new enhancement with react js toolkit where if we are combining reducers we can directly keep without using combine reducers.

// this is from redux toolkit
// const reducer = {
//   products: productsReducer,
//   productDetails: productDetailsReducer,
//   authDetails: authReducer,
//   profileDetails: updateProfileReducer, // this is for updating the user profile in video ghulam used user iam using profileDetails
//   forgetPassword: forgetPasswordReducer,
//   cart: cartReducer,
// };

// we should keep initial state
// it contains all the data that we want to put in the state just before loading the application
// here when ever we reload the page to not loose data we have to pass all the local storage items to initial state this action should take place when ever
// we selected cart items these cart items should come into cart even after reload to persist that effect we are doing this change.
// console.log(localStorage.getItem("cartItems"));
let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },

  // if localstorage contains cartitems then parse the strigified json object(as data is in string formate if its in localstroage) then pass that localstroed
  ///value to cartItems else pass empty array
};
// console.log(initialState.cart.cartItems);
// Now at third step we should create our store for that use middleware funciton it contains all the middle ware data we use basically it would be thunk
const middleware = [thunk];
const store = createStore(
  reducer, // for keeping above combined reducers
  initialState, // for keeping initail state befor openig the application.
  composeWithDevTools(applyMiddleware(...middleware)) // this first we linked our redux tool chrome to app with composewithDevtool to we are applying our middleware.
);

// even the store can be configured like this easily with out keeping all the redundent code like the above. dev tools will get automaticall intiated.
// const store = configureStore({
//   reducer: reducer,
//   initialState: initialState,
//   middleware: middleware,
// });

// all the is boiler plate code which we should do with empty combineReducers({}) as application progress we would add all our reducers.
export default store;

// first we create a reducer for that we have to create an action to update the state.
