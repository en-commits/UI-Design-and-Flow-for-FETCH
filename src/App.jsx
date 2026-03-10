import { useState } from "react";
import FetchProducts        from "./FetchProducts";
import FetchCustomers       from "./FetchCustomers";
import FetchInvoices        from "./FetchInvoices";
import FetchInvoiceBuilder  from "./FetchInvoiceBuilder";
import FetchCollections     from "./FetchCollections";
import FetchSettings        from "./FetchSettings";
import FetchTickets         from "./FetchTickets";
import FetchConnectors      from "./FetchConnectors";
import FetchPaymentGateways from "./FetchPaymentGateways";

export default function App() {
  const [page, setPage]         = useState("settings");
  const [pageData, setPageData] = useState(null);

  const navigate = (target, data = null) => {
    setPage(target);
    setPageData(data);
  };

  if (page === "settings")         return <FetchSettings        navigate={navigate} />;
  if (page === "products")         return <FetchProducts        navigate={navigate} />;
  if (page === "customers")        return <FetchCustomers       navigate={navigate} />;
  if (page === "invoices")         return <FetchInvoices        navigate={navigate} />;
  if (page === "invoice-builder")  return <FetchInvoiceBuilder  navigate={navigate} invoiceData={pageData?.invoice || null} />;
  if (page === "collections")      return <FetchCollections     navigate={navigate} prefilledInvoice={pageData?.invoice || null} />;
  if (page === "tickets")          return <FetchTickets         navigate={navigate} />;
  if (page === "connectors")       return <FetchConnectors      navigate={navigate} />;
  if (page === "payment-gateways") return <FetchPaymentGateways navigate={navigate} />;

  return null;
}
