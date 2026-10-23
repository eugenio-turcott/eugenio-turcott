const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const colors=['#f5a5cb','#82dbed','#c4b5fd','#a5d6a7','#f4cf92','#8daee8'];
const number=value=>new Intl.NumberFormat('en-US').format(Math.max(0,Number(value)||0));
export function ownPublicRepos(repos,owner){return repos.filter(r=>!r.private&&!r.fork&&!r.archived&&r.owner?.login?.toLowerCase()===owner.toLowerCase());}
function frame(title,description,content,date){return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="320" viewBox="0 0 500 320" role="img" aria-labelledby="title desc"><title id="title">${esc(title)}</title><desc id="desc">${esc(description)}</desc><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#151829"/><stop offset="1" stop-color="#21172e"/></linearGradient></defs><rect x="1" y="1" width="498" height="318" rx="22" fill="url(#bg)" stroke="#4d3c59"/><g font-family="Segoe UI,Arial,sans-serif"><rect x="26" y="29" width="4" height="23" rx="2" fill="#f5a5cb"/><text x="42" y="47" fill="#f5f0fa" font-size="21" font-weight="700">${esc(title)}</text>${content}<line x1="26" y1="281" x2="474" y2="281" stroke="#4d3c59"/><text x="26" y="302" font-size="11" fill="#b3b2c9">PUBLIC DATA · ${esc(date)}</text></g></svg>`;}
export function overviewCard(user,repos,date){
 const stars=repos.filter(r=>!r.private&&!r.fork).reduce((n,r)=>n+(Number(r.stargazers_count)||0),0);
 const values=[['Public repos',user.public_repos],['Followers',user.followers],['Stars received',stars],['Following',user.following]];
 const content=values.map(([label,value],i)=>{const x=i%2?262:26,y=i<2?78:178;return `<rect x="${x}" y="${y}" width="212" height="86" rx="14" fill="#fff" fill-opacity=".035"/><text x="${x+16}" y="${y+36}" font-size="30" font-weight="800" fill="${colors[i]}">${number(value)}</text><text x="${x+16}" y="${y+62}" font-size="13" fill="#cbc7dc">${label}</text>`;}).join('');
 return frame('A little GitHub snapshot','Public repositories, followers, stars received across non-fork public repositories, and following.',content,date);
}
export function languagesCard(totals,date){
 const all=Object.entries(totals).filter(([,n])=>Number.isFinite(n)&&n>0).sort((a,b)=>b[1]-a[1]),total=all.reduce((s,[,n])=>s+n,0),rows=all.slice(0,5);
 if(all.length>5)rows.push(['Other',all.slice(5).reduce((s,[,n])=>s+n,0)]);
 let x=26;
 const bar=rows.map(([,n],i)=>{const w=448*n/total;const rect=`<rect x="${x.toFixed(2)}" y="82" width="${w.toFixed(2)}" height="14" fill="${colors[i]}"/>`;x+=w;return rect;}).join('');
 const legend=rows.map(([name,n],i)=>`<circle cx="32" cy="${123+i*25}" r="4" fill="${colors[i]}"/><text x="46" y="${128+i*25}" fill="#ddd8ea" font-size="13">${esc(name)}</text><text x="473" y="${128+i*25}" text-anchor="end" fill="${colors[i]}" font-size="13" font-weight="700">${(100*n/total).toFixed(1)}%</text>`).join('');
 return frame('Languages in my repositories','Language share by bytes in active, non-fork public repositories; not a measure of proficiency.',rows.length?bar+legend:'<text x="26" y="135" fill="#cbc7dc" font-size="14">No public language data available.</text>',date);
}
