import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routers/route";

const App = () => {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
};

export default App;