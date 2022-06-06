import React, { Fragment, useEffect, useState } from "react";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
//getProductDetails we should keep all the data related to product when the product get loaded.
import {
  updateProduct,
  getProductDetails,
  clearErrors,
} from "../../Actions/productActions";
import { UPDATE_PRODUCT_RESET } from "../../Constants/productConstant";

import MetaData from "../Layout/MetaData";
import SideBar from "./SideBar";

// as updating a product is nearly equivalent to adding new product data we keep almost similar code between update product and new product

const UpdateProduct = ({ match, history }) => {
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
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [seller, setSeller] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]); // these are basically old images in data base and we are supposed to delete them once we updated.
  const [imagesPreview, setImagesPreview] = useState([]);

  const alert = useAlert();
  const dispatch = useDispatch();
  const { error, product } = useSelector((state) => state.productDetails);
  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.product);

  const productId = match.params.id; // from here we are getting productid from url.

  useEffect(() => {
    // if product id is changed dispatch the product details else set the details of the product.
    // this is to handle if the product id is changed.
    if (product && product._id !== productId) {
      dispatch(getProductDetails(productId));
    } else {
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setCategory(product.category);
      setSeller(product.seller);
      setStock(product.stock);
      setOldImages(product.images);
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      history.push("/admin/products");
      alert.success("Product Created Successfully");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [
    dispatch,
    error,
    alert,
    isUpdated,
    history,
    updateError,
    product,
    productId,
  ]);

  const submitHandler = (e) => {
    e.preventDefault();
    // images.forEach(image=>{})
    const formData = {
      name,
      price,
      description,
      category,
      stock,
      seller,
      images,
    };

    dispatch(updateProduct(product._id, formData));
  };
  const onChangeHandler = (e) => {
    const files = Array.from(e.target.files);
    // here user may click on images simultaneously and upload them so we are capturing them as array of images.
    //again user may want to change the images in that case we have to clear the images preview to null so we are clearing previous state.
    // so this is to make empty for those two values as user may upload images multiple times and multiple images at single time. to handle both cases
    // we are doing the following.
    setImagesPreview([]);
    setImages([]);
    setOldImages([]);
    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          // we are using as spread operator and appending the result to it and it changes to new array
          //as loop iterates the reader.result pushes the new elment into oldArray with spread operator
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };
      reader.readAsDataURL(file); //we have to pass the blob when we read this file it should get uploaded so for that we send onload call back handler.
    });
  };

  return (
    <Fragment>
      <MetaData title={"Update Product Admin"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <SideBar />
        </div>
        <div className="col-12 col-md-10">
          <Fragment>
            <div className="wrapper my-5">
              <form
                className="shadow-lg"
                onSubmit={submitHandler}
                encType="multipart/form-data"
              >
                <h1 className="mb-4">New Product</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price_field">Price</label>
                  <input
                    type="text"
                    id="price_field"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description_field">Description</label>
                  <textarea
                    className="form-control"
                    id="description_field"
                    rows="8"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="category_field">Category</label>
                  <select
                    className="form-control"
                    id="category_field"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="stock_field">Stock</label>
                  <input
                    type="number"
                    id="stock_field"
                    className="form-control"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="seller_field">Seller Name</label>
                  <input
                    type="text"
                    id="seller_field"
                    className="form-control"
                    value={seller}
                    onChange={(e) => setSeller(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Images</label>

                  <div className="custom-file">
                    <input
                      type="file"
                      name="product_images"
                      className="custom-file-input"
                      id="customFile"
                      onChange={onChangeHandler}
                      multiple
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      Choose Images
                    </label>
                  </div>
                  {/* for handling old images */}
                  {oldImages &&
                    oldImages.map((img) => (
                      <img
                        src={img.url}
                        key={img}
                        alt={img.url}
                        className="mt-3 mr-2"
                        width="55"
                        height="52"
                      />
                    ))}
                  {imagesPreview.map((img) => (
                    <img
                      src={img}
                      key={img}
                      alt="Images Preview"
                      className="mt-3 mr-2"
                      width="55"
                      height="52"
                    />
                  ))}
                </div>

                <button
                  id="login_button"
                  type="submit"
                  className="btn btn-block py-3"
                  disabled={loading ? true : false}
                >
                  UPDATE
                </button>
              </form>
            </div>
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProduct;
