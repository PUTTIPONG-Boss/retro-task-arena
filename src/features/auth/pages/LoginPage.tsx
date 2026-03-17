import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import PixelDivider from "@/components/PixelDivider";
import { useEffect } from "react";

const LoginPage = () => {
  const { isAuthenticated, isLoading, loginWithOneID, mockLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleOneID = async () => {
    await loginWithOneID();
  };

  const handleMock = async () => {
    await mockLogin();
  };

  return (
    <div className="min-h-screen wood-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Decorative top */}
        <div className="text-center mb-6">
          <span className="font-pixel text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
            Guild Access Terminal
          </span>
        </div>

        <PixelFrame variant="dark" className="p-8">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="font-pixel text-[16px] text-accent pixel-text-shadow mb-3">
              ⚔ Developer Guild ⚔
            </h1>
            <p className="font-pixel-body text-lg text-muted-foreground">
              Login to access the Quest Board
            </p>
          </div>

          <PixelDivider label="authenticate" />

          {/* Pixel terminal decoration */}
          <div className="pixel-inset bg-background p-4 mb-6">
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
          </div>

          {/* Login buttons */}
          <div className="space-y-3">
            <PixelButton
              variant="gold"
              size="lg"
              className="w-full"
              onClick={handleOneID}
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "🔑 Login with OneID"}
            </PixelButton>

            <PixelButton
              variant="ghost"
              size="md"
              className="w-full"
              onClick={handleMock}
              disabled={isLoading}
            >
              🛠 Mock Login (Dev)
            </PixelButton>
          </div>

          <PixelDivider className="mt-6 mb-4" />

          <p className="font-pixel text-[7px] text-muted-foreground text-center leading-relaxed">
            No account needed — your profile is created automatically after
            first login.
          </p>
        </PixelFrame>

        {/* Bottom decoration */}
        <div className="text-center mt-4">
          <span className="font-pixel text-[7px] text-muted-foreground tracking-widest">
            v0.1.0 · QUEST BOARD SYSTEM
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
