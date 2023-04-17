import * as React from "react";
import { useEffect } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import moment from "moment";

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

const app = initializeApp(firebaseConfig);
// eslint-disable-next-line
const auth = getAuth(app);

export default function AddThread({ tag, func }) {
  const [open, setOpen] = React.useState(false);
  const [maxWidth, setMaxWidth] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const title = document.getElementById("title").value;
    const text = document.getElementById("text").value;
    //console.log(title, text, tag.tag)
    createPost(title, text);
    alert("Thread Created!");
    setOpen(false);
    console.log(tag);
    func(true);
  };

  const createPost = async (title, text, e) => {
    const db = getFirestore();
    const user = localStorage.getItem("user");
    const timestamp = new Date().getTime();

    try {
      const docRef = await addDoc(
        collection(db, "course/" + tag + "/Discuss/"),
        {
          date: moment(timestamp).format("MMMM Do YYYY, h:mm:ss a"),
          user: JSON.parse(user),
          title: title,
          content: text,
          comment: [],
          timestamp: timestamp,
        }
      ).then(() => {
        console.log("Post created!");
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open new thread
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={"sm"}
        fullWidth={true}
      >
        <DialogTitle>Open New Thread</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Input Your Thread Title and Content
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="text"
            label="Content"
            type="text"
            multiline
            fullWidth
            rows={4}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={(e) => {
              handleSubmit();
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
