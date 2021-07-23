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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

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

  dayjs.extend(relativeTime);

  const [qnas, setQnas] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ansDialogOpen, setAnsDialogOpen] = useState({
    open: false,
    question: "",
    id: "",
  });
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleAnsDiagOpen = (question, id) => () => {
    setAnsDialogOpen({ open: true, question, id });
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
      const qnaData = {
        question,
        date: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:3000/forum/qna/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
        body: JSON.stringify({
          ...qnaData,
          forumid,
        }),
      });

      const parseRes = await response.json();

      if (parseRes.status === true) {
        setQnas([{ ...qnaData, id: parseRes.id }, ...qnas]);
        setNotification({
          open: true,
          severity: "success",
          message: parseRes.message,
        });
      } else {
        setNotification({
          open: true,
          severity: "error",
          message: parseRes.message,
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // tutor
  const answerQuestion = (answer, id) => async () => {
    setAnsDialogOpen({ open: false, question: "", id: "" });

    console.log(id);
    try {
      const date = new Date().toISOString();
      const response = await fetch("http://localhost:3000/forum/qna/answer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
        body: JSON.stringify({ id, answer, date }),
      });

      const parseRes = await response.json();

      if (parseRes === true) {
        setQnas(
          qnas.map((qna) =>
            qna.id === id ? { ...qna, answer, dateresponded: date } : qna
          )
        );
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
    } catch (error) {
      console.error(error.message);
    }
  };

  // both users
  const displayQnA = async () => {
    try {
      const response = await fetch("http://localhost:3000/forum/qna", {
        method: "GET",
        headers: {
          token: localStorage.token,
          "Content-Type": "application/json",
          forumid,
        },
      });

      const parseRes = await response.json();

      setQnas(parseRes || []);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    displayQnA();
  }, []);

  const deleteQuestion = (id) => async () => {
    try {
      const response = await fetch(`http://localhost:3000/forum/qna`, {
        method: "DELETE",
        headers: {
          token: localStorage.token,
          "Content-Type": "application/json",
          id,
        },
      });

      const parseRes = await response.json();

      if (parseRes.status === true) {
        setQnas(qnas.filter((qna) => qna.id !== id));
        setNotification({
          open: true,
          severity: "success",
          message: parseRes.message,
        });
      } else {
        setNotification({
          open: true,
          severity: "error",
          message: parseRes.message,
        });
      }
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
            qnas.map((qna) => (
              <div key={qna.id}>
                <Card className={classes.root} variant="elevation">
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      {`${dayjs(qna.dateasked).format("DD/MM/YYYY")} (${dayjs(
                        qna.dateasked
                      ).fromNow()})`}
                    </Typography>

                    <Grid container wrap="nowrap" spacing={0}>
                      <Typography variant="h6" component="h2">
                        {qna.question}
                      </Typography>
                    </Grid>
                    {qna.answer && (
                      <>
                        <Grid container wrap="nowrap" spacing={0}>
                          <Typography
                            variant="h7"
                            component="p"
                            className={classes.footer}
                          >
                            {qna.answer}
                          </Typography>
                        </Grid>

                        <Typography
                          color="textSecondary"
                          gutterBottom
                          className={classes.date}
                        >
                          {`${dayjs(qna.dateresponded).format(
                            "DD/MM/YYYY"
                          )} (${dayjs(qna.dateresponded).fromNow()})`}
                        </Typography>
                      </>
                    )}
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
                          onClick={deleteQuestion(qna.id)}
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
                            onClick={handleAnsDiagOpen(qna.question, qna.id)}
                          >
                            {qna.answer === null ? "answer" : "edit"}
                          </Button>
                        </CardActions>
                      </Box>
                    </>
                  )}
                </Card>

                <br />
              </div>
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
                onClick={answerQuestion(answer, ansDialogOpen.id)}
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
