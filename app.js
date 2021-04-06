//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose  = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true, useUnifiedTopology: true } );

const itemsSchema={
  name:String
}

const Item=mongoose.model("Item",itemsSchema)

const item1=new Item({
  name:"welcome to your todo list"
});

const item2=new Item({
  name:"welcome "
});
const item3=new Item({
  name:"hey"
});

const arr=[item1,item2,item3];





app.get("/", function(req, res) 
{
  Item.find({},function(err,itemlist)
  {
    if(err)
    console.log(err);
    else
    {
      if(itemlist.length===0)
      {
        Item.insertMany(arr,function(err)
        {
          if(err)
          console.log("error");
          else
          console.log("data updated successfully");
        });
        res.redirect("/");
      }
      else
      res.render("list", {listTitle: "Today", newListItems: itemlist});

    }
   
    
  })

});

app.post("/", function(req, res){

  const item = req.body.newItem;
  const nw= new Item({
     name:item
  });
  nw.save();
  res.redirect("/");

  
});

app.post("/delete",function(req,res)
{
  const id=req.body.checkbox;
  Item.findByIdAndRemove(id,function(err)
  {
    if(err)
    console.log(err);
    else
    console.log("success delete");
  });

  res.redirect("/");
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
