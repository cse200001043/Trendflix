import validator from "validator";

export const validateLoginForm = ({ email, password }) => {
  const isMailValid = validateMail(email);
  const isPasswordValid = validatePassword(password);
  return isMailValid && isPasswordValid;
};

export const validateRegisterForm = ({ email, password, username }) => {
  const isMailValid = validateMail(email);
  const isPasswordValid = validatePassword(password);
  const isUsernameValid = validateUsername(username);

  return isMailValid && isPasswordValid && isUsernameValid;
};

const validatePassword = (password) => {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });
};

export const validateMail = (email) => {
  return validator.isEmail(email);
};

export const validateUsername = (username) => {
  return username.length > 2 && username.length < 13;
};
