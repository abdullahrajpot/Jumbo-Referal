import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { Div } from "@jumbo/shared";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import SettingsIcon from "@mui/icons-material/Settings";

import {
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { authUser as dummyUser } from "./data";
import { JumboDdPopover } from "@jumbo/components/JumboDdPopover";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";

const AuthUserPopover = () => {
  const { theme } = useJumboTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Get real user from localStorage, fallback to dummyUser
  let user = dummyUser;
  try {
    const stored = localStorage.getItem("user");
    if (stored) {
      user = { ...dummyUser, ...JSON.parse(stored) };
      // Optionally, set profile_pic to dummy if not present
      if (!user.profile_pic) user.profile_pic = dummyUser.profile_pic;
      if (!user.name) user.name = dummyUser.name;
    }
  } catch {}

  async function handleLogout() {
    await logout();
    return navigate("/auth/login-1");
  }

  return (
    <ThemeProvider theme={theme}>
      <JumboDdPopover
        triggerButton={
          <Avatar
            src={user?.profile_pic}
            sizes={"small"}
            sx={{ boxShadow: 23, cursor: "pointer" }}
          />
        }
        sx={{ ml: 3 }}
      >
        <Div
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            p: (theme) => theme.spacing(2.5),
          }}
        >
          <Avatar
            src={user?.profile_pic}
            alt={user.name}
            sx={{ width: 60, height: 60, mb: 2 }}
          />
          <Typography variant={"h5"}>{user.name}</Typography>
          <Typography variant={"body1"} color="text.secondary">
            {user.email}
          </Typography>
        </Div>
        <Divider />
        <nav>
          <List disablePadding sx={{ pb: 1 }}>
            <ListItemButton onClick={() => navigate('/user/profile')}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PersonOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" sx={{ my: 0 }} />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <EditOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Edit Profile" sx={{ my: 0 }} />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/settings')}>
              <ListItemIcon sx={{ minWidth: 36 }}>
              <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" sx={{ my: 0 }} />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 36 }}>
                < RepeatOutlinedIcon/>
              </ListItemIcon>
              <ListItemText
                // onClick={() => navigate('/samples/content-layout')}
                primary="Switch User"
                sx={{ my: 0 }}
              />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ my: 0 }} />
            </ListItemButton>
          </List>
        </nav>
      </JumboDdPopover>
    </ThemeProvider>
  );
};

export { AuthUserPopover };
