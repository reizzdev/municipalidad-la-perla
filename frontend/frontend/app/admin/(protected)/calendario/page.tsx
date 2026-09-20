import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CalendarView from "@/components/calendario/CalendarView";
import LoginPanel from "@/components/calendario/LoginPanel";

export default function CalendarioPage() {
  return (
    <>

      <main className="min-h-screen bg-gray-50">

        <div className="container-main py-8">

          {/* Título + Login inline */}
          <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          </div>

          <CalendarView />
        </div>
      </main>

    </>
  );
}