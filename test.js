const mongoose = require('mongoose')

const url = `mongodb+srv://rhafaelbijaksana:elbigans04@cluster0.hagyt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}

const { Schema } = mongoose;

const blogSchema = new Schema({
    title:  String, // String is shorthand for {type: String}
    author: String,
});

mongoose.connect(url,connectionParams)
    .then( async () => {
        const Model = mongoose.model('Test', blogSchema);
        const doc = new Model({title: 'rich man', author: 'rhafael'});
        await doc.save();

        console.log(await Model.find())


    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })