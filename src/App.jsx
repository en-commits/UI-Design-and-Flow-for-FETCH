import { useState } from "react";
import FetchPricing from "./FetchPricing";
import FetchProducts from "./FetchProducts";
import FetchCustomers from "./FetchCustomers";

export default function App() {
  const [page, setPage] = useState("billing");

  if (page === "products")  return <FetchProducts  navigate={setPage} />;
  if (page === "billing")   return <FetchPricing   navigate={setPage} />;
  if (page === "customers") return <FetchCustomers navigate={setPage} />;

  return null;
}
