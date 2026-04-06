import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import CreateProject from "./pages/CreateProject";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-project" element={<CreateProject />} />
      <Route path="/register" element={<Register/>}/>
    </Routes>
  );
}

export default App;