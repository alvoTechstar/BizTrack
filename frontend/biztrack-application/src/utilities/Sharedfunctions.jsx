export const validateEmail = (email) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
      String(email).toLowerCase()
    );
  };

  export const validatePassword = (test, password) => {
    switch (test) {
      case "length":
        return password.length >= 7;
      case "characters":
        return /[^A-z\s\d][\\^]?/.test(password);
      case "uppercase":
        return /([A-Z])/.test(password);
      case "number":
        return /\d+/.test(password);
      default:
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/.test(
          password
        );
    }
  };