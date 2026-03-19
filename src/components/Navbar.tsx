import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "@/features/users/store/userStore";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useTranslation } from "react-i18next";
import PixelButton from "@/components/PixelButton";

const InetQuestLogo = () => (
  <svg
    width="80"
    height="32"
    viewBox="0 0 80 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="pixel-text-shadow" // เพิ่ม shadow ให้ดูมีมิติ
  >
    {/* ดาบไขว้ด้านขวา (สีทอง accent) */}
    <path
      d="M68 4H72V8H76V12H72V16H68V20H64V16H60V12H64V8H68V4Z"
      fill="hsl(var(--accent))"
    />
    <path
      d="M64 12H68V16H72V20H76V24H72V28H68V24H64V20H60V16H64V12Z"
      fill="hsl(var(--accent))"
    />
    {/* ตัวอักษร "INET" (สีขาว foreground) */}
    <path d="M4 4H12V8H8V24H12V28H4V4Z" fill="hsl(var(--foreground))" />{" "}
    {/* I */}
    <path
      d="M16 4H20V8H24V12H20V16H24V20H20V28H16V4Z"
      fill="hsl(var(--foreground))"
    />{" "}
    {/* N */}
    <path
      d="M28 4H36V8H32V12H36V16H32V20H36V24H32V28H28V4Z"
      fill="hsl(var(--foreground))"
    />{" "}
    {/* E */}
    <path d="M40 4H48V8H44V28H40V4Z" fill="hsl(var(--foreground))" /> {/* T */}
    {/* ตัวอักษร "QUEST" (สีทอง accent) */}
    <path d="M4 20H12V24H8V28H4V20Z" fill="hsl(var(--accent))" /> {/* Q */}
    <path d="M16 20H24V28H20V24H16V20Z" fill="hsl(var(--accent))" /> {/* U */}
    <path d="M28 20H36V24H32V28H28V20Z" fill="hsl(var(--accent))" /> {/* E */}
    <path d="M40 20H48V24H44V28H40V20Z" fill="hsl(var(--accent))" /> {/* S */}
    <path d="M52 20H60V24H56V28H52V20Z" fill="hsl(var(--accent))" /> {/* T */}
    {/* โล่ด้านซ้าย (สี foreground) */}
    <path d="M0 8H4V24H0V8Z" fill="hsl(var(--foreground))" />
    <path d="M4 24H12V28H4V24Z" fill="hsl(var(--foreground))" />
    <path d="M12 24V8H16V24H12Z" fill="hsl(var(--foreground))" />
    <path d="M4 8H12V4H4V8Z" fill="hsl(var(--foreground))" />
  </svg>
);

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useAuthStore((s) => s.logout);
  const { t, i18n } = useTranslation();
  if (!user) return null;

  // ⭐️ 1. ปรับ fontClass โดยกำหนดแค่ขนาดและฟอนต์ ไม่ใช้ชื่อเจาะจงตามที่คุณบอก
  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[14px]";

  const toggleLanguage = () => {
    const newLang = i18n.language === "th" ? "en" : "th";
    i18n.changeLanguage(newLang);
    localStorage.setItem("app_lang", newLang);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/", label: t("navbar.quest_board", "Quest Board"), icon: "📋" },
    { to: "/create-quest", label: t("navbar.post_quest", "Post Quest"), icon: "📜" },
    { to: "/reward-shop", label: t("navbar.reward_shop", "Reward Shop"), icon: "🏪" },
    { to: "/profile", label: t("navbar.profile", "Profile"), icon: "👤" },
  ];

  return (
    <>
      {/* ⭐️ 2. เพิ่มเงื่อนไขคลาส font-['TA-ChaiLai'] ไว้ที่ nav หลัก เพื่อคลุมทุกส่วนที่เป็นภาษาไทย */}
      <nav className={`bg-card pixel-border sticky top-0 z-50 ${i18n.language === "th" ? "font-['TA-ChaiLai']" : ""}`}>
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-14">
          <Link
            to="/"
            // โลโก้ ไม่ต้องใช้ fontClass เพราะมันเป็นรูปภาพ/ไอคอน
            className="font-pixel text-[12px] text-accent pixel-text-shadow tracking-wide flex items-center gap-2"
          >
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src="/src/assets/logoinetquest.png"
                alt="INETQUEST"
                className="h-10 w-auto"
                style={{
                  imageRendering: "pixelated", // สำคัญมาก: ทำให้พิกเซลไม่เบลอ
                  filter: "drop-shadow(2px 2px 0px rgba(0,0,0,0.5))",
                  width: "100px",
                  height: "80px",
                }}
              />
            </Link>
          </Link>

          <div className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                // ⭐️ 3. เพิ่ม font-pixel (สำหรับภาษาอังกฤษ) และ fontClass
                className={`font-pixel ${fontClass} uppercase tracking-wider transition-none ${
                  location.pathname === link.to
                    ? "text-accent pixel-text-shadow"
                    : "text-foreground hover:text-accent"
                }`}
              >
                <span className="mr-1">{link.icon}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}

            {/* User HUD */}
            <div className="pixel-border bg-secondary px-3 py-1 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {/* ⭐️ 4. เพิ่ม fontClass ให้ส่วนของเลเวลเผื่อมีการแปลในอนาคต */}
                <span className={`font-pixel text-[7px] text-muted-foreground ${i18n.language === "th"}`}>
                  LV
                </span>
                <span className={`font-pixel text-[10px] text-foreground ${i18n.language === "th"}`}>
                  {user.level}
                </span>
              </div>
              <div className="w-[1px] h-4 bg-border" />
              <div className="flex items-center gap-1">
                <span className="text-lg">🪙</span>
                <span className={`font-pixel text-[10px] text-accent pixel-text-shadow ${i18n.language === "th"}`}>
                  {user.points.toLocaleString()}
                </span>
              </div>
              <div className="w-[1px] h-4 bg-border" />
              <span className={`font-pixel text-[8px] text-foreground hidden md:inline ${i18n.language === "th"}`}>
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="font-pixel text-[7px] text-destructive hover:text-destructive/80 uppercase tracking-wider cursor-pointer"
              >
                ⏻
              </button>
            </div>
            <PixelButton
              onClick={toggleLanguage}
              variant="ghost"
              size="sm"
              // ⭐️ 5. ปุ่มสลับภาษา ให้คงฟอนต์พิกเซลไว้เพื่อความสวยงาม
              className="font-pixel text-[11px] min-w-[50px] font-pixel"
            >
              {i18n.language === "th" ? "ENG" : "TH"}
            </PixelButton>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;