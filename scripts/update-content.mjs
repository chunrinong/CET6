import { writeFile } from 'node:fs/promises';

const key = process.env.OPENAI_API_KEY;
if (!key) throw new Error('Missing OPENAI_API_KEY repository secret');
const date = new Date().toISOString().slice(0, 10);
const topics = ['数字时代与人工智能','教育公平与终身学习','环境保护与可持续发展','青年责任与社会参与','健康生活与心理韧性','文化传承与全球交流','城市发展与公共交通','就业转型与职业技能'];
const dayNumber = Math.floor(Date.parse(date + 'T00:00:00Z') / 86400000);
const topicIndex = Math.floor(dayNumber / 3) % topics.length;
const topic = topics[topicIndex];
const cycleDay = dayNumber % 3 + 1;
const prompt = `今天是 ${date}，话题是“${topic}”，本话题第 ${cycleDay}/3 天。请使用 web_search 搜索可信的近期或权威英文素材（优先联合国、UNESCO、OECD、世界银行、政府或大学），把事实抽象为适用于中国大学英语六级议论文的表达，而非照抄来源。输出严格 JSON 对象，不要 markdown：{"topic":"话题名","topicNote":"不超过45字的中文提示","source":"资料来源标题及完整URL，至少2条","sentences":[{"cn":"成熟、有论证层次的中文句子，约35-65字","en":"准确自然、适合六级高分作文的英文翻译","words":[{"word":"英文重点词","meaning":"简明中文释义"}]}]}。必须恰好5句，每句恰好3个词汇。选六级中高难度学术词汇或搭配，排除常见四级或高考词。句式多样，避免重复套路、空洞口号和未经来源支持的数字或事实。`;
const response = await fetch('https://api.openai.com/v1/responses', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'gpt-5-mini', tools: [{ type: 'web_search' }], input: prompt })
});
if (!response.ok) throw new Error('Responses API ' + response.status + ': ' + (await response.text()).slice(0, 1500));
const result = await response.json();
const output = result.output?.flatMap(item => item.content || []).find(item => item.type === 'output_text')?.text;
if (!output) throw new Error('No generated text returned');
const content = JSON.parse(output.replace(/^```(?:json)?\s*|\s*```$/g, ''));
if (!content.topic || !Array.isArray(content.sentences) || content.sentences.length !== 5) throw new Error('Expected exactly five sentences');
for (const [i, sentence] of content.sentences.entries()) {
  if (!sentence.cn || !sentence.en || !Array.isArray(sentence.words) || sentence.words.length !== 3) throw new Error('Invalid sentence ' + (i + 1));
}
content.date = date;
content.source ||= '请在 Actions 工作流日志中查看本次搜索引用。';
await writeFile(new URL('../content.js', import.meta.url), 'window.DAILY_CONTENT = ' + JSON.stringify(content, null, 2) + ';\n', 'utf8');
console.log('Updated ' + date + ': ' + content.topic);
