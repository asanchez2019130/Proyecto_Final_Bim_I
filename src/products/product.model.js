import mongoose from 'mongoose';

const productShema = mongoose.Schema({
    nameProduct: {
        type: String,
        required: [true, "The name is requerid"]
    },
    descriptionProduct: {
        type: String,
        required: [true, "The description is requerid"]
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    stock: {
        type: Number,
        default: 0,
        required: true
    },
    state: {
        type: Boolean,
        default: true
    }
})

export default mongoose.model('Product', productShema)