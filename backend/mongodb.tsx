const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.DATABASE_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const testConnection = async () => {
  try {
      const client = new MongoClient(uri, {
          serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
          }
      });

      const cl = await client.connect();
      console.log("Connected to MongoDB!");
      const db = cl.db("NextJS");

      await client.close();
  } catch (error: any) {
      console.error("Connection test failed:", error.message);
  }
};

testConnection();


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const mongoConnect = async (dbName: string, colName?: string) => {
  console.log("Connecting to MongoDB with:", dbName, colName);
  try {
    const cl = await client.connect();
    console.log("Connected to MongoDB!");

    const db = cl.db(dbName);

    if (colName) {
        const collection = db.collection(colName);
        console.log("Collection selected:", colName);
        return { collection, client };
    } else {
        console.log("Database selected:", dbName);
        return { db, client };
    }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

export default mongoConnect;
