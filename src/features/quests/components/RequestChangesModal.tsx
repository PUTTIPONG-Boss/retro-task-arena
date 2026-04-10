import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PixelButton from "@/components/PixelButton";
import PixelTextarea from "@/components/PixelTextarea";
import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import PixelFlag from "@/components/icons/PixelFlag";

interface RequestChangesModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  workerUsername: string;
  questTitle: string;
}

const RequestChangesModal = ({
  open,
  onClose,
  onSubmit,
  workerUsername,
  questTitle,
}: RequestChangesModalProps) => {
  const [reason, setReason] = useState("");
  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[16px]";

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onSubmit(reason);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="pixel-border bg-card border-none max-w-md p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className={`font-pixel text-danger pixel-text-shadow text-center flex items-center justify-center gap-2 ${fontClass}`}>
            <PixelFlag size={18} color="#b91c1c" flagColor="#ef4444" /> {t("questWorkspace.modals.requestChanges.title")}
          </DialogTitle>
          <DialogDescription className={`text-center text-muted-foreground mt-2 leading-relaxed ${fontClass}`}>
            {t("questWorkspace.modals.requestChanges.desc")}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5">
          {/* Quest & Worker info */}
          <div className="pixel-border bg-secondary/50 p-3 space-y-1">
            <div className="flex justify-between items-center">
              <span className={`text-muted-foreground uppercase ${fontClass}`}>{t("questWorkspace.sidebar.statusReport")}</span>
              <span className={`font-pixel text-foreground truncate max-w-[150px] ${fontClass}`}>{questTitle}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-muted-foreground uppercase ${fontClass}`}>{t("questWorkspace.sidebar.name")}</span>
              <span className={`font-pixel text-accent pixel-text-shadow ${fontClass}`}>{workerUsername}</span>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <p className={`font-pixel text-muted-foreground mb-2 uppercase ${fontClass}`}>
              {t("questWorkspace.modals.requestChanges.reasonLabel")}
            </p>
            <PixelTextarea
              rows={4}
              placeholder={t("questWorkspace.modals.requestChanges.placeholder")}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={`w-full ${fontClass}`}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <PixelButton
              variant="ghost"
              size="md"
              className={`flex-1 ${fontClass}`}
              onClick={onClose}
            >
              {t("questWorkspace.modals.requestChanges.cancelBtn")}
            </PixelButton>
            <PixelButton
              variant="danger"
              size="md"
              className={`flex-1 ${fontClass}`}
              onClick={handleSubmit}
              disabled={!reason.trim()}
            >
              {t("questWorkspace.modals.requestChanges.submitBtn")}
            </PixelButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestChangesModal;
