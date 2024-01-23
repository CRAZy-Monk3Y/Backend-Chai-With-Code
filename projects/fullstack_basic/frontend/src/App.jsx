import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios
      .get("/api/jokes")
      .then((response) => setJokes(response.data.jokes))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <h1>Chai aur Fullstack</h1>

      {jokes.length > 0 ? (
        jokes?.map((joke) => (
          <div key={joke.id}>
            <h2>{joke.title}</h2>
            <p>{joke.content}</p>
          </div>
        ))
      ) : (
        <>
          <p>No Jokes Found</p>
        </>
      )}
    </>
  );
}

export default App;
