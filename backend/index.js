const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8000;
// const authRoute = require("./routes/authRoute");
// const uploadRoute = require("./routes/uploadRoute");
const tourRoute = require("./routes/tourRoute");
const inforTourRoute = require("./routes/inforTourRoute");
const inforTourNoteRoute = require("./routes/inforTourNoteRoute");
const bookingRoute = require("./routes/bookingRoute");

const path = require("path");
const dbConnect = require("./config/dbConnect");

dbConnect();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/api/auth", authRoute);
app.use("/api/tour", tourRoute);
app.use("/api/inforTour", inforTourRoute);
app.use("/api/inforTourNote", inforTourNoteRoute);
app.use("/api/booking", bookingRoute);

// Use the video routes

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
