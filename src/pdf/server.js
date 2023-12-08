const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/pdfs', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const pdfSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
});

const Pdf = mongoose.model('Pdf', pdfSchema);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.post('/upload', upload.single('pdf'), async (req, res) => {
  const { originalname, buffer } = req.file;

  const newPdf = new Pdf({
    name: originalname,
    data: buffer,
  });

  await newPdf.save();
  res.json({ message: 'PDF uploaded successfully!' });
});

app.get('/download/:id', async (req, res) => {
  const pdf = await Pdf.findById(req.params.id);

  if (pdf) {
    res.setHeader('Content-Disposition', `attachment; filename=${pdf.name}`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdf.data);
  } else {
    res.status(404).json({ error: 'PDF not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
