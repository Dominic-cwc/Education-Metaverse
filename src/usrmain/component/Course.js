import { useState, useEffect } from "react";

import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";

import AddThread from "./AddThread";

// material-ui
import { Box, List, ListItemButton, ListItemText, Button } from "@mui/material";
import * as React from "react";
/* import Box from "@mui/material/Box"; */
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
/* import Button from "@mui/material/Button"; */
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import Fab from "@mui/material/Fab";
import ListItem from "@mui/material/ListItem";

import moment from "moment";

export default function Course() {
  const [courseList, setCourseList] = useState([]);
  const [tag, setTag] = useState(null); // course tag
  const [course, setCourse] = useState(null);
  const [disContent, setDisContent] = useState([]);
  const [courseContent, setCourseContent] = useState([]);
  const [refresh, setrefresh] = useState(false);
  const [comment, setComment] = useState([]);

  const [username, setUsername] = useState(null);

  //

  const findCourseList = async () => {
    const db = getFirestore();
    const courseRef = collection(db, "course");
    const courseSnapshot = await getDocs(courseRef);
    const courseList = courseSnapshot.docs.map((doc) => doc.data());
    setCourseList(courseList);
    console.log(courseList);
  };

  const loadCourse = (name, tag, lessoninfo) => {
    setCourse(name);
    setTag(tag);
    setCourseContent(lessoninfo);
    console.log("courseInfo");
    findDiscuss(tag);
  };

  const findDiscuss = async (tag) => {
    const db = getFirestore();
    const discussRef = collection(db, "course/" + tag + "/Discuss");
    const discussSnapshot = await getDocs(discussRef);
    const discussList = discussSnapshot.docs.map((doc) => doc.id);

    const temparr = [];
    for (let i = 0; i < discussList.length; i++) {
      const discussRef = doc(db, "course/" + tag + "/Discuss/", discussList[i]);
      const discussSnapshot = await getDoc(discussRef);
      const discussData = discussSnapshot.data();
      discussData.id = discussList[i];

      if (discussData.comment.length > 0) {
        discussData.comment.sort((a, b) => a.timestamp - b.timestamp);
      }
      temparr[i] = discussData;
    }

    temparr.sort((a, b) => a.timestamp - b.timestamp);

    console.log(temparr);
    setDisContent(temparr);
  };

  useEffect(() => {
    // Just run the first time
    findCourseList();
    const user = JSON.parse(localStorage.getItem("user"));
    setUsername(user.username);
  }, []);

  useEffect(() => {
    console.log("user is typing comment");
    console.log(comment);
  }, [comment]);

  useEffect(() => {
    console.log(disContent);
  }, [disContent]);

  useEffect(() => {
    console.log("refresh");
    findDiscuss(tag);
    setrefresh(false);
  }, [refresh]);

  const pull_data = (data) => {
    console.log("pull data");
    setrefresh(refresh + data);
    console.log(refresh);
    console.log(data); // LOGS DATA FROM CHILD (My name is Dean Winchester... &)
  };

  const submitComment = async (docid) => {
    const db = getFirestore();
    console.log("submit comment");
    const timestamp = new Date().getTime();

    const docRef = doc(db, "course/" + tag + "/Discuss/", docid);
    await updateDoc(docRef, {
      comment: arrayUnion({
        by: username,
        content: comment,
        time: moment(timestamp).format("MMMM Do YYYY, h:mm:ss a"),
        timestamp: timestamp,
      }),
    });
    setrefresh(true);
    setComment("");
  };
  return (
    <>
      {course === null ? (
        <>
          <Box
            sx={{
              borderColor: "blue",
              width: "100%",
              height: 400,
              bgcolor: "grey.100",
              borderRadius: "16px",
              border: "2px solid",
              boxShadow: 2,
            }}
          >
            <List>
              <Typography
                variant="h3"
                fontweight="bold"
                /* backgroundColor="text.disable" */
                /* sx={{ fontSize: 14 }} */

                gutterBottom
              >
                Course List
              </Typography>
              {courseList.map((course) => {
                return (
                  <ListItemButton
                    key={course.tag}
                    onClick={(e) => {
                      console.log(course.courseInfo);
                      loadCourse(
                        course.name,
                        course.tag,
                        course.courseInfo.lessons
                      );
                    }}
                  >
                    <ListItemText
                      primary={course.name}
                      secondary={course.courseInfo.lessons.classCode}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        </>
      ) : (
        <>
          <h1>{course}</h1>

          <h3>Course description</h3>
          <Card
            sx={{
              minWidth: 275,
              bgcolor: "white",
              borderRadius: "16px",
              borderColor: "black",
              border: "2px solid",
              boxShadow: 2,
            }}
          >
            <CardContent>
              <Typography
                variant="h3"
                /* backgroundColor="text.disable" */
                /* sx={{ fontSize: 14 }} */

                gutterBottom
              >
                Subject Code: {courseContent.classCode}
              </Typography>
              <Typography variant="h4" component="div">
                Tutor: {courseContent.Tutor}
              </Typography>
              <Typography variant="h4" sx={{ mb: 1.5 }}>
                Lesson time: {courseContent.lessonTime}
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ textDecoration: "underline" }}
              >
                Lesson day
              </Typography>

              <Typography variant="h6" color="text.secondary">
                {courseContent.Day}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Contact Email: {courseContent.contact}
              </Typography>
            </CardContent>
            {/*  <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions> */}
          </Card>
          <Button
            variant="outlined"
            color="error"
            onClick={(e) => {
              setCourse(null);
            }}
          >
            Return to Course List
          </Button>

          <Box sx={{ width: "100%", height: 600 }}>
            <List>
              Fourm&nbsp;&nbsp;&nbsp;
              <AddThread tag={tag} func={pull_data} />
              {}
              <Paper style={{ maxHeight: 300, overflow: "auto" }}>
                {disContent.map((Thread) => {
                  return (
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <ListItemText
                          primary={Thread.title}
                          secondary={Thread.date}
                        />
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          {courseContent.Tutor}:{Thread.content}
                        </Typography>

                        <Typography sx={{ color: "black", mt: 4 }}>
                          Comment
                        </Typography>
                        {Thread.comment.length > 0 ? (
                          <Paper
                            style={{
                              maxHeight: 100,
                              overflow: "auto",
                              width: 500,
                            }}
                          >
                            <List>
                              {Thread.comment &&
                                Thread.comment.map((comment) => {
                                  return (
                                    <ListItem>
                                      <ListItemText
                                        primary={comment.content}
                                        secondary={"from " + comment.by}
                                      />
                                      <ListItemText primary={comment.time} />
                                    </ListItem>
                                  );
                                })}
                            </List>
                          </Paper>
                        ) : (
                          <Typography>No comment currently.</Typography>
                        )}

                        <TextField
                          id="standard-basic"
                          label="Comment"
                          variant="standard"
                          value={comment}
                          onChange={(comment) => {
                            setComment(comment.target.value);
                          }}
                        />
                        <Fab
                          variant="extended"
                          size="medium"
                          color="primary"
                          aria-label="add"
                          sx={{ mt: 1, ml: 1 }} // mt = margin top , ml = margin left
                        >
                          <SendIcon
                            onClick={() => {
                              submitComment(Thread.id);
                            }}
                          />
                        </Fab>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Paper>
            </List>
          </Box>
        </>
      )}
    </>
  );
}
