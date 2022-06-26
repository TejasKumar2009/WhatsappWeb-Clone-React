import { useEffect } from "react";

import { Routes, Route } from "react-router-dom";

// Files Import
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import ChatId from "./[id]";
import NoChatScreen from "./NoChatScreen";
import Login from "./Login";
import Loading from "./Loading";

// Authentication Imports
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

// Stylesheets Imports
import "../styles/App.css";

function App() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      <div className="app">
        <div className="app_body">
          {loading ? (
            <Loading />
          ) : user ? (
            <>
              <Sidebar />
              <Routes>
                <Route exact path="/" element={<NoChatScreen />} />
                <Route exact path="/chat/:chatId" element={<Chat />} />
              </Routes>
            </>
          ) : (
            <Login />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
