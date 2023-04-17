const express = require("express");
const exphbs = require("express-handlebars");
const { MongoClient, ObjectId } = require("mongodb");
//För att kunna hämta datan från boy extention
const bodyParser = require("body-parser");

//Connecta till databas
const connectionUrl = "mongodb://127.0.0.1:27017";
const client = new MongoClient(connectionUrl);
//var Databas namn
const dbName = "SongList";

//Funktion som anluster oss
async function getCarsCollection() {
  await client.connect();
  const db = client.db(dbName);
  //Skapar Collection där alla data ligger
  const collection = db.collection("songs");
  return collection;
}

const app = express();

//setup för handlebars
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

//mer setup
app.set("view engine", "hbs");

//För kunna acessa vår publick folder för css
app.use(express.static("public"));
//För hämta datan från vara inpput annars går det in få in datan och detta är en extention
app.use(bodyParser.urlencoded({ extended: false }));

//För att kuna display datan i vår home
app.get("/", async (req, res) => {
  //För att kunna hämta dana från var kollektion
  const collection = await getCarsCollection();
  //Lägga in vår data i array och hämta det därifrån
  const findResult = await collection.find({}).toArray();

  //SongList är namnet på vår array där allt ligger som renderas på home och skicas till home också
  res.render("home", { songList: findResult });
});

//Gå in lägga tll data läge
app.get("/new-song", (req, res) => {
  //Renderar våra input
  res.render("new-song");
});

//Skicka all data från input till databasMongoDb
app.post("/new-song", async (req, res) => {
  //De parametrar som vi skicar in och deras value och någon slacks skydd också
  const newSong = {
    artist: req.body.artist,
    song: req.body.song,
  };

  //Hämtar var collection
  const collection = await getCarsCollection();

  //insertOne är för att lägga till data i vår collection
  await collection.insertOne(newSong);

  //Efter det går vi tillbaka till home
  res.redirect("/");
});

//Funktionen för att gå i edit lägga för en spesifik item
app.get("/songList/:id", async (req, res) => {
  //hämtar specifika id för just en item
  const objectId = new ObjectId(req.params.id);
  //hämtar var kollektion
  const collection = await getCarsCollection();
  //För att hitta en specifik item med den iden
  const songL = await collection.findOne({ _id: objectId });

  //När vi har hittar den specifika item med ideen så displays dens propretys när vi är i edit läge i vår hbs edit-song
  res.render("edit-song", { songL });
});

//För att upptadera data
app.post("/edit-song/:id", async (req, res) => {
  //De parametrar som vi skicar in och deras value och någon slacks skydd också
  const updatedSong = {
    artist: req.body.artist,
    song: req.body.song,
  };
  //hämtar specifika id för just en item
  const objectId = new ObjectId(req.params.id);
  //hämtar var kollektion
  const collection = await getCarsCollection();
  //Här upptaderas all data och $set ger oss möjligheten att upptadera allt som vi skrivit och det ligger under variablen uptaded song
  await collection.updateOne({ _id: objectId }, { $set: updatedSong });

  //efter ändringen går vi tillbaka till home
  res.redirect("/");
});

//För radera song
app.post("/delete-song/:id", async (req, res) => {
  //hämtar specifika id för just en item
  const objectId = new ObjectId(req.params.id);
  //hämtar var kollektion
  const collection = await getCarsCollection();
  //raderar spesifika item med den ideen
  await collection.deleteOne({ _id: objectId });

  res.redirect("/");
});

app.listen(5500, () => {
  console.log("http://localhost:5500/");
});
