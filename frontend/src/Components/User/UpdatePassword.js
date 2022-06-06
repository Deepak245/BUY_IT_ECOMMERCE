import React, { Fragment, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";

import MetaData from "../Layout/MetaData";
import { updatePassword, clearErrors } from "../../Actions/userActions";
import { UPDATE_PASSWORD_RESET } from "../../Constants/userConstants";

const UpdatePassword = ({ history }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");

  const alert = useAlert();

  const dispatch = useDispatch();
  // what are all objects we declated in UserRedcuer they will get destructred here.
  //   console.log(useSelector((state) => state.authDetails));
  // const { user } = useSelector((state) => state.authDetails); // from here we should bring what ever user logged in.
  const { error, isUpdated, loading } = useSelector(
    (state) => state.profileDetails
  );
  // console.log(user);
  useEffect(() => {
    // if user exist we should set name to user .name

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("PASSWORD UPDATED SUCCESSFULLY");
      //once user updated successfully then we should dispatch the user with new updated data.

      history.push("/me");
      dispatch({
        type: UPDATE_PASSWORD_RESET,
      });
    }
  }, [dispatch, alert, error, history, isUpdated]); //here we have to bringin the history as props as included history in dependency arrary
  const submitHandler = (e) => {
    e.preventDefault();
    // const formData = new FormData(); // for upllading images with user data.

    const formData = { oldPassword, password };
    // console.log(myTestForm.get("avatar"));
    dispatch(updatePassword(formData));
  };

  return (
    <Fragment>
      <MetaData title={"Change Password"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mt-2 mb-5">Update Password</h1>
            <div className="form-group">
              <label htmlFor="old_password_field">Old Password</label>
              <input
                type="password"
                id="old_password_field"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="new_password_field">New Password</label>
              <input
                type="password"
                id="new_password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn update-btn btn-block mt-4 mb-3"
              disabled={loading ? true : false}
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdatePassword;
