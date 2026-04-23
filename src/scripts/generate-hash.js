// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcrypt');

async function generateHash() {
  const password = '123456';
  const hash = await bcrypt.hash(password, 12);
  console.log(`Password "${password}" hashed: ${hash}`);
  
  // Test the hash
  const isValid = await bcrypt.compare(password, hash);
  console.log(`Verification: ${isValid}`);
}

generateHash().catch(console.error);
