import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      orderBy("points", "desc")
    );

    // 🔥 Real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUsers(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ background: "black", color: "white", minHeight: "100vh", padding: "20px" }}>
      <h1>🏆 Leaderboard</h1>

      {users.map((u, i) => (
        <div
          key={u.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            borderBottom: "1px solid #333"
          }}
        >
          <span>
            #{i + 1} {u.name}
          </span>
          <span>{u.points || 0} ⚡</span>
        </div>
      ))}
    </div>
  );
}