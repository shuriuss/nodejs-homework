const app = require("./app");
const { connectMongo } = require("./src/db/conection");

const start = async () => {
  try {
    await connectMongo();
    console.log("Database connection successful");

    app.listen(3000, (error) => {
      if (error) {
        console.error("Error at aserver launch:", error);
      }
      console.log("Server running. Use our API on port: 3000");
    });
  } catch (error) {
    console.error('Failed to launch application with error:', error.message);
  }
};

start()
