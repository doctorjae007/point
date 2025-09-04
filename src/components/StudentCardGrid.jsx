import { useEffect, useState,useRef } from "react";
import confetti from "canvas-confetti"; // 🎆 ไลบรารีพลุ
import "./StudentCardGrid.css"; // ใช้สำหรับ glow animation

export default function StudentCardGrid() {
  const maxScore = 100;

  useEffect(() => {
  const handleBeforeUnload = (e) => {
    e.preventDefault();
    e.returnValue = ""; // บาง browser ต้องใส่เพื่อให้โชว์ popup
  };
  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, []);


  const avatars = [
    "🐯", "🦁", "🦄", "🐼", "🐸", "🐵", "🐨", "🐰", "🐱",
    "🐮", "🐔", "🐧", "🐦", "🐤", "🦉", "🦅", "🐢", "🐍",
    "🐙", "🦕", "🦖", "🐳", "🐬", "🐠", "🦋", "🐝", "🐞",
    "🐲", "🐉", "🦊", "🦝", "🦓", "🦒", "🦘", "🦔", "🦦", "🦥"
  ];

  // รายชื่อนักเรียน
  const names = [
    "จิรพัฒน์","ชยพล","ชวนากร","ณัฐชนน","ณัฐนันท์","ธนโชติ","พัสกร","ธรณินทร์","นภัสกร","ปิโยรส",
    "พิชิต","ภัทรธร","ภาวัต","วชิรวิชญ์","ศักดิธัช","ศุภณัฐ","กัญญ์วรา","กันตพร","กิรณา","จิรชญาดา",
    "จิราพัช","ฐริตา","ปภาดา","ปภาวรินท์","ปรีดานันท์","เปมิกา","พิชญ์ลลิดา","ภัทรภร","อลิสา","กนกพงศ์",
    "กฤตเมธ","ก้องภพ","เกริกฤทธิ์","เตชินท์","ธนกร","ธนวรรธน์","ปุณยวีร์","พัชรกูล","ภานุวัฒน์","วชิรวิชญ์",
    "วสุวัญญ์","ศตคุณ","อติเทพ","อรงณ์กร","จิราพัชร","โจโซฟิน","ณิชนันทน์","ธัญพิชชา","นันท์นภัส","ผกากรอง",
    "โยสิตา","รัชนีวรรณ","รุ่งนิภา","วชิรญาณ์","วรัทธิตา","วิลาสินี","สุประวีณ์"
  ];

  const initialStudents = names.map((name, index) => ({
    id: index + 1,
    name,
    avatar: avatars[index % avatars.length], // แจกไม่ซ้ำจนกว่าจะหมด avatars
    score: 0
  }));

  const [students, setStudents] = useState(initialStudents);
  const [highlightedId, setHighlightedId] = useState(null);

  // อ้างอิงเสียง ding
  const audio = new Audio("/ding.mp3");
audio.play();



  // โหลดคะแนนจาก localStorage
  useEffect(() => {
    const saved = localStorage.getItem("studentScores");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === initialStudents.length) {
          setStudents(parsed);
        }
      } catch (err) {
        console.error("Error parsing saved scores:", err);
      }
    }
  }, []);

  // เซฟคะแนนทุกครั้งที่เปลี่ยน
  useEffect(() => {
    localStorage.setItem("studentScores", JSON.stringify(students));
  }, [students]);

  // เพิ่ม/ลดคะแนน + highlight card
  const handleScore = (id, delta) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id
          ? {
              ...student,
              score: Math.max(0, Math.min(student.score + delta, maxScore)),
            }
          : student
      )
    );

    setHighlightedId(id);
    setTimeout(() => setHighlightedId(null), 2000);
    // เล่นเสียงตอนกด +
    if (delta > 0 && dingSound.current) {
      dingSound.current.currentTime = 0; // รีเซ็ตให้เล่นใหม่ทุกครั้ง
      dingSound.current.play();
    }

    // 🎆 ยิงพลุถ้าเป็นการเพิ่มคะแนน
    if (delta > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }, // ยิงจากกลางจอ
      });
    }
  };

  const resetScores = () => setStudents(initialStudents);

  // Auto-sort leaderboard
  const sortedStudents = [...students].sort((a, b) => b.score - a.score);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Leaderboard นักเรียน</h2>
        <button
          onClick={resetScores}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          รีเซตคะแนนทั้งหมด
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-[80vh] overflow-y-auto">
        {sortedStudents.map(student => (
          <div
            key={student.id}
            className={`bg-green-50 rounded p-2 flex flex-col items-center relative transition-all duration-300
              ${
                highlightedId === student.id
                  ? "scale-110 shadow-2xl z-10 animate-glow"
                  : "shadow"
              } hover:scale-105`}
          >
            {/* คะแนน */}
            <div className="text-5xl font-bold mb-2">{student.score}</div>

            {/* Avatar */}
            <div className="text-4xl my-2">{student.avatar}</div>

            {/* ชื่อ */}
            <div className="text-2xl font-semibold mb-2">{student.name}</div>

            {/* ปุ่ม + / - */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleScore(student.id, 1)}
                className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
              >
                +
              </button>
              <button
                onClick={() => handleScore(student.id, -1)}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
