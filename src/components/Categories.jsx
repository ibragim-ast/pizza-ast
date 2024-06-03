import { useState } from "react";

const Categories = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const categores = [
    "Все",
    "Мясные",
    "Вегетарианская",
    "Гриль",
    "Острые",
    "Закрытые",
  ];

  const handleActiveIndex = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="categories">
      <ul>
        {categores.map((category, index) => (
          <li
            onClick={() => handleActiveIndex(index)}
            key={index}
            className={activeIndex === index ? "active" : ""}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
