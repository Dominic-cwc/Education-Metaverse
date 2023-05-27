import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/loginStyle.css";
import "./fonts/material-icon/css/material-design-iconic-font.min.css";
import GoogleIcon from "@mui/icons-material/Google";
import Login_logo from "./images/signin-image.jpg";
import Button from "@mui/material/Button";
import CryptoJS from "crypto-js";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, set } from "firebase/database";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
} from "firebase/auth";
import { Alert } from "@mui/material";

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

export default function Login() {
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [correctemailpw, setCorrectEmailPW] = useState(true);
  const handleSubmit = (event) => {
    // Prevent page reload
    event.preventDefault();

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Realtime Database and get a reference to the service
    const dbRef = ref(getDatabase(app));
    console.log("connected");

    const hashedEmail = CryptoJS.SHA256(state.email).toString(CryptoJS.enc.Hex);
    console.log(hashedEmail);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, state.email, state.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        get(child(dbRef, "users/" + hashedEmail))
          .then((snapshot) => {
            console.log(state.password, state.email);
            if (
              snapshot.exists() &&
              snapshot.val().password ===
                hashPassword(state.password, snapshot.val().salt)
            ) {
              console.log("LOGIN SUCCESSFUL");
              localStorage.setItem("authenticated", true);
              localStorage.setItem(
                "user",
                JSON.stringify({
                  id: hashedEmail,
                  username: snapshot.val().username,
                })
              );
              setCorrectEmailPW(true);
              navigate("/Education-Metaverse/dashboard/");
            } else {
              console.log("No data available");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.log("LOGIN FAILED");
        setCorrectEmailPW(false);
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const hashPassword = (password, salt) => {
    // Concatenate the password and salt
    const data = password + salt;
    // Hash the data using SHA-256
    const hashedPassword = CryptoJS.SHA256(data);
    // Return the hashed password
    return hashedPassword.toString(CryptoJS.enc.Hex);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState(() => {
      return {
        ...state,
        [name]: value,
      };
    });
  };

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        //token to Google API
        console.log(token);

        // The signed-in user info.
        const user = result.user;
        localStorage.setItem("authenticated", true);

        const userid = user.uid;

        let hexid = "";
        for (let i = 0; i < userid.length; i++) {
          hexid += userid.charCodeAt(i).toString(16);
        }

        localStorage.setItem("authenticated", true);
        localStorage.setItem(
          "user",
          JSON.stringify({ id: hexid, username: user.displayName })
        );

        const dbRef = ref(getDatabase(app));
        console.log("connected");

        get(child(dbRef, "users/" + hexid))
          .then((snapshot) => {
            if (!snapshot.exists()) {
              set(child(dbRef, "users/" + hexid), {
                username: user.displayName,
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });

        navigate("/Education-Metaverse/dashboard");
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const renderForm = (
    //Sign in  Form
    <section className="sign-in">
      <div className="container">
        <div className="signin-content">
          <div className="signin-image">
            <figure>
              <img src={Login_logo} alt="Login Logo"></img>
            </figure>
            <Link
              to="/Education-Metaverse/SignUp"
              className="signup-image-link"
            >
              Create an account
            </Link>
          </div>

          <div className="signin-form">
            <h2 className="form-title">Login</h2>
            <form
              onSubmit={handleSubmit}
              className="register-form"
              id="login-form"
            >
              <div className="form-group">
                <label htmlFor="email">
                  <i className="zmdi zmdi-email"></i>
                </label>
                <input
                  type="text"
                  name="email"
                  id="your_email"
                  value={state.email}
                  onChange={handleInputChange}
                  placeholder="Your Email Address"
                />
              </div>
              <div className="form-group">
                <label htmlFor="your_pass">
                  <i className="zmdi zmdi-lock"></i>
                </label>
                <input
                  type="password"
                  name="password"
                  id="your_pass"
                  value={state.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                />
              </div>
              {!correctemailpw ? (
                <p className="fst-italic text-danger">
                  *Incorrect email or password.
                </p>
              ) : (
                ""
              )}
              <div className="form-group">
                <input
                  type="checkbox"
                  name="remember-me"
                  id="remember-me"
                  className="agree-term"
                />
                <label htmlFor="remember-me" className="label-agree-term">
                  <span>
                    <span></span>
                  </span>
                  Remember me
                </label>
              </div>
              <div className="form-group form-button">
                <input
                  type="submit"
                  name="signin"
                  id="signin"
                  className="form-submit"
                  value="Log in"
                />
              </div>
            </form>
            <div className="social-login">
              <span className="social-label">Or login with</span>
              <ul className="socials">
                <li>
                  <Button color="error" onClick={googleLogin}>
                    <GoogleIcon />
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <div className="login-form">{renderForm}</div>
    </>
  );
}
