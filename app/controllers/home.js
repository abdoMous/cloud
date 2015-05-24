var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Projects = mongoose.model('Project'),
  Tasks = mongoose.model('Task'),
  Promise = require('promise');

var guid = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {

    Projects.find(function (err, projects) {
        if (err) return next(err);
        else res.render('index', { title: "IssueTracker", projects: projects, project:false,task:false })
    })

});

router.get('/project/:id', function (req, res, next) {

    Projects.find(function (err, projects) {
        if (err) return next(err);
        else{
            Projects.findOne({"_id":req.params.id},function(err,project){
                console.log(project);
                if (err) return next(err);
                Tasks.find({project_id:req.params.id,deleted:false},function(err,tasks){
                    console.log(tasks);
                    if(err)  next(err)
                    res.render('index', { title: "IssueTracker", projects: projects,project:project,tasks:tasks,task:false})
                })
            })

        }
    })
});
//remove project
router.get('/project/remove/:id',function(req,res,next){
    console.log("deleting")
  Projects.remove({"_id":req.params.id},function(err,result){
      console.log("project deleted")
      res.redirect('/');
  })
})
//remove task
router.get('/project/remove/:id/:id_task',function(req,res,next){
    req.body._v = Number(new Date());
    req.body.deleted = true;
    Tasks.update({_id:req.params.id_task},req.body,function(err,result){
        if(err) return next(err);
        console.log(result);
        res.redirect('/project/'+req.params.id);
    })
})

router.post('/project/add/',function(req,res,next){
    console.log(req.body)
    req.body = false
    var project = new Projects(req.body)
    project.save(function(err,result){
        if(err) return next(err);
        console.log(result);
        res.redirect('/');
    })
})

router.post('/project/edit/:id',function(req,res,next){
    console.log(req.body)
    Projects.update({_id:req.params.id},req.body,function(err,result){
        if(err) return next(err);
        console.log(result);
        res.redirect('/');
    })
})

// Edit task
router.post('/project/edit/:id/:id_task',function(req,res,next){
    console.log(req.body)
    req.body._v = Number(new Date());
    Tasks.update({_id:req.params.id_task},req.body,function(err,result){
        if(err) return next(err);
        console.log(result);
        res.redirect('/project/'+req.params.id);
    })
})

router.get('/project/:id/:id_task', function (req, res, next) {

    Projects.find(function (err, projects) {
        if (err) return next(err);
        else{
            Projects.findOne({"_id":req.params.id},function(err,project){
                console.log(project);
                if (err) return next(err);
                Tasks.find({project_id:req.params.id},function(err,tasks){
                    console.log(tasks);
                    if(err)  next(err)
                    Tasks.findOne({"_id":req.params.id_task},function(err,task){
                        if(err) next(err)
                        res.render('index', { title: "IssueTracker", projects: projects,project:project,tasks:tasks,task:task});
                    })
                })
            })

        }
    })
});
//Add Task
router.post('/project/:id/add/',function(req,res,next){
    console.log(req.body)
    req.body._id = guid();
    req.body.deleted = false;
    req.body.project_id = req.params.id;
    req.body._v = Number(new Date());
    var task = new Tasks(req.body)
    task.save(function(err,result){
        if(err) return next(err);
        console.log(result);
        res.redirect('/project/'+req.params.id);
    })
})
router.get('/sync/projects',function(req,res,next){
    Projects.find(function (err, projects) {
        res.json(projects)
    })
});
//trigger
router.post('/sync/',function(req,res,next){
    console.log("sync");
    console.log(req.body);
    var tasks = req.body.tasks
    var lastSync = req.body.lastSync
    var version = Number(new Date());
    for(var i in tasks){

        tasks[i]._id = tasks[i].id
        delete tasks[i].id;
        tasks[i]._v = version;

        switch(tasks[i].flag){
            case 1://create task
                tasks[i].deleted = false;
                var task = new Tasks(tasks[i]);
                task.save(function(err,result){
                    //if(err) return next(err);
                    console.log("item "+tasks[i].title+" added");
                })
                break;
            case 2://edit task
                tasks[i]._v = version;
                Tasks.update({_id:tasks[i]._id},tasks[i],function(err,result){
                    if(err) return next(err);
                    console.log(result);
                })
                break;
            case 3://delete task
                tasks[i].deleted = true;
                Tasks.update({_id:tasks[i]._id},tasks[i],function(err,result){
                    console.log(result);
                })
                break;
        }

    }

    Tasks.find({'_v':{'$gt':lastSync}},function(err,tasks){
        res.json({synced:true,_v:version,changes:tasks});
    })
})