import { getConnection } from "../database/connection.js";
import bcrypt from "bcrypt";
import sql from "mssql";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import {
  MESSAGES_FOR_MISSING_FIELDS,
  MESSAGES_FOR_MISSING_FIELDS_LOGIN,
} from "../constants/const.js";

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const pool = await getConnection();
    const {
      username,
      lastname,
      email,
      phone,
      password,
      passwordConfirmation,
      gender,
    } = req.body;

    for (const field in MESSAGES_FOR_MISSING_FIELDS) {
      if (!req.body[field]) {
        res.status(400);
        res.send(MESSAGES_FOR_MISSING_FIELDS[field]);
        return;
      }
    }

    if (password !== passwordConfirmation) {
      res.status(400);
      res.send("Las contraseñas no coinciden");
      return;
    }

    //chequeamos que el email no este en uso
    const resultEmail = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM users WHERE email = @email");

    if (resultEmail.recordset.length > 0) {
      res.status(400);
      res.send("El email ya está en uso");
      return;
    }

    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("lastname", sql.VarChar, lastname)
      .input("email", sql.VarChar, email)
      .input("phone", sql.VarChar, phone)
      .input("password", sql.VarChar, hashedPassword)
      .input("gender", sql.VarChar, gender)
      .query(
        "INSERT INTO users (username, lastname, email, phone, password, gender) VALUES (@username, @lastname, @email, @phone, @password, @gender)"
      );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const pool = await getConnection();
    const { email, password } = req.body;

    for (const field in MESSAGES_FOR_MISSING_FIELDS_LOGIN) {
      if (!req.body[field]) {
        res.status(400);
        res.send(MESSAGES_FOR_MISSING_FIELDS_LOGIN[field]);
        return;
      }
    }

    //chequeamos que el email exista
    const resultEmail = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM users WHERE email = @email");

    if (resultEmail.recordset.length === 0) {
      res.status(400);
      res.send(" Credenciales inválidas");
      return;
    }

    const comparePassword = await bcrypt.compare(
      password,
      resultEmail.recordset[0].password
    );

    if (!comparePassword) {
      res.status(400);
      res.send("Credenciales inválidas");
      return;
    }

    const token = jsonwebtoken.sign(
      { user: resultEmail.recordset[0].email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: false,
      path: "/",
      secure: true,
      sameSite: "none",
    };

    res.cookie("jwt", token, cookieOptions);
    res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
