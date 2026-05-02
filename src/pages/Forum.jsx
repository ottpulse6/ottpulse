import { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

import PageWrapper from "../components/layout/PageWrapper";
import SectionHeader from "../components/ui/SectionHeader";

import { addPoints, trackPost } from "../services/userPulseService";

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");

  const load = async () => {
    const snap = await getDocs(collection(db, "posts"));
    setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "posts"), {
      text,
      createdAt: Date.now()
    });

    await trackPost();
    await addPoints(10);

    setText("");
    load();
  };

  return (
    <PageWrapper>
      <SectionHeader
        title="💬 Community Pulse"
        subtitle="Share opinions & earn points"
      />

      <div style={card}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write something..."
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            background: "#000",
            color: "white",
            border: "1px solid #333"
          }}
        />
        <button onClick={submit}>Post</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        {posts.map((p) => (
          <div key={p.id} style={card}>
            {p.text}
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

const card = {
  background: "#111",
  padding: "15px",
  borderRadius: "10px",
  border: "1px solid #222",
  marginBottom: "10px"
};