import { Octokit } from "@octokit/core";
import { issuesResponse } from "./types";
import {getLastCount} from '../utils/rest-api-last-count';

export async function getIssues(owner: string, repo: string) : Promise<issuesResponse> {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    try {
        const total_count =await getLastCount(owner,repo,"issues");
        const response = await octokit.request('GET /repos/{owner}/{repo}/issues', {
            owner: owner,
            repo: repo,
            per_page: total_count,
        });
        return response;
    } catch (error) {
        // console.error(error);
        throw error;
    }
}
