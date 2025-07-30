import { SignupForm } from "@app/_components/auth/signup";
import { ASSET_AVATARS, ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { getAssetPath } from "@app/_utilities/helpers";
import { Div, Link } from "@jumbo/shared";
import { Facebook, Google, Twitter } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import shadows from "@mui/material/styles/shadows";
import { useTranslation } from "react-i18next";

export default function Signup1() {
  const { t } = useTranslation();
  return (
    <Div
      sx={{
        flex: 1,
        flexWrap: "wrap",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: (theme) => theme.spacing(4),
      }}
    >
      <Div sx={{ mb: 3, display: "inline-flex" }}>
        <img src={`${ASSET_IMAGES}/logo.png`} alt="Jumbo React" />
      </Div>
      <Card sx={{ maxWidth: "100%", width: 360, mb: 4 }}>
        <Div sx={{ position: "relative", height: "200px" }}>
          <CardMedia
            component="img"
            alt="signup background"
            height="200"
            image={`${ASSET_IMAGES}/colin-watts.jpg`}
          />
          <Div
            sx={{
              flex: 1,
              inset: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              backgroundColor: (theme) =>
                alpha(theme.palette.common.black, 0.5),
              p: (theme) => theme.spacing(3),
            }}
          >
            <Typography
              variant={"h2"}
              sx={{
                color: "common.white",
                fontSize: "1.5rem",
                mb: 0,
              }}
            >
              {t("CreateAccount")}
            </Typography>
          </Div>
        </Div>
        <CardContent sx={{ pt: 0 }}>
          <Avatar
            alt="Remy Sharp"
            src={getAssetPath(`${ASSET_AVATARS}/avatar10.jpg`)}
            sx={{
              width: 56,
              height: 56,
              marginLeft: "auto",
              boxShadow: shadows[3],
              transform: "translateY(-50%)",
            }}
          />
          <SignupForm />

          <Typography textAlign={"center"} variant={"body1"} mb={1}>
            {t("Already have an account?")} {" "}
            <Link underline="none" to={"/auth/login-1"}>
              {t("Login")}
            </Link>
          </Typography>
        </CardContent>
      </Card>
      <Typography variant={"body1"} mb={2}>
        {t ("Or sign up with")}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton
          sx={{
            bgcolor: "#385196",
            color: "common.white",
            p: (theme) => theme.spacing(1.25),
            "&:hover": {
              backgroundColor: "#385196",
            },
          }}
          aria-label="Facebook"
        >
          <Facebook fontSize={"small"} />
        </IconButton>
        <IconButton
          sx={{
            bgcolor: "#00a8ff",
            color: "common.white",
            p: (theme) => theme.spacing(1.25),
            "&:hover": {
              backgroundColor: "#00a8ff",
            },
          }}
          aria-label="Twitter"
        >
          <Twitter fontSize={"small"} />
        </IconButton>
        <IconButton
          sx={{
            bgcolor: "#23272b",
            color: "common.white",
            p: (theme) => theme.spacing(1.25),
            "&:hover": {
              backgroundColor: "#23272b",
            },
          }}
          aria-label="Google"
        >
          <Google fontSize="small" />
        </IconButton>
      </Stack>
    </Div>
  );
}
