import React, { Fragment, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";

import MetaData from "../Layout/MetaData";
import { register, clearErrors } from "../../Actions/userActions";

const Register = ({ history }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  }); // here we are using object notation.

  const { name, email, password } = user; // destructing the user data for future reference.
  const [avatar, setAvatar] = useState(""); //this is to set the image of user
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/Default_Avatar.jpg"
  );
  // console.log(user);
  const alert = useAlert();

  const dispatch = useDispatch();
  // what are all objects we declated in UserRedcuer they will get destructred here.
  //   console.log(useSelector((state) => state.authDetails));
  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.authDetails
  );

  useEffect(() => {
    // if user is already logged in no need to go back to login page again. so simple push user to home page.
    if (isAuthenticated) {
      history.push("/");
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error, isAuthenticated, history]);
  const submitHandler = (e) => {
    e.preventDefault();
    // const formData = new FormData(); // for upllading images with user data.
    // console.log(avatar);
    // myTestForm.set("name", name);
    // myTestForm.set("email", email);
    // myTestForm.set("password", password);
    // myTestForm.set("avatar", avatar);
    const formData = { name, email, password, avatar };
    // console.log(myTestForm.get("avatar"));
    dispatch(register(formData));
  };
  const onChangeHandler = (e) => {
    if (e.target.name === "avatar") {
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
    } else {
      setUser({ ...user, [e.target.name]: e.target.value }); // here we are adding the new value of either name or password to user.
    }
  };
  return (
    <Fragment>
      <MetaData title={"Register User"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          {/* set encription type to multipart form data. and link the submit handler function */}
          <form
            className="shadow-lg"
            onSubmit={submitHandler}
            encType="multipart/form-data"
          >
            <h1 className="mb-3">Register</h1>

            <div className="form-group">
              <label htmlFor="name_field">Name</label>
              <input
                type="name"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={onChangeHandler}
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
                onChange={onChangeHandler}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={onChangeHandler}
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
                    accept="image/*"
                    onChange={onChangeHandler}
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>

            <button
              id="register_button"
              type="submit"
              className="btn btn-block py-3"
              // when even loading disable this button and once loading is completed enable this button
              disabled={loading ? true : false}
            >
              REGISTER
              {/* once we click on register button dispatch event start and loading will so we should disable this button */}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
