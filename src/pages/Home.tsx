import qs from "qs";
import { useSelector } from "react-redux";
import React, { useCallback, useEffect, useRef } from "react";
import {
  selectFilter,
  setCategoryId,
  setCurrentPage,
  setFilters,
  SortPropertyEnum,
} from "../redux/slices/filterSlice";
import { fetchPizzas, selectPizzaData } from "../redux/slices/pizzaSlice";
import { useNavigate } from "react-router-dom";
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock";
import Skeleton from "../components/PizzaBlock/Skeleton";
import Pagination from "../components/Pagination";
import { sortList } from "../components/Sort";
import { useAppDispatch } from "../redux/store";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSearch = useRef(false);
  const isMounted = useRef(false);

  const { items, status } = useSelector(selectPizzaData);
  const { categoryId, sort, currentPage, searchValue } =
    useSelector(selectFilter);

  const onChangeCategory = useCallback((idx: number) => {
    dispatch(setCategoryId(idx));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pizzas = items.map((obj: any) => <PizzaBlock key={obj.id} {...obj} />);
  const skeletons = [...new Array(8)].map((_, index) => (
    <Skeleton key={index} />
  ));

  const getPizzas = async () => {
    let url = "https://665dbd55e88051d6040810d1.mockapi.io/items";
    const params = [];

    const order = sort.sortProperty.includes("-") ? "asc" : "desc";
    const sortBy = sort.sortProperty.replace("-", "");

    if (categoryId > 0) {
      params.push(`category=${categoryId}`);
    }

    params.push(`sortBy=${sortBy}`);
    params.push(`order=${order}`);
    params.push(`limit=8`);
    params.push(`page=${currentPage}`);

    if (searchValue) {
      params.push(`search=${searchValue}`);
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    dispatch(fetchPizzas(url));
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1)) as {
        categoryId?: string;
        currentPage?: string;
        searchValue?: string;
        sortProperty?: string;
      };

      const sort = sortList.find(
        (obj) => obj.sortProperty === params.sortProperty
      );

      dispatch(
        setFilters({
          searchValue: params.searchValue || "",
          categoryId: Number(params.categoryId) || 0,
          currentPage: Number(params.currentPage) || 1,
          sort: sort || {
            name: "популярности",
            sortProperty: SortPropertyEnum.RATING_DESC,
          },
        })
      );

      isSearch.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      });

      navigate(`?${queryString}`);
    }
    isMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, searchValue, currentPage, sort.sortProperty]);

  useEffect(() => {
    getPizzas();
    window.scrollTo(0, 0);

    if (!isSearch.current) {
      getPizzas();
    }

    isSearch.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, searchValue, currentPage, sort.sortProperty]);

  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <div className="container">
      <div className="content__top">
        <Categories
          value={categoryId}
          onChangeCategory={(index: any) => onChangeCategory(index)}
        />
        <Sort value={sort} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === "error" ? (
        <div className="content__error-info">
          <h2>Произошла ошибка</h2>
          <p>
            К сожалению, жадный сервер не отдает пиццы. Мы уже работаем над
            этим, зайдите позже
          </p>
        </div>
      ) : (
        <div className="content__items">
          {status === "loading" ? skeletons : pizzas}
        </div>
      )}

      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
