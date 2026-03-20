// ใช้ typeof Audio !== "undefined" เพื่อป้องกัน Error ถ้ารันแบบ SSR
const soundOn = typeof Audio !== "undefined" ? new Audio('/sounds/on-light.mp3') : null;
const soundOff = typeof Audio !== "undefined" ? new Audio('/sounds/off-light.mp3') : null;
const soundSelect = typeof Audio !== "undefined" ? new Audio('/sounds/select-sound.mp3') : null;
 
// ฟังก์ชันสำหรับเปิด Filter
export const playSoundOn = () => {
  if (!soundOn) return;
  soundOn.currentTime = 0; 
  soundOn.play().catch(e => console.log("Audio blocked:", e));
};

// ฟังก์ชันสำหรับปิด Filter
export const playSoundOff = () => {
  if (!soundOff) return;
  soundOff.currentTime = 0;
  soundOff.play().catch(e => console.log("Audio blocked:", e));
};

// ฟังก์ชันสำหรับเลือกตัวเลือกใน Filter
export const playSoundSelect = () => {
  if (!soundSelect) return;
  soundSelect.currentTime = 0;
  soundSelect.play().catch(e => console.log("Audio blocked:", e));
}