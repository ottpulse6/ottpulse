import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

import PageWrapper from "../components/layout/PageWrapper";
import SectionHeader from "../components/ui/SectionHeader";

export default function Profile() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) setData(snap.data());
    });

    return () => unsub();
  }, []);

  if (!data) return <PageWrapper>Loading...</PageWrapper>;

  return (
    <PageWrapper>
      <SectionHeader title="👤 Your Profile" subtitle="Your activity & status" />

      <div style={card}>
        <h2>{data.name}</h2>
        <p>⚡ {data.points || 0}</p>

        <h3>📊 Activity</h3>
        <p>Views: {data.views || 0}</p>
        <p>Watchlist: {data.watchlistAdds || 0}</p>
        <p>Posts: {data.posts || 0}</p>
      </div>
    </PageWrapper>
  );
}

const card = {
  background: "#111",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #222"
};