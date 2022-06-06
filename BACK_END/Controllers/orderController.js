const Order = require("../Models/order");
const Product = require("../Models/product");

const ErrorHandler = require("../Utils/ErrorHandler");

const catchAsyncError = require("../MiddleWares/catchAsyncError");

// Create a new Order =>/api/v1/order/new

exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body; // order items is arry of all prodcust that user wants to purchase
  // all the above values are calculated in front end react part
  const order = await Order.create({
    orderItems: orderItems,
    shippingInfo: shippingInfo,
    itemsPrice: itemsPrice,
    taxPrice: taxPrice,
    shippingPrice: shippingPrice,
    totalPrice: totalPrice,
    paymentInfo: paymentInfo,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order: order,
  });
});

//get single order => /api/v1/order/:id

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("No Order Found with this Id", 404));
  }
  res.status(200).json({
    success: true,
    order: order,
  });
});

//get logged in user status => /api/v1/orders/me

exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  if (!orders) {
    return next(new ErrorHandler("No Order Found with this Id", 404));
  }
  res.status(200).json({
    success: true,
    orders: orders,
  });
});

// GET ALL ORDER => /api/v1/admin/orders
// only admin user can see all orders

exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const allOrders = await Order.find();
  let totalAmount = 0;
  allOrders.forEach(function (order) {
    totalAmount = totalAmount + order.totalPrice;
  });
  if (!allOrders) {
    return next(new ErrorHandler("No orders found from database", 404));
  }
  //   console.log(allOrders);
  res.status(200).json({
    success: true,
    totalAmount: totalAmount,
    allOrders: allOrders,
  });
});

// changing the order status  and stock of the product delivered.
//update the process of the order
exports.updateOrderDetails = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  // find the status of the order
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already Delivered this order", 400));
  }
  // if delivered update the stock of the product.
  // order items contains list of all the orders which are ordered.
  // in the order itemswe have product/quantity, we are supposed to take and build our login.
  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });
  // this orderStatus will go into request part of postman
  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();

  await order.save();
  res.status(200).json({
    success: true,
  });
});
// some times if we didnt kept [validateBeforeSave:false] we get error message when firing
// first fire GET ALL PRODUCT ROUTE and select the producut for which we did ordered
//second got ORDERS-GET ALL ORDERS this is admin route which we will get all the order details. Select the order in such away that product id is matching order
// thrid place the order in UPDATE ORDER DETAILS and send the request. it should get success
// four again fire ORDERS-GET ALL ORDERS we should see that our order status should change to DELIVERED
// five again fire GET ALL PRODCUT we should see the count coming down for our selected product.

// for deleting the order  ==> /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("New Order found with this order", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    message: "ORDER DELETED SUCCESSFULLY",
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
}
