import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import TaskDetails from "./TaskDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota principal (Lista de tarefas) */}
        <Route path="/" element={<Home />} />

        {/* Rota dinâmica para os detalhes (onde :id é a variável) */}
        <Route path="/tarefa/:id" element={<TaskDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
