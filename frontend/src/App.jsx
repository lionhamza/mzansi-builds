import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";

import MainLayout from "./Layouts/MainLayout";
import CreateProject from "./pages/CreateProject";

// (you will create these pages next)
//import Feed from "./pages/Feed";
//import MyProjects from "./pages/MyProjects";
//import Celebration from "./pages/Celebration";

function App() {
  return (
    <Routes>
      {/* Auth pages (no sidebar) */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* App pages (with sidebar) */}
      <Route element={<MainLayout />}>
        {/* Route path="/feed" element=<Feed /  */}
        <Route path="/create-project" element={<CreateProject />} />
         {/* <Route path="/my-projects" element={<MyProjects />} /> */}
        {/*<Route path="/celebration" element={<Celebration />} />*/}
      </Route>
    </Routes>
  );
}

export default App;