import { BrowserRouter, Routes, Route } from "react-router-dom";
import BillForm from "./Components/BillForm";
import Login from "./Components/Login";
import ProtectedRoute from "./Components/ProtectedRoute";
import InvoicePreview from "./Components/InvoicePreview";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <BillForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoice"
          element={
            <ProtectedRoute>
              <InvoicePreview />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
