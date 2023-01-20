import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from "./Auth.tsx"
import Home from "./Home.tsx"
import TaskSettings from "./TaskSettings"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/taskSettins/:name" element={<TaskSettings/>} />
      </Routes>
    </Router>
  );
}

export default App;
