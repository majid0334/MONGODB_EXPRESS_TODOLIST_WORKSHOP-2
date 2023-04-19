const { MongoClient, ObjectId } = require("mongodb");

const connectionUrl = "mongodb://127.0.0.1:27017";
/* "mongodb+srv://{användarnmn}:{egenlösonrd}@cluster0.04mtmqb.mongodb.net/?retryWrites=true&w=majority"; */
const client = new MongoClient(connectionUrl);

const dbName = "CarsCrudApp";

async function main() {
  console.log("function working!");
  await client.connect();
  console.log("Connected!");
  const db = client.db(dbName);
  const collection = db.collection("cars");

  //Lägger in datan in datan till var databas
  await addNewCar(collection);

  //uptaderar vår bil
  await uptadeCar(collection);
  // omvandlar var objeck ttill masoor av aray
  await findAllcars(collection);

  return "done!";
}

async function uptadeCar(collection) {
  const objectId = new ObjectId("643687afefd62e2794786abd");
  const updateResult = await collection.updateOne(
    { _id: objectId },
    { $set: { distance: 10000 } }
  );
  console.log({ updateResult });
}

async function findAllcars(collection) {
  const finalResult = await collection.find({}).toArray();
  console.log({ finalResult });
}

//lägga till ny data
async function addNewCar(collection) {
  //objeck som skickas in
  const newCar = {
    make: "Saab",
    model: "9000",
    year: 1999,
  };
  //Stoppar in data in vår kollektion som heter cars som är barnet till CarsCrudApp
  const result = await collection.insertOne(newCar);
  console.log({ result });
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
