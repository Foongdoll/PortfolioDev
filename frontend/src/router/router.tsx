import { BrowserRouter, Routes, Route } from "react-router-dom";
import CommonLayout from "./layouts/common-layout";
import ProtectedLayout from "./layouts/protected-layout";
import CommonRouter from "./common-router";
import ProtectedRouter from "./protected-router";
import Sidebar from "../components/common/Sidebar";

export default function Router() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        {/* 공통(비로그인) 라우트 */}
        <Route element={<CommonLayout />}>
          {CommonRouter()}
        </Route>

        {/* 보호(인증 필요) 라우트 */}
        <Route element={<ProtectedLayout />}>
          {ProtectedRouter()}
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
