require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const bcrypt = require('bcrypt');




const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 9000;

// CORS Options (Allow all origins for dev)
const corsOptions = {
  origin: '*',
  credentials: true,
};
// app.use(cors({
//   origin:[
//     'https://solosphare-e9359.web.app/',
//     'http://localhost:9000/'

//   ],
// }))

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.is6qs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// JWT Middleware
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
     await client.connect();
    
    const db = client.db('Assets');
    const assetsCollection = db.collection('AddAsset');
    const RequestCollection = db.collection('RequestAsset');
    const usersCollection = db.collection('users');
  
    const HRManagerCollection = db.collection('Manager');

    // JWT Token Creation
    app.post("/jwt", (req, res) => {
      const user = req.body;
      console.log(user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2h" });
      res.send({ token });
    });

//    
    // Register or update user
    app.post("/user", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User already exists", insertedId: null });
      }
      const result = await usersCollection.insertOne(user);
      res.send({ message: "User inserted successfully", insertedId: result.insertedId });
    });

    // Upsert user by email
    app.post('/users/:email', async (req, res) => {
      const email = decodeURIComponent(req.params.email);
      const query = { email };
      const user = req.body;
      const isExist = await usersCollection.findOne(query);
      if (isExist) return res.send(isExist);
      const result = await usersCollection.insertOne({ ...user, role: 'employee', timestamp: Date.now() });
      res.send(result);
    });

    // Add asset
    app.post('/assets', verifyJWT, async (req, res) => {
      const asset = req.body;
      const result = await assetsCollection.insertOne(asset);
      res.send(result);
    });
  


//  Get HR by Email
app.delete('/requests/:id', async (req,res)=>{
  const id = req.params.id
  const result = await RequestCollection.deleteOne({_id : new ObjectId(id)})
  res.send(result);

})

// GET HR by email
app.get('/hr/email/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const hr = await HRManagerCollection.findOne({ email });
    if (!hr) return res.status(404).send({ error: 'HR not found' });
    res.send(hr);
  } catch (err) {
    console.error('Error fetching HR by email:', err);
    res.status(500).send({ error: 'Server error' });
  }
});



// HR Manager Registration Endpoint
app.post('/hr/register', async (req, res) => {
  try {
    // Validate input
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid request body' 
      });
    }

    const hr = req.body;

    // Required fields check
    const requiredFields = ['fullName', 'companyName', 'email', 'password', 'dateOfBirth', 'package'];
    const missingFields = requiredFields.filter(field => !hr[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(hr.email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email format' 
      });
    }

    // Validate password strength
    if (hr.password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    // Check for existing user
    const existingHR = await HRManagerCollection.findOne({ email: hr.email });
    if (existingHR) {
      return res.status(409).json({ 
        success: false,
        message: 'Email already registered' 
      });
    }

    // Hash password (using your bcrypt configuration)
    const saltRounds = 12; // Increased for better security
    const hashedPassword = await bcrypt.hash(hr.password, saltRounds);

    // Create HR document
    const hrDocument = {
      fullName: hr.fullName,
      companyName: hr.companyName,
      companyLogo: hr.companyLogo || null,
      email: hr.email,
      password: hashedPassword,
      dateOfBirth: new Date(hr.dateOfBirth),
      package: {
        id: hr.package.id,
        name: hr.package.name,
        price: hr.package.price,
        maxEmployees: hr.package.maxEmployees || 
          (hr.package.name.includes('5') ? 5 :
          hr.package.name.includes('10') ? 10 :
          hr.package.name.includes('20') ? 20 : 0)
      },
      employees: [],
      createdAt: new Date(),
      status: 'active',
      role: 'hr',
      paymentStatus: 'pending',
      emailVerified: false
    };

    // Insert into database
    const result = await HRManagerCollection.insertOne(hrDocument);

    // Generate JWT token using your ACCESS_TOKEN_SECRET
    const token = jwt.sign(
      { 
        id: result.insertedId, 
        email: hr.email, 
        role: 'hr' 
      },
      process.env.ACCESS_TOKEN_SECRET, // Using your provided secret
      { expiresIn: '7d' }
    );

    // Prepare response (excluding sensitive data)
    const responseData = {
      _id: result.insertedId,
      fullName: hr.fullName,
      companyName: hr.companyName,
      email: hr.email,
      package: hrDocument.package,
      createdAt: hrDocument.createdAt,
      status: 'active'
    };

    // Send verification email (using your Nodemailer credentials)
    // try {
    //   const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: process.env.NODEMAILER_USER,
    //       pass: process.env.NODEMAILER_PASS
    //     }
    //   });

    //   const mailOptions = {
    //     from: process.env.NODEMAILER_USER,
    //     to: hr.email,
    //     subject: 'Welcome to Our HR Platform',
    //     html: `<p>Hello ${hr.fullName},</p>
    //            <p>Your HR Manager account has been created successfully!</p>
    //            <p>Please verify your email by clicking this link: 
    //            <a href="${process.env.CLIENT_URL}/verify-email?token=${token}">Verify Email</a></p>`
    //   };

    //   await transporter.sendMail(mailOptions);
    // } catch (emailError) {
    //   console.error('Email sending failed:', emailError);
    //   // Continue even if email fails
    // }

    res.status(201).json({
      success: true,
      message: 'HR Manager registered successfully. Verification email sent.',
      data: responseData,
      token: token
    });

  } catch (error) {
    console.error('HR Registration Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed. Please try again.',
      error: error.message 
    });
  }
});

//  Add Employ 


app.post('/hr/:hrId/add-employee', async (req, res) => {
  const { hrId } = req.params;
  const { name, email } = req.body;

  if (!ObjectId.isValid(hrId)) {
    return res.status(400).json({ message: 'Invalid HR ID' });
  }
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  try {
    const hr = await HRManagerCollection.findOne({ _id: new ObjectId(hrId) });
    if (!hr) return res.status(404).json({ message: 'HR not found' });

    if (hr.employees.length >= hr.package.maxEmployees) {
      return res.status(400).json({ message: 'Employee limit reached' });
    }

    const newEmployee = {
      id: new ObjectId(),
      name,
      email,
      addedAt: new Date().toISOString()
    };

    await HRManagerCollection.updateOne(
      { _id: new ObjectId(hrId) },
      { $push: { employees: newEmployee } }
    );

    res.json({ message: 'Employee added successfully', employee: newEmployee });
  } catch (error) {
    console.error("Error adding employee:", error); // log full error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



app.get('/hr/by-id/:id', async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).send({ message: 'Invalid HR ID' });

  try {
    const hr = await HRManagerCollection.findOne({ _id: new ObjectId(id) });
    if (!hr) return res.status(404).send({ message: 'HR not found' });
    res.send(hr);
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
});



    // Get all assets
    app.get('/all-assets', async (req, res) => {
      
      const result = await assetsCollection.find().toArray();
      res.send(result);
    });

    // Get all users
    app.get('/all-users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // Request asset
    app.post('/request-asset', async (req, res) => {
      const Request = req.body;
      const result = await RequestCollection.insertOne(Request);
      res.send(result);
    });

   

   // Get all requests without verifyJWT
app.get('/requests-employee/:email', async (req, res) => {
   const email = req.params.email;
   
   const filter = {'HR.email': email};
   const result = await RequestCollection.find(filter).toArray();
   res.send(result);
});


    // Get requests by user email
    app.get('/requests-employee/:email', async (req, res) => {
      const email = req.params.email;
      const filter = { 'requestedBy.email': email };
      const result = await RequestCollection.find(filter).toArray();
      res.send(result);
    });

      

   

    app.get('/employee/company-info/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const hr = await HRManagerCollection.findOne({ "employees.email": email });

    if (!hr) {
      return res.status(404).json({ message: "Not assigned to any company" });
    }

    const employees = hr.employees.map(({ name, email }) => ({ name, email }));

    res.json({
      companyName: hr.companyName,
      companyLogo: hr.companyLogo,
      totalEmployees: employees.length,
      employees,
    });
  } catch (err) {
    console.error('Company info error:', err.message);
    res.status(500).json({ message: "Server error" });
  }
});


    // Add multiple users to a team
    app.post('/add-to-team', async (req, res) => {
      const { users, teamId } = req.body;
      if (!teamId || !users || !Array.isArray(users) || users.length === 0) {
        return res.status(400).send({ message: 'Invalid data' });
      }

      try {
        const updatePromises = users.map(user => {
          return usersCollection.updateOne(
            { _id: new ObjectId(user._id) },
            { $set: { teamId } }
          );
        });
        await Promise.all(updatePromises);
        res.send({ success: true, message: 'Users added to the team successfully' });
      } catch (err) {
        console.error('Error adding users to team:', err);
        res.status(500).send({ message: 'Internal server error' });
      }
    });

    // Stripe payment intent
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({ clientSecret: paymentIntent.client_secret });
    });

    // Update request status (approve/reject)
    app.patch('/requests/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!ObjectId.isValid(id)) return res.status(400).send({ message: 'Invalid ID' });

  const allowed = ['approved', 'rejected', 'pending'];
  if (!allowed.includes(status)) return res.status(400).send({ message: 'Invalid status' });

  try {
    const result = await RequestCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    res.send(
      result.modifiedCount
        ? { message: `Status changed to ${status}` }
        : { message: 'No update made. Request not found or already updated.' }
    );
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

    

    await client.db('admin').command({ ping: 1 });
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error(err);
  }
  
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from Asset Management server!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
