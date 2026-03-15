import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import JourneyPage from "./pages/JourneyPage";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <Layout>
      <Home />
      <JourneyPage />
      <ContactPage />
    </Layout>
  );
}

export default App;
