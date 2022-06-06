import axios from "axios";
import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  ADMIN_PRODUCTS_REQUEST,
  ADMIN_PRODUCTS_SUCCESS,
  ADMIN_PRODUCTS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
  GET_REVIEWS_REQUEST,
  GET_REVIEWS_SUCCESS,
  GET_REVIEWS_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  CLEAR_ERRORS,
} from "../Constants/productConstant";

// this will fetch all our products from backend.
//currentPage=1 mean by default page number is one
// once we set they keyword and fetched data with network request. the  `/api/v1/products?keyword=${keyword}&page=${currentPage}` will hit backend with keyword
// --where we defined a route with keyword searching and we getback our data with searched keyword.
// add parameter price to the array function its and array so values will be price[0] and price[1]
export const getProducts =
  (keyword = "", currentPage, price, category, rating = 0) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_PRODUCTS_REQUEST }); // first we dispatch the action so that all the previous products are cleared out & loading is set to true.
      //after this we should send the request to backend to get data.
      // const { data } = await axios.get("/api/v1/products");
      // to adujust code to receive current page data from backend
      // why we gave page-... because at backend we customized querry as this.queryStr.page)
      // modify the get method by including keyword which comes from search product
      // console.log(keyword);
      // create a link for the api url. Here price should be greater than 0 and must be less than 1000 doller
      let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${rating}`;
      // we check if category exist then send link with category to backend if not exist dont send it.
      if (category) {
        link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}&ratings[gte]=${rating}`;
      }
      const { data } = await axios.get(link);
      // console.log(data);
      //after pulling data dispath the action
      //once after firing network request we get our data in data . this data we are linking to payload
      // now when we dispatch the action with data. this goes in reducer. so here the action = { type: ALL_PRODUCTS_SUCCESS,payload: data,  }

      dispatch({
        type: ALL_PRODUCTS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      // if there is an error this action will get dispatched which is linked to ALL_PRODUCTS_FAIL reducer of product reducer.
      dispatch({
        type: ALL_PRODUCTS_FAIL,
        payload: error.response.data.message, // here what ever failed response we got we are linking to error object of ALL PRODCUT FAIL reducer.
      });
    }
  };

// this will fetch all our productsDetails from backend.
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST }); // first we dispatch the action so that all the previous products are cleared out & loading is set to true.
    //after this we should send the request to backend to get data.
    const { data } = await axios.get(`/api/v1/product/${id}`);
    // console.log(data);
    //after pulling data dispath the action
    //once after firing network request we get our data in data . this data we are linking to payload
    // now when we dispatch the action with data. this goes in reducer. so here the action = { type: ALL_PRODUCTS_SUCCESS,payload: data,  }
    // console.log(data);
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    // if there is an error this action will get dispatched which is linked to ALL_PRODUCTS_FAIL reducer of product reducer.
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message, // here what ever failed response we got we are linking to error object of ALL PRODCUT FAIL reducer.
    });
  }
};

// this will fetch all our productsDetails from backend.
export const newReview = (reviewData) => async (dispatch) => {
  // console.log(reviewData);
  try {
    dispatch({ type: NEW_REVIEW_REQUEST }); // first we dispatch the action so that all the previous products are cleared out & loading is set to true.
    //after this we should send the request to backend to get data.
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.put(`/api/v1/review`, reviewData, config); // if user gave review two time the new rewiew should be updated so we are give put req
    // console.log(data);
    //after pulling data dispath the action
    //once after firing network request we get our data in data . this data we are linking to payload
    // now when we dispatch the action with data. this goes in reducer. so here the action = { type: ALL_PRODUCTS_SUCCESS,payload: data,  }
    // console.log(reviewData, data);
    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    // if there is an error this action will get dispatched which is linked to ALL_PRODUCTS_FAIL reducer of product reducer.
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.response.data.message, // here what ever failed response we got we are linking to error object of ALL PRODCUT FAIL reducer.
    });
  }
};

// this will delete the data from mongodb of a product who have acces is admin
export const deleteProduct = (id) => async (dispatch) => {
  // console.log(id);
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST }); // first we dispatch the action so that all the previous products are cleared out & loading is set to true.

    const { data } = await axios.delete(`/api/v1/admin/product/${id}`); // if user gave review two time the new rewiew should be updated so we are give put req
    // console.log(data);
    //after pulling data dispath the action
    //once after firing network request we get our data in data . this data we are linking to payload
    // now when we dispatch the action with data. this goes in reducer. so here the action = { type: ALL_PRODUCTS_SUCCESS,payload: data,  }
    // console.log(id, data);
    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    // if there is an error this action will get dispatched which is linked to ALL_PRODUCTS_FAIL reducer of product reducer.
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.response.data.message, // here what ever failed response we got we are linking to error object of ALL PRODCUT FAIL reducer.
    });
  }
};

// this will fetch all our productsDetails from backend.
export const updateProduct = (id, productData) => async (dispatch) => {
  // console.log(productData);
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST }); // first we dispatch the action so that all the previous products are cleared out & loading is set to true.
    //after this we should send the request to backend to get data.
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.put(
      `/api/v1/admin/product/${id}`,
      productData,
      config
    ); // if user gave PRODUCT two time the new rewiew should be updated so we are give put req
    // console.log(data);
    //after pulling data dispath the action
    //once after firing network request we get our data in data . this data we are linking to payload
    // now when we dispatch the action with data. this goes in reducer. so here the action = { type: ALL_PRODUCTS_SUCCESS,payload: data,  }
    // console.log(productData, data);
    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    // if there is an error this action will get dispatched which is linked to ALL_PRODUCTS_FAIL reducer of product reducer.
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response.data.message, // here what ever failed response we got we are linking to error object of ALL PRODCUT FAIL reducer.
    });
  }
};

// this will fetch all our productsDetails from backend.
export const newProduct = (productData) => async (dispatch) => {
  // console.log(productData);
  try {
    dispatch({ type: NEW_PRODUCT_REQUEST }); // first we dispatch the action so that all the previous products are cleared out & loading is set to true.
    //after this we should send the request to backend to get data.
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      `/api/v1/admin/product/new`,
      productData,
      config
    ); // if user gave PRODUCT two time the new rewiew should be updated so we are give put req
    // console.log(data);
    //after pulling data dispath the action
    //once after firing network request we get our data in data . this data we are linking to payload
    // now when we dispatch the action with data. this goes in reducer. so here the action = { type: ALL_PRODUCTS_SUCCESS,payload: data,  }
    // console.log(productData, data);
    dispatch({
      type: NEW_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    // if there is an error this action will get dispatched which is linked to ALL_PRODUCTS_FAIL reducer of product reducer.
    dispatch({
      type: NEW_PRODUCT_FAIL,
      payload: error.response.data.message, // here what ever failed response we got we are linking to error object of ALL PRODCUT FAIL reducer.
    });
  }
};

// this will fetch all our productsDetails from backend for admin page.
export const getAdminProducts = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_PRODUCTS_REQUEST }); // first we dispatch the action so that all the previous products are cleared out & loading is set to true.
    //after this we should send the request to backend to get data.
    const { data } = await axios.get(`/api/v1/admin/products/`);
    // console.log(data);
    //after pulling data dispath the action
    //once after firing network request we get our data in data . this data we are linking to payload
    // now when we dispatch the action with data. this goes in reducer. so here the action = { type: ALL_PRODUCTS_SUCCESS,payload: data,  }
    // console.log(data);
    dispatch({
      type: ADMIN_PRODUCTS_SUCCESS,
      payload: data.products,
    });
  } catch (error) {
    // if there is an error this action will get dispatched which is linked to ALL_PRODUCTS_FAIL reducer of product reducer.
    dispatch({
      type: ADMIN_PRODUCTS_FAIL,
      payload: error.response.data.message, // here what ever failed response we got we are linking to error object of ALL PRODCUT FAIL reducer.
    });
  }
};

// to clear error.
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};

// this will fetch all the reviews displayed on the product.
export const getProductReviews = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_REVIEWS_REQUEST }); // first we dispatch the action so that all the previous products are cleared out & loading is set to true.
    //after this we should send the request to backend to get data.
    const { data } = await axios.get(`/api/v1/reviews?id=${id}`);
    // console.log(data);
    //after pulling data dispath the action
    //once after firing network request we get our data in data . this data we are linking to payload
    // now when we dispatch the action with data. this goes in reducer. so here the action = { type: ALL_PRODUCTS_SUCCESS,payload: data,  }
    // console.log(data);
    dispatch({
      type: GET_REVIEWS_SUCCESS,
      payload: data.reviews,
    });
  } catch (error) {
    // if there is an error this action will get dispatched which is linked to ALL_PRODUCTS_FAIL reducer of product reducer.
    dispatch({
      type: GET_REVIEWS_FAIL,
      payload: error.response.data.message, // here what ever failed response we got we are linking to error object of ALL PRODCUT FAIL reducer.
    });
  }
};

// delete the product reviews from the admin screen
export const deleteReviews = (id, productId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REVIEW_REQUEST }); // first we dispatch the action so that all the previous products are cleared out & loading is set to true.
    //after this we should send the request to backend to get data.
    const { data } = await axios.delete(
      `/api/v1/reviews?id=${id}&productId=${productId}`
    );
    // console.log(data);
    //after pulling data dispath the action
    //once after firing network request we get our data in data . this data we are linking to payload
    // now when we dispatch the action with data. this goes in reducer. so here the action = { type: ALL_PRODUCTS_SUCCESS,payload: data,  }
    // console.log(data);
    dispatch({
      type: DELETE_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    // if there is an error this action will get dispatched which is linked to ALL_PRODUCTS_FAIL reducer of product reducer.
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: error.response.data.message, // here what ever failed response we got we are linking to error object of ALL PRODCUT FAIL reducer.
    });
  }
};
