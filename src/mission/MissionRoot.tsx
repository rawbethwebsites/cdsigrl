import { useEffect, useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { readToken } from "./lib";
import MissionHome from "./MissionHome";
import Control from "./Control";
import Storybook from "./Storybook";
import { Toasts } from "./ui";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string | undefined;

/** /mission — the China Partner Mission dashboard, backed by Convex. */
export default function MissionRoot() {
  const client = useMemo(() => (CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null), []);
  const token = useMemo(readToken, []);

  useEffect(() => {
    document.title = "China Partner Mission | CDS IGRL";
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = "/os/mission.webmanifest";
    const icon = document.createElement("link");
    icon.rel = "apple-touch-icon";
    icon.href = "/os/mission-icon.png";
    document.head.append(link, icon);
    document.documentElement.style.fontSize = "17px";
    return () => { link.remove(); icon.remove(); document.documentElement.style.fontSize = ""; };
  }, []);

  if (!client) return <Notice text="The mission dashboard isn't connected yet (VITE_CONVEX_URL is missing)." />;
  if (!token) return <Notice text="Open the personal link the trip leader sent you to sign in." />;
  return (
    <ConvexProvider client={client}>
      <Toasts />
      <Routes>
        <Route path="control" element={<Control token={token} />} />
        <Route path="storybook" element={<Storybook token={token} />} />
        <Route path="*" element={<MissionHome token={token} />} />
      </Routes>
    </ConvexProvider>
  );
}

function Notice({ text }: { text: string }) {
  return <div className="grid min-h-screen place-items-center bg-ink p-6 text-center text-xl text-cream"><p className="max-w-md">{text}</p></div>;
}
