import React, { Fragment, useEffect } from "react";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";

import { myOrders, clearErrors } from "../../Actions/orderAction";

import Loader from "../Layout/Loader";
import MetaData from "../Layout/MetaData";

const ListOrder = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector((state) => state.myOrders);
  useEffect(() => {
    dispatch(myOrders());
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

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
          label: "Num of Items",
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
          sort: "asc",
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
          <Link to={`/order/${order._id}`} className="btn btn-primary">
            <i className="fa fa-eye"></i>
          </Link>
        ),
      });
    });
    return data;
  };
  return (
    <Fragment>
      <MetaData title={"My Orders"} />
      <h1 className="my-5">My Orders</h1>
      {loading ? (
        <Loader />
      ) : (
        <MDBDataTable
          data={setOrders()}
          className="px-3"
          bordered
          striped
          hover
        />
      )}
    </Fragment>
  );
};

export default ListOrder;
