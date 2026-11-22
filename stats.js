const bloomStats = (() => {
 const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];
 const SHORT_LABELS = {taxi:'沒搭計程車', tea:'沒買手搖'};

 function shiftDay(date, offset) {
  const shifted = new Date(date);
  shifted.setDate(shifted.getDate() + offset);
  return shifted;
 }

 function summarize(days, habits, dateKey, today) {
  const todayKey = dateKey(today);
  const elapsed = (today.getDay() + 6) % 7 + 1;
  const monday = shiftDay(today, 1 - elapsed);
  const week = WEEKDAYS.map((label, index) => {
   const date = shiftDay(monday, index);
   return {label, date, key:dateKey(date), future:index >= elapsed};
  });
  const current = week.slice(0, elapsed);
  const previous = current.map(day => dateKey(shiftDay(day.date, -7)));
  const recorded = Object.keys(days).filter(key =>
   /^\d{4}-\d{2}-\d{2}$/.test(key) && key <= todayKey &&
   habits.some(habit => Boolean(days[key]?.[habit.id]))
  ).sort();
  const sleepScores = current.flatMap(day => {
   const raw = days[day.key]?.sleep?.q;
   const score = typeof raw === 'number' || typeof raw === 'string' ? Number(raw) : NaN;
   return Number.isInteger(score) && score >= 1 && score <= 5 ? [score] : [];
  });
  const sleepAverage = sleepScores.length
   ? sleepScores.reduce((total, score) => total + score, 0) / sleepScores.length
   : null;
  const completionCount = (keys, id) => keys.filter(key => Boolean(days[key]?.[id])).length;
  const first = recorded[0];
  const comparable = Boolean(first && first <= previous[previous.length - 1]);
  const differences = comparable ? habits.map(habit => ({
   name:habit.n,
   difference:completionCount(current.map(day => day.key), habit.id) - completionCount(previous, habit.id)
  })) : [];
  const greatest = Math.max(0, ...differences.map(habit => Math.abs(habit.difference)));
  const changes = greatest ? differences.filter(habit => Math.abs(habit.difference) === greatest) : [];
  return {week, first, total:recorded.length, sleepAverage, sleepCount:sleepScores.length, comparable, changes};
 }

 function metric(label, value, note) {
  return `<div class="card stats-metric">
   <span class="stats-metric-label">${label}</span>
   <strong class="stats-value">${value}</strong>
   <span class="stats-note">${note}</span>
  </div>`;
 }

 function rhythm(week, days, habits, escape) {
  const columns = week.map(day =>
   `<th scope="col" aria-label="${day.key} 星期${day.label}">${day.label}</th>`
  ).join('');
  const rows = habits.map(habit => {
   const cells = week.map(day => {
    const completed = Boolean(days[day.key]?.[habit.id]);
    const label = day.future ? '未來日期' : completed ? '已完成' : '無完成紀錄';
    const dot = day.future ? '' : `<span class="stats-dot ${completed ? 'stats-dot-done' : ''}" aria-hidden="true"></span>`;
    return `<td aria-label="${label}">${dot}</td>`;
   }).join('');
   return `<tr><th scope="row">${escape(SHORT_LABELS[habit.id] || habit.n)}</th>${cells}</tr>`;
  }).join('');
  return `<section class="card stats-rhythm" aria-labelledby="stats-rhythm-title">
   <h3 id="stats-rhythm-title">習慣節奏圖</h3>
   <p class="stats-note">一格代表一天</p>
   <table aria-labelledby="stats-rhythm-title">
    <thead><tr><td></td>${columns}</tr></thead>
    <tbody>${rows}</tbody>
   </table>
   <div class="stats-legend">
    <span><i class="stats-dot stats-dot-done" aria-hidden="true"></i>已完成</span>
    <span><i class="stats-dot" aria-hidden="true"></i>無完成紀錄</span>
    <span><i class="stats-dot stats-dot-future" aria-hidden="true"></i>未來留白</span>
   </div>
  </section>`;
 }

 function render({days, habits, dateKey, escape, today = new Date()}) {
  const result = summarize(days, habits, dateKey, today);
  const shortDate = day => `${day.date.getMonth() + 1}/${day.date.getDate()}`;
  const firstDate = result.first
   ? result.first.replace(/^(\d{4})-(\d{2})-(\d{2})$/, (_, y, m, d) => `首次打卡　${y} 年 ${Number(m)} 月 ${Number(d)} 日`)
   : '還沒有打卡紀錄';
  const sleep = result.sleepAverage === null ? '—' : `${result.sleepAverage.toFixed(1)} / 5`;
  const sleepNote = result.sleepCount ? `依本週已記錄的 ${result.sleepCount} 筆平均` : '本週還沒有睡眠品質紀錄';
  const [change, ...ties] = result.changes;
  const changeNote = change
   ? `比上週同期${change.difference > 0 ? '多' : '少'} ${Math.abs(change.difference)} 天${ties.length ? ` · 另 ${ties.length} 項並列` : ''}`
   : result.comparable ? '各習慣與上週同期的完成天數相同' : '上週同期尚無可比較紀錄';

  return `<section class="weekly-stats">
   <h2>統計</h2>
   <p class="stats-period">本週　${shortDate(result.week[0])}–${shortDate(result.week[6])}</p>
   ${metric('累積打卡天數', `${result.total} 天`, firstDate)}
   ${metric('本週平均睡眠品質', sleep, sleepNote)}
   ${metric('變化最明顯', change ? escape(change.name) : '—', changeNote)}
   ${rhythm(result.week, days, habits, escape)}
   <details class="card stats-backup">
    <summary>資料備份</summary>
    <p class="sm">清除 Safari 網站資料會遺失紀錄，建議定期匯出。</p>
    <button type="button" data-a="export">匯出備份</button>
    <button type="button" data-a="import">還原備份</button>
    <input id="imp" type="file" accept=".json" hidden>
   </details>
  </section>`;
 }

 return {render};
})();
