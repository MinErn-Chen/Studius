import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    paddingTop: "10px",
  },
  footer: {
    fontSize: 16,
    paddingTop: "5px",
  },
});

const QnA = ({ userInformation, setNotification, forumid }) => {
  const classes = useStyles();
  const date = new Date(); // for both instances of asked and responded
  const dateObj =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [ansDialogOpen, setAnsDialogOpen] = useState({
    open: false,
    question: "",
  });
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleAnsDiagOpen = (question) => () => {
    setAnsDialogOpen({ open: true, question: question });
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleAnsDiagClose = (answer) => {
    setAnsDialogOpen({ open: false });
  };

  // student
  const askQuestion = (question) => async () => {
    handleClose();
    try {
      const response = await fetch("http://localhost:3000/forum/qna/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
        body: JSON.stringify({
          forumid: forumid,
          question: question,
          date: dateObj,
        }),
      });

      const parseRes = await response.json();

      if (parseRes === true) {
        setNotification({
          open: true,
          severity: "success",
          message: `Question posted`,
        });
      } else {
        setNotification({
          open: true,
          severity: "error",
          message: parseRes,
        });
      }
      window.location.reload();
    } catch (error) {
      console.error(error.message);
    }
  };

  // tutor
  const answerQuestion = (answer, question) => async () => {
    handleClose();
    try {
      const response = await fetch("http://localhost:3000/forum/qna/answer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
        body: JSON.stringify({
          forumid: forumid,
          answer: answer,
          date: dateObj,
          question: question,
        }),
      });

      const parseRes = await response.json();

      if (parseRes === true) {
        setNotification({
          open: true,
          severity: "success",
          message: `Answer posted`,
        });
      } else {
        setNotification({
          open: true,
          severity: "error",
          message: parseRes,
        });
      }
      window.location.reload();
    } catch (error) {
      console.error(error.message);
    }
  };

  // both users
  const displayQnA = async () => {
    try {
      const response = await fetch("http://localhost:3000/forum/qna", {
        method: "POST",
        headers: {
          token: localStorage.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ forumid: forumid }),
      });

      const parseRes = await response.json();

      window.qnas = parseRes;
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    displayQnA();
  }, []);

  const qnas =
    window.qnas === undefined ? [] : window.qnas === null ? [] : window.qnas;

  const deleteQuestion = (question, answer) => async () => {
    try {
      const response = await fetch(`http://localhost:3000/forum/qna`, {
        method: "DELETE",
        headers: {
          token: localStorage.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          forumid: forumid,
        }),
      });

      const parseRes = await response.json();

      if (parseRes === true) {
        setNotification({
          open: true,
          severity: "success",
          message: "Question deleted",
        });
      } else {
        setNotification({
          open: true,
          severity: "error",
          message: parseRes,
        });
      }
      window.location.reload();
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message: error.message,
      });
      console.log(error.message);
    }
  };

  return (
    <>
      <div>
        <div>
          {userInformation.type === "Student" ? (
            <div>
              <Box display="flex" m={3} justifyContent="center">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleClickOpen}
                >
                  + Ask a question
                </Button>
              </Box>

              <Dialog
                open={dialogOpen}
                onClose={handleClose}
                aria-labelledby="qn-dialog-title"
                fullWidth
              >
                <DialogTitle id="qn-dialog-title">New Question</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="question"
                    label="Question"
                    onChange={(event) => setQuestion(event.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={askQuestion(question)} color="primary">
                    Add
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          ) : null}
        </div>

        <div>
          {qnas.length === 0 ? (
            <Box display="flex" justifyContent="center" m={2}>
              <Typography variant="h4"> No questions yet!</Typography>
            </Box>
          ) : (
            qnas
              .map((element) => Object.values(element))
              .map((element) => (
                <>
                  <Card className={classes.root} variant="elevation">
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        {element[2] /*dateAsked*/}
                      </Typography>

                      <Grid container wrap="nowrap" spacing={0}>
                        <Typography variant="h6" component="h2">
                          {element[0] /*question*/}
                        </Typography>
                      </Grid>
                      <Grid container wrap="nowrap" spacing={0}>
                        <Typography
                          variant="h7"
                          component="p"
                          className={classes.footer}
                        >
                          {element[1] /*answer*/}
                        </Typography>
                      </Grid>

                      <Typography
                        color="textSecondary"
                        gutterBottom
                        className={classes.date}
                      >
                        {element[3] /*dateResponded*/}
                      </Typography>
                    </CardContent>

                    {userInformation.type === "Student" ? (
                      <Box display="flex" flexDirection="row-reverse">
                        <CardActions>
                          <Button
                            size="small"
                            variant="contained"
                            style={{
                              backgroundColor: "#CC0000",
                              color: "white",
                            }}
                            onClick={deleteQuestion(element[0], element[1])}
                          >
                            Delete
                          </Button>
                        </CardActions>
                      </Box>
                    ) : (
                      <>
                        <Box display="flex" flexDirection="row-reverse">
                          <CardActions>
                            <Button
                              variant="contained"
                              colour="primary"
                              onClick={handleAnsDiagOpen(element[0])}
                            >
                              {element[1] === null ? "answer" : "edit"}
                            </Button>
                          </CardActions>
                        </Box>
                      </>
                    )}
                  </Card>

                  <br />
                </>
              ))
          )}
        </div>

        <>
          <Dialog
            open={ansDialogOpen.open}
            onClose={handleAnsDiagClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Question: {ansDialogOpen.question}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="answer"
                label="Your reply"
                onChange={(event) => setAnswer(event.target.value)}
                multiline
                rows={4}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAnsDiagClose} color="primary">
                cancel
              </Button>
              <Button
                onClick={answerQuestion(answer, ansDialogOpen.question)}
                color="primary"
              >
                answer
              </Button>
            </DialogActions>
          </Dialog>
        </>
      </div>
    </>
  );
};

export default QnA;
