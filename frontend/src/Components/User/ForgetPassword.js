import React, { Fragment, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";

import MetaData from "../Layout/MetaData";
import { forgetPassword, clearErrors } from "../../Actions/userActions";
import { UPDATE_PASSWORD_RESET } from "../../Constants/userConstants";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const alert = useAlert();

  const dispatch = useDispatch();

  const { error, message, loading } = useSelector(
    (state) => state.forgetPassword
  );
  //   console.log(user);
  useEffect(() => {
    // if user exist we should set name to user .name

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (message) {
      alert.success(message);
    }
  }, [dispatch, alert, error, message]); //here we have to bringin the history as props as included history in dependency arrary
  const submitHandler = (e) => {
    e.preventDefault();
    // const formData = new FormData(); // for upllading images with user data.

    const formData = { email };
    // console.log(myTestForm.get("avatar"));
    dispatch(forgetPassword(formData));
  };
  return (
    <Fragment>
      <MetaData title={"Forget Password"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-3">Forgot Password</h1>
            <div className="form-group">
              <label htmlFor="email_field">Enter Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              id="forgot_password_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading ? true : false}
            >
              Send Email
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ForgetPassword;
