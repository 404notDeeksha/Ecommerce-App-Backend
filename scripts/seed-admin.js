const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  userId: { type: String, default: () => require("uuid").v4() },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ["user", "admin", "product_manager"], default: "user" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

const seedAdmin = async () => {
  const email = process.argv[2] || "admin@example.com";
  const password = process.argv[3] || "Admin@123";
  const name = process.argv[4] || "Admin";
  const role = process.argv[5] || "admin";

  if (!process.env.MONGODB_URL) {
    console.error("❌ Error: MONGODB_URL not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connected to MongoDB");

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log(`⚠️  User already exists: ${email}`);
      
      if (existingUser.role !== role) {
        existingUser.role = role;
        await existingUser.save();
        console.log(`✅ Updated user role to: ${role}`);
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
      });

      await user.save();
      console.log(`✅ User created: ${email}`);
      console.log(`   Password: ${password}`);
    }

    console.log("\n📋 Login credentials:");
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${role}`);

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

seedAdmin();