import express from "express";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/error.js";
import notFound from "./middleware/notFound.js";
const port = process.env.PORT || 8001;

const app = express();

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// logger middleware
app.use(logger);

// Routes
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Error handling middleware - needs to be after routes
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`server is running on port ${port}`));
