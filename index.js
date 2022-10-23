import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import PostsDAO from "./dao/postsdao.js";
import ElementsDAO from "./dao/elementsdao.js";
import mongoose from "mongoose";
dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8081;

mongoose
  .connect(process.env.PORTFOLIO_DB_URI)
  .then((client) => {
    app.listen(port, () => {
      console.log(`Mongoose listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("error", err.stack);
    process.exit(1);
  });



// MongoClient.connect(process.env.PORTFOLIO_DB_URI, {
//   wtimeoutMS: 2500,
// })
//   .catch((err) => {
//     console.error("error", err.stack);
//     process.exit(1);
//   })
//   .then(async (client) => {
//     console.log(Object.keys(client.db))
//     await PostsDAO.injectDB(client);
//     await ElementsDAO.injectDB(client);
//     app.listen(port, () => {
//       console.log(`listening on port ${port}`);
//     });
//   });
