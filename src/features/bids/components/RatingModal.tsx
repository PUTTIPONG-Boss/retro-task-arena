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
          <DialogTitle className="font-pixel text-[11px] text-foreground pixel-text-shadow text-center">
            ⚔ Rate the Quest Completion
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-base mt-2">
            Rate the adventurer's work
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5">
          {/* Quest & Worker info */}
          <div className="pixel-border bg-secondary p-3 space-y-1">
            <div className="flex justify-between">
              <span className="text-base text-muted-foreground">Quest</span>
              <span className="font-pixel text-[8px] text-foreground">{questTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base text-muted-foreground">Worker</span>
              <span className="font-pixel text-[8px] text-accent pixel-text-shadow">{workerUsername}</span>
            </div>
          </div>

          {/* Star rating */}
          <div className="text-center">
            <p className="font-pixel text-[8px] text-muted-foreground mb-3">YOUR RATING</p>
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
              <p className="font-pixel text-[9px] text-accent pixel-text-shadow mt-2">
                {rating} / 5
              </p>
            )}
          </div>

          {/* Feedback */}
          <div>
            <p className="font-pixel text-[8px] text-muted-foreground mb-2">FEEDBACK (OPTIONAL)</p>
            <PixelTextarea
              rows={3}
              placeholder="Leave feedback about the work..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          {/* Submit */}
          <PixelButton
            variant="gold"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={rating === 0}
          >
            ✅ Submit Rating
          </PixelButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
