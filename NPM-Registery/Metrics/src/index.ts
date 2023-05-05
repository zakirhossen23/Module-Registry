#! /usr/bin/env node

require("dotenv").config({ path: ".env" }); // load environment variables from .env file
const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const program = new Command();
const parse = require("parse-github-url");

// import logging
import { logToFile } from "./logging/logging";

// import community profile
import { getCommunityProfile } from "./api/getCommunityProfile";
import { getReadme } from "./api/getReadme";
import { getLicense } from "./api/getLicense";
import { getIssues } from "./api/getIssues";
import { getContributors } from "./api/getContributors";
import { getCommits } from "./api/getCommits";
import { cloneRepo, createTempFolder, deleteClonedRepo } from "./api/clone";
import { getPkgGithubURL } from "./api/getPkgGithubURL";


// import metrics
import { calculateLicenseCompatibility } from "./metrics/licenseCompatibility";
import { calculateRampUp } from "./metrics/rampUp";
import { calculateResponsiveness } from "./metrics/responsiveness";
import { calculateBusFactor } from "./metrics/busFactor";
import { calculateNetScore } from "./metrics/netScore";
import { calculateCorrectness } from "./metrics/correctness";

program
    .version("1.0.0")
    .description("ACME metrics CLI")
    .option("-f, --file <value>", "absoulte directory of file containing urls")
    .parse(process.argv);

const options = program.opts();

if (options.file ) {
    const text = fs.readFileSync(path.resolve(options.file), "utf-8");
    const urlList = text.split("\n")

    // create a tmp directory to clone the repos into
    if (!fs.existsSync("./tmp")) {
        try {
            createTempFolder();
        } catch (err) {
            console.error(err);
        }
    }

    // for each package in the list get the community profile
    urlList.forEach(async (url: string) => {

        logToFile(url, 1, "URL");

        // convert npmjs url to github url if necessary
        let githubURL = url;
        if (url.includes("npmjs.com")) {
            const [pkgName] = url.split("/").slice(-1);
            try {
                githubURL = await getPkgGithubURL(pkgName, 'latest');
            } catch (error) {
                console.log(`${pkgName} does not have a github repository.`);
                logToFile(url, 1, "URL", "does not have a github repository");
                return;
            }
        }

        const repo = parse(githubURL);

        try {
            const communityProfileResponse = await getCommunityProfile(repo.owner, repo.name);
            const issuesResponse = await getIssues(repo.owner, repo.name);
            const readmeResponse = await getReadme(repo.owner, repo.name);
            const licenseResponse = await getLicense(repo.owner, repo.name);
            const contributorsResponse = await getContributors(repo.owner, repo.name);
            const commitsResponse = await getCommits(repo.owner, repo.name);
            await cloneRepo(githubURL, `./tmp/${repo.name}`);

            const busFactor = calculateBusFactor(contributorsResponse, commitsResponse);
            const rampUp = calculateRampUp(communityProfileResponse, readmeResponse);
            const responsiveness = calculateResponsiveness(issuesResponse);
            const licenseCompatibility = calculateLicenseCompatibility(licenseResponse, readmeResponse);
            const correctness = calculateCorrectness(`./tmp/${repo.name}`);
            await deleteClonedRepo(`./tmp/${repo.name}`);

            const netScore = calculateNetScore(rampUp, correctness, busFactor, responsiveness, licenseCompatibility);
            // print all scores the the console rounded to 2 decimal places
            console.log(`{"URL":"${url}", "NET_SCORE":${netScore.toFixed(2)}, "RAMP_UP_SCORE":${rampUp.toFixed(2)}, "CORRECTNESS_SCORE":${correctness.toFixed(2)}, "BUS_FACTOR_SCORE":${busFactor.toFixed(2)}, "RESPONSIVE_MAINTAINER_SCORE":${responsiveness.toFixed(2)}, "LICENSE_SCORE":${licenseCompatibility.toFixed(2)}}`);
            //console.log(`${url} ${netScore} ${rampUp} ${correctness} ${busFactor} ${responsiveness} ${licenseCompatibility}`)
        } catch (error) {
            logToFile(error, 1, "ERROR");
        }
    });
}

// if no options are passed show the help page
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
