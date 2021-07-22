import { useState, React, useEffect } from "react";
import Button from "@material-ui/core/Button";
import GetAppIcon from "@material-ui/icons/GetApp";
import PublishIcon from "@material-ui/icons/Publish";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  upload: {
    display: "none",
  },
});

const Files = ({ match, setNotification, forumid }) => {
  const classes = useStyles();
  const [fileData, setFileData] = useState();

  const date = new Date();
  const dateObj =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

  const fileChangeHandler = (event) => {
    setFileData(event.target.files[0]);
  };

  // tutor only
  const uploadFile = async (event) => {
    const file = new FormData();
    file.append("forumid", forumid);
    file.append("date", dateObj);
    file.append("file", fileData);
    event.preventDefault();
    try {
      console.log(fileData);
      const response = await fetch("http://localhost:3000/forum/file", {
        method: "POST",
        headers: {
          token: localStorage.token,
        },
        body: file,
      });

      const parseRes = await response.json();

      if (parseRes === true) {
        setNotification({
          open: true,
          severity: "success",
          message: `File uploaded`,
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

  const files =
    window.files === undefined ? [] : window.files === null ? [] : window.files;

  return (
    <>
      <Box display="flex" m={3} justifyContent="center">
        <input
          className={classes.upload}
          id="upload"
          type="file"
          onChange={fileChangeHandler}
        />
        <label htmlFor="upload">
          <Button variant="contained" color="secondary" component="span">
            <PublishIcon />
            Select File
          </Button>
        </label>
        <Box component="span" m={1}>
          {fileData === undefined ? null : fileData.name}
        </Box>

        <form enctype="multipart/form-data">
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            onClick={uploadFile}
          >
            Upload File
          </Button>
        </form>
      </Box>

      <br />

      <div>
        {files.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h4"> No files yet!</Typography>
          </Box>
        ) : null}
      </div>
    </>
  );
};

export default Files;

/*
// unworkables 
 // both
  const displayFiles = async () => {
    try {
      const response = await fetch("http://localhost:3000/forum/files", {
        method: "POST",
        headers: {
          token: localStorage.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ forumid: forumid }),
      });

      const parseRes = await response.json();
      console.log(parseRes);
      window.files = parseRes;
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    displayFiles();
  }, []);

  const files =
    window.files === undefined ? [] : window.files === null ? [] : window.files;

    console.log(files)

  //tutor only
  const deleteFile = async () => {};

  // both
  const downloadFile = async () => {};

return (
    <>
      <Header title="File downloader with progress bar" />

      <ExternalInfo page="fileDownloader" />

      <div className="row">
        <div className="col text-center">
          <h2>File Downloader with progress bar in react</h2>
          <div className="row mt-3">
            {files.map((file, idx) => (
              <div className="col" key={idx}>
                <div className="card ">
                  <div className="card-body" key={idx}>
                    <img className="card-img-top mb-3" src={file.thumb} />
                    <h5 className="card-title">{file.name}</h5>

                    <a
                      className="btn btn-primary cursor-pointer text-white"
                      onClick={() => download(file)}
                    >
                      Download <GetAppIcon />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {downloaderComponentUI}
      </div>
    </>
  );
};

*/
