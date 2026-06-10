import { useState } from "react";
import Dashboard    from "./Dashboard";
import Funcionarios from "./Funcionarios";

export default function App() {
  const [page, setPage] = useState("dashboard");

  if (page === "funcionarios") return <Funcionarios onNavigate={setPage} />;
  return <Dashboard onNavigate={setPage} />;
}
