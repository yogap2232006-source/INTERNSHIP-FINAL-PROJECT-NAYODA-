const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load env vars
dotenv.config();

// Load models
const User = require('./src/models/User');
const Project = require('./src/models/Project');

const seedData = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Create a dummy client user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const clientUser = await User.create({
      name: 'TechVision Inc',
      email: 'contact@techvision.com',
      password: hashedPassword,
      role: 'Client'
    });

    const blockTrustUser = await User.create({
      name: 'BlockTrust',
      email: 'hr@blocktrust.com',
      password: hashedPassword,
      role: 'Client'
    });

    console.log('Created dummy clients');

    // Create Mock Projects
    const projects = [
      {
        title: "Full Stack Developer for E-commerce Platform",
        description: "We are looking for an experienced MERN stack developer to build a modern e-commerce platform with AI product recommendations. You will be responsible for both frontend and backend. Requirements:\n\n- 3+ years of React experience\n- Strong understanding of Node.js and Express\n- Experience with MongoDB and Mongoose\n- Familiarity with Tailwind CSS\n- Understanding of RESTful APIs\n\nThe project is expected to take around 3-4 weeks. Please provide examples of similar projects you have built.",
        budget: 5000,
        skillsRequired: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
        location: "Remote",
        status: "Open",
        client: clientUser._id
      },
      {
        title: "UI/UX Designer for FinTech Mobile App",
        description: "Need a talented designer to create an intuitive and stunning UI for our new crypto wallet app. Must be proficient in Figma and have experience with FinTech applications.",
        budget: 3500,
        skillsRequired: ["Figma", "UI/UX", "Mobile Design"],
        location: "New York, NY",
        status: "Open",
        client: blockTrustUser._id
      }
    ];

    await Project.insertMany(projects);
    console.log('Seeded mock projects successfully!');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
