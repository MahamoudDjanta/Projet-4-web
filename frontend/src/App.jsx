import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Chargement...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/test")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Erreur : " + err.message));
  }, []);

  return (
    <div>
      <h1>Gestion de présence</h1>
      <h2>{message}</h2>
    </div>
  );
}

export default App;