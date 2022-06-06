import React, { Fragment, useEffect } from "react";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";

import {
  getAdminProducts,
  deleteProduct,
  clearErrors,
} from "../../Actions/productActions";
import { DELETE_PRODUCT_RESET } from "../../Constants/productConstant";

import Loader from "../Layout/Loader";
import MetaData from "../Layout/MetaData";
import SideBar from "../Admin/SideBar";

const ProductList = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, products } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );
  useEffect(() => {
    dispatch(getAdminProducts());
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("product deleted Successfully");
      history.push("/admin/products");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
  }, [dispatch, error, alert, deleteError, isDeleted, history]);
  //   console.log(products);
  const setProducts = () => {
    //    here data contains two thing coloumns and rows  colums is arry of objects and each object is defining how the column should look like
    // based on field we will connect row and column. so give that carefully. Actions Colum is like we can view/deleted row based on privellage.
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Price",
          field: "price",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
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
    products.forEach((product) => {
      data.rows.push({
        id: product._id,
        name: product.name,
        price: `$${product.price}`,
        stock: product.stock,

        // if order.order status exist then for that particluar order it should be delivered status.
        actions: (
          <Fragment>
            <Link
              to={`/admin/product/${product._id}`}
              className="btn btn-primary py-1 px-2"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button
              className="btn btn-danger py-1 px-2 ml-2"
              onClick={() => deleteProductHandler(product._id)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </Fragment>
        ),
      });
    });
    return data;
  };

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };
  return (
    <Fragment>
      <MetaData title={"All Products"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <SideBar />
        </div>
        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5">All Products</h1>
            {loading ? (
              <Loader />
            ) : (
              <Fragment>
                <MDBDataTable
                  data={setProducts()}
                  className="px-3"
                  bordered
                  striped
                  hover
                />
              </Fragment>
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductList;
