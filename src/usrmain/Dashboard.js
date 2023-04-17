import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import Course from "./component/Course";

// @mui
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Button, Alert } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TelegramIcon from "@mui/icons-material/Telegram";
import HomeIcon from "@mui/icons-material/Home";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

//font
import "./font.css";
import Message from "./Message";
import { Inbox } from "@mui/icons-material";
import { getAuth, signOut } from "firebase/auth";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Dashboard() {
  const theme = useTheme();
  const [currentState, setcurrentState] = useState("Main");

  const [draweropen, setdrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setdrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setdrawerOpen(false);
  };

  const [dialogopen, setdialogOpen] = useState(false);

  const handleClickdialogOpen = () => {
    setdialogOpen(true);
  };

  const handledialogClose = () => {
    setdialogOpen(false);
  };

  const [openalert, setOpenalert] = useState(true);

  const signout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("user");
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Signout successful");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });

    navigate("/");
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    console.log(JSON.parse(user));
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={draweropen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              mr: 2,
              ...(draweropen && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Education Metaverse
          </Typography>
          <Typography variant="h6" textAlign="right" sx={{ flexGrow: 1 }}>
            Welcome, {JSON.parse(localStorage.getItem("user")).username}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleClickdialogOpen}
            style={{ marginLeft: ".5rem" }}
          >
            SignOut
          </Button>
          <Dialog
            open={dialogopen}
            onClose={handledialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Are you ready to signout?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Make sure every action is done before you signout.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handledialogClose} color="error">
                No
              </Button>
              <Button onClick={signout} color="success" autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={draweropen}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* {["Chat"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => {
                  setcurrentState(text);
                }}
              >
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))} */}
          <ListItem key={"Main"} disablePadding>
            <ListItemButton
              onClick={() => {
                //setcurrentState("Main");
                window.location.reload();
              }}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={"Main Page"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Chat"} disablePadding>
            <ListItemButton
              onClick={() => {
                setcurrentState("Message");
              }}
            >
              <ListItemIcon>
                <TelegramIcon />
              </ListItemIcon>
              <ListItemText primary={"Message"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={draweropen}>
        <DrawerHeader />
        {localStorage.getItem("authenticated") ? (
          currentState == "Message" ? (
            <Message />
          ) : currentState == "Main" ? (
            <>
              <Collapse in={openalert}>
                <Alert
                  severity="success"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpenalert(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  User is successfully log in. Welcome to the dashboard.
                </Alert>
              </Collapse>
              <Course />
            </>
          ) : (
            ""
          )
        ) : (
          <Navigate to="/" />
        )}
      </Main>
    </Box>
  );
}
