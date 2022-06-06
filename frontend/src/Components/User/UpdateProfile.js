import React, { Fragment, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";

import MetaData from "../Layout/MetaData";
import {
  updateProfile,
  loadUser,
  clearErrors,
} from "../../Actions/userActions";
// we should use loadUser & UpdateProfile actions why ? as we should load user once after upating the profile with fresh data.
import { UPDATE_PROFILE_RESET } from "../../Constants/userConstants";
const UpdateProfile = ({ history }) => {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(""); //this is to set the image of user
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/Default_Avatar.jpg"
  );

  const alert = useAlert();

  const dispatch = useDispatch();
  // what are all objects we declated in UserRedcuer they will get destructred here.
  //   console.log(useSelector((state) => state.authDetails));
  const { user } = useSelector((state) => state.authDetails); // from here we should bring what ever user logged in.
  const { error, isUpdated, loading } = useSelector(
    (state) => state.profileDetails
  );
  // console.log(user);
  useEffect(() => {
    // if user exist we should set name to user .name
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar.url);
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("USER UPDATED SUCCESSFULLY");
      //once user updated successfully then we should dispatch the user with new updated data.
      dispatch(loadUser()); // this will load user with fresh updated data from database.
      history.push("/me");
      dispatch({
        type: UPDATE_PROFILE_RESET,
      });
    }
  }, [dispatch, alert, error, history, isUpdated]); //here we have to bringin the history as props as included history in dependency arrary
  const submitHandler = (e) => {
    e.preventDefault();
    // const formData = new FormData(); // for upllading images with user data.

    const formData = { name, email, avatar };
    // console.log(myTestForm.get("avatar"));
    dispatch(updateProfile(formData));
  };
  const onChangeHandler = (e) => {
    // here we dont have to set email as we are authenticating the user and no need of avatar if check.

    const reader = new FileReader();
    // this is a call back function. when we read this file we pass this call back and check the state
    // 0- reader is created ; 1- it is in Processing; 2- readly uploaded; we will check the state
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]); //we have to pass the blob when we read this file it should get uploaded so for that we send onload call back handler.
  };
  return (
    <Fragment>
      <MetaData title={"Updating Profile"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow-lg"
            onSubmit={submitHandler}
            encType="multipart/form-data"
          >
            <h1 className="mt-2 mb-5">Update Profile</h1>

            <div className="form-group">
              <label htmlFor="email_field">Name</label>
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
              <label htmlFor="avatar_upload">Avatar</label>
              <div className="d-flex align-items-center">
                <div>
                  <figure className="avatar mr-3 item-rtl">
                    <img
                      src={avatarPreview}
                      className="rounded-circle"
                      alt="Avatar Preview"
                    />
                  </figure>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    name="avatar"
                    className="custom-file-input"
                    id="customFile"
                    accept="images/*"
                    onChange={onChangeHandler}
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn update-btn btn-block mt-4 mb-3"
              disabled={loading ? true : false}
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProfile;
