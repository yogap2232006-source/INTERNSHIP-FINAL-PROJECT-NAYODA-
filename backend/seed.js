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

    // Clear existing collections
    await User.deleteMany({});
    await Project.deleteMany({});
    console.log('Database cleared for seeding...');

    // Create clients
    const clientUser = await User.create({
      name: 'TechVision Inc',
      email: 'contact@techvision.com',
      password: 'password123',
      role: 'Client'
    });

    const blockTrustUser = await User.create({
      name: 'BlockTrust',
      email: 'hr@blocktrust.com',
      password: 'password123',
      role: 'Client'
    });

    // Create Freelancers
    const freelancerUser = await User.create({
      name: 'John Dev',
      email: 'freelancer@test.com',
      password: 'password123',
      role: 'Freelancer',
      profile: {
        title: 'Full Stack Engineer',
        bio: 'Specialist in Node.js, React, and MongoDB with 5+ years experience building SaaS applications.',
        skills: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'],
        hourlyRate: 50,
        location: 'Remote, US',
        phoneNumber: '+1-555-0199',
        projectDuration: '10'
      }
    });

    const designFreelancer = await User.create({
      name: 'Sophia UI/UX',
      email: 'sophia@test.com',
      password: 'password123',
      role: 'Freelancer',
      profile: {
        title: 'Senior UI/UX Designer',
        bio: 'Creating beautiful, user-centered digital interfaces for web and mobile apps. Figma expert.',
        skills: ['Figma', 'UI/UX', 'Mobile Design', 'Wireframing'],
        hourlyRate: 65,
        location: 'San Francisco, CA',
        phoneNumber: '+1-555-0188',
        projectDuration: '7'
      }
    });

    // Create Admin
    await User.create({
      name: 'System Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'Admin'
    });

    console.log('Created seeded users (Clients, Freelancers, Admin)');

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
