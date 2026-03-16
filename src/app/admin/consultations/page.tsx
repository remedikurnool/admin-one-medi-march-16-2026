import { ModulePlaceholder } from "@/components/module-placeholder";
import { Stethoscope } from "lucide-react";

export default function ConsultationsPage() {
  return (
    <ModulePlaceholder
      title="Consultations"
      description="Oversee doctor consultations — online, clinic, and home visits across specialties."
      icon={<Stethoscope className="h-5 w-5" />}
      features={[
        "Appointment Scheduling",
        "Doctor Availability & Roster",
        "Video Consultation Monitoring",
        "Prescription Management",
        "Follow-up Tracking",
        "Patient Feedback & Ratings",
      ]}
      badgeText="Core Module"
    />
  );
}
