import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../Constants/cartConstants";

// what ever the user selected add all of them to cartItems array.
export const cartReducer = (
  state = { cartItems: [], shippingInfo: {} },
  action
) => {
  switch (action.type) {
    case ADD_TO_CART:
      // console.log(state);
      const item = action.payload; // action.payload is the product we have to put it into cart. we should check if item exist or not.
      // item consist of selected product
      // In this line we are checking that if the product we are adding to cart already exists in cart or not.
      // We will use find() on cartItems in state and then compare each item with the action.payload.
      // action.payload contains the product that we want to add in cart.
      // console.log(item.product);
      // console.log(state);
      // Here if a item in cart, has same id as existing product id we are putting the item from the payload else the item in that iteration, so basically we are overwritting the product?
      // Yes, we are overwriting the product data. Maybe user have updated the quantity of the product. So we have to overwrite the data of the product.
      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      ); //i.product is id of the product select its pro
      // If that product is not in the cart we will add it.If the product already exists, then we will update it will new product data like quantity.
      if (isItemExist) {
        // this is a condition where we already added an item to the cart.
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.product === isItemExist.product ? item : i
          ),
        };
      } else {
        //if item not in cart simply have to return the state & cart items are equal to what ever in the state and attach our current item.
        // here we are spreading the state and adding the item from action.payload when ever there is an empty cart item.
        //so we met with our initial cart addition.
        return { ...state, cartItems: [...state.cartItems, item] };
      }
    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.product !== action.payload), //so action.payload must contain id of that product for which we want to delete it should be
      }; // so it should passed from action.
    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };
    default:
      return state;
  }
};
