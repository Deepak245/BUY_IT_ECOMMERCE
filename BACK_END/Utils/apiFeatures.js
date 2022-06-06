class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    // console.log("in Search")
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    // console.log({...keyword});
    this.query = this.query.find({ ...keyword });
    // console.log(this);
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    // console.log(queryCopy);
    // remove fileds for the query
    // const removeFields = ['keyword','limit','page'];
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((el) => delete queryCopy[el]);
    // console.log(queryCopy);
    // Advance filter for price in between 100 to 500 or rating greater than 3 for that we should use less than greater than
    // those lt & gt should be givin in mongoose modle find so we should use regular expression.
    //{{DOMAIN}}/api/v1/products?keyword=apple&category=Laptops&price[gte]=1&price[lte]=200
    // gte & lte are the mongo model greater than and less than to keep in find query we should add regular express for that we should
    // convert the json value to string and then add regular expresion and put in find query.they need dollar sign

    //{{DOMAIN}}/api/v1/products?keyword=apple&price[gte]=1&price[lte]=200
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    // console.log(queryStr);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultsperPage) {
    //{{DOMAIN}}/api/v1/products?page=2
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultsperPage * (currentPage - 1);

    this.query = this.query.limit(resultsperPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
