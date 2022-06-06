import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import Loader from "../Layout/Loader";
import MetaData from "../Layout/MetaData";
import { login, clearErrors } from "../../Actions/userActions";

const Login = ({ history, location }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const alert = useAlert();

  const dispatch = useDispatch();
  // what are all objects we declated in UserRedcuer they will get destructred here.
  //   console.log(useSelector((state) => state.authDetails));
  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.authDetails
  );
  // so if location.search exist then extract which part we should navigate or redirect.
  // here once use came from shipping withoutlogin then he will prompt to login and user logged in then location.search will be in url. so no its redirect to shipping
  //if not location.search exist then it navigates to "/ " this code is little bit trickier code.
  //this line is added / modified once after shipping page is coded.
  const redirect = location.search ? location.search.split("=")[1] : "/";
  useEffect(() => {
    // if user is already logged in no need to go back to login page again. so simple push user to home page.
    if (isAuthenticated) {
      // history.push("/");
      //after coding shipping page the above code is commented.
      history.push(redirect);
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error, isAuthenticated, history]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Login"} />
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              {/* for form we should define SubmitHandled i.e how form should behave onsubmitting it */}
              <form className="shadow-lg" onSubmit={submitHandler}>
                <h1 className="mb-3">Login</h1>
                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input
                    type="email"
                    id="email_field"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password_field">Password</label>
                  <input
                    type="password"
                    id="password_field"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {/* this will get activated when we forget our password*/}
                <Link to="/password/forgot" className="float-right mb-4">
                  Forgot Password?
                </Link>

                <button
                  id="login_button"
                  type="submit"
                  className="btn btn-block py-3"
                >
                  LOGIN
                </button>
                {/* here when we click on newUser this will take us to Registration page. this related route is defined in App.js page.this is how we link two pages. */}
                <Link to="/register" className="float-right mt-3">
                  New User?
                </Link>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Login;
