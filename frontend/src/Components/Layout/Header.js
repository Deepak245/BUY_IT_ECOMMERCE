import React, { Fragment } from "react";
import { Route, Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import Search from "./Search";

import { logout } from "../../Actions/userActions";

// import { loadUser } from "../../Actions/userActions";

import "../../App.css";

// here we cannot directly keep the search component as search component takes history of browser.
// to get history of browser we should import router into header component then we can use history object
// here we cannot use history directly as search component is not directly under app.js component its winded over Header and then into Route  component.
// so tag history data to render prop of route and pull out history and then pass that history to search component as props.
const Header = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.authDetails);
  const { cartItems } = useSelector((state) => state.cart);
  // console.log(cartItems.length);
  // this is function which should get triggered when we click on loggout user.
  const logoutHandler = () => {
    dispatch(logout());
    alert.success("Logged out successfully");
  };
  return (
    <Fragment>
      <nav className="navbar row">
        <div className="col-12 col-md-3">
          <div className="navbar-brand">
            <Link to="/">
              <img src="/images/logo.png" />
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-6 mt-2 mt-md-0">
          {/* <Route render={({ history }) => <Search history={history} />} /> */}

          <Route render={({ history }) => <Search history={history} />} />
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          {/* try to wrapp cart into a link */}

          <Link to="/cart" style={{ textDecoration: "none" }}>
            <span id="cart" className="ml-3">
              Cart
            </span>
            <span className="ml-1" id="cart_count">
              {cartItems.length}
            </span>
          </Link>
          {/* this is how we sould keep if condition if user logged in show page else not logged in then check if not loading as some time it might take to login*/}
          {/* again check for that condition */}
          {user ? (
            <div className="m1-4 dropdown d-inline">
              <Link
                to="#!"
                className="btn dropdown-toggle text-white mr-4"
                type="button"
                id="dropDownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <figure className="avatar avatar-nav">
                  <img
                    src={user.avatar && user.avatar.url}
                    alt={user && user.name}
                    className="rounded-circle"
                  />
                </figure>
                <span>{user && user.name}</span>
              </Link>
              <div
                className="dropdown-menu"
                aria-labelledby="dropDownMenuButton"
              >
                {/* if user is admin then we should display dashboard option ; so if user is not admin show him the orders page if admin show him dashboard page */}
                {user && user.role === "admin" && (
                  <Link className="dropdown-item" to="/dashboard">
                    DashBoard
                  </Link>
                )}

                <Link className="dropdown-item" to="/orders/me">
                  Orders
                </Link>
                {/* this is for every user so display them with profiles */}
                <Link className="dropdown-item" to="/me">
                  Profiles
                </Link>
                {/* to define logout option to user dowpdown mean */}

                <Link
                  className="dropdown-item text-danger"
                  to="/"
                  onClick={logoutHandler}
                >
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            !loading && (
              <Link to="/login" className="btn ml-4" id="login_btn">
                Login
              </Link>
            )
          )}
          {/* "https://reactjs.org/docs/conditional-rendering.html"  ==>This article explains on how to do inline conditional ternary expression*/}
        </div>
      </nav>
    </Fragment>
  );
};

export default Header;

// very very importnant note
// inside of render for route keep typing carefully for the arrow function dont give parantesis to component if given the component will not render properly

// so the search route will take some previous history object; so that history needs to be passed as a prop to search component.
