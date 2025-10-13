// Install jwt lib: npm install jsonwebtoken
import jwt from "jsonwebtoken";
import fs from "fs";

// Read your downloaded .p8 file (same folder)
const privateKey = fs.readFileSync("./AuthKey_5C84QM5564.p8").toString();

// Replace these with your real Apple Developer values:
const token = jwt.sign(
  {
    iss: "72DC653W7Q", // Example: 7D123ABC45
    aud: "https://appleid.apple.com",
    sub: "com.outdoorguy24.unbound.signin" // Your Services ID
  },
  privateKey,
  {
    algorithm: "ES256",
    expiresIn: "180d",
    keyid: "5C84QM5564" // Example: 98ABC12345
  }
);

console.log("\n✅ Apple Sign In Secret JWT:\n");
console.log(token);
