import { Layout } from "@/components/layout";
import Dashboard from "@/pages/dashboard";

function Foods() { return <Layout><div className="p-8">Foods Page</div></Layout>; }
function Attractions() { return <Layout><div className="p-8">Attractions Page</div></Layout>; }
function Stories() { return <Layout><div className="p-8">Stories Page</div></Layout>; }
function Vendors() { return <Layout><div className="p-8">Vendors Page</div></Layout>; }
function Events() { return <Layout><div className="p-8">Events Page</div></Layout>; }
function MapExplorer() { return <Layout><div className="p-8">Map Explorer Page</div></Layout>; }
function Wishlist() { return <Layout><div className="p-8">Wishlist Page</div></Layout>; }
function AiAssistant() { return <Layout><div className="p-8">AI Assistant Page</div></Layout>; }
function Settings() { return <Layout><div className="p-8">Settings Page</div></Layout>; }

export {
  Foods,
  Attractions,
  Stories,
  Vendors,
  Events,
  MapExplorer,
  Wishlist,
  AiAssistant,
  Settings
};
