import { useState } from "react";
import FetchPricing         from "./FetchPricing";
import FetchProducts        from "./FetchProducts";
import FetchCustomers       from "./FetchCustomers";
import FetchInvoices        from "./FetchInvoices";
import FetchInvoiceBuilder  from "./FetchInvoiceBuilder";
import FetchCollections     from "./FetchCollections";
import FetchPaymentGateways from "./FetchPaymentGateways";

export default function App() {
  const [page, setPage]         = useState("billing");
  const [pageData, setPageData] = useState(null);

  const navigate = (target, data = null) => {
    setPage(target);
    setPageData(data);
  };

  if (page === "billing")           return <FetchPricing          navigate={navigate} />;
  if (page === "products")          return <FetchProducts         navigate={navigate} />;
  if (page === "customers")         return <FetchCustomers        navigate={navigate} />;
  if (page === "invoices")          return <FetchInvoices         navigate={navigate} />;
  if (page === "invoice-builder")   return <FetchInvoiceBuilder   navigate={navigate} invoiceData={pageData?.invoice || null} />;
  if (page === "collections")       return <FetchCollections      navigate={navigate} prefilledInvoice={pageData?.invoice || null} />;
  if (page === "payment-gateways")  return <FetchPaymentGateways  navigate={navigate} />;

  return null;
}
