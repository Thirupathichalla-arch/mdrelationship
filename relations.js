const express = require("express");
const mongoose=require("mongoose")

let users = require("./MOCK_DATA.json");


const connect=() =>{
    return mongoose.connect("mongodb://127.0.0.1:27017/test");
};
//--------userdata----
const userSchema=new mongoose.Schema({
    first_name:{type: String,required:true},
    last_name:{type:String,required:false},
    email:{type:String,required:true,unique:true},
    gender:{type:String,required:false,default:"Male"},
    age:{type:Number,required:true},
});

const User=mongoose.model("user",userSchema);

//------postdata----
const postSchema=new mongoose.Schema({
    title:{ type:String,required:true},
    body:{ type:String,required:true},
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    tag_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"tag",
        required:true,
    }

});
const Post=mongoose.model("post",postSchema)

//------commentdata----
const  commentSchema=new mongoose.Schema({
    body:{type:String,required:true},
    
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post",
        required:true,
    }
});
const Comment=mongoose.model("comment",commentSchema)
//------tagdata----
const  tagSchema=new mongoose.Schema({
    name:{type:String,required:true},
});
const Tag=mongoose.model("tag",tagSchema)

const app = express();
app.use(express.json());


//=======userdata=========

app.post("/users", async(req,res)=>{
    try{
    const user=await User.create(req.body);
    res.status(201).send(user);
    }catch(e){
        res.status(500).json({status:e.message});
    }
});

app.get("/users", async(req,res)=>{
    const users=await User.find({email:"a@a.com"}).lean().exec();
    res.send({users});
});
app.get("/users/:id", async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        res.send({user});
    }
    catch(e){
        res.status(500).json({status:e.message});
    }

});
app.patch("/users/:id",async(req,res)=>{
        try{
const user=await User.findByIdAndUpdate(req.params.id, req.body,{ new:true,
            })
            .lean().exec();
            return res.status(201).send(user);
        }catch(e){
            return res.status(500).json({message:e.message,status:"failed"});
        }
    });
   
app.delete("/users/:id",async(req,res)=>{
    try{
    const user=await User.findOneAndDelete(req.params.id).lean().exec();
    res.status(200).send(user);
    }catch(e){
    return res.status(500).json({message:e.message,status:"failed"});
}
});

//=======tagdata=========

app.post("/tags", async(req,res)=>{
    try{
    const tag=await Tag.create(req.body);
    res.status(201).send(tag);
    }catch(e){
        res.status(500).json({status:e.message});
    }
});

app.get("/tags", async(req,res)=>{
    const tags=await Tag.find({email:"a@a.com"}).lean().exec();
    res.send({tags});
});
app.get("/tags/:id", async(req,res)=>{
    try{
        const tag=await Tag.findById(req.params.id);
        res.send({tag});
    }
    catch(e){
        res.status(500).json({status:e.message});
    }

});
app.patch("/tags/:id",async(req,res)=>{
        try{
const tag=await Tag.findByIdAndUpdate(req.params.id, req.body,{ new:true,
            })
            .lean().exec();
            return res.status(201).send(tag);
        }catch(e){
            return res.status(500).json({message:e.message,status:"failed"});
        }
    });
   
app.delete("/tags/:id",async(req,res)=>{
    try{
    const tag=await Tag.findOneAndDelete(req.params.id).lean().exec();
    res.status(200).send(tag);
    }catch(e){
    return res.status(500).json({message:e.message,status:"failed"});
}
});
app.get("/tags/:id/posts", async (req, res) => {
    try {
      const tag = await Tag.findById(req.params.id).lean().exec();
      const posts = await Post.find({ tag_ids: tag._id })
        .populate("tag_ids")
        .lean()
        .exec();
  
      return res.status(200).send({ posts, tag });
    } catch (e) {
      return res.status(500).json({ message: e.message, status: "Failed" });
    }
  });

//==========postschema====


app.post("/posts", async(req,res)=>{
    try{
    const post=await Post.create(req.body);
    res.status(201).send(post);
    }catch(e){
        res.status(500).json({status:e.message});
    }
});

app.get("/posts", async(req,res)=>{
    const posts=await Post.find({email:"a@a.com"}).lean().exec();
    res.send({posts});
});
app.get("/posts/:id", async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        res.send({post});
    }
    catch(e){
        res.status(500).json({status:e.message});
    }

});
app.patch("/posts/:id",async(req,res)=>{
        try{
const post=await Post.findByIdAndUpdate(req.params.id, req.body,{ new:true,
            })
            .lean().exec();
            return res.status(201).send(post);
        }catch(e){
            return res.status(500).json({message:e.message,status:"failed"});
        }
    });
   
app.delete("/posts/:id",async(req,res)=>{
    try{
    const post=await Post.findOneAndDelete(req.params.id).lean().exec();
    res.status(200).send(post);
    }catch(e){
    return res.status(500).json({message:e.message,status:"failed"});
}
});

//=======comentschema====
app.post("/comments", async(req,res)=>{
    try{
    const comment=await Comment.create(req.body);
    res.status(201).send(comment);
    }catch(e){
        res.status(500).json({status:e.message});
    }
});

app.get("/comments", async(req,res)=>{
    const comments=await Comment.find({email:"a@a.com"}).lean().exec();
    res.send({comments});
});
app.get("/comments/:id", async(req,res)=>{
    try{
        const comment=await Comment.findById(req.params.id);
        res.send({comment});
    }
    catch(e){
        res.status(500).json({status:e.message});
    }

});
app.patch("/comments/:id",async(req,res)=>{
        try{
const comment=await Comment.findByIdAndUpdate(req.params.id, req.body,{ new:true,
            })
            .lean().exec();
            return res.status(201).send(comment);
        }catch(e){
            return res.status(500).json({message:e.message,status:"failed"});
        }
    });
   
app.delete("/comments/:id",async(req,res)=>{
    try{
    const comment=await Comment.findOneAndDelete(req.params.id).lean().exec();
    res.status(200).send(comment);
    }catch(e){
    return res.status(500).json({message:e.message,status:"failed"});
}
});
app.listen(245,async function(){
    await connect();
    console.log("listening on port 245");
});
