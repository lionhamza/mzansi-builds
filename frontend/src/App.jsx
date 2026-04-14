import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Messages from "./pages/Messages";
import ProjectChat from "./pages/ProjectChat";
import MainLayout from "./Layouts/MainLayout";
import CreateProject from "./pages/CreateProject";
import Feed from "./pages/feed";
import MyProjects from "./pages/MyProjects";
import CelebrationWall from "./pages/CelebrationWall";
import ViewProfile from "./pages/ViewProfile";
import Notifications from "./pages/Notifications";   // ✅ ADD THIS

function App() {
  return (
    <Routes>
      {/* Auth pages (no sidebar) */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* App pages (with sidebar) */}
      <Route element={<MainLayout />}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/celebration-wall" element={<CelebrationWall />} />
        <Route path="/profile/:id" element={<ViewProfile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/project-chat/:id" element={<ProjectChat />} />
        {/* 🔔 Notifications Page */}
        <Route path="/notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
}

export default App;