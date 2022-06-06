import React, { Fragment } from "react";

import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

// in props we will pass which route we want to protect we pass that route.
const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
  const { isAuthenticated, loading, user } = useSelector(
    (state) => state.authDetails
  );
  //from authdetails we should get isAuthenticated value based on that and loading condition we are supposed to return a component

  // console.log({ ...rest }); // here get details like path, exact etc.
  // console.log(Component.name); // this is how we can extract name of component passed.
  return (
    <Fragment>
      {/* here we are checking if loading false  then we customize route. */}

      {loading === false && (
        <Route
          // here we are spreading out the values like path exact keywords in render we are returning
          {...rest}
          render={(props) => {
            // if isAuthenticated is false use not logged in
            if (isAuthenticated === false) {
              return <Redirect to="/login" />;
            }
            // if user is not admin we are supposed to redirect to home page.
            if (isAdmin === true && user.role !== "admin") {
              return <Redirect to="/" />;
            }
            return <Component {...props} />;
          }}
        />
      )}
    </Fragment>
  );
};

export default ProtectedRoute;
