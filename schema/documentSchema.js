import mongoose from "mongoose";

const docSchema = mongoose.Schema({
    _id:{
        type:String,
        required: true
    }, 
    data:{
        type: Object,
        required: true
    }
});

const documentSchema = mongoose.model('document', docSchema);

export default documentSchema;