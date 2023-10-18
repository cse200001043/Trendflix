import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import { Avatar, Container, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { getAuthActions } from "../../app/actions/authActions";
import { getActions } from "../../app/actions/alertActions";
import { connect } from "react-redux";
import { validateMail } from "../../shared/utils/validators";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

const ForgotPassword = ({ requestPasswordReset, openAlertMessage }) => {
  const [mailStatus, setMailStatus] = React.useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userDetails = {
      email: data.get("email"),
    };
    if (validateMail(data.get("email"))) {
      requestPasswordReset(userDetails, setMailStatus);
    } else {
      openAlertMessage("Please enter a valid email.");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          {mailStatus ? (
            <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
              Password Reset Link has been sent to the given email id.
            </Typography>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Id"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
            </Box>
          )}
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    ...getAuthActions(dispatch),
    ...getActions(dispatch),
  };
};
export default connect(null, mapActionsToProps)(ForgotPassword);
