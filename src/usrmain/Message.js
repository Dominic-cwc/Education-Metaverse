import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

//mui
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";
import SendIcon from "@mui/icons-material/Send";

/* Firebase Configure */
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "100%",
  },
  // headBG: {
  //   backgroundColor: "#e0e0e0",
  // },
  borderRight500: {
    height: "814px",
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "644px",
    overflowY: "auto",
    overflow: "auto",
  },
});

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

/* -----Chatbox-------------- */
const Message = () => {
  // Initialize Firebase
  const [userData, setuserData] = useState({});

  const [receiver, setReceiver] = useState("");
  const [receiverID, setReceiverID] = useState("");

  const [receivedMessage, setreceivedMessage] = useState([]);

  const [textmessage, settextmessage] = useState("");

  const myuser = JSON.parse(localStorage.getItem("user"));
  const myuserName = myuser.username;
  const myuserid = myuser.id;

  const [searchfield, setsearchfield] = useState("");

  const [renderMessage, setrenderMessage] = useState(false);
  const [messagefetched, setmessagefetched] = useState(false);

  const getCurrentTime = () => {
    const current = new Date();

    const date = current.toLocaleDateString("en-HK");

    // By default US English uses 12hr time with AM/PM
    const time = current.toLocaleTimeString("en-HK");
    return { datestr: date + " " + time, timestamp: current.getTime() };
  };

  /* hash */
  const hashMessage = (textmessage, currentTime) => {
    // Concatenate the password and salt
    const data = textmessage + currentTime;
    // Hash the data using SHA-256
    const hashedMessage = CryptoJS.SHA256(data);
    // Return the hashed password
    return hashedMessage.toString(CryptoJS.enc.Hex);
  };

  const sendMessage = () => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    // Initialize Realtime Database and get a reference to the service
    const db = getDatabase(app);

    const currentTime = getCurrentTime();
    const dateStr = currentTime.datestr;
    const timestamp = currentTime.timestamp;

    const hashedMessage = hashMessage(textmessage, dateStr);
    const verificationstr = hashMessage(textmessage + dateStr, myuserid);

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // ...

        //try sender|receiver to be the id, open n(n-1)/2 entries
        get(child(ref(db), "messages/" + myuserid + "|" + receiverID)) //sender|receiver exist?
          .then((snapshot) => {
            if (!snapshot.exists()) {
              get(child(ref(db), "messages/" + receiverID + "|" + myuserid)) //receiver|sender exist?
                .then((snapshot) => {
                  if (snapshot.exists()) {
                    set(
                      ref(
                        db,
                        "messages/" +
                          receiverID +
                          "|" +
                          myuserid +
                          "/" +
                          hashedMessage
                      ),
                      {
                        From: myuserid,
                        To: receiverID,
                        DateString: dateStr,
                        Timestamp: timestamp,
                        Content: encrypt(textmessage),
                        verificationstr: verificationstr,
                      }
                    )
                      .then(() => {
                        receiveMessage();
                      })
                      .catch((error) => {
                        // The write failed...
                      });
                  } else {
                    set(
                      ref(
                        db,
                        "messages/" +
                          myuserid +
                          "|" +
                          receiverID +
                          "/" +
                          hashedMessage
                      ),
                      {
                        From: myuserid,
                        To: receiverID,
                        DateString: dateStr,
                        Timestamp: timestamp,
                        Content: encrypt(textmessage),
                        verificationstr: verificationstr,
                      }
                    )
                      .then(() => {
                        receiveMessage();
                      })
                      .catch((error) => {
                        // The write failed...
                      });
                  }
                });
            } else {
              //both not exist
              set(
                ref(
                  db,
                  "messages/" +
                    myuserid +
                    "|" +
                    receiverID +
                    "/" +
                    hashedMessage
                ),
                {
                  From: myuserid,
                  To: receiverID,
                  DateString: dateStr,
                  Timestamp: timestamp,
                  Content: encrypt(textmessage),
                  verificationstr: verificationstr,
                }
              )
                .then(() => {
                  receiveMessage();
                })
                .catch((error) => {
                  // The write failed...
                });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        // User is signed out
        // ...
      }
    });
  };

  const receiveMessage = () => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    // Initialize Realtime Database and get a reference to the service
    const db = getDatabase(app);

    const sender = myuserid;
    const receiver = receiverID;

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // ...

        //try sender|receiver to be the id, open n(n-1)/2 entries
        get(child(ref(db), "messages/" + sender + "|" + receiver)) //sender|receiver exist?
          .then((snapshot) => {
            if (snapshot.exists()) {
              const temparr = [];
              snapshot.forEach((childSnapshot) => {
                //check the message data integrity
                const time = childSnapshot.val().DateString;
                const message = decrypt(childSnapshot.val().Content);
                const sender = childSnapshot.val().From;
                const verificationstr = childSnapshot.val().verificationstr;
                const hashedMessage = hashMessage(message + time, sender);
                if (verificationstr === hashedMessage) {
                  temparr.push(childSnapshot.val());
                }
              });

              //sort the message by timestamp
              temparr.sort((a, b) => {
                return a.Timestamp - b.Timestamp; // <0 a before b, >0 a after b
              });
              if (!compareMessage(temparr, receivedMessage)) {
                setreceivedMessage(temparr);
                setmessagefetched((messagefetched) => !messagefetched);
              }
              return;
            } else {
              get(child(ref(db), "messages/" + receiver + "|" + sender)) //receiver|sender exist?
                .then((snapshot) => {
                  if (snapshot.exists()) {
                    const temparr = [];
                    snapshot.forEach((childSnapshot) => {
                      //check verificationstr
                      const time = childSnapshot.val().DateString;
                      const message = decrypt(childSnapshot.val().Content);
                      const sender = childSnapshot.val().From;
                      const verificationstr =
                        childSnapshot.val().verificationstr;
                      const hashedMessage = hashMessage(message + time, sender);
                      if (verificationstr === hashedMessage) {
                        temparr.push(childSnapshot.val());
                      }
                    });

                    //sort the message by timestamp
                    temparr.sort((a, b) => {
                      return a.Timestamp - b.Timestamp; // <0 a before b, >0 a after b
                    });
                    if (!compareMessage(temparr, receivedMessage)) {
                      setreceivedMessage(temparr);
                      setmessagefetched((messagefetched) => !messagefetched);
                    }
                    return;
                  } else {
                    //both not have
                    setreceivedMessage([]);
                    setmessagefetched((messagefetched) => !messagefetched);
                    return;
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        // User is signed out
        // ...
      }
    });
  };

  const compareMessage = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;

    const len = Math.min(arr1.length, arr2.length);
    for (let i = 0; i < len; i++) {
      if (arr1[i].verificationstr !== arr2[i].verificationstr) return false;
    }
    return true;
  };

  const getDBcontent = () => {
    const app = initializeApp(firebaseConfig);
    const dbRef = ref(getDatabase(app));
    const user = JSON.parse(localStorage.getItem("user"));
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        get(child(dbRef, "users/"))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const temparr1 = {};
              snapshot.forEach((childSnapshot) => {
                temparr1[childSnapshot.key] = childSnapshot.val();
              });
              setuserData(temparr1);
            } else {
            }
          })
          .catch((error) => {
            console.error(error);
          });
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  };
  useEffect(() => {
    getDBcontent();

    const interval = setInterval(() => {
      setrenderMessage((renderMessage) => !renderMessage);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const alluserid = [];
    const allusename = [];
    Object.keys(userData).forEach((key) => {
      alluserid.push(key);
      allusename.push(userData[key].username);
    });
    //prevent user from sending message to a blank user
    setReceiver(allusename[0]);
    setReceiverID(alluserid[0]);
    receiveMessage();
  }, [userData]);

  useEffect(() => {
    receiveMessage();
  }, [receiverID, receiver, renderMessage]);

  useEffect(() => {
    const element = document.getElementById("messageArea");
    element.scrollTop = element.scrollHeight - element.clientHeight;
  }, [messagefetched]);

  //luxury functions

  //message encryption
  const encrypt = (message) => {
    const key = "comp3334";
    const encrypted = CryptoJS.AES.encrypt(message, key).toString();
    return encrypted;
  };

  //message decryption
  const decrypt = (message) => {
    const key = "comp3334";
    const decrypted = CryptoJS.AES.decrypt(message, key).toString(
      CryptoJS.enc.Utf8
    );
    return decrypted;
  };

  /* -------------------------- */
  const classes = useStyles();
  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" className="header-message">
            Message
          </Typography>
        </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={3} className={classes.borderRight500}>
          <List>
            <ListItemButton
              key={myuserName}
              style={{
                maxHeight: "56px",
              }}
            >
              <ListItemIcon>
                <Avatar alt={myuserName} />
              </ListItemIcon>
              <ListItemText
                primary={myuserName}
                style={{
                  maxHeight: "56px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {myuserName}
              </ListItemText>
            </ListItemButton>
          </List>
          <Divider />
          <Grid item xs={12} style={{ padding: "10px" }}>
            <TextField
              id="outlined-basic-email"
              label="Search"
              variant="outlined"
              fullWidth
              onChange={(e) => {
                setsearchfield(e.target.value);
              }}
            />
          </Grid>
          <Divider />
          <List style={{ maxHeight: "664px", overflow: "auto" }}>
            {/* mapping, avoid too much user in the screen, used overflow */}
            {Object.keys(userData).map((key) =>
              key !== myuser.id ? (
                searchfield === "" ? (
                  <ListItemButton
                    key={key}
                    onClick={() => {
                      setReceiver(userData[key].username);
                      setReceiverID(key);
                    }}
                  >
                    <ListItemIcon>
                      <Avatar alt={key} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        userData[key].username.length > 10
                          ? userData[key].username.substr(0, 10) + "..." //prevent username too long
                          : userData[key].username
                      }
                    ></ListItemText>
                  </ListItemButton>
                ) : userData[key].username.includes(searchfield) ? (
                  <ListItemButton
                    key={key}
                    onClick={() => {
                      setReceiver(userData[key].username);
                      setReceiverID(key);
                    }}
                  >
                    <ListItemIcon>
                      <Avatar alt={key} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        userData[key].username.length > 10
                          ? userData[key].username.substr(0, 10) + "..." //prevent username too long
                          : userData[key].username
                      }
                    ></ListItemText>
                  </ListItemButton>
                ) : null
              ) : null
            )}
          </List>
        </Grid>
        <Grid item xs={9}>
          {/* The receiver info. */}
          <Grid item xs={12} style={{ borderRight: "1px solid #e0e0e0" }}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Avatar alt={receiver} />
                </ListItemIcon>
                <ListItemText
                  align="left"
                  style={{
                    maxHeight: "56px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {receiver}
                </ListItemText>
              </ListItem>
            </List>
          </Grid>

          <Divider />
          {/* mapping, avoid too much message in the screen, used overflow*/}
          <List className={classes.messageArea} id="messageArea">
            {/* pre-received messages */}
            {receivedMessage.map((message) =>
              message.From === myuser.id ? (
                <ListItem key={message.DateString} alignItems="flex-start">
                  <Grid container>
                    <Grid item xs={12}>
                      <ListItemText
                        align="right"
                        primary={decrypt(message.Content)}
                      ></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                      <ListItemText
                        align="right"
                        secondary={message.DateString}
                      ></ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>
              ) : (
                <ListItem key={message.DateString} alignItems="flex-start">
                  <Grid container>
                    <Grid item xs={12}>
                      <ListItemText
                        align="left"
                        primary={decrypt(message.Content)}
                      ></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                      <ListItemText
                        align="left"
                        secondary={message.DateString}
                      ></ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>
              )
            )}
          </List>
          <Divider />
          <Grid container style={{ padding: "20px" }}>
            <Grid item xs={11}>
              <TextField
                onChange={(e) => {
                  settextmessage(e.target.value);
                }}
                id="outlined-basic-email"
                label="Type Something"
                fullWidth
                value={textmessage}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    if (textmessage === "") return;
                    sendMessage();
                    settextmessage("");
                  }
                }}
              />
            </Grid>
            <Grid xs={1} align="right">
              <Fab color="primary" aria-label="add">
                <SendIcon
                  onClick={() => {
                    if (textmessage === "") return;
                    sendMessage();
                    settextmessage("");
                  }}
                />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Message;
