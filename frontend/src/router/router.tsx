import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CommonLayout from "./layouts/common-layout";
import ProtectedLayout from "./layouts/protected-layout";
import CommonRouter from "./common-router";
import ProtectedRouter from "./protected-router";
import Sidebar from "../components/common/Sidebar";

export default function Router() {
  const fallback = (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 text-slate-100"
    >
      <span className="animate-pulse text-sm tracking-[0.35em] text-sky-200">
        LOADING
      </span>
    </div>
  );

  return (
    <BrowserRouter>
      <Sidebar />
      <Suspense fallback={fallback}>
        <Routes>
          {/* 공통(비로그인) 사용자 */}
          <Route element={<CommonLayout />}>{CommonRouter()}</Route>

          {/* 보호(인증 필요) 사용자 */}
          <Route element={<ProtectedLayout />}>{ProtectedRouter()}</Route>

          {/* 404 */}
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
