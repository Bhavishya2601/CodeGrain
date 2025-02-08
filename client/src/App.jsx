import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Loading from "./components/Loading.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Error = lazy(() => import("./pages/Error.jsx"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App
