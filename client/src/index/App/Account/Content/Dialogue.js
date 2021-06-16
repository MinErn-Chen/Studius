import Dialog from "@material-ui/core/Dialog";

import FirstName from "./Dialogue/FirstName";
import LastName from "./Dialogue/LastName";
import EmailAddress from "./Dialogue/EmailAddress";
import Password from "./Dialogue/Password";
import DeleteAccount from "./Dialogue/DeleteAccount";

const Dialogue = ({
  dialogue,
  setNotification,
  setAuth,
  accountInformation,
  handleDialogueClose,
}) => {
  const dialogueContents = [
    {
      type: "First name",
      content: (
        <FirstName
          accountInformation={accountInformation}
          setNotification={setNotification}
          handleDialogueClose={handleDialogueClose}
        />
      ),
    },
    {
      type: "Last name",
      content: (
        <LastName
          accountInformation={accountInformation}
          setNotification={setNotification}
          handleDialogueClose={handleDialogueClose}
        />
      ),
    },
    {
      type: "Email address",
      content: (
        <EmailAddress
          accountInformation={accountInformation}
          setNotification={setNotification}
          handleDialogueClose={handleDialogueClose}
        />
      ),
    },
    {
      type: "Password",
      content: (
        <Password
          setNotification={setNotification}
          handleDialogueClose={handleDialogueClose}
        />
      ),
    },
    {
      type: "Delete account",
      content: (
        <DeleteAccount
          setAuth={setAuth}
          setNotification={setNotification}
          handleDialogueClose={handleDialogueClose}
        />
      ),
    },
  ];

  const dialogueContent = dialogue.type
    ? dialogueContents.find(
        (dialogueContent) => dialogueContent.type === dialogue.type
      ).content
    : null;

  return (
    <Dialog
      open={dialogue.open}
      onClose={handleDialogueClose}
      aria-labelledby="attribute-dialogue"
      maxWidth="xs"
      fullWidth
    >
      {dialogueContent}
    </Dialog>
  );
};

export default Dialogue;
