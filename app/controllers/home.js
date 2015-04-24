var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Projects = mongoose.model('Project'),
  Promise = require('promise');


module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {

    Projects.find(function (err, projects) {
        if (err) return next(err);
        else res.render('index', { title: "IssueTracker", projects: projects, project:false })
    })

});

router.get('/project/:id', function (req, res, next) {

    Projects.find(function (err, projects) {
        if (err) return next(err);
        else{
            Projects.findOne({"_id":req.params.id},function(err,project){
                console.log(project);
                if (err) return next(err);
                res.render('index', { title: "IssueTracker", projects: projects,project:project})
            })

        }
    })
});

router.get('/project/remove/:id',function(req,res,next){
    console.log("deleting")
  Projects.remove({"_id":req.params.id},function(err,result){
      console.log("project deleted")
      res.redirect('/');
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