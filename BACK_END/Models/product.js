const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter product name'],
        trim:true,
        maxLenght:[100,'product name cannot exceed 100 characters']
    },
    price:{
        type:Number,
        required:[true,'please enter product price'],
        trim:true,
        maxLenght:[5,'product name cannot exceed 5 characters'],
        default:0.0
    },
    description:{
        type:String,
        required:[true,'please enter product description']
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                reuired:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,'please enter category of the product'],
        enum:{
            values:[
                'Electronics',
                'Cameras',
                'Laptops',
                'Accessories',
                'HeadPhones',
                'Food',
                'Clothes/Shoes',
                'Sports',
                'OutDoors',
                'Home'
            ],
            message:'please select correct category for product'
        }
    },
    seller:{
        type:String,
        required:[true,"please enter product seller"]
    },
    stock:{
        type:Number,
        required:[true,'please enter product stock'],
        maxLenght:[5,'Product name cannot exceed  5 characters'],
        default:0
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model('product',productSchema);