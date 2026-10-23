import {mkdir,writeFile,rename}from 'node:fs/promises';
import {ownPublicRepos,overviewCard,languagesCard}from './profile-cards.mjs';
const owner='eugenio-turcott',token=process.env.GH_TOKEN;
async function api(path){
 const response=await fetch(`https://api.github.com${path}`,{signal:AbortSignal.timeout(20000),headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'eugenio-turcott-profile',...(token?{Authorization:`Bearer ${token}`}:{})}});
 if(!response.ok)throw new Error(`GitHub returned ${response.status} for ${path}. Existing cards were kept.`);
 return response.json();
}
const user=await api(`/users/${owner}`),repos=[];
for(let page=1;;page++){const chunk=await api(`/users/${owner}/repos?type=owner&per_page=100&page=${page}`);repos.push(...chunk);if(chunk.length<100)break;}
const totals={},own=ownPublicRepos(repos,owner).filter(r=>r.name!==owner);
for(let offset=0;offset<own.length;offset+=4){const results=await Promise.all(own.slice(offset,offset+4).map(r=>api(`/repos/${owner}/${r.name}/languages`)));for(const languages of results)for(const [name,n]of Object.entries(languages))totals[name]=(totals[name]||0)+n;}
const date=new Intl.DateTimeFormat('en-US',{year:'numeric',month:'short',day:'numeric',timeZone:'America/Mexico_City'}).format(new Date()),assets=new URL('../assets/',import.meta.url);
await mkdir(assets,{recursive:true});
for(const [file,svg]of [['overview.svg',overviewCard(user,repos,date)],['languages.svg',languagesCard(totals,date)]]){const target=new URL(file,assets),temp=new URL(`${file}.tmp`,assets);await writeFile(temp,svg);await rename(temp,target);}
console.log(`Updated public cards: ${repos.length} public repositories, ${Object.keys(totals).length} languages. No private repository data was requested.`);
