// Task model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    _id:String,
    title: String,
    done:Boolean,
    project_id:String,
    description:String,
    _v:Number,
    deleted:{type:Boolean,defult:false}
});
ProjectSchema.set('versionKey', false);
ProjectSchema.virtual('date')
    .get(function(){
        return this._id.getTimestamp();
    });

mongoose.model('Task', ProjectSchema);
