// src/lib/sound.ts

// 1. โหลดไฟล์เสียงเตรียมไว้ตั้งแต่แรก (ใส่ไว้ข้างนอกฟังก์ชันเพื่อไม่ให้โหลดซ้ำซ้อน)
// ใช้ typeof Audio เพื่อป้องกัน Error ถ้ารันแบบ SSR
const pageTurnAudio = typeof Audio !== "undefined" ? new Audio('/sounds/page-turn.mp3') : null;

// ถ้ามีไฟล์เสียงปุ่มคลิกด้วย ก็เพิ่มตรงนี้ได้เลย
// const clickAudio = typeof Audio !== "undefined" ? new Audio('/sounds/click.mp3') : null;

export const playPageTurnSound = () => {
  if (!pageTurnAudio) return;
  
  // 2. รีเซ็ตเวลาเป็น 0 ทุกครั้งที่กด เพื่อให้กดรัวๆ ได้โดยเสียงไม่หาย
  pageTurnAudio.currentTime = 0; 
  
  // 3. สั่งเล่นเสียง (ใส่ catch ไว้กัน Browser บล็อก Autoplay)
  pageTurnAudio.play().catch(e => console.log("Audio blocked:", e));
};

/*
export const playClickSound = () => {
  if (!clickAudio) return;
  clickAudio.currentTime = 0;
  clickAudio.play().catch(e => console.log("Audio blocked:", e));
};
*/