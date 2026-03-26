import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelDivider from "@/components/PixelDivider";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

/* ── tiny helper: seeded-ish random array ── */
const makeStars = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 60}%`,
    delay: Math.random() * 5,
    dur: 2 + Math.random() * 4,
    size: Math.random() > 0.6 ? 2 : 1,
  }));

const makeParticles = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: `${5 + Math.random() * 90}%`,
    delay: Math.random() * 8,
    dur: 6 + Math.random() * 8,
  }));

const LoginPage = () => {
  const { isAuthenticated, user, isLoading, loginWithOneID, login, mockLogin, mockSeniorLogin, mockAdminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin" || user.role === "ADMIN") {
        navigate("/manage/quest", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const stars = useMemo(() => makeStars(40), []);
  const particles = useMemo(() => makeParticles(14), []);

  const { i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px] font-['TA_8bit']" : "text-[14px] font-pixel";

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Welcome back, Adventurer!");
    } catch (error) {
      toast.error("Authentication failed. Check your coordinates.");
    }
  };

  return (
    <div className={`relative min-h-screen overflow-hidden ${fontClass}`}>
      {/* ═══ LAYER 1 — pixel star sky (supplemental to global bg) ═══ */}
      <div className="absolute inset-0 z-0">
        {stars.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-foreground"
            style={{
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
            }}
            animate={{ opacity: [0.15, 0.8, 0.15] }}
            transition={{
              duration: s.dur,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* slow floating motes */}
        {particles.map((p) => (
          <motion.div
            key={`p-${p.id}`}
            className="absolute w-[2px] h-[2px] bg-accent/30 rounded-full"
            style={{ left: p.x, bottom: "5%" }}
            animate={{
              y: [0, -200, -400],
              x: [0, 15, -10],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: p.dur,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* ═══ LAYER 2 — guild hall silhouette scene ═══ */}
      <div className="absolute inset-0 z-[1] flex items-end justify-center pointer-events-none select-none">
        {/* Simple pixel guild hall built with divs */}
        <div className="relative w-full max-w-[900px] opacity-[0.07] blur-[1px]">
          {/* towers */}
          <div className="flex justify-between items-end px-8">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-foreground" />
              <div className="w-8 h-28 bg-foreground" />
              <div className="w-12 h-8 bg-foreground" />
            </div>
            {/* main building */}
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-foreground" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
              <div className="w-48 h-40 bg-foreground relative">
                {/* windows */}
                <div className="absolute top-6 left-6 w-4 h-6 bg-background" />
                <div className="absolute top-6 right-6 w-4 h-6 bg-background" />
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-6 bg-background" />
                {/* door */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-14 bg-background" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-foreground" />
              <div className="w-8 h-28 bg-foreground" />
              <div className="w-12 h-8 bg-foreground" />
            </div>
          </div>
          {/* ground */}
          <div className="w-full h-6 bg-foreground" />
        </div>

        {/* torch flicker overlays */}
        <motion.div
          className="absolute bottom-32 left-[30%] w-20 h-20 rounded-full bg-accent/5 blur-xl"
          animate={{ opacity: [0.3, 0.6, 0.2, 0.5, 0.3], scale: [1, 1.1, 0.95, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 right-[30%] w-20 h-20 rounded-full bg-accent/5 blur-xl"
          animate={{ opacity: [0.2, 0.5, 0.3, 0.6, 0.2], scale: [1, 1.05, 1.1, 0.95, 1] }}
          transition={{ duration: 3.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ═══ dark vignette overlay ═══ */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, hsl(var(--background)) 80%)",
        }}
      />

      {/* ═══ LOGIN PANEL ═══ */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Decorative top */}
          <div className="text-center mb-6">
            <span className="text-[12px] text-muted-foreground tracking-[0.3em] uppercase">
              Guild Access Terminal
            </span>
          </div>

          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Soft panel glow */}
            <div className="relative">
              <div className="absolute -inset-2 bg-accent/[0.04] blur-xl rounded-sm pointer-events-none" />

              <PixelFrame variant="dark" className="relative p-8">
                {/* Title */}
                <div className="text-center mb-6">
                  <h1 className="font-pixel text-[24px] text-accent pixel-text-shadow mb-3">
                    ⚔ Inet Developer Guild ⚔
                  </h1>
                  <p className="font-pixel text-[18px] text-accent text-muted-foreground">
                    Login to access the Quest Board
                  </p>
                </div>

                <PixelDivider />

                {/* Pixel terminal decoration */}
                {/* <div className="pixel-inset bg-background p-4 mb-6">
                  <div className="font-pixel-body text-sm text-muted-foreground space-y-1">
                    <p>
                      <span className="text-success terminal-glow">{">"}</span>{" "}
                      Initializing guild terminal...
                    </p>
                    <p>
                      <span className="text-success terminal-glow">{">"}</span>{" "}
                      Authentication required
                    </p>
                    <p>
                      <span className="text-success terminal-glow">{">"}</span>{" "}
                      Select login method_
                    </p>
                  </div>
                </div> */}

                {/* Login Form */}
                <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
                  <div>
                    <label className="font-pixel text-[18px] text-muted-foreground block mb-2 uppercase">Email</label>
                    <PixelInput 
                      placeholder="adventurer@guild.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="font-pixel text-[18px] text-muted-foreground block mb-2 uppercase">Secret Password</label>
                    <PixelInput 
                      type="password" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                  <PixelButton
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="w-full font-pixel text-[16px] uppercase tracking-wider"
                    disabled={isLoading}
                  >
                    {isLoading ? "Authenticating..." : "⚔ Sign In"}
                  </PixelButton>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50"></div>
                  </div>
                  <div className="relative flex justify-center text-[8px] uppercase">
                    <span className="bg-[#1a1a1b] text-muted-foreground font-pixel text-[18px]">Or use Identity providers</span>
                  </div>
                </div>

                {/* Other Login options */}
                <div className="space-y-3">
                  <PixelButton
                    variant="primary"
                    size="md"
                    className="w-full font-pixel text-[16px] uppercase tracking-wider"
                    onClick={() => loginWithOneID()}
                    disabled={isLoading}
                    type="button"
                  >
                    🔑 Login with OneID
                  </PixelButton>

                  <PixelButton
                    variant="ghost"
                    size="sm"
                    className="w-full font-pixel text-[16px] uppercase tracking-wider"
                    onClick={() => mockLogin()}
                    disabled={isLoading}
                    type="button"
                  >
                    🛠 Dev Tool: Mock Login
                  </PixelButton>
                  <div className="flex gap-2 mt-2">
                    <PixelButton
                      variant="ghost"
                      size="sm"
                      className="w-full font-pixel text-[12px] uppercase tracking-wider text-blue-400 hover:bg-blue-900/20"
                      onClick={() => mockSeniorLogin && mockSeniorLogin()}
                      disabled={isLoading}
                      type="button"
                    >
                      🛠 Mock Senior
                    </PixelButton>

                    <PixelButton
                      variant="ghost"
                      size="sm"
                      className="w-full font-pixel text-[12px] uppercase tracking-wider text-red-400 hover:bg-red-900/20"
                      onClick={() => mockAdminLogin && mockAdminLogin()}
                      disabled={isLoading}
                      type="button"
                    >
                      🛠 Mock Admin
                    </PixelButton>
                  </div>

                </div>

                <PixelDivider className="mt-6 mb-4" />

                <p className="font-pixel text-[12px] text-muted-foreground text-center leading-relaxed">
                  No account needed — your profile is created automatically after
                  first login.
                </p>
              </PixelFrame>
            </div>
          </motion.div>

          {/* Bottom decoration */}
          <div className="text-center mt-4">
            <span className="font-pixel text-[12px] text-muted-foreground tracking-widest">
              v0.1.0 · INET QUEST BOARD SYSTEM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
