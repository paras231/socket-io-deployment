import React from "react";
import Join from "./Components/Join/Join";
import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
import Chat from "./Components/Chat/Chat";
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Join />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
