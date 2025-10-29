import { Route } from "react-router-dom";

export default function ProtectedRouter() {    
    return (
        <>
            <Route path="/dashboard" element={<div>대시보드</div>} />
            <Route path="/admin" element={<div>관리자 페이지</div>} />
        </>
    )
}