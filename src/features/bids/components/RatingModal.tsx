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

interface RatingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
  workerUsername: string;
  questTitle: string;
}

const RatingModal = ({ open, onClose, onSubmit, workerUsername, questTitle }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState("");

  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[16px]";

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, feedback);
    setRating(0);
    setHovered(0);
    setFeedback("");
  };

  const display = hovered || rating;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="pixel-border bg-card border-none max-w-md p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className={`font-pixel text-foreground pixel-text-shadow text-center ${fontClass}`}>
            {t("questWorkspace.modals.rating.title")}
          </DialogTitle>
          <DialogDescription className={`text-center text-muted-foreground text-base mt-2 ${fontClass}`}>
            {t("questWorkspace.modals.rating.desc")}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5">
          {/* Quest & Worker info */}
          <div className="pixel-border bg-secondary p-3 space-y-1">
            <div className="flex justify-between">
              <span className={`text-base text-muted-foreground ${fontClass}`}>{t("questWorkspace.modals.rating.questLabel")}</span>
              <span className={`font-pixel text-[12px] text-foreground ${fontClass}`}>{questTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-base text-muted-foreground ${fontClass}`}>{t("questWorkspace.modals.rating.workerLabel")}</span>
              <span className={`font-pixel text-[12px] text-accent pixel-text-shadow ${fontClass}`}>{workerUsername}</span>
            </div>
          </div>

          {/* Star rating */}
          <div className="text-center">
            <p className={`font-pixel text-[12px] text-muted-foreground mb-3 ${fontClass}`}>{t("questWorkspace.modals.rating.ratingLabel")}</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-3xl transition-transform hover:scale-125 ${
                    star <= display ? "text-accent drop-shadow-[0_0_6px_hsl(var(--accent))]" : "text-muted-foreground/40"
                  }`}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="font-pixel text-[12px] text-accent pixel-text-shadow mt-2">
                {rating} / 5
              </p>
            )}
          </div>

          {/* Feedback */}
          <div>
            <p className={`font-pixel text-[12px] text-muted-foreground mb-2 ${fontClass}`}>{t("questWorkspace.modals.rating.feedbackLabel")}</p>
            <PixelTextarea
              rows={3}
              placeholder={t("questWorkspace.modals.rating.feedbackPlaceholder")}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          {/* Submit */}
          <PixelButton
            variant="gold"
            size="lg"
            className="w-full font-pixel text-[16px]"
            onClick={handleSubmit}
            disabled={rating === 0}
          >
            {t("questWorkspace.modals.rating.submitBtn")}
          </PixelButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
