import { RouterProvider } from "react-router-dom";
import { router } from "./_routes";
import {
  JumboDialog,
  JumboDialogProvider,
  JumboTheme,
} from "@jumbo/components";
import { CONFIG } from "./_config";
import { AuthProvider } from "./_components/_core/AuthProvider";
import JumboRTL from "@jumbo/components/JumboRTL/JumboRTL";
import { Suspense } from "react";
import { CssBaseline } from "@mui/material";
import { AppSnackbar } from "./_components/_core";
import { Spinner } from "./_shared";
import { AppProvider } from "./_components/AppProvider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <JumboTheme init={CONFIG.THEME}>
          <CssBaseline />
          <Suspense fallback={<Spinner />}>
            <JumboRTL>
              <JumboDialogProvider>
                <JumboDialog />
                <AppSnackbar>
                  <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
                  <RouterProvider router={router} />
                </AppSnackbar>
              </JumboDialogProvider>
            </JumboRTL>
          </Suspense>
        </JumboTheme>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
