import {
  FacebookOutlined,
  Instagram,
  LinkedIn,
  Mail,
  MessageOutlined,
  NotificationsActiveRounded,
  Refresh,
  Settings,
  TaskAltOutlined,
  Twitter,
  YouTube,
  AccountBalanceWalletOutlined,
  GradeSharp
} from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AccountBalancedWalletIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import Dashboard from "@mui/icons-material/Dashboard";
import MlmTree from "@mui/icons-material/AccountTree";





const APP_ICONS = [
  {
    name: "sample",
    Component: EditOutlinedIcon,
    props: { sx: { fontSize: 20 } },
  },
  {
    name: "wallet",
    Component: AccountBalancedWalletIcon ,
    props: { sx: { fontSize: 20 } },
  },
  {
    name: "dashboard",
    Component: Dashboard ,
    props: { sx: { fontSize: 20 } },
  },
  {
    name: "mlm",
    Component: MlmTree ,
    props: { sx: { fontSize: 20 } },
  },


];

export { APP_ICONS };
