// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config(); // This should be at the top

// const connectDB = async () => {
//   try {
//     console.log('Connecting to MongoDB...');
//     console.log('Connection string:', process.env.MONGODB_URI); // Debug line
    
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('✅ MongoDB Connected Successfully');
//   } catch (error) {
//     console.error('❌ MongoDB connection failed:', error.message);
//     process.exit(1);
//   }
// };








import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 5555;
const mongoDBURL = process.env.MONGO_URI;

// Middleware - Allow all origins in production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.netlify.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Routes (keep your existing routes)
app.get('/', (req, res) => {
  res.json({ 
    message: 'BookStore API is running!',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ... keep your existing health, books routes ...
// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});


// Book routes (add these to test your database)
app.get('/books', async (req, res) => {
  try {
    // This will only work if MongoDB is connected
    const books = await mongoose.connection.db?.listCollections().toArray();
    res.json({ 
      message: 'Books endpoint',
      collections: books || ['Database not connected']
    });
  } catch (error) {
    res.json({ 
      message: 'Books endpoint',
      error: 'Database not available',
      tip: 'Start MongoDB service to enable database features'
    });
  }
});



// MongoDB Connection
const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoDBURL);
    console.log('✅ MongoDB Connected!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
};




// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();


// ✅ ADD GRACEFUL SHUTDOWN HERE - AT THE VERY END
process.on('SIGINT', () => {
  console.log('👋 SIGINT received - shutting down gracefully');
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received - shutting down gracefully');
  mongoose.connection.close();
  process.exit(0);
});






// //////////////////////////////////////////
// 1. Imports
// 2. Middleware setup
// 3. Route definitions
// 4. Database connection + server start
// 5. ✅ Graceful shutdown handlers (AT THE END)