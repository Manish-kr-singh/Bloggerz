var express = require("express") ;
var methodOverride = require("method-override") ;
var expressSanitizer = require("express-sanitizer") ;
var app = express() ;
var bodyParser = require("body-parser") ;
var mongoose = require("mongoose") ;


mongoose.connect("mongodb://localhost/restful_blog_app") ;
app.set("view engine", "ejs") ;
app.use(express.static("public")) ;
app.use(bodyParser.urlencoded({extended: true})) ;
app.use(expressSanitizer());
app.use(methodOverride("_method")) ;

//Mongoose Model Config 

var blogSchema = new mongoose.Schema({
	title: String, 
	image: String ,
	body: String ,
	created: {type: Date, default: Date.now}
}) ;


var Blog = mongoose.model("Blog", blogSchema) ;

/* 
    Blog.create({
	title: "Test",
	image: "image",
	body: "First blog"

}); */


// Restful Routes
app.get("/", function(req, res){
	res.redirect("/blogs") ;
}) ;


app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("error")
		}else{
			res.render("index", {blogs: blogs}) ;
		}
	})
}) ;

//NEW ROUTE
  app.get("/blogs/new", function(req, res){
          res.render("new") ;
  }) ;


/// create route

app.post("/blogs", function(req, res){
	console.log(req.body);
	req.body.blog.body = req.sanitize(req.body.blog.body) ;
       console.log("==============") ;
       console.log(req.body);
       Blog.create(req.body.blog, function(err,newBlog){
             if(err){
             	res,render("new") ;
             } else{
             	res.redirect("/blogs") ;
             }          
       });
});

//show route

app.get("/blogs/:id", function(req, res){
        Blog.findById(req.params.id, function(err, foundBLOG){
           if(err){
                res.redirect("/blogs") ;
           }else{
               res.render("show", {blog: foundBLOG}) ;
           }
        });
});

//Edit Route

app.get("/blogs/:id/edit", function(req,res){
	  Blog.findById(req.params.id, function(err, foundBLOg){
	  	if(err){
	  		res.redirect("/blogs") ;
	  	}else{
	  		res.render("edit", {blog: foundBLOg}) ;
	  	}
	  }) ;
}) ;

//Update route

app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body) ;
         Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedblog){
         	if(err){
                res.redirect("/blogs") ;
         	}else {
         		res.redirect("/blogs/" + req.params.id) ;
         	}
         }) ;
});


// Destroy Route

app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
         res.redirect("/blogs") ;
		}else{
           res.redirect("/blogs")
		}
	});
});


app.get("/blogs/new", function(req, res){
       res.render("new") ;
}) ;










app.listen(80, function(req, res){
	console.log( "Server is started") ;
}) ;
