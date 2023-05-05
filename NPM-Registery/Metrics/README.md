## How to setup
1. First install npm
2. Make a .env file. 
#### The .env file should contain:
```sh
GITHUB_TOKEN=ghp_nqp7EaHtK5SKzj5WEA2hRbsq6zeejjnnfuHwR
LOG_LEVEL=1
LOG_FILE=/Users/myUser/IdeaProjects/files/project-1-1.log
```
3. Then run 
```bash
export $(cat .env | xargs)
```

## How to run
1. ```./run install``` to install dependencies
2. ```./run build``` to build the code
3. ```./run URL_FILE``` to output the Correctness, net score, etc.
4. ```./run test``` to test 

