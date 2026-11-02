const week = window.CET6_WEEK;
const $ = (s) => document.querySelector(s);
const chosen = new URLSearchParams(location.search).get('day');
let active = Math.max(0, Math.min(6, Number(chosen || 1) - 1));
function render() {
  const entry = week.days[active];
  const date = new Date(`${entry.date}T12:00:00`);
  $('#today').textContent = new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(date);
  $('#topic').textContent = entry.topic;
  $('#topicNote').textContent = entry.topicNote;
  $('#cycle').textContent = `第 ${active+1} / 7 天`;
  $('#progress').style.width = `${(active+1)/7*100}%`;
  $('#topicIndex').innerHTML = `${String(active+1).padStart(2,'0')} <span>—</span>`;
  $('#dayHeading').textContent = active === 0 ? '今日五句' : `第 ${active+1} 天 · 五句`;
  $('#updated').textContent = `本周素材 · 更新于 ${week.updated}`;
  $('#updated').title = `参考来源：${entry.source}`;
  document.querySelectorAll('.week-day').forEach((b,i)=>b.classList.toggle('active',i===active));
  $('#sentences').innerHTML = entry.sentences.map((s,i)=>`<article class="sentence" tabindex="0" aria-expanded="false"><div class="number">${String(i+1).padStart(2,'0')}</div><div class="body"><p class="cn">${s.cn}</p><div class="reveal"><p class="en">${s.en}</p><div class="words">${s.words.map(w=>`<span class="word"><b>${w.word}</b><small>${w.meaning}</small></span>`).join('')}</div></div></div><button class="toggle" aria-label="显示翻译">＋</button></article>`).join('');
  document.querySelectorAll('.sentence').forEach(card=>{const toggle=()=>{card.classList.toggle('open');card.setAttribute('aria-expanded',card.classList.contains('open'))};card.addEventListener('click',toggle);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}})});
  const audio = window.CET6_AUDIO[active];
  $('#audioTitle').textContent = audio.title;
  $('#audioDesc').textContent = audio.description;
  $('#audioLevel').textContent = audio.level;
  $('#audioPlayer').src = audio.audio;
  $('#audioSource').href = audio.source;
  $('#transcriptToggle').textContent = $('#transcriptToggle').getAttribute('aria-expanded') === 'true' ? '收起英文原文　−' : '显示英文原文　＋';
  $('#transcript').innerHTML = audio.transcript;
  $('#transcript').hidden = $('#transcriptToggle').getAttribute('aria-expanded') !== 'true';
  $('#transcriptToggle').onclick = () => {
    const open = $('#transcriptToggle').getAttribute('aria-expanded') !== 'true';
    $('#transcriptToggle').setAttribute('aria-expanded', String(open));
    $('#transcriptToggle').textContent = open ? '收起英文原文　−' : '显示英文原文　＋';
    $('#transcript').hidden = !open;
  };
}
$('#weekNav').innerHTML = week.days.map((d,i)=>`<button class="week-day" type="button" aria-label="第 ${i+1} 天：${d.topic}"><small>DAY ${String(i+1).padStart(2,'0')}</small><span>${new Intl.DateTimeFormat('zh-CN',{month:'numeric',day:'numeric'}).format(new Date(`${d.date}T12:00:00`))}</span></button>`).join('');
document.querySelectorAll('.week-day').forEach((b,i)=>b.addEventListener('click',()=>{active=i;render();history.replaceState(null,'',`?day=${i+1}`)}));
render();
$('#refresh').addEventListener('click',()=>location.reload());

