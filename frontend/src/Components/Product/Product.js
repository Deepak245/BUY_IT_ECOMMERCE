import React from "react";
import { Link } from "react-router-dom";
// we sent a prop call col from home page so adding that
const Product = ({ product, col }) => {
  return (
    <div className={`col-sm-12 col-md-6 col-lg-${col} my-3`}>
      {/* this $col multiplied by p-3 gives total number of cards to be displayed */}
      <div className="card p-3 rounded">
        <img className="card-img-top mx-auto" src={product.images[0].url} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">
            <Link to={`/product/${product._id}`}>{product.name}</Link>
          </h5>
          <div className="ratings mt-auto">
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{ width: `${(product.ratings / 5) * 100}%` }}
              ></div>
            </div>
            <span id="no_of_reviews">({product.numOfReviews})</span>
          </div>
          <p className="card-text">${product.price}</p>
          <Link
            to={`/product/${product._id}`}
            id="view_btn"
            className="btn btn-block"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
// type rsc and enter we should get plain functional compnent
// here to linke the procut id for view button we are supposed to add href and for name of product as well
// now when we click on view button the page will be redirected to individual product pageno need to specifically render/refresh the page. to avoid the specific refresh
// we are supposed to add {link } to the react router dom. change a to link
