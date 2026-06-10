import { useState } from "react";
import Dashboard     from "./Dashboard";
import Funcionarios  from "./Funcionarios";
import Relatorios    from "./Relatorios";
import Tratamentos   from "./Tratamentos";
import Configuracoes from "./Configuracoes";

export default function App() {
  const [page, setPage] = useState("dashboard");

  if (page === "funcionarios") return <Funcionarios  onNavigate={setPage} />;
  if (page === "relatorios")   return <Relatorios    onNavigate={setPage} />;
  if (page === "tratamentos")  return <Tratamentos   onNavigate={setPage} />;
  if (page === "config")       return <Configuracoes onNavigate={setPage} />;
  return <Dashboard onNavigate={setPage} />;
}