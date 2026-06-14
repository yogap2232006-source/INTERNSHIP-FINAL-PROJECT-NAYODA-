const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB Atlas/URI...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`Connection to MONGO_URI failed: ${error.message}`);
        console.log('Falling back to local in-memory MongoDB (mongodb-memory-server)...');
        
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            
            const conn = await mongoose.connect(mongoUri);
            console.log(`In-memory MongoDB Connected: ${conn.connection.host}`);
            
            await seedInMemoryDB();
        } catch (innerError) {
            console.error(`Failed to start in-memory MongoDB: ${innerError.message}`);
            process.exit(1);
        }
    }
};

const seedInMemoryDB = async () => {
    try {
        const User = require('../models/User');
        const Project = require('../models/Project');
        
        const userCount = await User.countDocuments();
        if (userCount > 0) return;
        
        console.log('Seeding in-memory database...');
        
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

        const adminUser = await User.create({
            name: 'System Admin',
            email: 'admin@test.com',
            password: 'password123',
            role: 'Admin'
        });

        console.log('Created dummy users for testing:');
        console.log('  Client: contact@techvision.com / password123');
        console.log('  Client: hr@blocktrust.com / password123');
        console.log('  Freelancer 1: freelancer@test.com / password123 (John Dev)');
        console.log('  Freelancer 2: sophia@test.com / password123 (Sophia UI/UX)');
        console.log('  Admin: admin@test.com / password123');

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
        console.log('In-memory database seeded successfully!');
    } catch (err) {
        console.error('Error seeding in-memory database:', err);
    }
};

module.exports = connectDB;
