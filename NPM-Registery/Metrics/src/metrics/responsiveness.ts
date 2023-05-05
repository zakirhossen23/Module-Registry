import { issuesResponse } from "../api/types";
import { logToFile } from "../logging/logging";

// calculate responsiveness metric
// this is done by taking the number of issues that have been updated and dividing by the total number of issues
export function calculateResponsiveness(issues: issuesResponse) {

    const issueData = issues.data;
    const issueCount = issueData.length;
    const responsiveIssues = issueData.filter((issue) => issue.created_at !== issue.updated_at);
    const responsiveIssueCount = responsiveIssues.length;

    logToFile(issueCount, 2, "Issue Count");
    logToFile(responsiveIssueCount, 2, "Responsive Issue Count");
    logToFile(responsiveIssueCount / issueCount, 1, "Responsiveness");

    return issueCount === 0 ? 0 : responsiveIssueCount / issueCount;
}
