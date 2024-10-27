import mongoConnect from "../../backend/mongodb";

export const fetchCollection = async (dbName: string, collectionName: string) => {
    const datas = await mongoConnect(dbName, collectionName);
    const { collection, client } = datas;
    try {
        const data = await collection.find({}).toArray();
        console.log("Data from fetchCollections in CRUD :", data);
        return data;
    } catch (error) {
        console.error("Error fetching collection:", error);
        throw error;
    } finally {
        await client.close();
    }
};


export const fetchDataBase = async (dbName: string) => {
    const { db, client } = await mongoConnect(dbName); // Connect to the database

    try {
        const collections = await db.listCollections().toArray(); // List all collections in the database
        return collections;
    } catch (error) {
        console.error("Error fetching database:", error);
        throw error;
    } finally {
        await client.close(); // Ensure the client is closed after the operation
    }
};
