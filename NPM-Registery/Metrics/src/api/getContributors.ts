import { Octokit } from "@octokit/core";
import { contributorsResponse } from "./types";
import {getLastCount} from '../utils/rest-api-last-count';

export async function getContributors(owner: string, repo: string): Promise<contributorsResponse> {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    try {
        const total_count =await getLastCount(owner,repo,"contributors");
        const response = await octokit.request('GET /repos/{owner}/{repo}/contributors', {
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