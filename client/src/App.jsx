import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import {Toaster} from 'react-hot-toast';
import UserProvider from "./context/userContext.jsx";

import Loading from "./components/Loading.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Invite = lazy(() => import("./pages/Invite.jsx"));
const Error = lazy(() => import("./pages/Error.jsx"));

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
      <Toaster />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/invite/:inviteId" element={<Invite />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App
