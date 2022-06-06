import React, { Fragment, useEffect, useState } from "react";
import MetaData from "./Layout/MetaData";
import Product from "../Components/Product/Product";
import Loader from "../Components/Layout/Loader";
import Pagination from "react-js-pagination"; // for pagination purpose.
import Slider from "rc-slider"; // along with this we should import css file from rc slider npm page.
import "rc-slider/assets/index.css"; // for default design of slider define range for it

import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../Actions/productActions";

import { useAlert } from "react-alert";
//The useDispatch hook is used to dispatch an action while useSelector hook is used to get the state from the redux store.
// so when ever we are loading the home page route with search tearm we kept separate route for the search tearm. so during that route also we are loading homepage.
//when we load the homepage the match prop is default browser prop contains following informate.
// isExact: true
// params:
// keyword: "apple"
// [[Prototype]]: Object
// path: "/search/:keyword"
// url: "/search/apple"
// [[Prototype]]: Object                      from this we are extracting our required keyword. this keyword we are linking to dependency parameter.

const { createSliderWithTooltip } = Slider; // this will work with version 9.6.5 lastest version has some issues.

const Range = createSliderWithTooltip(Slider.Range); // this approach is used when we want a tool tip to be displayed on the slider for price range.

// once the keyword is changed useEffect triggers and page will get rendered itself. now the keyword we are passing it to actionfile. for futher explanation go to product action js ffile

const Home = ({ match }) => {
  const categories = [
    // we get these values we took from backend to remove the errors
    "Electronics",
    "Cameras",
    "Laptops",
    "Accessories",
    "HeadPhones",
    "Food",
    "Clothes/Shoes",
    "Sports",
    "OutDoors",
    "Home",
  ];
  // we set currentpage using usestate hook to change value of current page we are using setCurrentPage ; so change we are change current page value and set new value
  // if we change current page based on that page we should display products so we link currentpage to dependency array
  //console.log(match);
  // const { keyword } = useParams(); // the keyword we get from search window should be send to backend so link it to getproducts action is dispatch of useeffect

  // this line would be activated when ever the state changes as we should pull the poducts from the newly modified state object i.e [products] which we defined in reducer
  // so useSelector is a hook which is used to pull the state from the redux out into react side. state is an object to that object products is userdefined state.
  // we are pullingout user defined updated [products] state to react side using useSelector
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000]); // these are for price filter
  const [category, setCategory] = useState(""); // this are for category filter. we will get list of category from backend.
  const [rating, setRating] = useState(0); // initial rating is zero.

  const alert = useAlert();
  const dispatch = useDispatch();
  // console.log(keyword);
  // this line would be activated when ever the state changes as we should pull the poducts from the newly modified state object i.e [products] which we defined in reducer
  // so useSelector is a hook which is used to pull the state from the redux out into react side. state is an object to that object products is userdefined state.
  // we are pullingout user defined updated [products] state to react side using useSelector
  // what ever is in state we should pull then like below
  const {
    loading,
    products,
    productCount,
    resPerPage,
    filteredProductsCount,
    error,
  } = useSelector((state) => state.products);
  // console.log(productCount);
  // console.log(state.products);
  // this run when component loads.this is first hook it will run when component loads.
  // basically like a constructor

  // console.log(keyword);
  const keyword = match.params.keyword;
  // console.log(keyword);
  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    dispatch(getProducts(keyword, currentPage, price, category, rating)); // getProducts is basically an action so we using dispatch which gets trigger when the home page loads. i.e action is triggered on page load.
  }, [dispatch, alert, error, currentPage, keyword, price, category, rating]); // when ever the error occurs we should display the error for that reason we kept error in dependency array of use effect
  // we should provide key value one the product is render so we provided key value to className="col-sm-12 col-md-6 col-lg-3 my-3
  //{products mean if products exits that is meaning of the line then map the products
  // when price changed render it , when category changed render it.
  // once rating changes useEffect should run properly so we kept in dependency filter.

  // when ever there is change in new alert the alert value should get changed/rendered so added to dependency array.
  function setCurrentPageNo(pagenumber) {
    // console.log(pagenumber);
    setCurrentPage(pagenumber);
  }
  //we display filter when some on search something like on search page we should display fileter so below to classname row we keep our code.
  let count = productCount;
  // console.log(count);
  if (keyword) {
    // if keyword exist which mean we are on filtered page. in this case we have less prodcuts.
    count = filteredProductsCount;
  }
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products Online"} />
          <h1 id="products_heading">Latest Products</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              {/* if keyword exist do something i.e display filter else display plain products forthat we right below logic */}
              {keyword ? (
                <Fragment>
                  <div className="col-6 col-md-3 mt-5 mb-5">
                    <div className="px=5">
                      {/* marks is an objec which we should define minimux mark and maximum mark. we should set min and max values */}
                      <Range
                        marks={{
                          1: `$1`,
                          1000: `$1000`,
                        }}
                        min={1}
                        max={1000}
                        defaultValue={[1, 1000]}
                        tipFormatter={(value) => `$${value}`}
                        tipProps={{ placement: "top", visible: true }}
                        value={price}
                        onChange={(price) => setPrice(price)}
                      />
                      <hr className="my-5" />
                      <div className="mt-5">
                        <h4 className="mb-3">categories</h4>
                        <ul className="pl-0">
                          {categories.map((category) => (
                            <li
                              style={{
                                cursor: "pointer",
                                listStyleType: "none",
                              }}
                              key={category}
                              onClick={() => setCategory(category)}
                            >
                              {category}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <hr className="my-3" />
                      <div className="mt-5">
                        <h4 className="mb-3">Ratings</h4>
                        <ul className="pl-0">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <li
                              style={{
                                cursor: "pointer",
                                listStyleType: "none",
                              }}
                              key={star}
                              onClick={() => setRating(star)}
                            >
                              <div className="rating-outer">
                                <div
                                  className="rating-inner"
                                  style={{ width: `${star * 20}%` }}
                                ></div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-9">
                    <div className="row">
                      {/* without col in product the ui will get rendered in damaged way so to rectify we add col to product component */}
                      {/* here we should display total columns to be four as slider is included */}
                      {products &&
                        products.map((product) => (
                          <Product
                            key={product._id}
                            product={product}
                            col={4}
                          />
                        ))}
                    </div>
                  </div>
                </Fragment>
              ) : (
                products &&
                products.map((product) => (
                  // here as we dont display slider so total colomuns will be three so col=3
                  <Product key={product._id} product={product} col={3} />
                ))
              )}
            </div>
          </section>
          {resPerPage <= count && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={productCount}
                onChange={setCurrentPageNo}
                nextPageText={"Next"}
                prevPageText={"PreviousPage"}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;

//we should fill ratings as well for that we use inner class style attribute with a formula for className="rating-inner"
// now to get product details we have to create a separate component for them.
// active page is current page, itemscountperpage is equal to value we pass from pagination code
// itemClass & link class are from bootstrap no need to hadle them

// sometimes we want to show only two products from data base and no need to display pagination. then we should do following.

// Error:-
// bellow errow will come if we didnt kept keyword in search when we use axios.
//Proxy error: Could not proxy request /api/v1/products?page=1 from localhost:3000 to http://localhost:4000/.
//See https://nodejs.org/api/errors.html#errors_common_system_errors for more information (ECONNREFUSED).
