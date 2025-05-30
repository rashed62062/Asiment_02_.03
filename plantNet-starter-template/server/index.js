require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const morgan = require('morgan')
const port = process.env.PORT || 9000
const app = express()
// middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).send({ message: 'unauthorized access' })
    }
    req.user = decoded
    next()
  })
}

require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.is6qs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// const uri = "mongodb+srv://<db_username>:<db_password>";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
async function run() {
  try {

    const db = client.db('Assets')
    const assetsCollection = db.collection('AddAsset')
    const RequestCollection = db.collection('ReqAsset')
    const usersCollection = db.collection('users')
    const teamsCollection = db.collection('teams');

    // save or update a user in db
    app.post('/users/:email', async (req, res) => {
      const email = decodeURIComponent(req.params.email); // Decode the email
      const query = { email };
      const user = req.body;
    
      // Check if user exists in db
      const isExist = await usersCollection.findOne(query);
      if (isExist) {
        return res.send(isExist);
      }
    
      const result = await usersCollection.insertOne({
        ...user,
        role: 'employee',
        timestamp: Date.now(),
      });
      res.send(result);
    });
    

    // Generate jwt token
    app.post('/jwt', async (req, res) => {
      const email = req.body
      const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '365d',
      })
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true })
    })
    // Logout
    app.get('/logout', async (req, res) => {
      try {
        res
          .clearCookie('token', {
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({ success: true })
      } catch (err) {
        res.status(500).send(err)
      }
    })

    //  post Asset
    app.post('/assets',  async (req, res) => {
      const asset = req.body
      const result = await assetsCollection.insertOne(asset)
      console.log(result);
      res.send(result)
    })

//  get all assets 
    app.get('/all-assets',  async(req, res) => {
      const result = await assetsCollection.find().toArray()
      res.send(result)

    })

    //  get db employees
    app.get('/all-users',  async(req, res) => {
      const result = await usersCollection.find().toArray()
      res.send(result)

    })



//  request assets collection
    app.post('/request-asset',  async (req, res) => {
      const asset = req.body
      const result = await RequestCollection.insertOne(asset)
    
      res.send(result)
    })


    // get all requests from db assets

    app.get('/requests-employee',  async(req, res) => {
      const result = await RequestCollection.find().toArray()
      res.send(result)
    })


//  email wisely requested filtering
app.get('/requests-employee/:email', async (req, res) => {
  const email = req.params.email;
  const filter = { 'requestedBy.email': email }; // Correctly access nested email field
  const result = await RequestCollection.find(filter).toArray(); // Use the filter object
  res.send(result);
});

app.post('/hr-manager',  async (req, res) => {
  const manager = req.body

  const result = await teamsCollection.insertOne(manager);

  

  res.send(result)
})

// app.post('/add-to-team',  async (req, res) => {
//   const manager = req.body
//   const result = await teamsCollection.insert(manager)
 
//   res.send(result)
// })






// Route to get all members of a team by teamId
app.get('/my-team', async (req, res) => {
  const teamId = req.user?.teamId; // Optional chaining for safety

  if (!teamId) {
    return res.status(400).send({ message: 'Team ID not found for this user.' });
  }

  try {
    const teamDetails = await teamsCollection.aggregate([
      { $match: { _id: new ObjectId(teamId) } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'teamId',
          as: 'teamMembers',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1, // Include team name if it exists in the team collection
          description: 1, // Optional fields
          createdAt: 1,
          teamMembers: {
            $map: {
              input: '$teamMembers',
              as: 'member',
              in: {
                _id: '$$member._id',
                name: '$$member.name',
                email: '$$member.email',
                photo: '$$member.photo',
                role: '$$member.role',
                teamId: '$$member.teamId',
              },
            },
          },
        },
      },
    ]).toArray();

    if (!teamDetails || teamDetails.length === 0) {
      return res.status(404).send({ message: 'No team found or no members in this team.' });
    }

    return res.status(200).send(teamDetails[0]); // Returns team info + array of members
  } catch (error) {
    console.error('Error fetching team members:', error);
    return res.status(500).send({ message: 'Internal server error' });
  }
});



// // Add users to the team
app.post('/add-to-team', async (req, res) => {
  const { users, teamId } = req.body
  

  if (!teamId || !users || !Array.isArray(users) || users.length === 0) {
    return res.status(400).send({ message: 'Invalid data' })
  }

  try {
    const updatePromises = users.map(user => {
      return teamsCollection.insert(
        { _id: new ObjectId(user._id) }, // Correctly using `new ObjectId`
        { $set: { teamId } }
      )
    })

    const updateResults = await Promise.all(updatePromises)

    if (updateResults.every(result => result.modifiedCount > 0)) {
      return res.status(200).send({ success: true, message: 'Users added to the team successfully' })
    } else {
      return res.status(400).send({ message: 'Some users were not added to the team' })
    }
  } catch (err) {
    console.error('Error adding users to team:', err)
    return res.status(500).send({ message: 'Internal server error' })
  }
})
    

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello from plantNet Server..')
})

app.listen(port, () => {
  console.log(`plantNet is running on port ${port}`)
})