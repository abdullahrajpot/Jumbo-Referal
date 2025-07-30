export function customValidation(values) {
  const errors = {};
  if (!values.email || !/^[^@]+@[^@]+\.[^@]+$/.test(values.email)) {
    errors.email = "Enter a valid email";
  }
  if (!values.password) {
    errors.password = "Enter your password";
  }
  return errors;
}
