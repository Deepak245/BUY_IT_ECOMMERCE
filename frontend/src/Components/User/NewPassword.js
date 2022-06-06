import React, { Fragment, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";

import MetaData from "../Layout/MetaData";
import { resetPassword, clearErrors } from "../../Actions/userActions";
// as we should get the token for resetpassword url so we should bring history and match.
const NewPassword = ({ history, match }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const alert = useAlert();

  const dispatch = useDispatch();

  const { error, success, loading } = useSelector(
    (state) => state.forgetPassword
  );
  //   console.log(user);
  useEffect(() => {
    // if user exist we should set name to user .name

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("PassWord Updated Successfully");
      history.push("/login");
    }
  }, [dispatch, alert, error, success, history]); //here we have to bringin the history as props as included history in dependency arrary
  const submitHandler = (e) => {
    e.preventDefault();
    // const formData = new FormData(); // for upllading images with user data.

    const formData = { password, confirmPassword };
    // console.log(myTestForm.get("avatar"));
    dispatch(resetPassword(match.params.token, formData));
  };
  return (
    <Fragment>
      <MetaData title={"New Password Reset"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-3">New Password</h1>

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

            <div className="form-group">
              <label htmlFor="confirm_password_field">Confirm Password</label>
              <input
                type="password"
                id="confirm_password_field"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              id="new_password_button"
              type="submit"
              className="btn btn-block py-3"
              // disabled={loading ? true : false}
            >
              Set Password
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default NewPassword;
