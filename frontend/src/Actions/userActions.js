import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  FORGET_PASSWORD_REQUEST,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_FAIL,
  NEW_PASSWORD_REQUEST,
  NEW_PASSWORD_SUCCESS,
  NEW_PASSWORD_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  CLEAR_ERRORS,
} from "../Constants/userConstants";
import axios from "axios";

//login data
export const login = (email, password) => async (dispatch) => {
  try {
    // console.log(email);
    dispatch({ type: LOGIN_REQUEST });
    // her we are setting heards.
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/v1/login",
      { email, password },
      config
    );
    // console.log(data);
    dispatch({ type: LOGIN_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data.errMessage,
    });
  }
};

//REGISTER USER
export const register = (userData) => async (dispatch) => {
  try {
    // console.log(userData);
    dispatch({ type: REGISTER_USER_REQUEST });
    // her we are setting heards.
    const config = {
      headers: {
        // "Content-type": "multipart/form-data", // here we are passing images as well so we should use multipart form data.
        "Content-type": "application/json", // as we are not sending it into server we are storing to cloudinary so we are making content type as application/json
      },
    };
    // const { data } = await axios.post("/api/v1/register", { userData }, config);
    // const { data } = await axios.post(
    //   `/api/v1/register`,
    //   userData,

    //   { config }
    // );
    const { data } = await axios.post(`/api/v1/register`, userData, config);
    // console.log(data);
    dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user });
  } catch (error) {
    console.log(error.response.data);
    console.log(error.response.data.stack);
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error.response.data.errMessage,
    });
  }
};

//LOAD LOGIN USER.
export const loadUser = () => async (dispatch) => {
  try {
    // console.log(userData);
    dispatch({ type: LOAD_USER_REQUEST });

    const { data } = await axios.get(`/api/v1/me`);
    // console.log(data);
    dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
  } catch (error) {
    console.log(error.response.data);
    console.log(error.response.data.stack);
    dispatch({
      type: LOAD_USER_FAIL,
      payload: error.response.data.errMessage,
    });
  }
};

//LOGOUT-> LOGIN USER.
export const logout = () => async (dispatch) => {
  try {
    await axios.get(`/api/v1/logout`);
    // console.log(data);
    dispatch({ type: LOGOUT_USER_SUCCESS });
  } catch (error) {
    console.log(error.response.data);
    console.log(error.response.data.stack);
    dispatch({
      type: LOGOUT_USER_FAIL,
    });
  }
};
// to clear error.
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};

//UPDATE USER PROFILE
export const updateProfile = (userData) => async (dispatch) => {
  try {
    // console.log(userData);
    dispatch({ type: UPDATE_PROFILE_REQUEST });
    // her we are setting heards.
    const config = {
      headers: {
        // "Content-type": "multipart/form-data", // here we are passing images as well so we should use multipart form data.
        "Content-type": "application/json", // as we are not sending it into server we are storing to cloudinary so we are making content type as application/json
      },
    };
    // this is a put request
    const { data } = await axios.put(`/api/v1/me/update`, userData, config);
    // console.log(data);
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.success });
  } catch (error) {
    console.log(error.response.data);
    console.log(error.response.data.stack);
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response.data.errMessage,
    });
  }
};

//UPDATE USER PASSWORD
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST });
    // her we are setting heards.
    const config = {
      headers: {
        "Content-type": "application/json", // as we are not sending it into server we are storing to cloudinary so we are making content type as application/json
      },
    };
    // this is a put request
    const { data } = await axios.put(
      `/api/v1/password/update`,
      passwords,
      config
    );
    // console.log(data);
    dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    // console.log(error.response.data);
    // console.log(error.response.data.stack);
    dispatch({
      type: UPDATE_PASSWORD_FAIL,
      payload: error.response.data.errMessage,
    });
  }
};

//get forget PASSWORD
export const forgetPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGET_PASSWORD_REQUEST });
    // her we are setting heards.
    const config = {
      headers: {
        "Content-type": "application/json", // as we are not sending it into server we are storing to cloudinary so we are making content type as application/json
      },
    };
    // this is a put request
    const { data } = await axios.post(`/api/v1/password/forgot`, email, config);
    // console.log(data);
    dispatch({ type: FORGET_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {
    // console.log(error.response.data);
    // console.log(error.response.data.stack);
    dispatch({
      type: FORGET_PASSWORD_FAIL,
      payload: error.response.data.errMessage,
    });
  }
};

//get reset PASSWORD, here token is reset password token coming from link
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PASSWORD_REQUEST });
    // her we are setting heards.
    const config = {
      headers: {
        "Content-type": "application/json", // as we are not sending it into server we are storing to cloudinary so we are making content type as application/json
      },
    };
    // this is a put request
    const { data } = await axios.put(
      `/api/v1/password/reset/${token}`,
      passwords,
      config
    );
    // console.log(data);
    dispatch({ type: NEW_PASSWORD_SUCCESS, payload: data.success });
  } catch (error) {
    // console.log(error.response.data); // these are the error messages those will naturally come from the backend of  return next(new ErrorHandler("Password Doesnot Match", 400));
    // console.log(error.response.data.stack); // so customize them properly to receive error as we needed.
    dispatch({
      type: NEW_PASSWORD_FAIL,
      payload: error.response.data.errMessage,
    });
  }
};

//LOAD all the users who are in admin page.
export const allUsers = () => async (dispatch) => {
  try {
    // console.log(userData);
    dispatch({ type: ALL_USERS_REQUEST });

    const { data } = await axios.get(`/api/v1/admin/users`);
    // console.log(data);
    dispatch({ type: ALL_USERS_SUCCESS, payload: data.users });
  } catch (error) {
    // console.log(error.response.data);
    // console.log(error.response.data.stack);
    dispatch({
      type: ALL_USERS_FAIL,
      payload: error.response.data.errMessage,
    });
  }
};

//to update user details from admin page.
// PUT http://localhost:3000/api/v1/admin/user/62768b41a18298e08403bd7c 404 (Not Found)  mean route is not there from backend so include that route at backend.
export const updateUser = (id, userData) => async (dispatch) => {
  console.log(id, userData);
  try {
    dispatch({ type: UPDATE_USER_REQUEST });
    // her we are setting heards.
    const config = {
      headers: {
        "Content-type": "application/json", // as we are not sending it into server we are storing to cloudinary so we are making content type as application/json
      },
    };
    // this is a put request
    const { data } = await axios.put(
      `/api/v1/admin/user/${id}`,
      userData,
      config
    );
    // console.log(data);
    dispatch({ type: UPDATE_USER_SUCCESS, payload: data.success });
  } catch (error) {
    // console.log(error.response);
    // console.log(error.response.data.stack);
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response.data.errMessage,
    });
  }
};

//to get user details from admin page.
export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    // her we are setting heards.

    // this is a put request
    const { data } = await axios.get(`/api/v1/admin/user/${id}`);
    // console.log(data);
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data.user });
  } catch (error) {
    // console.log(error.response.data);
    // console.log(error.response.data.stack);
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: error.response.data.errMessage,
    });
  }
};

//to delete a user from admin page.
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });
    // her we are setting heards.

    // this is a put request
    const { data } = await axios.delete(`/api/v1/admin/user/${id}`);
    // console.log(data);
    dispatch({ type: DELETE_USER_SUCCESS, payload: data.success });
  } catch (error) {
    // console.log(error.response.data);
    // console.log(error.response.data.stack);
    dispatch({
      type: DELETE_USER_FAIL,
      payload: error.response.data.errMessage,
    });
  }
};
