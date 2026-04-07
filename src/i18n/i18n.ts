import i18n from 'i18next'; //ตัวหลักที่จัดการเรื่องการเปลี่ยนภาษา
import { initReactI18next } from 'react-i18next'; //ตัวเชื่อม (Binding) ระหว่าง i18next กับ React เพื่อให้ใช้งานผ่าน Hook อย่าง useTranslation ได้
import LanguageDetector from 'i18next-browser-languagedetector'; //ตัวช่วยเช็คว่าเบราว์เซอร์ของผู้ใช้ตั้งค่าเป็นภาษาอะไร เพื่อที่จะเลือกภาษาให้โดยอัตโนมัติ
import enRes from '../locales/en/translation.json'; //ไฟล์ภาษาอังกฤษ
import thRes from '../locales/th/translation.json'; //ไฟล์ภาษาไทย

i18n
  .use(LanguageDetector) // ให้เช็คภาษาจากเบราว์เซอร์อัตโนมัติ
  .use(initReactI18next) // ส่ง instance นี้ไปให้ react-i18next ใช้งาน
  .init({
    resources: {
      en: { translation: enRes },
      th: { translation: thRes }
    },
    fallbackLng: 'en', //หากระบบหาภาษาที่ตรงกับเครื่องผู้ใช้ไม่เจอ หรือคำแปลในภาษานั้นไม่มี ให้กลับไปใช้ ภาษาอังกฤษ เป็นค่าเริ่มต้น
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag'], //ลำดับการตรวจจับภาษา
      caches: ['localStorage'], //เก็บภาษาที่เลือกไว้ใน localStorage
    },
    interpolation: { escapeValue: false } // ปิดการ escape ค่าพิเศษ เพื่อให้แสดงผล HTML/Emoji ได้
  });

export default i18n;