const Product = require('../Models/product');
const dotenv = require("dotenv");
const connectDatabase = require('../config/database');

const products = require('../Data/product');


// importing config file to use config variables
dotenv.config({path:'BACK_END/config/config.env'});


connectDatabase();

const seedProducts = async ()=>{
    try{
        await Product.deleteMany();
        console.log("Products are Deleted");

        await  Product.insertMany(products);
        console.log('All products are added');
        process.exit();
    }catch(error){
        console.log(error.message);
        process.exit();
    }
}

seedProducts();