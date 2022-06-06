import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

//these eblow two are related to stripe component payment set up details
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

//Cart Import
import Cart from "./Components/Cart/Cart";
import ShippingInfo from "./Components/Cart/ShippingInfo"; // this must be a protected Route.
import ConfirmOrder from "./Components/Cart/ConfirmOrder";
import Payment from "./Components/Cart/Payment";
import OrderSuccess from "./Components/Cart/OrderSuccess";

//order Imports
import ListOrders from "./Components/Orders/ListOrder";
import OrderDetails from "./Components/Orders/OrderDetails";

//Auth or user Imports
import Login from "./Components/User/Login";
import Register from "./Components/User/Register";
import UpdateProfile from "./Components/User/UpdateProfile";
import UpdatePassword from "./Components/User/UpdatePassword";
import ForgetPassword from "./Components/User/ForgetPassword";
import NewPassword from "./Components/User/NewPassword";

//Admin Imports
import DashBoard from "./Components/Admin/DashBoard";
import ProductList from "./Components/Admin/ProductList";
import NewProduct from "./Components/Admin/NewProduct";
import UpdateProduct from "./Components/Admin/UpdateProduct";
import OrderList from "./Components/Admin/OrderList";
import ProcessOrder from "./Components/Admin/ProcessOrder";
import UsersList from "./Components/Admin/UsersList";
import UpdateUser from "./Components/Admin/UpdateUser";
import ProductReviews from "./Components/Admin/ProductReviews";

import Profile from "./Components/User/Profile";
import Header from "./Components/Layout/Header";

import Home from "./Components/Home";
import Footer from "./Components/Layout/Footer";

import ProductDetails from "./Components/Product/ProductDetails";

// import protected Route
import ProtectedRoute from "./Components/Route/ProtectedRoute";
import { loadUser } from "./Actions/userActions";
import { useSelector } from "react-redux";
import store from "./store";
import axios from "axios";

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");

  // This is how we should display logged in user. once logged in to persist data we are supposed to use useeffect hook which should be directly fired on the store.
  useEffect(() => {
    store.dispatch(loadUser()); // we simply cannot dispatch loaduser so to use that action we must use store object. this should be kept in useEffect.
    // so we should import useEffect,Store and loaduser.

    async function getStripeApiKey() {
      const { data } = await axios.get("api/v1/stripeapi");
      setStripeApiKey(data.stripeApiKey);
      // const stripe = await loadStripe(data.stripeApiKey);
      // console.log(data.stripeApiKey);
    }

    getStripeApiKey();
  }, []);

  const { user, isAuthenticated, loading } = useSelector(
    (state) => state.authDetails
  );
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path="/" component={Home} exact />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/password/forgot" component={ForgetPassword} exact />
          <Route path="/password/reset/:token" component={NewPassword} exact />
          {/* which component we want to make a proected route simple we should add protected route to it */}
          {/* https://dev.to/olumidesamuel_/implementing-protected-route-and-authentication-in-react-js-3cl4 */}
          <ProtectedRoute path="/me" component={Profile} exact />
          <ProtectedRoute path="/me/update" component={UpdateProfile} exact />
          <ProtectedRoute
            path="/password/update"
            component={UpdatePassword}
            exact
          />

          <Route path="/search/:keyword" component={Home} />
          <Route path="/product/:id" component={ProductDetails} exact />
          <Route path="/cart" component={Cart} exact />
          <ProtectedRoute path="/shipping" component={ShippingInfo} exact />
          <ProtectedRoute
            path="/order/confirm"
            component={ConfirmOrder}
            exact
          />
          <ProtectedRoute path="/success" component={OrderSuccess} exact />
          <ProtectedRoute path="/orders/me" component={ListOrders} exact />
          <ProtectedRoute path="/order/:id" component={OrderDetails} exact />
          {/* check if stripe API key exist then elements component from stripe with take stripe as props whichs needs a method then place protected rount */}
          {stripeApiKey && (
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment" component={Payment} exact />
            </Elements>
          )}
        </div>
        <ProtectedRoute
          path="/dashboard"
          isAdmin={true}
          component={DashBoard}
          exact
        />
        <ProtectedRoute
          path="/admin/products"
          isAdmin={true}
          component={ProductList}
          exact
        />
        <ProtectedRoute
          path="/admin/product"
          isAdmin={true}
          component={NewProduct}
          exact
        />
        <ProtectedRoute
          path="/admin/product/:id"
          isAdmin={true}
          component={UpdateProduct}
          exact
        />
        <ProtectedRoute
          path="/admin/orders"
          isAdmin={true}
          component={OrderList}
          exact
        />
        <ProtectedRoute
          path="/admin/order/:id"
          isAdmin={true}
          component={ProcessOrder}
          exact
        />
        <ProtectedRoute
          path="/admin/users"
          isAdmin={true}
          component={UsersList}
          exact
        />
        <ProtectedRoute
          path="/admin/user/:id"
          isAdmin={true}
          component={UpdateUser}
          exact
        />
        <ProtectedRoute
          path="/admin/reviews"
          isAdmin={true}
          component={ProductReviews}
          exact
        />
        {/* to not display footer if not admin do following changes */}
        {!loading && (!isAuthenticated || user.role !== "admin") && <Footer />}
      </div>
    </Router>
  );
}

export default App;
