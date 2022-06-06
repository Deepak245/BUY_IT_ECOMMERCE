import React, { Fragment } from "react";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { addItemToCart, removeItemFromCart } from "../../Actions/cartActions";

import MetaData from "../Layout/MetaData";

const Cart = ({ history }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  // console.log(cartItems);

  const increaseQty = (id, quantity, stock) => {
    // console.log(typeof quantity);
    const newQty = parseInt(quantity) + 1;
    if (newQty > stock) return; // this will return product.stork/count.valueAsNumber field as it is if matches.
    // if lesser value or not true else dispatch add items to cart.
    dispatch(addItemToCart(id, newQty));
  };
  const decreaseQty = (id, quantity) => {
    const newQty = quantity - 1;
    if (newQty <= 0) return; // this will return product.stork/count.valueAsNumber field as it is if matches.
    // if lesser value or not true else dispatch add items to cart.
    dispatch(addItemToCart(id, newQty));
  };
  const removeCartItemHandler = (id) => {
    dispatch(removeItemFromCart(id));
  };
  const checkoutHandler = () => {
    // if user not logged in when clicked on checkout definetly we should ask used to login . that is donel like the following. the redirect code is written in login.js
    // for example user came here and he didnt logged in then the below string will get copied to location object which is collected in LoginComponent.
    history.push("/login?redirect=shipping");
  };
  return (
    <Fragment>
      <MetaData title={"Your Cart Items"} />
      {/* here check if cartitems length which mean cart items are empty */}
      {cartItems.length === 0 ? (
        <h2 className="mt-5">Your Cart is Empty </h2>
      ) : (
        <Fragment>
          <h2 className="mt-5">
            Your Cart: <b>{cartItems.length} items</b>
          </h2>

          <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8">
              {/* Here we are keeping code to loop the each and every item of the cart */}
              {cartItems.map((item) => (
                <Fragment>
                  <hr />
                  <div className="cart-item" key={item.product}>
                    <div className="row">
                      <div className="col-4 col-lg-3">
                        <img
                          src={item.image}
                          alt="Laptop"
                          height="90"
                          width="115"
                        />
                      </div>

                      <div className="col-5 col-lg-3">
                        <Link to={`/products/${item.product}`}>
                          {item.name}
                        </Link>
                      </div>

                      <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                        <p id="card_item_price">${item.price}</p>
                      </div>

                      <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                        <div className="stockCounter d-inline">
                          <span
                            className="btn btn-danger minus"
                            onClick={() =>
                              decreaseQty(item.product, item.quantity)
                            }
                          >
                            -
                          </span>
                          <input
                            type="number"
                            className="form-control count d-inline"
                            value={item.quantity} // here we are defining the quantity of the product.
                            readOnly
                          />

                          <span
                            className="btn btn-primary plus"
                            onClick={() =>
                              increaseQty(
                                item.product,
                                item.quantity,
                                item.stock
                              )
                            }
                          >
                            +
                          </span>
                        </div>
                      </div>

                      <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                        <i
                          id="delete_cart_item"
                          className="fa fa-trash btn btn-danger"
                          onClick={() => removeCartItemHandler(item.product)}
                        ></i>
                      </div>
                    </div>
                  </div>
                  <hr />
                </Fragment>
              ))}
            </div>

            <div className="col-12 col-lg-3 my-4">
              <div id="order_summary">
                <h4>Order Summary</h4>
                <hr />
                <p>
                  Subtotal:{" "}
                  <span className="order-summary-values">
                    {cartItems.reduce(
                      (acc, item) => acc + Number(item.quantity),
                      0
                    )}{" "}
                    (Units)
                  </span>
                </p>
                {/* we should multiply item quanity with item price and then add it to next item and next item is nothing but accumilator */}
                <p>
                  Est. total:{" "}
                  <span className="order-summary-values">
                    $
                    {cartItems
                      .reduce(
                        (acc, item) => acc + item.quantity * item.price,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </p>

                <hr />
                <button
                  id="checkout_btn"
                  className="btn btn-primary btn-block"
                  onClick={checkoutHandler}
                >
                  Check out
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;
