var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Projects = mongoose.model('Project'),
  Tasks = mongoose.model('Task'),
  Promise = require('promise');


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
                Tasks.find({project_id:req.params.id},function(err,tasks){
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
    console.log("deleting")
  Tasks.remove({"_id":req.params.id_task},function(err,result){
      console.log("project deleted")
      res.redirect('/project/'+req.params.id);
  })
})

router.post('/project/add/',function(req,res,next){
    console.log(req.body)
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

router.post('/project/edit/:id/:id_task',function(req,res,next){
    console.log(req.body)
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
router.post('/project/:id/add/',function(req,res,next){
    console.log(req.body)
    req.body.project_id = req.params.id;
    var task = new Tasks(req.body)
    task.save(function(err,result){
        if(err) return next(err);
        console.log(result);
        res.redirect('/project/'+req.params.id);
    })
})