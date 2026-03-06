import { useState } from "react";
import FetchPricing         from "./FetchPricing";
import FetchProducts        from "./FetchProducts";
import FetchCustomers       from "./FetchCustomers";
import FetchInvoices        from "./FetchInvoices";
import FetchInvoiceBuilder  from "./FetchInvoiceBuilder";

export default function App() {
  const [page, setPage]         = useState("billing");
  const [pageData, setPageData] = useState(null);

  // navigate(page) or navigate(page, { invoice: row })
  const navigate = (target, data = null) => {
    setPage(target);
    setPageData(data);
  };

  if (page === "billing")         return <FetchPricing        navigate={navigate} />;
  if (page === "products")        return <FetchProducts       navigate={navigate} />;
  if (page === "customers")       return <FetchCustomers      navigate={navigate} />;
  if (page === "invoices")        return <FetchInvoices       navigate={navigate} />;
  if (page === "invoice-builder") return <FetchInvoiceBuilder navigate={navigate} invoiceData={pageData?.invoice || null} />;

  return null;
}
