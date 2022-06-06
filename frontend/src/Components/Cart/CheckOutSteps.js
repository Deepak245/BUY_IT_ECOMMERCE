// this is to create checkout steps after shipping info.

import React from "react";
import { Link } from "react-router-dom";

// should pass three values to the component as props at different stages
const CheckOutSteps = ({ shipping, confirmOrder, payment }) => {
  return (
    <div className="checkout-progress d-flex justify-content-center mt-5">
      {/* if we are shipping this code should work, the then part consist of  if shipping doesent exit which mean we are not on Shipping page. */}
      {/* this class definition declared in App.css file */}
      {shipping ? (
        <Link to="shipping" className="float-right">
          <div className="triangle2-active"></div>
          <div className="step active-step">Shipping</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="#!" disabled>
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete">Shipping</div>
          <div className="triangle-incomplete"></div>
        </Link>
      )}
      {/* this code should run on cifrm order page */}

      {confirmOrder ? (
        <Link to="/order/confirm" className="float-right">
          <div className="triangle2-active"></div>
          <div className="step active-step">confirmOrder</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="#!" disabled>
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete">confirmOrder</div>
          <div className="triangle-incomplete"></div>
        </Link>
      )}

      {/* this code should run on payment order page */}

      {payment ? (
        <Link to="/payment" className="float-right">
          <div className="triangle2-active"></div>
          <div className="step active-step">Payment</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="#!" disabled>
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete">Payment</div>
          <div className="triangle-incomplete"></div>
        </Link>
      )}
    </div>
  );
};

export default CheckOutSteps;
