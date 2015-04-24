// Project model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    title: String
});

ProjectSchema.virtual('date')
    .get(function(){
        return this._id.getTimestamp();
    });

mongoose.model('Project', ProjectSchema);
