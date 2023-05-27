import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/loginStyle.css";
import "./fonts/material-icon/css/material-design-iconic-font.min.css";
import GoogleIcon from "@mui/icons-material/Google";
import Login_logo from "./images/signup-image.jpg";
import Button from "@mui/material/Button";
import sha256 from "crypto-js/sha256";
import CryptoJS from "crypto-js";

import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, set } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvAO9riaSjsas9UJbF2TOYynaKBYRLUQM",
  authDomain: "comp3334-79d71.firebaseapp.com",
  databaseURL:
    "https://comp3334-79d71-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "comp3334-79d71",
  storageBucket: "comp3334-79d71.appspot.com",
  messagingSenderId: "212070543107",
  appId: "1:212070543107:web:a7d26fc7b771ecb665c336",
  measurementId: "G-5Z8QDF8B43",
};

export default function SignUp() {
  const [errorMessages, setErrorMessages] = useState({});
  const [validPassword, setvalidPassword] = useState(true);
  const [correctrepeatedPassword, setcorrectrepeatedPassword] = useState(true);
  const [emptyEmail, setemptyEmail] = useState(false);
  const [emptyPassword, setemptyPassword] = useState(false);
  const [emptyrepeatedPassword, setemptyrepeatedPassword] = useState(false);
  const [passwordcomplexity, setpasswordcomplexity] = useState(true);

  const navigate = useNavigate();

  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    repeatedPassword: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState(() => {
      return {
        ...state,
        [name]: value,
      };
    });
  };

  /* salt */
  const generateSalt = () => {
    // Generate a random 8-byte buffer
    const buffer = new Uint8Array(8);

    // Convert the buffer to a hexadecimal string
    const hex = Array.from(window.crypto.getRandomValues(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    // Return the hexadecimal string as the salt
    return hex;
  };

  /* hash */
  const hashPassword = (password, salt) => {
    // Concatenate the password and salt
    const data = password + salt;
    // Hash the data using SHA-256
    const hashedPassword = CryptoJS.SHA256(data);
    // Return the hashed password
    return hashedPassword.toString(CryptoJS.enc.Hex);
  };

  const handleSubmit = (event, password) => {
    // Prevent page reload
    event.preventDefault();

    // check the password is the same

    // Submit form

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Realtime Database and get a reference to the service
    const db = getDatabase(app);
    console.log("connected");

    // Create a new user
    const salt = generateSalt();

    //should check email is not empty
    if (state.email === "") {
      setemptyEmail(true);
      return;
    } else {
      setemptyEmail(false);
    }

    //should check password is not empty
    if (state.password === "") {
      setemptyPassword(true);
      return;
    } else {
      setemptyPassword(false);
    }

    //should check repeated password is not empty
    if (state.repeatedPassword === "") {
      setemptyrepeatedPassword(true);
      return;
    } else {
      setemptyrepeatedPassword(false);
    }

    //should check password at leadt 6 length
    if (
      !state.password.match(/[a-z]/g) ||
      !state.password.match(/[A-Z]/g) ||
      !state.password.match(/[0-9]/g) ||
      !state.password.length >= 8
    ) {
      setvalidPassword(false);
      return;
    } else {
      setvalidPassword(true);
    }

    //should check repeated password is the same as password
    if (state.password !== state.repeatedPassword) {
      setcorrectrepeatedPassword(false);
      return;
    } else {
      setcorrectrepeatedPassword(true);
    }

    const hashedPassword = hashPassword(state.password, salt);
    const hashedEmail = CryptoJS.SHA256(state.email).toString(CryptoJS.enc.Hex);

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, state.email, state.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // ...
        set(ref(db, "users/" + hashedEmail), {
          username: state.username === "" ? hashedEmail : state.username,
          password: hashedPassword,
          salt: salt,
        })
          .then(() => {
            // Data saved successfully!
            // show a pop up screen
            // back to login page
            navigate("/");
          })
          .catch((error) => {
            // The write failed...
            // show a pop up screen
          });
      })
      .catch((error) => {
        //when email is already used by another account error, error is printed in console
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  const renderForm = (
    //Sign Up  Form
    <section className="signup">
      <div className="container">
        <div className="signup-content">
          <div className="signup-form">
            <h2 className="form-title">Sign up</h2>
            <form
              onSubmit={handleSubmit}
              className="register-form"
              id="register-form"
            >
              <div className="form-group">
                <label for="name">
                  <i className="zmdi zmdi-account material-icons-name"></i>
                </label>
                <input
                  type="text"
                  name="username"
                  id="name"
                  value={state.username}
                  onChange={handleInputChange}
                  placeholder="Username (Optional)"
                />
              </div>
              <div className="form-group">
                <label for="email">
                  <i className="zmdi zmdi-email"></i>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={state.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                />
              </div>
              {!emptyEmail ? (
                ""
              ) : (
                <p className="fst-italic text-danger">
                  *The email cannot be empty
                </p>
              )}
              <div className="form-group">
                <label for="pass">
                  <i className="zmdi zmdi-lock"></i>
                </label>
                <input
                  type="password"
                  name="password"
                  id="pass"
                  value={state.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                />
              </div>
              {!emptyPassword ? (
                ""
              ) : (
                <p className="fst-italic text-danger">
                  *The password cannot be empty
                </p>
              )}

              {!validPassword ? (
                <p className="fst-italic text-danger">
                  *Password must contain (a-z, A-Z, 0-9, at least 8 characters)
                </p>
              ) : (
                ""
              )}

              <div className="form-group">
                <label for="re-pass">
                  <i className="zmdi zmdi-lock-outline"></i>
                </label>
                <input
                  type="password"
                  name="repeatedPassword"
                  id="re_pass"
                  placeholder="Repeat your password"
                  value={state.repeatedPassword}
                  onChange={handleInputChange}
                />
              </div>
              {!emptyrepeatedPassword ? (
                ""
              ) : (
                <p className="fst-italic text-danger">
                  *The repeated password cannot be empty
                </p>
              )}

              {!correctrepeatedPassword ? (
                <p className="fst-italic text-danger">
                  *Not the same as password
                </p>
              ) : (
                ""
              )}
              <div className="form-group">
                <input
                  type="checkbox"
                  name="agree-term"
                  id="agree-term"
                  className="agree-term"
                />
                <label for="agree-term" className="label-agree-term">
                  <span>
                    <span></span>
                  </span>
                  I agree all statements in{" "}
                  <a href="#" className="term-service">
                    Terms of service
                  </a>
                </label>
              </div>
              <div className="form-group form-button">
                <input
                  type="submit"
                  name="signup"
                  id="signup"
                  className="form-submit"
                  value="Register"
                />
              </div>
            </form>
          </div>
          <div className="signup-image">
            <figure>
              <img src={Login_logo} alt="Login Logo"></img>
            </figure>
            <Link to="/" className="signup-image-link">
              I am already registered
            </Link>
          </div>
        </div>
      </div>
    </section>
  );

  return <>{renderForm}</>;
}
