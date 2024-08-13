import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const FullPizza = () => {
  const [pizza, setPizza] = useState();
  const { id } = useParams();

  useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get(
          `https://665dbd55e88051d6040810d1.mockapi.io/items/${id}`
        );
        setPizza(data);
      } catch (error) {
        console.error("Error fetching pizza:", error);
      }
    }

    fetchPizza();
  }, []);

  if (!pizza) {
    return <p>Загрузка...</p>;
  }

  return (
    <div className="container">
      <img src={pizza.imageUrl} alt={pizza.title} />
      <h2>{pizza.title}</h2>
      <h4>{pizza.price}</h4>
    </div>
  );
};

export default FullPizza;
