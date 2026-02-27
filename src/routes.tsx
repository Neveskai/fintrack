import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./Login";
import { useEffect } from "react";
import { useAuthStore } from "@/common/stores";
import { TransactionsPage } from "./Transactions/transactions.page";
import { Spinner } from "@chakra-ui/react";

function AppRouter() {
  const { user, loading, onAuthStateChanged } = useAuthStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged()
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <Spinner />
    );
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <Router>
      <Routes>
        <Route path="/*" element={<TransactionsPage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
