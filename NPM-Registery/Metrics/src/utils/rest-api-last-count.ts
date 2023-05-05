import fetch from 'node-fetch';


export async function getLastCount(owner: string, repo: string, type:string) : Promise<any> {

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/${type}?per_page=1`, {
        method: 'GET',       
      });
    var link = response.headers.get('link')?.toString();
    if (link == undefined){
      return 0;
    }
    const regex = /&page=([0-9]+)>; rel=\"last\"/gm;

    const match = regex.exec(link)

    let total_count = Number(match[1]);
    return total_count;
}