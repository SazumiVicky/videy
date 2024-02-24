const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'file'));
  },
  filename: function (req, file, cb) {
    const videoId = generateRandomId();
    const fileExtension = path.extname(file.originalname);
    cb(null, videoId + fileExtension);
  }
});

const upload = multer({ storage: storage });
app.use(express.static('public'));

app.post('/api/upload', upload.single('file'), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/file/${req.file.filename}`;
  const fileId = req.file.filename.split('.')[0];
  res.status(200).json({ id: fileId });
});

app.get('/v', (req, res) => {
  const videoId = req.query.id;
  res.sendFile(path.join(__dirname, 'public', 'video.html'));
});

app.use((req, res, next) => {
  res.status(404).send("Page not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('An error occurred on the server');
});

app.listen(PORT, () => {
  console.log(`The server is running on the port ${PORT}`);
});

function generateRandomId() {
    var id = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return id;
}
