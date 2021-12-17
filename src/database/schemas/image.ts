import mongoose from 'mongoose';
import images from '@typess/mongoose/schemas/image';

const imageSchema = new mongoose.Schema<images>({
    src:  {
        type: String,
        required: true,
    },
});


export default imageSchema