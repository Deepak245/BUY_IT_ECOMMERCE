import React, { Fragment, useEffect, useState } from "react";
import { Carousel } from "react-bootstrap"; // its a boot strap component and hae to slide based on requirement
import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  newReview,
  clearErrors,
} from "../../Actions/productActions";
import { addItemToCart } from "../../Actions/cartActions";

import { NEW_REVIEW_RESET } from "../../Constants/productConstant";

import { useAlert } from "react-alert";

import Loader from "../Layout/Loader";
import MetaData from "../Layout/MetaData";
import ListReview from "../Review/ListReview";

const ProductDetails = ({ match }) => {
  // console.log({ match });
  const [quantity, setQuantity] = useState("1");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, product, error } = useSelector(
    (state) => state.productDetails
  );
  // console.log(product);
  const { user } = useSelector((state) => state.authDetails);
  const { error: reviewError, success } = useSelector(
    (state) => state.newReview
  );
  // we have match .params to bring in the id like param at backend to bring the id.
  useEffect(() => {
    dispatch(getProductDetails(match.params.id));
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Review posted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
  }, [dispatch, alert, error, reviewError, success, match.params.id]);

  const addToCart = () => {
    dispatch(addItemToCart(match.params.id, quantity));
    // here from match params we get id of prodct and quantity that we add from add quantity button. to this onclick event of add to cart button we
    // are linking the dispatch event action.
    alert.success("Item added to Cart");
  };
  const increaseQty = () => {
    const count = document.querySelector(".count"); // here we selecting the class name with count and getting the count values.
    if (count.valueAsNumber >= product.stock) return; // this will return product.stork/count.valueAsNumber field as it is if matches.
    // if lesser value or not true
    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };
  const decreaseQty = () => {
    const count = document.querySelector(".count"); // here we selecting the class name with count and getting the count values.
    if (count.valueAsNumber <= 1) return; // this will return product.stork/count.valueAsNumber field as it is if matches.
    // if lesser value or not true
    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };

  function setUserRatings() {
    // we should all starts first from there, here index give current iteration number; so eache iteration we are going to add
    //star value a new class value.;
    let stars = document.querySelectorAll(".star");
    console.log(stars);
    stars.forEach((star, index) => {
      star.starValue = index + 1;
      [
        //here we are adding multiple events this way to add multiple events
        "click",
        "mouseover",
        "mouseout",
      ].forEach(function (e) {
        star.addEventListener(e, showRatings);
      });
    });
    function showRatings(e) {
      stars.forEach((star, index) => {
        // if click event we simply check that
        if (e.type === "click") {
          if (index < this.starValue) {
            star.classList.add("orange"); // so here to star tag class list we are adding one more property orange class
            // when we click on rating we also need to set the rating this is done with usestate
            setRating(this.starValue);
          } else {
            star.classList.remove("orange");
          }
        }
        if (e.type === "mouseover") {
          if (index < this.starValue) {
            star.classList.add("yellow"); // so here to star tag class list we are adding one more property orange class
          } else {
            star.classList.remove("yellow");
          }
        }
        if (e.type === "mouseout") {
          star.classList.remove("yellow");
        }
      });
    }
  }

  const reviewHandler = () => {
    // const formData = new FormData();
    // formData.set("rating", rating);
    // formData.set("comment", comment);
    // formData.set("productId", match.params.id);
    const productId = match.params.id;
    const formData = { rating, comment, productId };
    dispatch(newReview(formData));
  };
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={product.name} />
          <div className="row f-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
              {/* <img
                src="https://i5.walmartimages.com/asr/1223a935-2a61-480a-95a1-21904ff8986c_1.17fa3d7870e3d9b1248da7b1144787f5.jpeg?odnWidth=undefined&odnHeight=undefined&odnBg=ffffff"
                alt="sdf"
                height="500"
                width="500"
              /> */}
              <Carousel pause="hover">
                {product.images &&
                  product.images.map((image) => (
                    <Carousel.Item key={image.public_id}>
                      <img
                        className="d-block w-100"
                        src={image.url}
                        alt={product.title}
                      />
                    </Carousel.Item>
                  ))}
              </Carousel>
            </div>

            <div className="col-12 col-lg-5 mt-5">
              <h3>{product.name}</h3>
              <p id="product_id">{product._id}</p>

              <hr />

              <div className="rating-outer">
                <div
                  className="rating-inner"
                  style={{ width: `${(product.numOfReviews / 5) * 100}%` }}
                ></div>
              </div>
              <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

              <hr />

              <p id="product_price">${product.price}</p>
              <div className="stockCounter d-inline">
                <span className="btn btn-danger minus" onClick={decreaseQty}>
                  -
                </span>

                <input
                  type="number"
                  className="form-control count d-inline"
                  value={quantity}
                  readOnly
                />

                <span className="btn btn-primary plus" onClick={increaseQty}>
                  +
                </span>
              </div>
              <button
                type="button"
                id="cart_btn"
                className="btn btn-primary d-inline ml-4"
                onClick={addToCart} // we do link the code to add selected item to the cart.
                disabled={product.stock === 0} // if product.stock is empty value we should disable this add to cart button.
              >
                Add to Cart
              </button>

              <hr />

              <p>
                Status:{" "}
                <span
                  id="stock_status"
                  className={product.stock > 0 ? "greenColor" : "redColor"}
                >
                  {" "}
                  {product.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                </span>
              </p>

              <hr />

              <h4 className="mt-2">Description:</h4>
              <p>{product.description}</p>
              <hr />
              <p id="product_seller mb-3">
                Sold by: <strong>{product.seller}</strong>
              </p>
              {/* this button should be displayed only to logged in user so modify code accordingly */}
              {/* on this button on click action is defiend as when user clicks it he should submit review */}
              {user ? (
                <button
                  id="review_btn"
                  type="button"
                  className="btn btn-primary mt-4"
                  data-toggle="modal"
                  data-target="#ratingModal"
                  onClick={setUserRatings}
                >
                  Submit Your Review
                </button>
              ) : (
                <div className="alert alert-danger mt-5" type="alert">
                  Login to POST your REVIEW
                </div>
              )}

              <div className="row mt-2 mb-5">
                <div className="rating w-50">
                  <div
                    className="modal fade"
                    id="ratingModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="ratingModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="ratingModalLabel">
                            Submit Review
                          </h5>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <ul className="stars">
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                          </ul>

                          <textarea
                            name="review"
                            id="review"
                            className="form-control mt-3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          ></textarea>
                          {/* when we click on submit review we should close this button as well so aria-label and data dismiss will do for us that work */}
                          <button
                            className="btn my-3 float-right review-btn px-4 text-white"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={reviewHandler}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {product.reviews && product.reviews.length > 0 && (
            <ListReview reviews={product.reviews} />
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
