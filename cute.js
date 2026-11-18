(function(){
var st=document.createElement('style');
st.textContent='@keyframes bdWig{0%,100%{transform:rotate(0)}30%{transform:rotate(-2deg)}60%{transform:rotate(2deg)}}'
+'.bd-hi{padding:0 8px;margin:-8px 0 16px;text-align:center;font-size:14px;color:#8a7fa6;letter-spacing:.5px}'
+'.bd-hi.w{animation:bdWig .4s ease}'
+'.bd-tip{font-size:13px;color:#8a7fa6;margin:8px 0 0;letter-spacing:.3px}'
+'.bd-toast{position:fixed;top:calc(14px + env(safe-area-inset-top));left:50%;transform:translateX(-50%);background:#ffd3c4;color:#6b3f35;padding:10px 18px;border-radius:99px;font-size:14px;font-weight:600;box-shadow:0 6px 16px #f7b7a355;z-index:9;transition:opacity .4s;white-space:nowrap}';
document.head.appendChild(st);

function hello(){var h=new Date().getHours();
 if(h<5)return '夜深了，要早點休息喔 🌙';if(h<11)return '早安 ☀️';if(h<14)return '午安 🍙';if(h<18)return '午後好 🍵';return '晚上好 🌙';}
function streak(){var c=0,d=new Date();if(!count(key(d)))d.setDate(d.getDate()-1);while(count(key(d))>0){c++;d.setDate(d.getDate()-1)}return c}
function lines(){
 var n=count(),l2=Math.max(0,2-n),l3=Math.max(0,3-n),hi=hello();
 if(tab=='today'){
  if(n==0)return [hi+' 今天從一件小事開始就好',hi+' 先喝杯水，再慢慢打卡吧','今天也一起慢慢開花吧 🌸'];
  if(n==1)return ['好的開始！再一項就能解鎖話語 💌','第一朵花開了 🌸 再接再厲'];
  if(n==2)return ['話語解鎖了！再一項就能去環遊世界 🌍','做得好～世界正在等你'];
  if(n<7)return ['已經完成 '+n+' 項了，你好棒 ✨','剩下的隨心就好，不用勉強','今天的你，正在閃閃發光'];
  return ['七項全部完成！今天的你滿分 🎉','全部完成～給自己一個大大的擁抱 🤍'];
 }
 if(tab=='stats'){var s=streak();
  return [s>1?'已經連續記錄 '+s+' 天了，好厲害 🔥':'來看看這陣子的自己吧 📊','每一格都是你留下的足跡','不管高低起伏，都是成長的一部分'];}
 if(tab=='quote'){
  if(l2)return ['再完成 '+l2+' 項，就能來抽一句話 💌','話語扭蛋在等你喔'];
  return ['今天想收到哪一句話呢？','抽一句，帶著它過今天吧 💌','喜歡的話，記得按愛心收藏'];}
 if(tab=='world'){
  if(l3)return ['再完成 '+l3+' 項，就能出發去旅行 ✈️','護照準備好了，只差一點點'];
  var e=S.places.length;return ['準備好出發了嗎？✈️',e?'你已經探索了 '+e+' 個地方':'第一站會是哪裡呢？','今天想去哪個國家看看？'];}
 if(tab=='shelf'){
  var r=S.books.filter(function(b){return b.status=='reading'}).length,d=S.books.filter(function(b){return b.status=='done'}).length;
  return [r?'目前有 '+r+' 本書陪著你 📖':'第一本書在等你喔 📖',d?'已經讀完 '+d+' 本了，真了不起':'讀完的書會收在這裡','翻幾頁也很好，慢慢讀就好'];}
 return [hi];
}

function toast(n){
 var msg;
 if(n==2)msg='💌 話語解鎖了！';else if(n==3)msg='🌍 世界解鎖了！';else if(n==7)msg='🎉 七項全部完成！';
 else{var c=['🌸 太棒了！','✨ 又完成一項！','💗 做得好！','🎈 今天好認真！'];msg=c[Math.floor(Math.random()*c.length)]}
 var t=document.createElement('div');t.className='bd-toast';t.textContent=msg+' 目前 '+n+' / 7';
 document.body.appendChild(t);
 setTimeout(function(){t.style.opacity='0'},1600);setTimeout(function(){t.remove()},2100);
}

var TIPS={
 exercise:{n:['動一動，讓身體也開心一下 🧘🏻‍♀️','伸展五分鐘也算數喔','今天想瑜珈還是跳舞呢？'],d:['身體謝謝你 💗','汗水是最棒的小花肥料 🌱','今天的你，輕盈又有力量']},
 english:{n:['每天一點點，英文就會慢慢開花 📖','今天學一個新單字也很棒','開口說一句英文吧'],d:['Great job! 又前進一步了 ✨','Nice work today 🌟','Well done! 英文也在發芽 🌱']},
 japanese:{n:['今日も少しだけ、がんばろう 🍡','學一句日文，今天就有收穫','五十音也是一種可愛的小圖案'],d:['おつかれさま！今天也很棒 🍡','一步一步，日文也在發芽 🌱','よくがんばったね 💗']},
 sleep:{n:['睡得好，一天的心情都會變好 🌙','記一下昨晚睡得怎麼樣吧','睡眠是最溫柔的充電'],d:['謝謝你照顧自己的睡眠 💤','好好睡覺是最溫柔的事','記下來了，身體會知道你在乎它']},
 taxi:{n:['今天用走的或搭捷運怎麼樣？🚶','少坐一趟，地球也會說謝謝 🌍','走一小段路，順便看看風景'],d:['今天靠自己的腳步出門，好棒 👟','省下的車資，可以買顆小甜點 🍰','地球和荷包都在偷偷開心 ✨']},
 tea:{n:['今天用白開水犒賞自己吧 💧','忍住的這一杯，是給未來的自己 ✨','想喝的時候，先深呼吸三次'],d:['成功忍住了！你好有毅力 🎉','今天的你，比昨天更自律一點 💪','給自己一個大大的讚 👍']},
 book:{n:['翻開幾頁就好，不用讀很多 📖','睡前讀一點，夢也會變溫柔','今天想陪哪一本書呢？'],d:['今天也和書本見面了 📚','文字陪著你，真好 💗','讀書的你，閃閃發亮 ✨']}
};
function pick(arr,seed){var h=0;for(var i=0;i<seed.length;i++)h=(h*31+seed.charCodeAt(i))%9973;return arr[h%arr.length]}

var off=0,lastTab=null,lastN=null,_r=render;
render=function(){
 var n=count();
 if(lastTab=='today'&&tab=='today'&&lastN!==null&&n>lastN)toast(n);
 if(tab!==lastTab)off=Math.floor(Math.random()*3);
 lastTab=tab;lastN=n;
 _r();
 var h2=document.querySelector('#app h2');
 if(h2){var L=lines();h2.insertAdjacentHTML('afterend','<div class="bd-hi" data-a="hi">'+L[off%L.length]+'</div>')}
 if(tab=='today'){
  var cards=document.querySelectorAll('#app .card'),rec=rd();
  HABITS.forEach(function(h,i){
   var card=cards[i+1];if(!card)return;
   var row=card.querySelector('.row'),t=TIPS[h.id];if(!row||!t)return;
   var arr=rec[h.id]?t.d:t.n;
   row.insertAdjacentHTML('afterend','<div class="bd-tip">'+pick(arr,key()+h.id+(rec[h.id]?'d':'n'))+'</div>');
  });
 }
};

window.addEventListener('click',function(e){
 var el=e.target.closest&&e.target.closest('[data-a="hi"]');if(!el)return;
 e.stopPropagation();off++;var L=lines();
 el.textContent=L[off%L.length];el.classList.remove('w');void el.offsetWidth;el.classList.add('w');
},true);

render();
})();
