"use client";

import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EligibilityIndicatorProps {
  visaSubclass: string;
  points: number;
  requiredPoints?: number; // Base requirement before nomination
  nominationPoints?: number; // Points from nomination if applicable
}

const VISA_REQUIRED_POINTS = 65;

export function EligibilityIndicator({ visaSubclass, points, nominationPoints = 0 }: EligibilityIndicatorProps) {
  const totalPossiblePoints = points + nominationPoints;
  let status: "eligible" | "not-eligible" | "pending-nomination" = "not-eligible";
  let message = "";
  let Icon = XCircle;
  let badgeVariant: "default" | "destructive" | "secondary" = "destructive";

  if (points >= VISA_REQUIRED_POINTS) {
    if (nominationPoints > 0 && visaSubclass !== "189") { // For 190, 491, eligibility is based on base points + nomination
        status = "eligible";
        message = `Eligible with nomination.`;
        Icon = CheckCircle2;
        badgeVariant = "default"; // Green (accent)
    } else if (visaSubclass === "189") {
        status = "eligible";
        message = "Eligible.";
        Icon = CheckCircle2;
        badgeVariant = "default";
    } else { // For 190/491, if base points >= 65 but nomination needed
        status = "pending-nomination";
        message = `Potentially eligible. Requires nomination.`;
        Icon = AlertCircle;
        badgeVariant = "secondary"; // Yellowish/Neutral
    }
  } else if (nominationPoints > 0 && totalPossiblePoints >= VISA_REQUIRED_POINTS && visaSubclass !== "189") {
    status = "pending-nomination";
    message = `Eligible with nomination (${nominationPoints} pts). Current base: ${points} pts.`;
    Icon = AlertCircle;
    badgeVariant = "secondary";
  } else {
    status = "not-eligible";
    message = `Not eligible. Needs ${VISA_REQUIRED_POINTS - points} more points.`;
    Icon = XCircle;
    badgeVariant = "destructive";
  }
  
  if (visaSubclass !== "189" && nominationPoints === 0 && points < VISA_REQUIRED_POINTS) {
     message = `Not eligible. Needs ${VISA_REQUIRED_POINTS - points} more points for base eligibility. Nomination adds points.`;
  }


  return (
    <div className="flex items-center space-x-3 p-3 border rounded-lg bg-card">
      <Icon
        className={`h-6 w-6 ${
          status === "eligible" ? "text-accent" : status === "pending-nomination" ? "text-yellow-500" : "text-destructive"
        }`}
      />
      <div>
        <p className="font-semibold text-foreground">Visa {visaSubclass}</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Badge variant={badgeVariant} className={`ml-auto capitalize ${badgeVariant === 'default' ? 'bg-accent text-accent-foreground' : ''}`}>
        {status.replace("-", " ")}
      </Badge>
    </div>
  );
}
