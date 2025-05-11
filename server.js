// // const express = require("express");
// // const connectDB = require("./config/db");
// // const authRoutes = require("./routes/auth");
// // const app = express();
// // const PORT = 5000;

// // app.use(express.json());
// // connectDB();

// // app.use("/api/auth", authRoutes);

// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// const express = require("express");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/auth");
// const studentRoutes = require("./routes/student");
// const attendanceRoutes = require("./routes/attendance");
// const admissionRoutes = require('./routes/admission');


// const app = express();
// const PORT = 5000;

// app.use(express.json());
// connectDB();

// app.use("/api/auth", authRoutes);
// app.use("/api/students", studentRoutes);
// app.use("/api/attendance", attendanceRoutes);
// app.use('/api/admission', admissionRoutes);


// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






const express = require("express");
require('dotenv').config();
const cors = require("cors"); // ✅ Import CORS
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/student");
const attendanceRoutes = require("./routes/attendance");
const admissionRoutes = require("./routes/admission");
const adminRoutes = require('./routes/admin'); // ✅ Import the route file
const teacherRoutes = require('./routes/teacher');

//const authRoutes = require('./routes/authRoutes'); // Assuming authRoutes is saved in routes folder



const app = express();
const PORT = 5000;

// ✅ Enable CORS for frontend
app.use(cors({
  origin: process.env.CLIENT_URL, // Frontend URL
  credentials: true,
}));

app.use(express.json());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/admission", admissionRoutes);
app.use('/api/admin', adminRoutes); // ✅ Correct base route
app.use('/api/teacher',teacherRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// RZhg8RltRXQzSdTB