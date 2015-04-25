// Task model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    title: String,
    done:Boolean,
    project_id:String,
    description:String
});

ProjectSchema.virtual('date')
    .get(function(){
        return this._id.getTimestamp();
    });

mongoose.model('Task', ProjectSchema);
