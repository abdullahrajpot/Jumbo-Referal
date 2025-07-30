import LoadingButton from "@mui/lab/LoadingButton";
import {
  JumboCheckbox,
  JumboForm,
  JumboInput,
  JumboOutlinedInput,
} from "@jumbo/vendors/react-hook-form";
import { customValidation } from "../validation";
import { IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import { Link } from "@jumbo/shared";
import React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { toast } from "react-toastify";

// Custom resolver for react-hook-form
const customResolver = async (values) => {
  const errors = customValidation(values);
  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors: Object.fromEntries(
      Object.entries(errors).map(([key, message]) => [key, { type: "manual", message }])
    ),
  };
};

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login: setAuthLogin } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  async function handleLogin(data) {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      // Connect to backend API for login
      const response = await axios.post("http://localhost:5001/api/users/login", data);
      // Store JWT token and user info in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setAuthLogin(); // Update AuthProvider state immediately
      toast.success("User Login Successfully")
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
      toast.error("Login failed")

    } finally {
      setLoading(false);
    }
  }

  return (
    <JumboForm
      resolver={customResolver}
      onSubmit={handleLogin}
      onChange={() => {}}
      defaultValues={{
        email: "",
        password: "",
        rememberMe: false,
      }}
    >
      <Stack spacing={3} mb={3}>
        <JumboInput
          fullWidth
          fieldName={"email"}
          label={t("login.email")}
        />
        <JumboOutlinedInput
          fieldName={"password"}
          label={t("login.password")}
          type={showPassword ? "text" : "password"}
          margin="none"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
        />

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <JumboCheckbox
            fieldName="rememberMe"
            label={t("login.rememberMe")}
            defaultChecked
          />
          <Typography textAlign={"right"} variant={"body1"}>
            <Link underline="none" to={"/auth/forgot-password"}>
              {t("login.forgotPassword")}
            </Link>
          </Typography>
        </Stack>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">{success}</Typography>}
        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          loading={loading}
        >
          {t("login.loggedIn")}
        </LoadingButton>
      </Stack>
    </JumboForm>
  );
};

export { LoginForm };
