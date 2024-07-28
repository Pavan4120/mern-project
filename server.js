const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // Import the cors middleware
const { Schema } = mongoose;

const app = express();

// Use cors middleware
app.use(cors());

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mern-auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Auto-increment plugin
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Define Login Schema
const loginSchema = new Schema({
  f_userName: { type: String, unique: true, required: true },
  f_Pwd: { type: String, required: true }
});
loginSchema.plugin(AutoIncrement, { inc_field: 'f_sno' });

const Login = mongoose.model('Login', loginSchema);

// Define Employee Schema
const employeeSchema = new Schema({
  f_Image: String,
  f_Name: { type: String, required: true },
  f_Email: { type: String, required: true },
  f_Mobile: { type: String, required: true },
  f_Designation: { type: String, required: true },
  f_Gender: { type: String, required: true },
  f_Course: { type: String, required: true },
  f_Active: { type: Boolean, default: true },
  f_CreateDate: { type: Date, default: Date.now }
});
employeeSchema.plugin(AutoIncrement, { inc_field: 'f_Id' });

const Employee = mongoose.model('Employee', employeeSchema);

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('f_Image');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Register API
app.post('/register', async (req, res) => {
  const { f_userName, f_Pwd } = req.body;

  if (!f_userName || !f_Pwd) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  const userExists = await Login.findOne({ f_userName });
  if (userExists) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(f_Pwd, salt);

  const newUser = new Login({
    f_userName,
    f_Pwd: hashedPassword
  });

  await newUser.save();
  res.status(201).json({ message: 'User registered successfully' });
});

// Login API
app.post('/login', async (req, res) => {
  const { f_userName, f_Pwd } = req.body;

  if (!f_userName || !f_Pwd) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  const user = await Login.findOne({ f_userName });
  if (!user) {
    return res.status(400).json({ message: 'Invalid login details' });
  }

  const isMatch = await bcrypt.compare(f_Pwd, user.f_Pwd);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid login details' });
  }

  res.json({ message: 'Login successful', userName: user.f_userName });
});

// Create Employee (POST)
app.post('/employees', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    } else {
      const {
        f_Name,
        f_Email,
        f_Mobile,
        f_Designation,
        f_Gender,
        f_Course
      } = req.body;

      if (!f_Name || !f_Email || !f_Mobile || !f_Designation || !f_Gender || !f_Course) {
        return res.status(400).json({ message: 'Please fill in all required fields' });
      }

      const newEmployee = new Employee({
        f_Image: req.file ? req.file.path : '',
        f_Name,
        f_Email,
        f_Mobile,
        f_Designation,
        f_Gender,
        f_Course
      });

      await newEmployee.save();
      res.status(201).json({ message: 'Employee created successfully' });
    }
  });
});

// Get All Employees (GET)
app.get('/employees', async (req, res) => {
  const { search = '', sort = 'f_Name', order = 'asc', page = 1, limit = 5 } = req.query;

  const query = {
    $or: [
      { f_Name: new RegExp(search, 'i') },
      { f_Email: new RegExp(search, 'i') },
      { f_Designation: new RegExp(search, 'i') }
    ]
  };

  const options = {
    sort: { [sort]: order === 'asc' ? 1 : -1 },
    skip: (page - 1) * limit,
    limit: parseInt(limit)
  };

  const employees = await Employee.find(query, null, options);
  const total = await Employee.countDocuments(query);

  res.json({ employees, total, page: parseInt(page), limit: parseInt(limit) });
});

// Get Employee by f_Id (GET)
app.get('/employees/:id', async (req, res) => {
  const { id } = req.params;
  const employee = await Employee.findOne({ f_Id: id });
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  res.json(employee);
});

// Update Employee (PUT)
app.put('/employees/:id', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    } else {
      const { id } = req.params;
      const updates = req.body;
      if (req.file) {
        updates.f_Image = req.file.path;
      }
      try {
        const updatedEmployee = await Employee.findOneAndUpdate({ f_Id: id }, updates, { new: true });
        if (!updatedEmployee) {
          return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee updated successfully', updatedEmployee });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  });
});

// Delete Employee (DELETE)
app.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;
  const deletedEmployee = await Employee.findOneAndDelete({ f_Id: id });
  if (!deletedEmployee) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  res.json({ message: 'Employee deleted successfully' });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
