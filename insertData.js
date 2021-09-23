const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const typeProjectSchema = new mongoose.Schema({
    _id:  {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    projects: [{ type: Schema.Types.ObjectId, ref: 'Projects' }]
});

const toolSchema = new mongoose.Schema({
    name:  {
        type: String,
        required: true,
    },
    as: String,
});

const imageSchema = new mongoose.Schema({
    src:  {
        type: String,
        required: true,
    },
});

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    tools: [toolSchema],
    typeProject: { type: String, ref: 'typeProjects' },
    images: [imageSchema],
    description: {
        type: String,
        required: true,
    },
    url: {
        type: String,
    }
});

(async () => {
    try {
        await mongoose.connect(`mongodb+srv://rhafaelbijaksana:elbigans04@cluster0.hagyt.mongodb.net/myFirstDatabase`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false,
            bufferMaxEntries: 0,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        const TypeProject = mongoose.model('typeProjects', typeProjectSchema);
        const Projects = mongoose.model('Projects', projectSchema);
        const Tools = mongoose.model('tools', toolSchema);

        // const typeProject = new TypeProject({_id: 'A1', name: 'Personal Project'});
        // await typeProject.save();

        const typeProject2 = await Tools.findByIdAndUpdate({_id: '614c8e51123460433d53b9cc'} ,{name: 'Work'}, {new: true});
        

        console.log(typeProject2)
        

        
        // const project = new Projects({
        //     title: 'elbi library', 
        //     startDate: new Date('2020 10 1'), 
        //     endDate: new Date('2020 10 1'), 
        //     startDate: new Date('2020 11 1'),
        //     tools: [
        //         {
        //             name: 'express js',
        //             description: 'backend framework'
        //         },
        //         {
        //             name: 'pug',
        //             description: 'template engine'
        //         }
        //     ],
        //     typeProject: 'A1',
        //     images: [
        //         {
        //             src: '/images/profile.jpg'
        //         }
        //     ],
        //     description: `this is for management library`,
        //     url: null,

        // });

        // await project.save()
        await mongoose.disconnect()
        process.exit()
    } catch (err) {
        console.log(err)
    }
}) ()
