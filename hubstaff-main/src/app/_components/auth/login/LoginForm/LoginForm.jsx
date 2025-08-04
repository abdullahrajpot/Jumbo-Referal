import LoadingButton from "@mui/lab/LoadingButton";
import {
  JumboCheckbox,
  JumboForm,
  JumboInput,
  JumboOutlinedInput,
} from "@jumbo/vendors/react-hook-form";
import { customValidation } from "../validation";
import { IconButton, InputAdornment, Stack, Typography, TextField } from "@mui/material";
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

  // 2FA state
  const [requires2FA, setRequires2FA] = React.useState(false);
  const [twoFactorCode, setTwoFactorCode] = React.useState("");
  const [pendingLogin, setPendingLogin] = React.useState(null); // store email/password

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  async function handleLogin(data) {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      // If 2FA is required, add the code to the request
      const payload = requires2FA
        ? { ...pendingLogin, twoFactorCode }
        : data;

      const response = await axios.post("http://localhost:5001/api/users/login", payload);

      // If backend asks for 2FA, show input
      if (response.data.requiresTwoFactor) {
        setRequires2FA(true);
        setPendingLogin({ email: data.email, password: data.password });
        setSuccess("Two-factor authentication code required.");
        setLoading(false);
        return;
      }

      // Only save user/token if present
      if (response.data.user && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setAuthLogin();
        toast.success("User Login Successfully");
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1000);
      } else {
        setError("Login failed: No user/token returned.");
        toast.error("Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  }

  // Render
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
          disabled={requires2FA}
        />
        <JumboOutlinedInput
          fieldName={"password"}
          label={t("login.password")}
          type={showPassword ? "text" : "password"}
          margin="none"
          disabled={requires2FA}
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

        {/* 2FA input, only show if required */}
        {requires2FA && (
          <TextField
            label="2FA Code"
            value={twoFactorCode}
            onChange={e => setTwoFactorCode(e.target.value)}
            fullWidth
            autoFocus
          />
        )}

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <JumboCheckbox
            fieldName="rememberMe"
            label={t("login.rememberMe")}
            defaultChecked
            disabled={requires2FA}
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
          {requires2FA ? "Verify 2FA" : t("login.loggedIn")}
        </LoadingButton>
      </Stack>
    </JumboForm>
  );
};

export { LoginForm };
