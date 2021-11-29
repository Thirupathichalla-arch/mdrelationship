const express = require("express");

const mongoose = require("mongoose");


const connect = () => {
    return mongoose.connect("mongodb://127.0.0.1:27017/library")
}
const app = express();
app.use(express.json());


//SECTION SCHEMA
const sectionSchema = new mongoose.Schema({
    name: { type: String, required: true , unique:true }
}, {
    versionKey: false,
    timestamps: true,
})

const Section = mongoose.model("sections", sectionSchema);

//SECTION CRUD

app.post("/section", async (req, res) => {
    try {
        const sectionList = await Section.create(req.body);
        return res.status(201).send(sectionList);
    }
    catch (e) {
        return res.status(500).json({ "status": e.message });
    }
})
app.get("/sections", async (req, res) => {
    try {
        const sectionList = await Section.find().lean().exec();
        return res.send({ sectionList });
    }
    catch (e) {
        return res.status(500).json({ "status": e.message });
    }
})
app.get("/sections/:id", async (req, res) => {
    try {
        const sectionList = await Section.findById(req.params.id).lean().exec();
        return res.json(sectionList);
    } catch (e) {
        return res.status(500).json({"status":e.message});
    }
})
app.patch("/sections/:id", async (req, res) => {
    try {
        const sectionList = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean().exec();
        return res.status(201).send(sectionList);
    } catch (e) {
        return res.status(500).json({ message: e.message,status:"Failed"});
    }
})
app.delete("/sections/:id", async (req, res) => {
    try {
        const sectionList = await Section.findByIdAndDelete(req.params.id).lean().exec();
        return res.status(200).send(sectionList);
    } catch (e) {
        return res.status(500).json({ message: e.message,status:"Failed"});
    }
})

//AUTHOR STARTS HERE

//AUTHOR SCHEMA

const authorSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name : {type:String ,required:true }
}, {
    versionKey: false,
    timestamps:true,
})
//Author crud

const Author = mongoose.model("author", authorSchema);

app.post("/author", async (req, res) => {
    try {
        const author = await Author.create(req.body);
        return res.status(201).send(author);
    }
    catch(e) {
        return res.status(500).json({"status":e.message});
    }
})

app.get("/authors", async (req, res) => {
    try {
        const authorsData = await Author.find().lean().exec();
        return res.send({authorsData})
    }
    catch(e) {
        return res.status(500).json({"status":e.message});
    }
})

app.get("/authors/:id", async (req, res) => {
    try {
        const author = await Author.findById(req.params.id).lean().exec();
        return res.json(author);
    }
    catch(e) {
        return res.status(500).json({"status":e.message});
    }
})

app.patch("/authors/:id", async (req, res) => {
    try {
        const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean().exec();
        return res.status(201).send(author);
    }
    catch(e) {
        return res.status(500).json({"status":e.message});
    }
})

app.delete("/authors/:id", async (req, res) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id).lean().exec();
        return res.status(200).send(author);
    } catch (e) {
        return res.status(500).json({ message: e.message,status:"Failed"});
    }
})
//Books starts here

//Books schema

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    author_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "author",
        required: true,
    }],
    section_ids: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sections",
        required: true,
    }
}, {
    versionKey: false,
    timestamps: true,
});

const Book = mongoose.model("book", bookSchema);

app.post("/book", async (req, res) => {
    try {
        const book = await Book.create(req.body);
        return res.status(201).send(book)
    }
    catch(e) {
        return res.status(500).json({"status":e.message});
    }
})

app.get("/books", async (req, res) => {
    try {
        const books = await Book.find().populate({ path: "author_ids", select:"first_name"+" "+"last_name"}).populate({path:"section_ids",select:"name"}).populate("author_ids").lean().exec();
        return res.status(201).send(books)
    }
    catch(e) {
        return res.status(500).json({"status":e.message});
    }
})

app.get("/books/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate({ path: "author_ids", select:"first_name"+" "+"last_name"}).lean().exec();
        return res.status(201).send(book)
    }
    catch(e) {
        return res.status(500).json({"status":e.message});
    }
})

app.patch("/books/:id", async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id,req.body,{ new: true}).lean().exec();
        return res.status(201).send(book);
    }
    catch(e) {
        return res.status(500).json({"status":e.message});
    }
})

app.delete("/books/:id", async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id).lean().exec();
        return res.status(200).send(book);
    } catch (e) {
        return res.status(500).json({ message: e.message,status:"Failed"});
    }
})


//checkout schema

const checkoutSchema = new mongoose.Schema({
    checkouts_name:{type:String ,required:true,unique:true},
    bks_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "book",
        required:true,
    }
}, {
    versionKey:false,
    timestamps:true,
});

const Checkout = mongoose.model("checkout", checkoutSchema);

///checkout crud

app.post("/checkout", async (req, res) => {
    try
    {
        const checkout = await Checkout.create(req.body);
        return res.status(201).send(checkout);
    }
    catch(e) {
        return res.status(500).json({"status":e.message});
    }
})
app.get("/checkouts", async (req, res) => {
    try {
        const checkout = await Checkout.find().populate({path :"bks_id",populate : {
            path : 'author_ids',select:"first_name"+" "+"last_name",
        }, populate: { path: "section_ids",select:"name" }}).lean().exec();
        return res.send({ checkout });
    }
    catch (e) {
        return res.status(500).send({"error":e});
    }
})

app.get("/checkouts/:id", async (req, res) => {
    try {
        const data = await Checkout.findById(req.params.id).lean().exec();
        return res.json(data);
    } catch (e) {
        return res.status(500).json({"status":e.message});
    }
})
app.patch("/checkouts/:id", async(req, res) => {
    try {
        const checkout = await Checkout.findByIdAndUpdate(req.params.id, req.body,{ new: true,}).lean().exec();
        return res.status(201).send(checkout);
    } catch (e) {
        return res.status(500).json({ message: e.message,status:"Failed"});
    }
});

app.delete("/checkouts/:id", async (req, res) => {
    try {
        const checkout = await Checkout.findByIdAndDelete(req.params.id).lean().exec();
        return res.status(200).send(checkout);
    } catch (e) {
        return res.status(500).json({ message: e.message,status:"Failed"});
    }
})

app.get("/books/:id/checkouts", async (req, res) => {
    try {
        const books = await Book.findById(req.params.id).lean().exec();
        const checkout = await Checkout.find({ bks_id: books._id }).populate({path :"bks_id",populate:{path:"author_ids",
        }, populate: { path: "section_ids", select: "name" }, populate: { path: "author_ids", select:"first_name"+" "+"last_name"}}).lean().exec();
        return res.status(201).send(checkout);
    }
    catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
})



//books by author id

app.get("/authors/:id/books", async (req, res) => {
    try {
        const author = await Author.findById(req.params.id).lean().exec();
        const books = await Book.find({ author_ids: author._id }).populate({ path: "bks_id" }).populate({ path: "author_ids" ,select:"first_name"+" "+"last_name"}).populate({ path: "section_ids", select: "name" }).lean().exec();
        return res.status(201).send(books);
    }
    catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
})

//books by sectionswise

app.get("/sections/:id/books", async (req, res) => {
    try {
        const section = await Section.findById(req.params.id).lean().exec();
        const books = await Book.find({ section_ids: section._id }).populate({ path: "bks_id" }).populate({ path: "author_ids" ,select:"first_name"+" "+"last_name"}).populate({ path: "section_ids", select: "name" }).lean().exec();
        return res.status(201).send(books);
    }
    catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
})
                //authors length==1
app.get("/books/authors/1", async (req, res) => {
    try {
        const singleAuthorBooks = await Book.find({ $where: 'this.author_ids.length==1' }).populate({ path:"section_ids",select:"name"}).populate({path:"author_ids",select:"first_name"+" "+"last_name"}).lean().exec();
        return res.status(201).send(singleAuthorBooks);
    }
    catch (e) {
        return res.status(501).json({ message: e.message, status: "Failed" });
    }
})

app.listen(2345, async () => {
    await connect();
    console.log("listening on 2345 port")
}) 