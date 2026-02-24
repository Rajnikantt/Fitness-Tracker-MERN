const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Exercise = require('../models/Exercise');
const Program = require('../models/Program');

// Sample exercises
const exercises = [
  // Chest
  { name: 'Bench Press', category: 'Chest', equipment: 'Barbell', description: 'Classic barbell bench press for chest development', isActive: true },
  { name: 'Dumbbell Press', category: 'Chest', equipment: 'Dumbbell', description: 'Dumbbell chest press', isActive: true },
  { name: 'Push-ups', category: 'Chest', equipment: 'Bodyweight', description: 'Standard push-ups', isActive: true },
  { name: 'Cable Fly', category: 'Chest', equipment: 'Cable', description: 'Cable chest fly', isActive: true },
  
  // Back
  { name: 'Deadlift', category: 'Back', equipment: 'Barbell', description: 'Conventional deadlift', isActive: true },
  { name: 'Bent Over Row', category: 'Back', equipment: 'Barbell', description: 'Barbell bent over row', isActive: true },
  { name: 'Pull-ups', category: 'Back', equipment: 'Bodyweight', description: 'Standard pull-ups', isActive: true },
  { name: 'Lat Pulldown', category: 'Back', equipment: 'Machine', description: 'Lat pulldown machine', isActive: true },
  
  // Legs
  { name: 'Squat', category: 'Legs', equipment: 'Barbell', description: 'Barbell back squat', isActive: true },
  { name: 'Leg Press', category: 'Legs', equipment: 'Machine', description: 'Leg press machine', isActive: true },
  { name: 'Lunges', category: 'Legs', equipment: 'Bodyweight', description: 'Walking lunges', isActive: true },
  { name: 'Romanian Deadlift', category: 'Legs', equipment: 'Barbell', description: 'RDL for hamstrings', isActive: true },
  
  // Shoulders
  { name: 'Overhead Press', category: 'Shoulders', equipment: 'Barbell', description: 'Standing overhead press', isActive: true },
  { name: 'Lateral Raise', category: 'Shoulders', equipment: 'Dumbbell', description: 'Dumbbell lateral raises', isActive: true },
  { name: 'Face Pull', category: 'Shoulders', equipment: 'Cable', description: 'Cable face pulls', isActive: true },
  
  // Arms
  { name: 'Barbell Curl', category: 'Arms', equipment: 'Barbell', description: 'Standing barbell curl', isActive: true },
  { name: 'Tricep Dips', category: 'Arms', equipment: 'Bodyweight', description: 'Parallel bar dips', isActive: true },
  { name: 'Hammer Curl', category: 'Arms', equipment: 'Dumbbell', description: 'Dumbbell hammer curls', isActive: true },
  
  // Core
  { name: 'Plank', category: 'Core', equipment: 'Bodyweight', description: 'Front plank hold', isActive: true },
  { name: 'Ab Wheel', category: 'Core', equipment: 'Other', description: 'Ab wheel rollouts', isActive: true },
  { name: 'Hanging Leg Raise', category: 'Core', equipment: 'Bodyweight', description: 'Hanging leg raises', isActive: true }
];

async function seedDatabase() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Exercise.deleteMany({});
    await Program.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@iron.com',
      password: 'admin123',
      role: 'Admin',
      isActive: true
    });
    console.log('✅ Admin user created:', admin.email);

    // Create regular user
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'User',
      isActive: true
    });
    console.log('✅ Regular user created:', user.email);

    // Create exercises
    const createdExercises = await Exercise.insertMany(exercises);
    console.log(`✅ Created ${createdExercises.length} exercises`);

    // Create a sample program
    const benchPress = createdExercises.find(e => e.name === 'Bench Press');
    const squat = createdExercises.find(e => e.name === 'Squat');
    const deadlift = createdExercises.find(e => e.name === 'Deadlift');
    const pullUps = createdExercises.find(e => e.name === 'Pull-ups');

    const sampleProgram = await Program.create({
      name: 'Beginner Full Body 3-Day',
      description: 'A 3-day full body program for beginners',
      createdBy: user._id,
      visibility: 'Public',
      days: [
        {
          dayNumber: 1,
          title: 'Day 1 - Push',
          notes: 'Focus on chest and triceps',
          exercises: [
            {
              exercise: benchPress._id,
              orderNo: 1,
              trainingStyle: 'Straight Sets',
              sets: [
                { setNo: 1, targetReps: 10, targetWeight: 135, restSeconds: 90 },
                { setNo: 2, targetReps: 10, targetWeight: 135, restSeconds: 90 },
                { setNo: 3, targetReps: 10, targetWeight: 135, restSeconds: 90 }
              ]
            }
          ]
        },
        {
          dayNumber: 2,
          title: 'Day 2 - Legs',
          notes: 'Squat and deadlift focus',
          exercises: [
            {
              exercise: squat._id,
              orderNo: 1,
              trainingStyle: 'Straight Sets',
              sets: [
                { setNo: 1, targetReps: 8, targetWeight: 185, restSeconds: 120 },
                { setNo: 2, targetReps: 8, targetWeight: 185, restSeconds: 120 },
                { setNo: 3, targetReps: 8, targetWeight: 185, restSeconds: 120 }
              ]
            }
          ]
        },
        {
          dayNumber: 3,
          title: 'Day 3 - Pull',
          notes: 'Back and biceps',
          exercises: [
            {
              exercise: pullUps._id,
              orderNo: 1,
              trainingStyle: 'Straight Sets',
              sets: [
                { setNo: 1, targetReps: 10, targetWeight: 0, restSeconds: 90 },
                { setNo: 2, targetReps: 10, targetWeight: 0, restSeconds: 90 },
                { setNo: 3, targetReps: 10, targetWeight: 0, restSeconds: 90 }
              ]
            }
          ]
        }
      ]
    });
    console.log('✅ Sample program created:', sampleProgram.name);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin - Email: admin@iron.com, Password: admin123');
    console.log('User - Email: john@example.com, Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
