import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../App";
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock";
import Skeleton from "../components/PizzaBlock/Skeleton";
import Pagination from "../components/Pagination";

const Home = () => {
  const { searchValue } = useContext(SearchContext);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryId, setCategoryId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState({
    name: "популярности",
    sortProperty: "rating",
  });
  const pizzas = items.map((item, id) => (
    <PizzaBlock key={item.id} {...item} />
  ));
  const skeletons = [...new Array(8)].map((_, index) => (
    <Skeleton key={index} />
  ));

  const getPizzas = async () => {
    let url = "https://665dbd55e88051d6040810d1.mockapi.io/items";
    const params = [];

    const order = sortType.sortProperty.includes("-") ? "asc" : "desc";
    const sortBy = sortType.sortProperty.replace("-", "");

    if (categoryId > 0) {
      params.push(`category=${categoryId}`);
    }

    params.push(`sortBy=${sortBy}`);
    params.push(`order=${order}`);
    params.push(`limit=4`);
    params.push(`page=${currentPage}`);

    if (searchValue) {
      params.push(`search=${searchValue}`);
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(url);
      setItems(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log("Ошибка при получении массива Пицц");
      setIsLoading(false);
    }
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    getPizzas();
  }, [categoryId, sortType, searchValue, currentPage]);

  return (
    <div className="container">
      <div className="content__top">
        <Categories
          value={categoryId}
          onChangeCategory={(index) => setCategoryId(index)}
        />
        <Sort value={sortType} onChangeSort={(index) => setSortType(index)} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination onChangePage={(number) => setCurrentPage(number)} />
    </div>
  );
};

export default Home;
