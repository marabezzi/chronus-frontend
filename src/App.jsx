import { useState } from "react";
import Dashboard    from "./Dashboard";
import Funcionarios from "./Funcionarios";
import Relatorios   from "./Relatorios";
 
export default function App() {
  const [page, setPage] = useState("dashboard");
 
  if (page === "funcionarios") return <Funcionarios onNavigate={setPage} />;
  if (page === "relatorios")   return <Relatorios   onNavigate={setPage} />;
  return <Dashboard onNavigate={setPage} />;
}
 