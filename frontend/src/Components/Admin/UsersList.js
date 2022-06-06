import React, { Fragment, useEffect } from "react";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";

import { allUsers, clearErrors, deleteUser } from "../../Actions/userActions";
import { DELETE_USER_RESET } from "../../Constants/userConstants";

import Loader from "../Layout/Loader";
import MetaData from "../Layout/MetaData";
import SideBar from "../Admin/SideBar";

const UsersList = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, users } = useSelector((state) => state.allUsers);
  // here we get if user got deleted or not for admin page.
  const { isDeleted } = useSelector((state) => state.profileDetails);
  // console.log(users);
  useEffect(() => {
    dispatch(allUsers());
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("USER deleted Successfully");
      history.push("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }
  }, [dispatch, error, alert, isDeleted, history]);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };
  const setUsers = () => {
    const data = {
      columns: [
        {
          label: "User ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "Role",
          field: "role",
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
    users.forEach((user) => {
      data.rows.push({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        // if order.order status exist then for that particluar order it should be delivered status.
        actions: (
          <Fragment>
            <Link
              to={`/admin/user/${user._id}`}
              className="btn btn-primary py-1 px-2"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button
              className="btn btn-danger py-1 px-2 ml-2"
              onClick={() => deleteUserHandler(user._id)}
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
    <Fragment>
      <MetaData title={"All Users"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <SideBar />
        </div>
        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5">All Users</h1>
            {loading ? (
              <Loader />
            ) : (
              <Fragment>
                <MDBDataTable
                  data={setUsers()}
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

export default UsersList;
