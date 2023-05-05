import { Octokit } from "@octokit/core";
import { commitsResponse } from "./types";
import {getLastCount} from '../utils/rest-api-last-count';

export async function getCommits(owner: string, repo: string) : Promise<commitsResponse> {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    try {
        const total_count =await getLastCount(owner,repo,"commits");
        const response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
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