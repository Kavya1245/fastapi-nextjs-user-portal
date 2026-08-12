export const rules = {
  firstName: {
    regex: "^[A-Za-z]+(?: [A-Za-z]+)*$",
    maxLength: 20,
    minLength: 1,
    message: "1-20 alphabets only. Spaces allowed in between, but not at start/end."
  },
  lastName: {
    regex: "^[A-Za-z]+(?: [A-Za-z]+)*$",
    maxLength: 15,
    minLength: 1,
    message: "1-15 alphabets only. Spaces allowed in between, but not at start/end."
  },
  password: {
    regex: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$",
    minLength: 6,
    message: "Min 6 chars, 1 Upper, 1 Lower, 1 Digit, 1 Symbol (@$!%*?&)"
  },
  email: {
    regex: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
    message: "Invalid email format"
  }
};
