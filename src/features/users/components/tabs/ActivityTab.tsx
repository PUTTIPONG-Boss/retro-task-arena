import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PixelFrame from "@/components/PixelFrame";
import PixelHeart from "@/components/icons/PixelHeart";
import { MyBid } from "@/features/finance/services/application.service";
import { Quest } from "@/features/quests/types";
import { UserProfile } from "../../types";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Sword, 
  Trophy, 
  CheckCircle, 
  Clock, 
  MessageSquare,
  ArrowRight
} from "lucide-react";

interface ActivityTabProps {
  bids: MyBid[];
  quests: Quest[];
  user: UserProfile;
}

type ActivityType = "QUEST_POSTED" | "BID_SUBMITTED" | "BID_ACCEPTED" | "QUEST_COMPLETED" | "WORK_SUBMITTED" | "REVIEW_RECEIVED" | "CHANGES_REQUESTED";

interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: string;
  metadata: {
    taskId: string;
    points?: number;
    comment?: string;
    status?: string;
    reason?: string;
  };
}

const ActivityTab: React.FC<ActivityTabProps> = ({ bids, quests, user }) => {
  const { t, i18n } = useTranslation();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[16px]";

  const activities = useMemo(() => {
    const events: ActivityEvent[] = [];

    // 1. Quests Posted (Senior/Employer)
    quests.forEach(q => {
      if (q.providerId === user.id) {
        events.push({
          id: `posted-${q.id}`,
          type: "QUEST_POSTED",
          title: q.title,
          timestamp: q.createdAt,
          metadata: { taskId: q.id }
        });
      }
    });

    // 2. Bids & Changes Requested (Junior)
    bids.forEach(b => {
      events.push({
        id: `bid-${b.id}`,
        type: "BID_SUBMITTED",
        title: b.taskTitle,
        timestamp: b.createdAt,
        metadata: { 
          taskId: b.taskId,
          points: b.bidAmount,
          status: b.status
        }
      });

      // 2.1 Changes Requested (Junior) - check if currently in-progress but has a latestComment
      if (b.status === "ACCEPTED" && b.latestComment) {
         const q = quests.find(q => q.id === b.taskId);
         if (q && q.status === "in-progress") {
            events.push({
              id: `changes-${b.id}`,
              type: "CHANGES_REQUESTED",
              title: b.taskTitle,
              timestamp: q.createdAt, 
              metadata: { 
                taskId: b.taskId,
                reason: b.latestComment
              }
            });
         }
      }
    });

    // 3. Quests Status Tracking (Both)
    quests.forEach(q => {
      // Bid Accepted (Senior)
      if (q.providerId === user.id && q.status !== "open" && q.status !== "bidding") {
          events.push({
            id: `accepted-${q.id}`,
            type: "BID_ACCEPTED",
            title: q.title,
            timestamp: q.createdAt, 
            metadata: { taskId: q.id }
          });
      }

      if (q.status === "completed") {
        if (q.assignedTo === user.id || q.providerId === user.id) {
          events.push({
            id: `completed-${q.id}`,
            type: "QUEST_COMPLETED",
            title: q.title,
            timestamp: q.createdAt, 
            metadata: { 
              taskId: q.id,
              points: q.rewardPoints
            }
          });
        }
      } else if (q.status === "review" && q.assignedTo === user.id) {
        // 4. Work Submitted (Junior)
        events.push({
          id: `submitted-${q.id}`,
          type: "WORK_SUBMITTED",
          title: q.title,
          timestamp: q.createdAt, 
          metadata: { taskId: q.id }
        });
      }
    });

    return events.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });
  }, [bids, quests, user.id, sortOrder]);

  const renderIcon = (type: ActivityType) => {
    switch (type) {
      case "QUEST_POSTED": return <FileText size={16} className="text-accent" />;
      case "BID_SUBMITTED": return <Sword size={16} className="text-yellow-400" />;
      case "BID_ACCEPTED": return <CheckCircle size={16} className="text-success" />;
      case "WORK_SUBMITTED": return <Clock size={16} className="text-accent" />;
      case "QUEST_COMPLETED": return <Trophy size={16} className="text-gold animate-bounce-slow" />;
      case "REVIEW_RECEIVED": return <MessageSquare size={16} className="text-success" />;
      case "CHANGES_REQUESTED": return <Clock size={16} className="text-danger" />;
      default: return <CheckCircle size={16} />;
    }
  };

  const getEventText = (event: ActivityEvent) => {
    switch (event.type) {
      case "QUEST_POSTED": return t("userProfile.activity.types.posted", { title: event.title });
      case "BID_SUBMITTED": return t("userProfile.activity.types.applied", { title: event.title });
      case "BID_ACCEPTED": return t("userProfile.activity.types.accepted", { title: event.title });
      case "WORK_SUBMITTED": return t("userProfile.activity.types.submitted", { title: event.title });
      case "QUEST_COMPLETED": return t("userProfile.activity.types.completed", { reward: event.metadata.points });
      case "CHANGES_REQUESTED": return t("userProfile.activity.types.changes_requested", { title: event.title, reason: event.metadata.reason });
      default: return event.title;
    }
  };

  return (
    <PixelFrame>
      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
        <h2 className={`font-pixel text-[10px] text-foreground pixel-text-shadow flex items-center gap-2 ${fontClass}`}>
          <PixelHeart size={20} className="text-yellow-400" /> {t("userProfile.activity.title")}
        </h2>
        
        <button 
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className={`pixel-border bg-secondary hover:bg-muted px-2 py-1 font-pixel text-[8px] text-accent transition-colors ${fontClass}`}
        >
          {sortOrder === "desc" ? "↓ " + t("userProfile.activity.sortNewest") : "↑ " + t("userProfile.activity.sortOldest")}
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="py-12 text-center opacity-50">
            <p className={`font-pixel text-muted-foreground ${fontClass}`}>
              {t("userProfile.activity.noApplications")}
            </p>
          </div>
        ) : (
          activities.map((event) => (
            <div 
              key={event.id} 
              className={cn(
                "pixel-border bg-secondary/30 p-4 transition-all hover:bg-muted/40 group",
                event.type === "QUEST_COMPLETED" ? "border-gold/30 bg-gold/5" : 
                event.type === "CHANGES_REQUESTED" ? "border-danger/30 bg-danger/5" : "border-pixel-shadow/20"
              )}
            >
              <div className="flex gap-4 items-start">
                <div className={cn(
                  "pixel-border p-2 bg-background/50",
                  event.type === "QUEST_COMPLETED" ? "text-gold" : 
                  event.type === "CHANGES_REQUESTED" ? "text-danger" : "text-muted-foreground"
                )}>
                  {renderIcon(event.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className={cn(
                      "font-pixel leading-tight",
                      event.type === "QUEST_COMPLETED" ? "text-gold pixel-text-shadow-gold" : 
                      event.type === "CHANGES_REQUESTED" ? "text-danger" : "text-foreground",
                      i18n.language === "th" ? "text-[12px]" : "text-[11px]"
                    )}>
                      {getEventText(event)}
                    </p>
                    <span className="text-[8px] text-muted-foreground font-pixel opacity-70">
                      {new Date(event.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  {(event.type === "QUEST_POSTED" || event.type === "BID_SUBMITTED" || event.type === "WORK_SUBMITTED" || event.type === "CHANGES_REQUESTED") && (
                    <Link 
                      to={`/quest/${event.metadata.taskId}`}
                      className="inline-flex items-center gap-1 text-[9px] text-accent hover:underline font-pixel mt-2"
                    >
                      {t("questDetail.back")} <ArrowRight size={10} />
                    </Link>
                  )}

                  {event.type === "QUEST_COMPLETED" && (
                    <div className="mt-3 flex gap-4">
                       <Link 
                        to={`/quest/${event.metadata.taskId}`}
                        className="pixel-border px-3 py-1 bg-gold/10 text-gold font-pixel text-[9px] hover:bg-gold/20 transition-all"
                      >
                        VIEW REWARDS
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </PixelFrame>
  );
};

export default ActivityTab;
