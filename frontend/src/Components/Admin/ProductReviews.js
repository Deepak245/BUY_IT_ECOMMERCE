import React, { Fragment, useState, useEffect } from "react";
import { MDBDataTable } from "mdbreact";

import MetaData from "../Layout/MetaData";
import SideBar from "../Admin/SideBar";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";

import {
  getProductReviews,
  deleteReviews,
  clearErrors,
} from "../../Actions/productActions";
import { DELETE_REVIEW_RESET } from "../../Constants/productConstant";

const ProductReviews = () => {
  const [productId, setProductId] = useState("");
  const alert = useAlert();
  const dispatch = useDispatch();

  const { error, reviews } = useSelector((state) => state.productReviews);
  // here we get if review got deleted or not for admin page.
  const { isDeleted } = useSelector((state) => state.review);
  console.log(reviews);
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (productId !== "") {
      dispatch(getProductReviews(productId));
    }
    if (isDeleted) {
      alert.success("Review deleted Successfully");

      dispatch({ type: DELETE_REVIEW_RESET });
    }

    if (productId !== "") {
      dispatch(getProductReviews(productId));
    }
  }, [dispatch, error, alert, productId, isDeleted]);

  const deleteReviewHandler = (id) => {
    dispatch(deleteReviews(id, productId));
  };

  //   when we submit we have to send id to the function
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(getProductReviews(productId));
  };
  const setReviews = () => {
    const data = {
      columns: [
        {
          label: "Review ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Rating",
          field: "rating",
          sort: "asc",
        },
        {
          label: "Comment",
          field: "comment",
          sort: "asc",
        },
        {
          label: "User",
          field: "user",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };
    // we should loop through all the orders simply have to pu data in rows
    // what is field id we kept in column that field id should be kep in rows to link. the speciality with mdreact is it has auto search functionality
    //the total no.of reviews will come from state.
    reviews.forEach((review) => {
      data.rows.push({
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        user: review.name,

        // if order.order status exist then for that particluar order it should be delivered status.
        actions: (
          <button
            className="btn btn-danger py-1 px-2 ml-2"
            onClick={() => {
              deleteReviewHandler(review._id);
            }}
          >
            <i className="fa fa-trash"></i>
          </button>
        ),
      });
    });
    return data;
  };
  return (
    <Fragment>
      <MetaData title={"Product Reviews"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <SideBar />
        </div>
        <div className="col-12 col-md-10">
          <Fragment>
            <div className="row justify-content-center mt-5">
              <div className="col-5">
                <form onSubmit={submitHandler}>
                  <div className="form-group">
                    <label htmlFor="productId_field">Enter Product ID</label>
                    <input
                      type="text"
                      id="productId_field"
                      className="form-control"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                    />
                  </div>

                  <button
                    id="search_button"
                    type="submit"
                    className="btn btn-primary btn-block py-2"
                  >
                    SEARCH
                  </button>
                </form>
              </div>
            </div>
            {reviews && reviews.length > 0 ? (
              <MDBDataTable
                data={setReviews()}
                className="px-3"
                bordered
                striped
                hover
              />
            ) : (
              <p className="mt-5 text-center">No Reviews</p>
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductReviews;
