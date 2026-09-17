import {
  Award,
  BookOpen,
  Building2,
  Compass,
  Globe2,
  HeartHandshake,
  Languages,
  GraduationCap,
  FlaskConical,
  Laptop2,
  Music2,
  UsersRound,
} from "lucide-react";
import type { Service } from "@/lib/academy";
import { cn } from "@/lib/utils";

const map = {
  languages: Languages,
  book: BookOpen,
  compass: Compass,
  building: Building2,
  globe: Globe2,
  heart: HeartHandshake,
  award: Award,
  consultancy: GraduationCap,
  research: FlaskConical,
  digital: Laptop2,
  music: Music2,
  leadership: UsersRound,
} as const;

export function ServiceIcon({
  name,
  className,
}: {
  name: Service["icon"];
  className?: string;
}) {
  const Icon = map[name];
  return <Icon className={cn("size-5", className)} strokeWidth={1.6} />;
}
