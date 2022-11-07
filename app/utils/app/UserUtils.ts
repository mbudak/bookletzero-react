const avatarText = (user: any): string => {
  if (user) {
    if (user.firstName && user.lastName) {
      if (user.firstName.length > 0 && user.lastName.length > 0) {
        return (user.firstName[0] + user.lastName[0]).toUpperCase();
      } else if (user.firstName.length > 1) {
        return user.firstName.substring(0, 2).toUpperCase();
      } else if (user.email.length > 1) {
        return user.email.substring(0, 2).toUpperCase();
      }
    } else if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
  }
  return "--";
};


const profileName = (user: any): string => {
  if (user) {
    if (user.firstName && user.lastName) {
      return user.firstName + " " + user.lastName;
    } else {
      return user.email;
    }
  }
  return "--";
};

const validateEmail = (email: unknown) => {
  const regexp = new RegExp(
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (typeof email !== "string" || email.length < 5 || !regexp.test(email) || email.length > 100) {
    return false;
  }
  return true;
};

const validatePassword = (password: unknown) => {
  if (typeof password !== "string" || password.length < 4) {
    return false;
  }
  return true;
};

const validatePasswords = (password?: string, passwordConfirm?: string) => {
  if (!validatePassword(password)) {
    return "Minimum of 4 characters";
  }
  if (!password || !passwordConfirm) {
    return "Password required";
  }
  if (password !== passwordConfirm) {
    return "Passwords don't match";
  }
};


export default {
  avatarText,
  profileName,
  validateEmail,
  validatePassword,
  validatePasswords,
};
