import React, { Fragment, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";

import MetaData from "../Layout/MetaData";

import SideBar from "../Admin/SideBar";
import {
  updateUser,
  getUserDetails,
  clearErrors,
} from "../../Actions/userActions";
// we should use loadUser & UpdateProfile actions why ? as we should load user once after upating the profile with fresh data.
import { UPDATE_USER_RESET } from "../../Constants/userConstants";

const UpdateUser = ({ history, match }) => {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const alert = useAlert();

  const dispatch = useDispatch();
  // what are all objects we declated in UserRedcuer they will get destructred here.
  //   console.log(useSelector((state) => state.authDetails));
  const { error, isUpdated } = useSelector((state) => state.profileDetails); // from here we should bring what ever user logged in.
  const { user } = useSelector((state) => state.userDetails);

  const userId = match.params.id;
  // console.log(user._id, userId);
  // console.log(isUpdated);
  useEffect(() => {
    // if user exist we should set name to user .name
    // console.log(user, user._id, userId);
    // console.log(user && user._id !== userId);
    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    } else {
      console.log(user._id);
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("USER UPDATED SUCCESSFULLY");
      //once user updated successfully then we should dispatch the user with new updated data.
      // dispatch(loadUser()); // this will load user with fresh updated data from database.
      // console.log(history);
      history.push("/admin/users");
      dispatch({
        type: UPDATE_USER_RESET,
      });
    }
  }, [dispatch, alert, error, history, isUpdated, userId, user]); //here we have to bringin the history as props as included history in dependency arrary
  const submitHandler = (e) => {
    e.preventDefault();
    // const formData = new FormData(); // for upllading images with user data.

    const formData = { name, email, role };
    // console.log(user._id);
    dispatch(updateUser(user._id, formData));
  };

  return (
    <Fragment>
      <MetaData title={`Update User`} />
      <div className="row">
        <div className="col-12 col-md-2">
          <SideBar />
        </div>
        <div className="col-12 col-md-10">
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" onSubmit={submitHandler}>
                <h1 className="mt-2 mb-5">Update User</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="name"
                    id="name_field"
                    className="form-control"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input
                    type="email"
                    id="email_field"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role_field">Role</label>

                  <select
                    id="role_field"
                    className="form-control"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn update-btn btn-block mt-4 mb-3"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUser;
