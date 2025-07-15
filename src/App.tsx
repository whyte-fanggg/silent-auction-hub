import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import CreateAuction from "./pages/CreateAuction"
import ProtectedRoute from "./components/ProtectedRoute"
import { useAuth } from "./hooks/useAuth"
import AuctionList from "./pages/AuctionList"
import AuctionDetails from "./pages/AuctionDetails"
import EditAuction from "./pages/EditAuction"
import AddItems from "./pages/AddItems"
import EditItem from "./pages/EditItem"
import Layout from "./components/Layout"
import LandingPage from "./pages/LandingPage"
import AuthPage from "./pages/AuthPage"
import PlaceBid from "./pages/PlaceBid"

function App() {
  const { user } = useAuth()

  if (user === undefined) {
    return <div>Loading session...</div>
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to="/auctions" replace />}
        />
        <Route
          path="/create-auction"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateAuction />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/auctions"
          element={
            <ProtectedRoute>
              <Layout>
                <AuctionList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/auctions/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <AuctionDetails />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/auctions/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <EditAuction />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/auctions/:id/items/new"
          element={
            <ProtectedRoute>
              <Layout>
                <AddItems />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/items/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <EditItem />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/items/:id/bid"
          element={
            <ProtectedRoute>
              <PlaceBid />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
