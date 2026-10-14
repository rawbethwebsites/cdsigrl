import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();
crons.interval("stop alarms", { minutes: 1 }, internal.alerts.stopAlarms, {});
export default crons;
