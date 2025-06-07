import { Route, Routes } from "react-router-dom";
import "./App.css";
import Kirish from "./components/Kirish";
import Quiz from "./components/Quiz";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Kirish />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </>
  );
}

export default App;
