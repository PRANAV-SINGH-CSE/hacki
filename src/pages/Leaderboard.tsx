import { useEffect, useMemo, useState } from "react";
import { getApps, initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import { Crosshair, Crown, Shield, Swords } from "lucide-react";
import "./Leaderboard.css";

type LeaderboardItem = {
  rank?: number | string;
  name?: string;
  team?: string;
  school?: string;
  studentsEducated?: string | number;
  students?: string | number;
  schoolsEducated?: string | number;
  schools?: string | number;
  sessionsConducted?: string | number;
  sessions?: string | number;
  score?: string | number;
  class?: string | number;
  category?: string;
  field?: string;
  imageUrl?: string;
};

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const required = [
  "apiKey",
  "authDomain",
  "databaseURL",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
] as const;

const missingVars = required.filter((key) => !firebaseConfig[key]);

const fallbackRows: LeaderboardItem[] = [
  { rank: 1, name: "Pranav Singh", studentsEducated: "1,250", schoolsEducated: 28, sessionsConducted: 80, score: 990 },
  { rank: 2, name: "ShadowXForgeX", studentsEducated: "1,120", schoolsEducated: 24, sessionsConducted: 64, score: 950 },
  { rank: 3, name: "CipherLynx", studentsEducated: 980, schoolsEducated: 21, sessionsConducted: 52, score: 910 },
  { rank: 4, name: "ByteHunter", studentsEducated: 870, schoolsEducated: 18, sessionsConducted: 45, score: 860 },
  { rank: 5, name: "RootReaper", studentsEducated: 730, schoolsEducated: 16, sessionsConducted: 38, score: 780 },
  { rank: 6, name: "NullVoyager", studentsEducated: 620, schoolsEducated: 13, sessionsConducted: 31, score: 670 },
  { rank: 7, name: "PacketPhantom", studentsEducated: 510, schoolsEducated: 11, sessionsConducted: 27, score: 590 },
  { rank: 8, name: "DarkSyntax", studentsEducated: 430, schoolsEducated: 9, sessionsConducted: 20, score: 480 },
  { rank: 9, name: "NeonSpectre", studentsEducated: 360, schoolsEducated: 7, sessionsConducted: 16, score: 390 },
  { rank: 10, name: "LogiCode", studentsEducated: 290, schoolsEducated: 6, sessionsConducted: 12, score: 320 },
];

const rankColors = ["gold", "silver", "bronze", "cyan", "cyan", "green", "red", "violet", "purple", "cyan"];
const eventBackgroundImage = `${process.env.PUBLIC_URL}/events/kavach2.0/bacground_image.png`;

const signaturePrograms = [
  {
    title: "Research Showcase",
    detail: "Innovations & Findings",
    icon: Shield,
    accent: "cyan",
  },
  {
    title: "Defense Drills",
    detail: "Hands-on Challenges",
    icon: Swords,
    accent: "violet",
  },
  {
    title: "Real-Time Response",
    detail: "Live Simulations",
    icon: Crosshair,
    accent: "cyan",
  },
];

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank > 3) {
    return <span className="leaderboard-rank-number">{rank}</span>;
  }

  return (
    <div className={`rank-wing-badge rank-wing-badge-${rank}`} aria-label={`Rank ${rank}`}>
      <div className="rank-top-line" />
      <div className="rank-wings rank-wing-left">
        <span className="rank-segment rank-segment-1" />
        <span className="rank-segment rank-segment-2" />
        <span className="rank-segment rank-segment-3" />
      </div>
      <div className="rank-hex-wrap">
        <div className="rank-hex-outer">
          <div className="rank-hex-inner">
            <span>{rank}</span>
          </div>
        </div>
      </div>
      <div className="rank-wings rank-wing-right">
        <span className="rank-segment rank-segment-1" />
        <span className="rank-segment rank-segment-2" />
        <span className="rank-segment rank-segment-3" />
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const [rows, setRows] = useState<LeaderboardItem[]>([]);
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (missingVars.length > 0) {
      setIsError(true);
      setStatus(`Missing Firebase env values: ${missingVars.join(", ")}`);
      return;
    }

    try {
      const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
      const db = getDatabase(app);
      const leaderboardRef = ref(db, "leaderboard");

      const unsubscribe = onValue(
        leaderboardRef,
        (snapshot) => {
          const value = snapshot.val();
          if (!value || typeof value !== "object") {
            setRows([]);
            setIsError(false);
            setStatus("Waiting for leaderboard data...");
            return;
          }

          const parsed = Object.values(value)
            .filter(Boolean)
            .map((entry, index) => {
              const item = entry as LeaderboardItem;
              const rank = Number(item.rank);
              return {
                ...item,
                rank: Number.isFinite(rank) ? rank : index + 1,
              };
            })
            .sort((a, b) => Number(a.rank) - Number(b.rank));

          setRows(parsed);
          setIsError(false);
          // setStatus(`Loaded ${parsed.length} ranked participant(s).`);
        },
        (error) => {
          setIsError(true);
          setStatus(`Failed to load leaderboard: ${error.message}`);
        },
      );

      return () => unsubscribe();
    } catch (error) {
      setIsError(true);
      setStatus(
        `Firebase initialization error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      return;
    }
  }, []);

  const renderedRows = useMemo<LeaderboardItem[]>(() => {
    if (rows.length > 0) return rows;
    return fallbackRows;
  }, [rows]);

  return (
    <section className="leaderboard-page">
      <div className="leaderboard-event-intro" aria-label="Cybersecurity Event Kavach 2.0 details">
        <div
          className="leaderboard-event-bg"
          style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.08)), url("${eventBackgroundImage}")` }}
          aria-hidden="true"
        />
        <div className="leaderboard-event-content">
          <div className="event-meta-row">
            <span className="event-pill">Event</span>
            <span>Kavach 2.0</span>
            <Shield size={17} strokeWidth={2.1} aria-hidden="true" />
          </div>

          <h1 className="event-title">
            <span>Cybersecurity</span>
            <span>
              Event <strong>Kavach 2.0</strong>
            </span>
          </h1>

          <div className="event-title-line" aria-hidden="true" />

          <p className="event-description">
            A flagship cybersecurity event featuring research showcases, defense drills, and real-time response
            simulations.
          </p>

          <div className="event-programs-label">Three Signature Programs</div>
          <div className="event-programs" aria-label="Kavach 2.0 signature programs">
            {signaturePrograms.map((program) => {
              const Icon = program.icon;
              return (
                <div className={`event-program-card event-program-${program.accent}`} key={program.title}>
                  <Icon size={40} strokeWidth={1.8} aria-hidden="true" />
                  <div>
                    <h2>{program.title}</h2>
                    <p>{program.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* <div className="event-security-stack" aria-label="Kavach security cycle">
          <span>Secure</span>
          <span>Detect</span>
          <span>Respond</span>
        </div> */}
      </div>

      <div className="leaderboard-shell" id="kavach-leaderboard">
        <div className="leaderboard-hero">
          <div>
            <div className="leaderboard-kicker">KAVACH 2.0</div>
            <h1 className="leaderboard-title">LEADERBOARD</h1>
            <p className="leaderboard-sub">Celebrating the impact makers shaping a more secure digital future.</p>
          </div>
        </div>

        <div className="leaderboard-board" role="table" aria-label="Kavach 2.0 leaderboard">
          <div className="leaderboard-head" role="row">
            <span role="columnheader">Rank</span>
            <span role="columnheader">Name</span>
            <span role="columnheader">No. of Students Educated</span>
            <span role="columnheader">No. of Schools</span>
            <span role="columnheader">No. of Session Conducted</span>
            <span role="columnheader">Score</span>
          </div>

          <div className="leaderboard-body">
            {renderedRows.map((item, index) => {
              const rankNumber = Number(item.rank) || index + 1;
              const rankClass = rankNumber <= 3 ? `top-${rankNumber}` : "";
              const colorClass = rankColors[index] || "cyan";
              const students = item.studentsEducated || item.students || item.class || "-";
              const schools = item.schoolsEducated || item.schools || item.school || item.team || "-";
              const sessions = item.sessionsConducted || item.sessions || "-";
              const score = item.score || "-";
              const initial = (item.name || "P").trim().charAt(0).toUpperCase();

              return (
                <div
                  key={`${rankNumber}-${item.name || index}`}
                  className={`leaderboard-row ${rankClass} rank-color-${colorClass}`}
                  role="row"
                >
                  <div className="leaderboard-cell rank-cell" role="cell">
                    <RankBadge rank={rankNumber} />
                  </div>
                  <div className="leaderboard-cell name-cell" role="cell">
                    <div className="lb-avatar">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name || "Participant"} />
                      ) : (
                        <span>{initial}</span>
                      )}
                    </div>
                    <span className="lb-crown-slot" aria-hidden="true">
                      {rankNumber === 1 ? <Crown className="lb-crown" size={14} fill="currentColor" /> : null}
                    </span>
                    <span className="lb-name">{item.name || `Participant ${rankNumber}`}</span>
                  </div>
                  <div className="leaderboard-cell metric-cell" role="cell">
                    {students}
                  </div>
                  <div className="leaderboard-cell metric-cell" role="cell">
                    {schools}
                  </div>
                  <div className="leaderboard-cell metric-cell" role="cell">
                    {sessions}
                  </div>
                  <div className="leaderboard-cell score-cell" role="cell">
                    <span>{score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className={`leaderboard-status${isError ? " is-error" : ""}`}>{status}</p>
      </div>
    </section>
  );
};

export default Leaderboard;
