const cardShop = (() => {
 // The check-in history records earnings. Each redemption stores its original cost.
 function shopPurchases(){
  const purchases=S.shopPurchases;
  if(!purchases||typeof purchases!=='object')return {};
  return Object.fromEntries(SHOP_CARDS.filter(card=>
   Number.isSafeInteger(purchases[card.id])&&purchases[card.id]>0
  ).map(card=>[card.id,purchases[card.id]]));
 }
 function walletBalance(){
  const earned=Object.keys(S.days).reduce((sum,date)=>sum+xp(date),0);
  const spent=Object.values(shopPurchases()).reduce((sum,cost)=>sum+cost,0);
  return earned-spent;
 }
 function walletSummary(){
  const balance=walletBalance();
  return '<p class="shop-balance">🐾 可用喵幣：'+Math.max(0,balance)+'</p>'
   +(balance<0?'<p class="sm">已兌換的小卡會保留，還需補 '+(-balance)+' 喵幣。</p>':'');
 }
 let shopCollection=false, shopSelected=null, shopMessage='';
 function shopImage(card,owned,decorative=false){
  const src='./card-shop/'+card.id+(owned?'-open.webp':'-locked.webp');
  const alt=decorative?'':owned?card.name+'的小貓插畫':'未解鎖剪影';
  return '<img src="'+src+'" alt="'+alt+'">';
 }
 function vShop(){
  const purchases=shopPurchases(), balance=walletBalance();
  const cards=SHOP_CARDS.filter(card=>!shopCollection||purchases[card.id]);
  const tiles=cards.map(card=>{
   const owned=Boolean(purchases[card.id]), missing=card.cost-balance;
   const label=missing>0?'還差 '+missing+' 喵幣':card.cost+' 喵幣';
   const action=owned?'<span class="chip on">已收藏</span>'
    :'<button type="button" class="'+(missing>0?'':'main')+'" data-a="shop-select" data-v="'+card.id+'" aria-label="'+card.name+'，'+label+'">'+label+'</button>';
   return '<article class="card shop-card '+(shopSelected===card.id?'selected':'')+'">'+shopImage(card,owned)+'<h3>'+card.name+'</h3>'+action+'</article>';
  }).join('');
  const selected=SHOP_CARDS.find(card=>card.id===shopSelected);
  const panel=selected?'<section class="card shop-confirm" aria-label="兌換確認"><div class="row">'+shopImage(selected,false,true)
   +'<div><b>'+selected.name+'</b><div class="sm">兌換後剩 '+(balance-selected.cost)+' 喵幣</div></div></div>'
   +'<div class="row"><button type="button" data-a="shop-cancel">取消</button>'
   +'<button type="button" class="main" data-a="shop-confirm">確認兌換 · '+selected.cost+' 喵幣</button></div></section>':'';
  return '<h2>🐾 小卡商店</h2><div class="card c">'+walletSummary()+'<p class="sm">用喵幣收藏小貓的小冒險</p></div>'
   +'<div class="shop-tabs" role="group" aria-label="小卡分類"><button type="button" class="'+(!shopCollection?'main':'')+'" data-a="shop-filter" data-v="all" aria-pressed="'+!shopCollection+'">全部小卡</button>'
   +'<button type="button" class="'+(shopCollection?'main':'')+'" data-a="shop-filter" data-v="collection" aria-pressed="'+shopCollection+'">我的收藏</button></div>'
   +(tiles?'<div class="shop-grid">'+tiles+'</div>':'<div class="card c">還沒有收藏的小卡。</div>')+panel
   +'<p class="shop-status" role="status">'+esc(shopMessage)+'</p>';
 }
 function handleShopAction(action,value){
  const card=SHOP_CARDS.find(item=>item.id===(action==='shop-select'?value:shopSelected));
  const tile=card?'[data-a="shop-select"][data-v="'+card.id+'"]':null;
  let focus=tile;
  shopMessage='';
  if(action==='shop-filter'){
   shopCollection=value==='collection';
   shopSelected=null;
   focus='[data-a="shop-filter"][aria-pressed="true"]';
  }else if(action==='shop-select'){
   if(!card||shopPurchases()[card.id])return;
   const missing=card.cost-walletBalance();
   shopSelected=missing>0?null:card.id;
   if(missing>0)shopMessage='再存 '+missing+' 喵幣，就能兌換「'+card.name+'」。';
   else focus='[data-a="shop-confirm"]';
  }else if(action==='shop-cancel'){
   shopSelected=null;
  }else if(action==='shop-confirm'){
   shopSelected=null;
   const purchases=shopPurchases();
   if(card&&!purchases[card.id]&&walletBalance()>=card.cost){
    const next={...S,shopPurchases:{...purchases,[card.id]:card.cost}};
    if(save(next)){
     S=next;
     shopMessage='已解鎖「'+card.name+'」。';
     focus='[data-a="shop-filter"][data-v="collection"]';
    }else shopMessage='無法儲存這次兌換，請再試一次。';
   }else shopMessage='餘額或收藏已更新，請重新選擇小卡。';
  }
  render();
  const target=focus&&$(focus);
  if(target)target.focus();
 }

 function resetSelection() {
  shopSelected=null;
  shopMessage='';
 }

 return { render:vShop, walletSummary, handleAction:handleShopAction, resetSelection };
})();
