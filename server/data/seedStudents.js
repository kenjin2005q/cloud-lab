const mongoose = require('mongoose');
require('dotenv').config();
const Student = require('../models/Student');

const students = [
    {
        studentId: "SV001",
        fullName: "Nguyen Van An",
        email: "an.nguyen@example.com",
        phone: "0901234567",
        address: "123 Nguyen Trai, Quan 1, TP.HCM",
        gender: "Male",
        dateOfBirth: new Date("2000-01-15"),
        major: "Computer Science",
        gpa: 3.5,
        year: 4,
        isActive: true
    },
    {
        studentId: "SV002",
        fullName: "Tran Thi Binh",
        email: "binh.tran@example.com",
        phone: "0909876543",
        address: "456 Le Loi, Quan 1, TP.HCM",
        gender: "Female",
        dateOfBirth: new Date("2001-05-20"),
        major: "Information Technology",
        gpa: 3.8,
        year: 3,
        isActive: true
    },
    {
        studentId: "SV003",
        fullName: "Le Van Cuong",
        email: "cuong.le@example.com",
        phone: "0912345678",
        address: "789 Pham Ngu Lao, Quan 1, TP.HCM",
        gender: "Male",
        dateOfBirth: new Date("1999-11-10"),
        major: "Software Engineering",
        gpa: 3.2,
        year: 4,
        isActive: true
    },
    {
        studentId: "SV004",
        fullName: "Pham Thi Dung",
        email: "dung.pham@example.com",
        phone: "0923456789",
        address: "321 Tran Hung Dao, Quan 1, TP.HCM",
        gender: "Female",
        dateOfBirth: new Date("2002-03-25"),
        major: "Data Science",
        gpa: 3.9,
        year: 2,
        isActive: true
    },
    {
        studentId: "SV005",
        fullName: "Hoang Van Em",
        email: "em.hoang@example.com",
        phone: "0934567890",
        address: "654 Hai Ba Trung, Quan 1, TP.HCM",
        gender: "Male",
        dateOfBirth: new Date("2000-07-08"),
        major: "Computer Science",
        gpa: 2.8,
        year: 3,
        isActive: false
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        await Student.deleteMany({});
        console.log('🗑️  Cleared existing data');
        
        const result = await Student.insertMany(students);
        console.log(`✅ Inserted ${result.length} students successfully`);
        
        const list = await Student.find({});
        console.log('\n📊 Current students:');
        list.forEach(s => {
            console.log(`   ${s.studentId} - ${s.fullName} (GPA: ${s.gpa})`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

seedDatabase();
