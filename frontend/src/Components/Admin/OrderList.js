import React, { Fragment, useEffect } from "react";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";

import { allOrders, deleteOrder, clearErrors } from "../../Actions/orderAction";
import { DELETE_ORDER_RESET } from "../../Constants/orderConstatnts";

import Loader from "../Layout/Loader";
import MetaData from "../Layout/MetaData";
import SideBar from "../Admin/SideBar";

const OrderList = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector((state) => state.allOrders);
  const { isDeleted } = useSelector((state) => state.order);
  //   const { error: deleteError, isDeleted } = useSelector(
  //     (state) => state.product
  //   );
  useEffect(() => {
    dispatch(allOrders());
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    // if (deleteError) {
    //   alert.error(deleteError);
    //   dispatch(clearErrors());
    // }
    if (isDeleted) {
      alert.success("order deleted Successfully");
      history.push("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }
  }, [dispatch, error, alert, isDeleted, history]);
  //   console.log(products);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };
  const setOrders = () => {
    //    here data contains two thing coloumns and rows  colums is arry of objects and each object is defining how the column should look like
    // based on field we will connect row and column. so give that carefully. Actions Colum is like we can view/deleted row based on privellage.
    const data = {
      columns: [
        {
          label: "Order ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "No of Items",
          field: "numofItems",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "amount",
          sort: "asc",
        },
        {
          label: "Status",
          field: "status",
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
    orders.forEach((order) => {
      data.rows.push({
        id: order._id,
        numofItems: order.orderItems.length,
        amount: `$${order.totalPrice}`,
        status:
          order.orderStatus &&
          String(order.orderStatus).includes("Delivered") ? (
            <p style={{ color: "green" }}>{order.orderStatus}</p>
          ) : (
            <p style={{ color: "red" }}>{order.orderStatus}</p>
          ),

        // if order.order status exist then for that particluar order it should be delivered status.
        actions: (
          <Fragment>
            <Link
              to={`/admin/order/${order._id}`}
              className="btn btn-primary py-1 px-2"
            >
              <i className="fa fa-eye"></i>
            </Link>
            <button
              className="btn btn-danger py-1 px-2 ml-2"
              onClick={() => deleteOrderHandler(order._id)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </Fragment>
        ),
      });
    });
    return data;
  };
  return (
    // as we should keep product list we are supposed to keep code from products list
    <Fragment>
      <MetaData title={"All Ordes"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <SideBar />
        </div>
        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5">All Orders</h1>
            {loading ? (
              <Loader />
            ) : (
              <Fragment>
                <MDBDataTable
                  data={setOrders()}
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

export default OrderList;
