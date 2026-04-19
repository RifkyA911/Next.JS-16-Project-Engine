import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Pre-hashed passwords for demo users
export const DEMO_USERS = [
  {
    id: "1",
    email: "admin@example.com",
    username: "admin",
    role: "administrator",
    name: "Admin User",
    // Hashed version of "123456"
    password: "$2b$12$C8KwaZVJMIcSlDo0/pbHz.svbB.KotaygENLytY2QHBqPUWS6a0TO",
    image:
      "https://wallpapers.com/images/high/anime-profile-picture-jioug7q8n43yhlwn.jpg",
    bio: "I am the admin user.",
    is_active: true,
    is_verified: true,
    created_at: new Date(),
    updated_at: new Date(),
    last_login: new Date(),
  },
  {
    id: "2",
    email: "user@example.com",
    username: "user",
    role: "user",
    name: "Dummy User",
    // Hashed version of "123456"
    password: "$2b$12$C8KwaZVJMIcSlDo0/pbHz.svbB.KotaygENLytY2QHBqPUWS6a0TO",
    image:
      "https://wallpapers.com/images/high/anime-profile-picture-jioug7q8n43yhlwn.jpg",
    bio: "I am the user.",
    is_active: true,
    is_verified: true,
    created_at: new Date(),
    updated_at: new Date(),
    last_login: new Date(),
  },
];

// Utility to generate new hashed passwords for development
export async function generateHashedPassword(password: string): Promise<string> {
  const hashed = await hashPassword(password);
  console.log(`Password "${password}" hashed: ${hashed}`);
  return hashed;
}
