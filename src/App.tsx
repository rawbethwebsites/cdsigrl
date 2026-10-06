import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import ApproachPage from "./pages/ApproachPage";
import ClientsPage from "./pages/ClientsPage";
import GetStartedPage from "./pages/GetStartedPage";
import LegalPage from "./pages/LegalPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// "/" is CDS IGRL OS (public/index.html). Client-side links to "/" do a full
// load so visitors land on the OS instead of the classic homepage.
function OsHome() {
  useEffect(() => { window.location.replace("/"); }, []);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<OsHome />} />
        <Route path="/classic" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/approach" element={<ApproachPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="/contact" element={<Navigate to="/get-started" replace />} />
        <Route path="/privacy" element={<LegalPage kind="privacy" />} />
        <Route path="/terms" element={<LegalPage kind="terms" />} />
        <Route path="*" element={<OsHome />} />
      </Routes>
    </>
  );
}
