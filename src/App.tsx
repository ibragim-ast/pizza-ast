import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";

import "./scss/app.scss";

const Cart = lazy(() => import(/* webpackChunkName: "cart" */ "./pages/Cart"));
const NotFound = lazy(
  () => import(/* webpackChunkName: "notFound" */ "./pages/NotFound")
);
const FullPizza = lazy(
  () => import(/* webpackChunkName: "fullPizza" */ "./pages/FullPizza")
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="" element={<Home />} />
        <Route
          path="cart"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Cart />
            </Suspense>
          }
        />
        <Route
          path="pizza/:id"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <FullPizza />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
