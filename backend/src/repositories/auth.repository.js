const { UserModel } = require("../models");
const NotFound = require("../errors/notFound.error");
const BadRequest = require("../errors/badRequest.error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthRepository {
  generateAuthToken(user) {
    try {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return token;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async login(email, password) {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) throw new NotFound("User not found");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        throw new BadRequest("wrong password", "Invalid credentials");

      const token = this.generateAuthToken(user);
      return { user, token };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async register(firstName, lastName, email, password, confirmPassword) {
    try {
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        throw new Error("All fields are required.");
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new Error("User with this email already exists.");
      }
      const user = await UserModel.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      });
      const token = this.generateAuthToken(user);
      return { user, token };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
module.exports = AuthRepository;
