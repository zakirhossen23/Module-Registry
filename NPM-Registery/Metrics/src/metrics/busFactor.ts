import { contributorsResponse, commitsResponse } from "../api/types";
import { logToFile } from "../logging/logging";

// the bus factor is the number of contributors divided by the number of commits
export function calculateBusFactor(contributors: contributorsResponse, commits: commitsResponse): number {
  const contributorsCount = contributors.data.length;
  const commitsCount = commits.data.length;
  const busFactor = contributorsCount / commitsCount;

  logToFile(commitsCount, 2, "Commits Count");
  logToFile(contributorsCount, 2, "Contributors Count");
  logToFile(busFactor, 1, "Bus Factor");

  return busFactor > 1 ? 1 : busFactor;
}
