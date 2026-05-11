import React, { useState, useEffect } from "react"; // Added useEffect
import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]); // State for our toys

  // 1. Fetch Toys on Page Load
  useEffect(() => {
    fetch("http://localhost:3001/toys")
      .then((r) => r.json())
      .then((toyData) => setToys(toyData));
  }, []);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  function handleAddToy(toyData) {
    fetch("http://localhost:3001/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toyData),
    })
      .then((r) => r.json())
      .then((newToy) => {
        setToys((currentToys) => [...currentToys, newToy]);
      });
  }

  function handleDeleteToy(toyId) {
    fetch(`http://localhost:3001/toys/${toyId}`, {
      method: "DELETE",
    }).then(() => {
      setToys((currentToys) => currentToys.filter((toy) => toy.id !== toyId));
    });
  }

  function handleLikeToy(toyId, likes) {
    fetch(`http://localhost:3001/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes }),
    })
      .then((r) => r.json())
      .then((updatedToy) => {
        setToys((currentToys) =>
          currentToys.map((toy) => (toy.id === updatedToy.id ? updatedToy : toy))
        );
      });
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer
        toys={toys}
        onDeleteToy={handleDeleteToy}
        onLikeToy={handleLikeToy}
      />
    </>
  );
}

export default App;