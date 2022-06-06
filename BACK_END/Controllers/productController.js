const res = require("express/lib/response");
const Product = require("../Models/product");
const ErrorHandler = require("../Utils/ErrorHandler");
const catchAsyncErrors = require("../MiddleWares/catchAsyncError");
const APIFeatures = require("../Utils/apiFeatures");
const { cloudinary } = require("../Utils/cloudinary");

// Create new product which goes to api/vi/prodcut/new

exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];
  //if body.images is an string these images need to be pushed into images arry else they should be pushed into simple images.
  //use may upload one image
  if (typeof req.body.images === "string") {
    images.push(req.body.images); // if single image then we should convert into array of images.
  } else {
    images = req.body.images; // this is for multiple images.
  }
  let imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "products",
      width: 150,
      crop: "scale",
    });
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images = imagesLinks;
  req.body.user = req.user;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product: product,
  });
});

// get all products api/v1/products
// exports.getProducts = catchAsyncErrors(async (req, res, next) => {
//   const resultsperPage = 4;
//   const productCount = await Product.countDocuments(); // this line is for front end implementation.
//   const apiFeatures = new APIFeatures(Product.find(), req.query)
//     .search()
//     .filter()
//     .pagination(resultsperPage);
//   const products = await apiFeatures.query;
//   // const products = await Product.find();
//   res.status(200).json({
//     success: true,
//     //count:products.length,
//     productCount: productCount,
//     products: products,
//     resultsperPage: resultsperPage,
//     message: "This Route will show all products in DataBase",
//   });
// });

exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resultsperPage = 4;
  const productCount = await Product.countDocuments();

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeatures.query;
  let filteredProductsCount = products.length;
  // console.log(filteredProductsCount);
  apiFeatures.pagination(resultsperPage);
  products = await apiFeatures.query.clone();
  // console.log(products.length);

  // console.log(apiFeatures1);
  res.status(200).json({
    success: true,
    productCount: productCount,
    products: products,
    resultsperPage: resultsperPage,
    filteredProductsCount: filteredProductsCount,
    message: "This Route will show all products in DataBase",
  });
});

// Duplicate Query Execution
// Mongoose no longer allows executing the same query object twice.
// If you do, you'll get a Query was already executed error. Executing the same query instance twice is typically indicative of mixing callbacks and promises,
// but if you need to execute the same query twice, you can call Query#clone() to clone the query and re-execute it.
// https://mongoosejs.com/docs/migrating_to_6.html#duplicate-query-execution

// get single product details api/v1/product/:id

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    // return res.status(404).json({
    //     success:false,
    //     message:"product not found"
    // });
    return next(new ErrorHandler("Product not Found", 404));
  }
  res.status(200).json({
    success: true,
    product: product,
  });
});

// UPDATE PROduct /api/v1/product/:id

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }

  let images = [];
  //if body.images is an string these images need to be pushed into images arry else they should be pushed into simple images.
  //use may upload one image
  if (typeof req.body.images === "string") {
    images.push(req.body.images); // if single image then we should convert into array of images.
  } else {
    images = req.body.images; // this is for multiple images.
  }

  // checking condition for undefined.
  if (images !== undefined) {
    // code for deleteing images associated to the productt.
    for (let i = 0; i < product.images.length; i++) {
      const result = await cloudinary.uploader.destroy(
        product.images[i].public_id,
        { folder: "Amrith-BuyIt-Images/Products" }
      );
    }
    let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "Amrith-BuyIt-Images/Products",
        width: 150,
        crop: "scale",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  }
  let imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "Amrith-BuyIt-Images/Products",
      width: 150,
      crop: "scale",
    });
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images = imagesLinks;

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product: product,
  });
});

// DELETING PRODUCT /api/v1/admin/product/:id

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }

  // code for deleteing images associated to the productt.
  for (let i = 0; i < product.images.length; i++) {
    const result = await cloudinary.uploader.destroy(
      product.images[i].public_id,
      { folder: "products" }
    );
  }
  await product.remove();

  res.status(200).json({
    success: true,
    message: "product Deleted Successfully",
  });
});

// FOR REVIEW ROUTS

//create new review = > api/v1/review
// from request we should pull three thing rating comment product id add review object to db
// this route should notonly get review but also should update old review.
// once reviewed we should update the rating as well.
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment: comment,
  };

  const product = await Product.findById(productId);
  // console.log(product.reviews[0]._id + "" + req.user._id);
  // revies is an array on that we are firing find
  // if any review matches the current user which mean that user had already review this product
  // console.log(product.reviews.map((item) => console.log(item.user.toString())));
  // console.log("From Request");
  // console.log(req.user._id);
  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  // if product is reviewed update it to array
  // else not reviewed then we should push that review into product review arry. then we should update num of review
  // console.log("is it reviewed " + isReviewed);
  if (isReviewed) {
    product.reviews.forEach((review) => {
      // console.log(review.user.toString());
      // console.log(req.user._id.toString());
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
      // console.log(review.comment);
    });
  } else {
    product.reviews.push(review);
    console.log("in Else part");
    product.numOfReiews = product.reviews.length;
  }
  // we should fine average rating for that we use method called reduce.
  // reduce will take multiple values and reduct it a single value
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  // console.log(product.ratings);
  await product.save({ validateBeforeSave: false });
  // console.log(product);
  res.status(200).json({
    success: true,
    message: "Review Ratings Updated Successfull",
  });
});

// GET PRODUCT REVIEWS =>/api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  // console.log(product)
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//Delete a product Review =>api/v1/reviews
// should pass two details one id of the review and id of the product
// We should use the product for which there is user object is accessable. for that product only we can able to delete the reveiwe.
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  // console.log(req.query.productId);
  // console.log(req.query.id);
  // if reqview.id !== req.query id then then add it to reviews
  // if that doesnot matches no need to add it in revies
  // so finally it contains all the reviews which we should not delete
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );
  const numofReviews = reviews.length;
  // console.log(reviews+"_"+numofReviews)
  // we should modify ratings as well and we should modif it.
  const ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) / numofReviews;
  // console.log(ratings)
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numofReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

// get all products to admin /api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  // console.log(products);
  res.status(200).json({
    success: true,
    products: products,
  });
});
