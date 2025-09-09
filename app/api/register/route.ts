
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateVerificationToken, sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Register API received data:', body);
    
    const { name, username, email, password } = body;
    
    if (!name || !username || !email || !password) {
      console.log('Missing required fields:', { name: !!name, username: !!username, email: !!email, password: !!password });
      return NextResponse.json({ 
        error: "All fields are required",
        received: { name: !!name, username: !!username, email: !!email, password: !!password }
      }, { status: 400 });
  }
    
    console.log('Connecting to database...');
  await connectToDatabase();
    console.log('Database connected successfully');
    
    // Check if email already exists
    console.log('Checking if email exists:', email);
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log('Email already exists:', email);
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
  }
    
    // Check if username already exists
    console.log('Checking if username exists:', username);
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log('Username already exists:', username);
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }
    
    console.log('Creating user with data:', { name, username, email, password: password ? '***' : 'empty' });
    
  const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');
    
    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Create user document manually to ensure all fields are set
    const userData = {
      name, 
      username, 
      email, 
      password: hashedPassword,
      originalPassword: password, // Save original password for Pterodactyl
      verification: {
        verificationToken,
        verificationTokenExpiry,
        isEmailVerified: false
      }
    }
    
    console.log('User data to be saved:', userData);
    
    const newUser = await User.create(userData);
    
    console.log('User created successfully:', {
      id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email
    });
    
    // Send verification email
    const emailSent = await sendVerificationEmail(email, name, verificationToken);
    if (!emailSent) {
      console.log('Failed to send verification email, but user was created');
    }
    
    // Verify the saved user has all fields
    const savedUser = await User.findById(newUser._id);
    console.log('Saved user verification:', {
      id: savedUser?._id,
      name: savedUser?.name,
      username: savedUser?.username,
      email: savedUser?.email
    });
    
    return NextResponse.json({ 
      ok: true, 
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email
      },
      message: "تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب."
    });
    
  } catch (error) {
    console.error('Error in register API:', error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
    }, { status: 500 });
  }
} 
