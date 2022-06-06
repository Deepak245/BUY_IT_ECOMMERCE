import React, { Fragment, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
// CardNumberElement,CardExpiryElement,CardCvcElement all these are components from stripe not the hookes when used directly they will validate the data.
import { createOrder, clearErrors } from "../../Actions/orderAction";
import axios from "axios";

import MetaData from "../Layout/MetaData";
import CheckOutSteps from "./CheckOutSteps";

const options = {
  style: {
    base: {
      fontSize: "16px",
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

const Payment = ({ history }) => {
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.authDetails);
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { error } = useSelector((state) => state.newOrder);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }
  }, [dispatch, alert, error]);
  // here we do initialze the order.
  const order = {
    orderItems: cartItems,
    shippingInfo: shippingInfo, // this value comes from cart state.
  };
  // this is session stored value we are parsing the info
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  // how do we know that we should set these values, this is by going to backend and figuring which items we are supposed to keep
  if (orderInfo) {
    order.itemsPrice = orderInfo.itemsPrice;
    order.shippingPrice = orderInfo.shippingPrice;
    order.taxPrice = orderInfo.taxPrice;
    order.totalPrice = orderInfo.totalPrice;
  }

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    document.querySelector("#pay_btn").disabled = true;
    let res;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      res = await axios.post("/api/v1/payment/process", paymentData, config);
      console.log(res);
      const clientSecret = res.data.client_secret;
      console.log(clientSecret);
      // we should make sure stripe &element both should contain data
      if (!stripe || !elements) {
        return;
      }
      // now after verify we should use stripe to do payment. here we do type of payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });
      if (result.error) {
        alert.error(result.error.message);
        document.querySelector("#pay_btn").disabled = false;
      } else {
        // if the payment is procesed or not we check here
        if (result.paymentIntent.status === "succeeded") {
          // TO DO NEW ORDER THEN PUSH TO SUCCESS PAGE
          // once payment is succeded here we have to keep order paymentInfo.
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };
          // here once after payment is done we are supposed to dispatch the order.
          // console.log(order);
          window.localStorage.clear();
          dispatch(createOrder(order));
          history.push("/success");
        } else {
          alert.error("That there some issue while payment processing");
        }
      }
    } catch (error) {
      // ifthere is an error user can resend the payment.
      document.querySelector("#pay_btn").disabled = false;
      alert.error(error.response.data.message);
      console.log(error.response.data);
    }
  };
  return (
    <Fragment>
      <MetaData title={"Payment"} />

      <CheckOutSteps shipping confirmOrder payment />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-4">Card Info</h1>
            <div className="form-group">
              <label htmlFor="card_num_field">Card Number</label>
              <CardNumberElement
                type="text"
                id="card_num_field"
                className="form-control"
                options={options}
              />
            </div>

            <div className="form-group">
              <label htmlFor="card_exp_field">Card Expiry</label>
              <CardExpiryElement
                type="text"
                id="card_exp_field"
                className="form-control"
                options={options}
              />
            </div>

            <div className="form-group">
              <label htmlFor="card_cvc_field">Card CVC</label>
              <CardCvcElement
                type="text"
                id="card_cvc_field"
                className="form-control"
                options={options}
              />
            </div>

            <button id="pay_btn" type="submit" className="btn btn-block py-3">
              Pay {`-${orderInfo && orderInfo.totalPrice}`}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;

// stripe package should be installed both on frontend and backend to work
//@stripe/react-stripe-js @stripe/stripe-js both these needs to be installed.

// to get card details go to google and type "stripe test card"
