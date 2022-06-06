import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  ADMIN_PRODUCTS_REQUEST,
  ADMIN_PRODUCTS_SUCCESS,
  ADMIN_PRODUCTS_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
  NEW_PRODUCT_RESET,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  DELETE_PRODUCT_RESET,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  UPDATE_PRODUCT_RESET,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_RESET,
  GET_REVIEWS_REQUEST,
  GET_REVIEWS_SUCCESS,
  GET_REVIEWS_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  DELETE_REVIEW_RESET,
  CLEAR_ERRORS,
} from "../Constants/productConstant";

// constains states initially it shouldbe empty array and state is an object so object contain empty array
// what ever object we kept in dispatch funciton of product action that will come to action parameter.
export const productsReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case ALL_PRODUCTS_REQUEST: // this case we set loading to true and products array should be initialised to empty arry
    case ADMIN_PRODUCTS_REQUEST:
      return {
        loading: true,
        products: [],
      };
    case ALL_PRODUCTS_SUCCESS: // this case we set loading to false and products array should contain all the products fetched from backend and all products loaded successfully.
      //console.log(state.products);
      // console.log(action.payload);
      return {
        loading: false,
        products: action.payload.products, // here products is value which is on left hand side so we set to fetched products.
        productCount: action.payload.productCount,
        resPerPage: action.payload.resultsperPage,
        filteredProductsCount: action.payload.filteredProductsCount, // linking from backend api data.
      };
    // in above step what ever data we are sending from backend they should tagged to action keyword.
    // so if anything we see like action.payload.products that is data fetched from backend.LHS is our state object in react.
    case ADMIN_PRODUCTS_SUCCESS:
      // console.log(action.payload);
      return {
        loading: false,
        products: action.payload,
      };
    case ALL_PRODUCTS_FAIL: // this case we set loading to true and products array should be initialised to empty arry
    case ADMIN_PRODUCTS_FAIL:
      return {
        loading: false,
        error: action.payload, // from the action this value get populated and we display it on screen.
      };
    case CLEAR_ERRORS: // this case we set loading to true and products array should be initialised to empty arry
      return {
        ...state,
        error: null,
      };
    // here above step we clear our error.
    default:
      return state;
  }
};

// this code is to display product details once after clicking the view product.

// product by default is empty object in state
export const productDetailsReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { ...state, loading: true };
    case PRODUCT_DETAILS_SUCCESS:
      // console.log(action);
      return { loading: false, product: action.payload };
    case PRODUCT_DETAILS_FAIL:
      return { ...state, error: action.payload };
    case CLEAR_ERRORS: // this case we set loading to true and products array should be initialised to empty arry
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// newReview reducer
export const newReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case NEW_REVIEW_REQUEST:
      return { ...state, loading: true };
    case NEW_REVIEW_SUCCESS:
      // console.log(action);
      return { loading: false, success: action.payload };
    case NEW_REVIEW_FAIL:
      return { ...state, error: action.payload };
    case NEW_REVIEW_RESET:
      return { ...state, success: false };
    case CLEAR_ERRORS: // this case we set loading to true and products array should be initialised to empty arry
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// HERE WE HANDLE BOTH DELETE AND UPDATE PRODUCT. IN ADMIN PAGE
export const prodcutReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_PRODUCT_REQUEST:
    case UPDATE_PRODUCT_REQUEST:
      return { ...state, loading: true };
    case DELETE_PRODUCT_SUCCESS:
      // console.log(action);
      return { ...state, loading: false, isDeleted: action.payload };
    case UPDATE_PRODUCT_SUCCESS:
      // console.log(action);
      return { ...state, loading: false, isUpdated: action.payload };
    case DELETE_PRODUCT_FAIL:
    case UPDATE_PRODUCT_FAIL:
      return { ...state, error: action.payload };
    case DELETE_PRODUCT_RESET:
      return { ...state, isDeleted: false };
    case UPDATE_PRODUCT_RESET:
      return { ...state, isUpdated: false };
    case CLEAR_ERRORS: // this case we set loading to true and products array should be initialised to empty arry
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// newReview reducer
export const newProductReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case NEW_PRODUCT_REQUEST:
      return { ...state, loading: true };
    case NEW_PRODUCT_SUCCESS:
      // console.log(action);
      return {
        loading: false,
        success: action.payload.success,
        product: action.payload.product,
      };
    case NEW_PRODUCT_FAIL:
      return { ...state, error: action.payload };
    case NEW_PRODUCT_RESET:
      return { ...state, success: false };
    case CLEAR_ERRORS: // this case we set loading to true and products array should be initialised to empty arry
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Product review reducer which pulls all the reviews defined on the product
export const productReviewReducer = (state = { review: [] }, action) => {
  switch (action.type) {
    case GET_REVIEWS_REQUEST:
      return { ...state, loading: true };
    case GET_REVIEWS_SUCCESS:
      // console.log(action);
      return {
        loading: false,
        reviews: action.payload,
      };
    case GET_REVIEWS_FAIL:
      return { ...state, error: action.payload };

    case CLEAR_ERRORS: // this case we set loading to true and products array should be initialised to empty arry
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// HERE WE HANDLE BOTH DELETE REVIEW. IN ADMIN PAGE
export const reviewReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_REVIEW_REQUEST:
      return { ...state, loading: true };
    case DELETE_REVIEW_SUCCESS:
      // console.log(action);
      return { ...state, loading: false, isDeleted: action.payload };

    case DELETE_REVIEW_FAIL:
      return { ...state, error: action.payload };
    case DELETE_REVIEW_RESET:
      return { ...state, isDeleted: false };

    case CLEAR_ERRORS: // this case we set loading to true and products array should be initialised to empty arry
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
