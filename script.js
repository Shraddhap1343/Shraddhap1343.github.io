(function(){
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* mobile menu */
  var toggle=document.querySelector(".menu-toggle"),nav=document.getElementById("nav");
  toggle.addEventListener("click",function(){
    var open=nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded",open);
    toggle.textContent=open?"\u2715":"\u2630";
  });
  nav.addEventListener("click",function(e){
    if(e.target.tagName==="A"){nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.textContent="\u2630"}
  });

  /* scroll progress bar */
  var bar=document.getElementById("progress");
  function onScroll(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.transform="scaleX("+(h>0?window.scrollY/h:0)+")";
  }
  window.addEventListener("scroll",onScroll,{passive:true});onScroll();

  /* reveal on scroll, staggered inside grids */
  var items=document.querySelectorAll("section, .skills>div, .project, .item, .certs li, .stat");
  items.forEach(function(el){
    el.classList.add("reveal");
    var p=el.parentElement,i=Array.prototype.indexOf.call(p.children,el);
    if(!el.matches("section"))el.style.transitionDelay=(i*0.12)+"s";
  });
  if("IntersectionObserver" in window&&!reduce){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}});
    },{threshold:0.15});
    items.forEach(function(el){io.observe(el)});
  }else{items.forEach(function(el){el.classList.add("in")})}

  /* active nav link */
  var links=document.querySelectorAll("nav a");
  var secs=["about","skills","projects","experience","resume","contact"].map(function(id){return document.getElementById(id)});
  var nio=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){links.forEach(function(a){a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id)})}
    });
  },{rootMargin:"-40% 0px -55% 0px"});
  secs.forEach(function(s){if(s)nio.observe(s)});

  /* full-size resume viewer */
  var zbtn=document.getElementById("zoomResume"),zoom=document.getElementById("zoom");
  if(zbtn&&zoom){
    var zimg=zoom.querySelector("img");
    var closeZ=function(){zoom.classList.remove("open");document.body.style.overflow="";zbtn.focus()};
    zbtn.addEventListener("click",function(){
      zoom.classList.add("open");document.body.style.overflow="hidden";
      zoom.querySelector(".zoom-close").focus();
    });
    zoom.addEventListener("click",function(e){if(e.target!==zimg)closeZ()});
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&zoom.classList.contains("open"))closeZ()});
  }

  /* count-up numbers */
  document.querySelectorAll(".stat b").forEach(function(b){
    var end=parseFloat(b.dataset.count),dec=parseInt(b.dataset.dec||0,10);
    if(reduce||!("IntersectionObserver" in window))return;
    b.textContent=(0).toFixed(dec);
    new IntersectionObserver(function(es,o){
      if(!es[0].isIntersecting)return;o.disconnect();
      var t0=performance.now();
      (function step(t){
        var p=Math.min((t-t0)/1200,1);
        b.textContent=(end*(1-Math.pow(1-p,3))).toFixed(dec);
        if(p<1)requestAnimationFrame(step);
      })(t0);
    },{threshold:0.6}).observe(b);
  });

  /* contact form opens the visitor's email app */
  var form=document.getElementById("contactForm");
  form.addEventListener("submit",function(e){
    e.preventDefault();
    var n=form.name.value,m=form.msg.value;
    window.location.href="mailto:9303shraddha@gmail.com?subject="+encodeURIComponent("Portfolio message from "+n)+"&body="+encodeURIComponent(m);
  });

  /* typing effect */
  var el=document.getElementById("typed");
  if(reduce||!el)return;
  var words=["full-stack web apps","REST APIs with Spring Boot","React interfaces","database-driven systems"];
  var w=0,c=0,del=false;
  function tick(){
    var word=words[w];
    el.textContent=word.slice(0,c);
    if(!del&&c<word.length){c++;setTimeout(tick,70)}
    else if(!del){del=true;setTimeout(tick,1600)}
    else if(c>0){c--;setTimeout(tick,35)}
    else{del=false;w=(w+1)%words.length;setTimeout(tick,300)}
  }
  setTimeout(tick,900);
})();
