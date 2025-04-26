import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "./index.css"
import App from "./App"
// import { AuthProvider } from "./context/AuthContext"
// import { NotificationProvider } from "./context/NotificationContext"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <AuthProvider> */}
        {/* <NotificationProvider> */}
        <QueryClientProvider client={queryClient}>
          <App />
          </QueryClientProvider>
        {/* </NotificationProvider> */}
      {/* </AuthProvider> */}
    </BrowserRouter>
  </React.StrictMode>,
)

