const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = bcrypt.genSaltSync(10);
const jwtsecret = "afdghsjfkgjfdyfhgkfplmn";
const cookieparser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const place = require("./models/Place");
app.use(express.json());
app.use(cookieparser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
mongoose.connect("mongodb://localhost:27017/booking");

const db = mongoose.connection;
db.once("open", () => {
  console.log("conected");
});
db.on("error", (err) => {
  console.log("error conection ", err);
});
app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, secret),
    });
    res.json(user);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (user) {
    const passOk = bcrypt.compareSync(password, user.password);
    if (passOk) {
      jwt.sign(
        { email: user.email, id: user._id, name: user.name },
        jwtsecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(user);
        }
      );
    } else {
      res.json("pass not ok");
    }
  } else {
    res.json("not found ");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtsecret, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json({});
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads/" });

app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedfile = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[1];

    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedfile.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedfile);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtsecret, {}, (err, user) => {
    if (err) throw err;
    place.create({
      owner: user.id,
    });
  });
});

app.listen(4000);
