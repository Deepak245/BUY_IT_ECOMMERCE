const express = require("express");
const router = express.Router();

const {
  newProduct,
  getProducts,
  getAdminProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../Controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../MiddleWares/auth");

router.route("/products").get(getProducts);
router.route("/admin/products").get(getAdminProducts);

router.route("/product/:id").get(getSingleProduct); // for getting single product

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct); // as we have post the new product we are using post method.

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct) // for updating the product
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router.route("/reviews").get(isAuthenticatedUser, getProductReviews);

router.route("/reviews").delete(isAuthenticatedUser, deleteReview);

module.exports = router;
