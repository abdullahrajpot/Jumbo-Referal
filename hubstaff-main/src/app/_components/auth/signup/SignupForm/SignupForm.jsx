import LoadingButton from "@mui/lab/LoadingButton";
import {
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
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

// Custom resolver for react-hook-form
const customResolver = (isFirstUser) => async (values) => {
  const errors = customValidation(values, isFirstUser);
  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors: Object.fromEntries(
      Object.entries(errors).map(([key, message]) => [key, { type: "manual", message }])
    ),
  };
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SignupForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const query = useQuery();
  const [isFirstUser, setIsFirstUser] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [referralCode, setReferralCode] = React.useState("");

  React.useEffect(() => {
    axios.get("/user/count").then(res => setIsFirstUser(res.data.count === 0)).catch(() => setIsFirstUser(false));
    const ref = query.get("ref");
    if (ref) setReferralCode(ref);
  }, [query]);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  async function handleSignup(data) {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      // Only send referrerCode if referralCode (from link) exists
      const payload = {
        ...data,
      };
      if (referralCode) payload.referrerCode = referralCode;
      await axios.post("http://localhost:5001/api/users/register", payload);
      toast.success("User Registered Successfully")
      setSuccess("Registration successful! You can now log in.");
      setTimeout(() => navigate("/auth/login-1"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
      toast.error("Registeration error!")

    } finally {
      setLoading(false);
    }
  }

  return (
    <JumboForm
      resolver={customResolver(isFirstUser)}
      onSubmit={handleSignup}
      onChange={() => {}}
      defaultValues={{
        name: "",
        email: "",
        password: "",
      }}
    >
      <Stack spacing={3} mb={3}>
        <JumboInput
          fullWidth
          fieldName={"name"}
          label={t("Name")}
        />
        <JumboInput
          fullWidth
          fieldName={"email"}
          label={t("Email")}
        />
        <JumboOutlinedInput
          fieldName={"password"}
          label={t("Password")}
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
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">{success}</Typography>}
        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          loading={loading}
        >
          {t("register")}
        </LoadingButton>
      </Stack>
    </JumboForm>
  );
};

export { SignupForm };
