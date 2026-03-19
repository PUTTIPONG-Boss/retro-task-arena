import { useUserStore } from "@/features/users/store/userStore";
import PixelFrame from "@/components/PixelFrame";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
// ⭐️ 1. นำเข้า useTranslation และ toast (ถ้ายังไม่มี) เพื่อใช้แสดงข้อความ
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const EditUserProfile = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  
  // ⭐️ 2. เรียกใช้ useTranslation
  const { t, i18n } = useTranslation();

  // ⭐️ 3. กำหนด fontClass แบบที่คุณให้จำไว้
  const fontClass = i18n.language === "th" ? "text-[16px]  font-['TA-ChaiLai']" : "text-[16px] font-pixel";

  const [username, setUsername] = useState(user?.username || "");
  const [title, setTitle] = useState(user?.title || "");
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || "");
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState("");

  if (!user) return null; // เพิ่มกันเหนียวกรณี user เป็น null

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = () => {
    if (user) {
      setUser({
        ...user,
        username,
        title,
        githubUrl,
        skills,
      });
    }
    // ⭐️ 4. เพิ่ม Toast ดึงคำแปล successMsg
    toast.success(t("editProfile.successMsg"), {
      style: { fontFamily: i18n.language === "th" ? '"TA-ChaiLai"' : '"Press Start 2P"', fontSize: "10px" },
    });
    navigate(-1);
  };

  return (
    // ⭐️ 5. ใส่ fontClass ลงใน div หลัก เพื่อให้ภาษาครอบคลุมทั้งหน้า
    <div className={`max-w-[900px] mx-auto px-4 py-8 ${i18n.language === "th" ? "font-['TA-ChaiLai']" : ""}`}>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          // ⭐️ 6. เพิ่ม fontClass ให้ปุ่ม CANCEL
          className={`text-muted-foreground hover:text-foreground transition-colors font-pixel ${fontClass}`}
        >
          {/* ⭐️ 7. ดึงคำแปล */}
          {t("editProfile.cancel")}
        </button>

        {/* ⭐️ 8. เพิ่ม fontClass ให้ Title */}
        <h1 className={`text-foreground pixel-text-shadow font-pixel ${fontClass}`}>
          {t("editProfile.title")}
        </h1>
      </div>

      <PixelFrame className="mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6 py-2">
          <div className="flex-1 w-full space-y-4">
            <div>
              {/* ⭐️ 9. เพิ่ม fontClass และดึงคำแปล Label */}
              <label className={`text-accent block mb-1 font-pixel ${fontClass}`}>
                {t("editProfile.labels.username")}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                // ⭐️ 10. เพิ่ม fontClass
                className={`w-full bg-secondary pixel-border p-2 text-foreground focus:outline-none font-pixel ${fontClass}`}
              />
            </div>
            <div>
              <label className={`text-accent block mb-1 font-pixel ${fontClass}`}>
                {t("editProfile.labels.adventurerTitle")}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full bg-secondary pixel-border p-2 text-foreground focus:outline-none font-pixel ${fontClass}`}
              />
            </div>
          </div>
        </div>
      </PixelFrame>

      <PixelFrame className="mb-6">
        {/* ⭐️ 11. เพิ่ม fontClass และดึงคำแปล */}
        <h2 className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass}`}>
          ⚔ {t("editProfile.skills.title")}
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill) => (
            <span
              key={skill}
              className={`pixel-border bg-secondary px-3 py-1 text-foreground flex items-center gap-2 font-pixel ${fontClass}`}
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="text-accent hover:text-red-500 font-bold ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            // ⭐️ 12. ดึงคำแปล Placeholder และเพิ่ม fontClass
            placeholder={t("editProfile.skills.placeholder")}
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
            className={`flex-1 bg-secondary pixel-border p-2 text-foreground focus:outline-none font-pixel ${fontClass}`}
          />
          <button
            onClick={addSkill}
            className={`pixel-border bg-muted px-4 text-foreground font-pixel ${fontClass}`}
          >
            {/* ⭐️ 13. ดึงคำแปลปุ่ม Add */}
            {t("editProfile.skills.addBtn")}
          </button>
        </div>
      </PixelFrame>

      <PixelFrame className="mb-6">
        {/* ⭐️ 14. เพิ่ม fontClass และดึงคำแปล */}
        <h2 className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass}`}>
          🔗 {t("editProfile.githubUrl")}
        </h2>
        <input
          type="text"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder={t("editProfile.githubPlaceholder")}
          className={`w-full bg-secondary pixel-border p-3 text-accent focus:outline-none font-pixel ${fontClass}`}
        />
      </PixelFrame>

      <div className="flex justify-center mt-4">
        <button
          onClick={handleSave}
          // ⭐️ 15. เพิ่ม flex items-center justify-center เพื่อบังคับให้ข้อความอยู่กึ่งกลางเป๊ะๆ เสมอ
          className={`pixel-border bg-secondary hover:bg-muted w-full sm:w-64 py-4 text-accent pixel-text-shadow transition-all font-pixel flex items-center justify-center ${fontClass}`}
        >
          {t("editProfile.confirmBtn")}
        </button>
      </div>
    </div>
  );
};

export default EditUserProfile;