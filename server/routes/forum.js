const router = require("express").Router();
const pool = require("../db");
const authorisation = require("../middleware/authorisation");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// POST into the forum table +
// PUT update engaged in S/T table after confirmation
router.put("/", authorisation, async (req, res) => {
  try {
    // destructure the req.body (OUID, subject)
    const { OUID, subject } = req.body;

    // insert into forums table
    if (req.user.type === "Tutor") {
      // do stuff in other tables
      const selfname = await pool.query(
        "SELECT concat(firstname, ' ',lastname) AS name FROM tutors WHERE id=$1",
        [req.user.id]
      );
      const OUname = await pool.query(
        "SELECT concat(firstname, ' ',lastname) AS name FROM students WHERE id=$1",
        [OUID]
      );
      const forumid = await pool.query(
        "INSERT INTO forums (tutor_id, student_id) VALUES ($1, $2) RETURNING *",
        [req.user.id, OUID]
      );

      // update self table
      await pool.query(
        "UPDATE tutors SET engaged = array_append(engaged, $1)  WHERE id = $2",
        [[subject, OUID, OUname.rows[0].name, forumid.rows[0].id], req.user.id]
      );

      // update opposing user table
      await pool.query(
        "UPDATE students SET engaged = array_append(engaged, $1)  WHERE id = $2",
        [
          [subject, req.user.id, selfname.rows[0].name, forumid.rows[0].id],
          OUID,
        ]
      );
    } else if (req.user.type === "Student") {
      const selfname = await pool.query(
        "SELECT concat(firstname,' ', lastname) AS name FROM students WHERE id=$1",
        [req.user.id]
      );
      const OUname = await pool.query(
        "SELECT concat(firstname,' ', lastname) AS name FROM tutors WHERE id=$1",
        [OUID]
      );
      const forumid = await pool.query(
        "INSERT INTO forums (tutor_id, student_id) VALUES ($1, $2) RETURNING *",
        [OUID, req.user.id]
      );

      await pool.query(
        "UPDATE students SET engaged = array_append(engaged, $1) WHERE id = $2",
        [[subject, OUID, OUname.rows[0].name, forumid.rows[0].id], req.user.id]
      );

      await pool.query(
        "UPDATE tutors SET engaged = array_append(engaged, $1)  WHERE id = $2",
        [
          [subject, req.user.id, selfname.rows[0].name, forumid.rows[0].id],
          OUID,
        ]
      );
    }

    res.json("Tuition successfully engaged!");
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

// get forum id
router.post("/id", authorisation, async (req, res) => {
  try {
    let user;
    const { OUID } = req.body;
    if (req.user.type === "Student") {
      user = await pool.query(
        "SELECT id FROM forums WHERE student_id = $1 AND tutor_id = $2",
        [req.user.id, OUID]
      );
    } else {
      user = await pool.query(
        "SELECT id FROM forums WHERE student_id = $2 AND tutor_id = $1",
        [req.user.id, OUID]
      );
    }
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

//ANNOUCMENTS
//get announcements :
router.post("/annoucements", authorisation, async (req, res) => {
  try {
    const { forumid } = req.body;
    const annoucements = await pool.query(
      "SELECT title, body, date FROM annoucements WHERE forumid = $1 ORDER BY date DESC",
      [forumid]
    );

    res.json(annoucements.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

// post annoucement: tutor only
/* note: do not allow static (same annc) edit for immutability purposes 
 ie: for every EDIT, router.delete and router.post will be called
 to avoid use of router.put */
router.post("/annoucement", authorisation, async (req, res) => {
  try {
    const { forumid, title, body, date } = req.body;

    const annoucement = await pool.query(
      "INSERT INTO annoucements VALUES ($1, $2, $3, $4) RETURNING *",
      [forumid, title, body, date]
    );

    if (annoucement.rows.length === 0) {
      res.json("Failed to post annoucement");
    }

    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

// delete annoucements
router.delete("/annoucements", authorisation, async (req, res) => {
  try {
    const { title, body, forumid } = req.body;

    //cannnot delete based on forum_id bc each S-T can have mutliple objects between them and tf f_id is not unique
    // student_id required since each tutor can post the same annc title/body to multiple students
    const annoucement = await pool.query(
      "DELETE FROM annoucements WHERE title = $1 AND body= $2 AND forumid = $3 RETURNING *",
      [title, body, forumid]
    );

    console.log(annoucement);

    if (annoucement.rows.length === 0) {
      res.json("Failed to delete annoucement");
    } else {
      res.json(true);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

// QNA
//get qna :
router.post("/qna", authorisation, async (req, res) => {
  try {
    const { forumid } = req.body;
    const questions = await pool.query(
      "SELECT question, answer, dateAsked, dateResponded FROM qna WHERE forumid = $1 ORDER BY dateAsked DESC",
      [forumid]
    );

    res.json(questions.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

// post question: student only
router.post("/qna/question", authorisation, async (req, res) => {
  try {
    const { forumid, question, date } = req.body;

    const qn = await pool.query(
      "INSERT INTO qna (forumid, question, dateAsked) VALUES ($1, $2, $3) RETURNING *",
      [forumid, question, date]
    );

    if (qn.rows.length === 0) {
      res.json("Failed to post question");
    } else if (qn.rows.length > 1) {
      // for precise Question obj identification at answer stage
      res.json("Question has been asked before");
    }

    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

// answer: tutor only
router.put("/qna/answer", authorisation, async (req, res) => {
  try {
    const { forumid, answer, date, question } = req.body;

    console.log(req.body);

    const ans = await pool.query(
      "UPDATE qna SET answer = $1, dateresponded = $2 WHERE forumid = $3 AND question = $4 RETURNING *",
      [answer, date, forumid, question]
    );

    if (ans.rows.length === 0) {
      res.json("Failed to post answer");
    } else {
      res.json(true);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

// delete question (and answer if there is): student only
router.delete("/qna", authorisation, async (req, res) => {
  try {
    const { question, forumid } = req.body;

    //cannnot delete based on forum_id bc each S-T can have mutliple objects between them and tf f_id is not unique
    // and recieve same answers across the system, but said student cannot post the same qn

    const entry = await pool.query(
      "DELETE FROM qna WHERE question = $1 AND forumid = $2 RETURNING *",
      [question, forumid]
    );

    if (entry.rows.length === 0) {
      res.json("Failed to delete question");
    } else {
      res.json(true);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server error");
  }
});

// FILES
const allowables = [
  "application/pdf",
  "application/msword",
  "application/vnd.ms-powerpoint",
  "application/vnd.ms-excel",
  "text/html",
];

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/tempStorage")); // temp soln for missing dir
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// adapted fileFilter & Validation
const fileUpload = multer({
  storage: fileStorage,
  fileFilter: (req, file, cb) => {
    if (!allowables.includes(file.mimetype)) {
      req.fileValidationError =
        "Only .pdf, .html and microsoft file types are allowed";
      cb(null, false);
    } else {
      cb(null, true);
    }
  },
});

// tutor only
router.post(
  // to replace an existing doc, user must delete then re-add, prevent direct edit
  "/file",
  [authorisation, fileUpload.single("file")],
  async (req, res) => {
    try {
      // check if file type is correct
      if (req.fileValidationError) {
        return res.json(req.fileValidationError);
      }

      const { mimetype, size, path, filename } = req.file;
      const { forumid, date } = req.body;

      await pool.query("INSERT INTO files VALUES ($1, $2, $3, $4, $5, $6)", [
        forumid,
        date,
        filename,
        path,
        mimetype,
        size,
      ]);

      res.json(true);
    } catch (error) {
      console.error(error);
      res.status(500).json("Server error");
    }
  }
);

// get files
router.post("/files", authorisation, async (req, res) => {
  try {
    const { forumid } = req.body;

    const files = await pool.query("SELECT * FROM files WHERE forumid = $1", [
      forumid,
    ]);

    if (files.rows.length === 0) {
      return res.status(404).json(false);
    }

    //bug here
    fs.readFile(path, (error, data) => {
      if (error) {
        res.status(500).json(error);
      }

      res.setHeader(
        "Content-Disposition",
        'attachment:filename="' + filename + '"'
      );
      res.send(data);
    });
  } catch (error) {
    res.status(500).json("Server error");
  }
});

// ASSIGNMENTS
router.post(
  // to replace an existing doc, user must delete then re-add, prevent direct edit
  "/assignment",
  [authorisation, fileUpload.single("file")],
  async (req, res) => {
    try {
      // check if file type is correct
      if (req.fileValidationError) {
        return res.json(req.fileValidationError);
      }

      const { mimetype, size, path, filename } = req.file;
      const { forumid, date } = req.body;

      await pool.query(
        "INSERT INTO assignments VALUES ($1, $2, $3, $4, $5, $6)",
        [forumid, date, filename, path, mimetype, size]
      );

      res.json(true);
    } catch (error) {
      console.error(error);
      res.status(500).json("Server error");
    }
  }
);

// get files
router.post("/assignments", authorisation, async (req, res) => {
  try {
    const { forumid } = req.body;

    const assns = await pool.query(
      "SELECT * FROM assignments WHERE forumid = $1",
      [forumid]
    );

    if (assns.rows.length === 0) {
      return res.status(404).json(false);
    }

    //bug here
    fs.readFile(path, (error, data) => {
      if (error) {
        res.status(500).json(error);
      }

      res.setHeader(
        "Content-Disposition",
        'attachment:filename="' + filename + '"'
      );
      res.send(data);
    });
  } catch (error) {
    res.status(500).json("Server error");
  }
});
module.exports = router;
