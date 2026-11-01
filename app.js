const data = window.DAILY_CONTENT;
const $ = (s) => document.querySelector(s);
const d = new Date(`${data.date}T12:00:00`);
$('#today').textContent = new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(d);
$('#topic').textContent=data.topic;
$('#topicNote').textContent=data.topicNote;
const day=(Math.floor(Date.parse(`${data.date}T00:00:00Z`)/86400000)%3+3)%3+1;
$('#cycle').textContent=`第 ${day} / 3 天`;
$('#progress').style.width=`${day/3*100}%`;
$('#updated').title=`素材参考：${data.source}`;
function render(){
 $('#sentences').innerHTML=data.sentences.map((s,i)=>`<article class="sentence" tabindex="0" aria-expanded="false"><div class="number">${String(i+1).padStart(2,'0')}</div><div class="body"><p class="cn">${s.cn}</p><div class="reveal"><p class="en">${s.en}</p><div class="words">${s.words.map(w=>`<span class="word"><b>${w.word}</b><small>${w.meaning}</small></span>`).join('')}</div></div></div><button class="toggle" aria-label="显示翻译">＋</button></article>`).join('');
 document.querySelectorAll('.sentence').forEach(card=>{const toggle=()=>{card.classList.toggle('open');card.setAttribute('aria-expanded',card.classList.contains('open'))};card.addEventListener('click',toggle);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}})});
}
render();
$('#refresh').addEventListener('click',()=>location.reload());
