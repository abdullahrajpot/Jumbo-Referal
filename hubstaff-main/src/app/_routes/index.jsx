import Login1 from "@app/pages/auth/login1";
import { createBrowserRouter } from "react-router-dom";
import SamplePage from "@app/pages";
import { StretchedLayout } from "@app/_layouts/StretchedLayout";
import { SoloLayout } from "@app/_layouts/SoloLayout"; 
import withAuth from "@app/_hoc/withAuth";
import { Page, NotFound404 } from "@app/_components/_core";
import Signup1 from "@app/pages/auth/signup1";
import ProfilePage from "@app/pages/user/profile";
import DepositPage from "@app/pages/user/deposit";
import DashboardPage from "@app/pages/dashboard/dashboard";
import MLMTreePage from "@app/pages/mlm-tree";
import GuestRoute from "@app/_hoc/GuestRoute";
import SettingsPage from "@app/pages/settings/SettingsPage";


const routes = [
  {
    path: "/",
    element: <StretchedLayout />,
    children: [
      {
        path: "/",
        element: <Page Component={SamplePage} hoc={withAuth} />,
      },
      {
        path: "dashboard",
        element: <Page Component={DashboardPage} hoc={withAuth} />,
      },
      {
        path: "user/profile",
        element: <Page Component={ProfilePage} hoc={withAuth} />,
      },
      {
        path: "user/deposit",
        element: <Page Component={DepositPage} hoc={withAuth} />,
      },
      {
        path: "mlm-tree",
        element: <Page Component={MLMTreePage} hoc={withAuth} />,
      },
      {
        path: "/settings",
        element: <Page Component={SettingsPage} hoc={withAuth} />,
      },
    ],
  },

  {
    path: "/auth",
    element: <SoloLayout />,
    children: [
      {
        path: "login-1",
        element: (
          <GuestRoute>
            <Login1 />
          </GuestRoute>
        )
      },
      {
        path: "signup-1",
        element: (
          <GuestRoute>
            <Signup1 />
          </GuestRoute>
        )
      },
    ],
  },
  {
    path: "*",
    element: <NotFound404 />,
  },
];

export const router = createBrowserRouter(routes);
