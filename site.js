/* Shared interactions and board drawings for both pages */
(function(){
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = matchMedia("(pointer: fine)").matches;

/* ---------- project data ---------- */
const PROJECTS = [
  {id:"motor", name:"Pico Motor Driver", tag:"In production · PCBWay",
   blurb:"Drives two DC motors or a stepper plus two servos from a Raspberry Pi Pico, on a separate 5–12 V motor supply.",
   chips:["RP2040","DRV8833","Motor control"]},
  {id:"badge", name:"Summit PCB Badge", tag:"In production · PCBWay",
   blurb:"Wearable circuit-board badge for a coding summit, with copper and silkscreen artwork on a custom outline.",
   chips:["Custom outline","PCB art","Events"]},
  {id:"esp", name:"ESP32 Handheld", tag:"Fabricated",
   blurb:"Battery-powered ESP32 handheld with an OLED display and four-button input. Designed, built and running.",
   chips:["ESP32","LiPo power","OLED"]},
  {id:"pulse", name:"Pulse Oximeter Board", tag:"",
   blurb:"Arduino Nano board that reads heart rate and SpO₂ from a MAX30102 sensor and shows them on an OLED.",
   chips:["ATmega328","MAX30102","I²C"]},
  {id:"shield", name:"Pico Robotics Shield", tag:"",
   blurb:"Robot-ready ports for analog, digital, servo and I²C, so students wire sensors to a Pico without a breadboard.",
   chips:["RP2040","Servo","Education"]}
];

/* ---------- board drawing helpers (viewBox 320 x 200) ---------- */
const R=(x,y,w,h,c,rx=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="${c}"/>`;
const C=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" class="${c}"/>`;
const T=(x,y,s,a="middle")=>`<text x="${x}" y="${y}" text-anchor="${a}" class="txt">${s}</text>`;
const P=(d,c="tr")=>`<path d="${d}" class="${c}"/>`;
const row=(x,y,n,dx,dy,s=4)=>{let o="";for(let i=0;i<n;i++)o+=R(x+i*dx-s/2,y+i*dy-s/2,s,s,"pad",1);return o};
const holes=()=>C(22,22,5,"ring")+C(298,22,5,"ring")+C(22,178,5,"ring")+C(298,178,5,"ring");
const edge=()=>R(8,8,304,184,"edge",12);

const DRAW = {
  motor(){
    return edge()+holes()+
      R(40,50,48,104,"ic",3)+row(44,56,10,0,10)+row(84,56,10,0,10)+T(64,106,"PICO")+
      R(150,78,40,30,"ic",2)+row(146,82,4,0,7,3)+row(194,82,4,0,7,3)+T(170,96,"DRV")+
      R(246,40,46,34,"ic",3)+C(259,57,7,"ring")+C(279,57,7,"ring")+
      R(246,112,46,34,"ic",3)+C(259,129,7,"ring")+C(279,129,7,"ring")+
      row(130,168,3,10,0,5)+row(180,168,3,10,0,5)+T(150,160,"SERVO",)+
      P("M84 76 H120 L134 90 H146")+P("M84 96 H118 L126 104 H146","tr thin")+
      P("M194 82 H218 L232 60 H252")+P("M194 103 H218 L232 125 H252")+
      P("M84 126 H104 L118 140 V168 H130","tr thin")+P("M84 136 H96 L110 150 H170 L180 160 V168","tr thin");
  },
  badge(){
    return `<path d="M160 10 L292 54 L292 140 L160 190 L28 140 L28 54 Z" class="edge"/>`+
      C(160,32,7,"ring")+
      `<text x="160" y="112" text-anchor="middle" class="txt" style="font-size:30px;fill-opacity:.9">&lt;/&gt;</text>`+
      P("M60 70 H110 L124 84 V128 L136 140 H184 L196 128 V84 L210 70 H260")+
      P("M70 140 H104 L118 154 H202 L216 140 H250","tr thin")+
      C(60,70,4,"pad")+C(260,70,4,"pad")+C(70,140,4,"pad")+C(250,140,4,"pad")+
      R(150,150,20,10,"ic",2)+T(160,176,"SUMMIT");
  },
  esp(){
    return edge()+holes()+
      R(36,36,70,96,"ic",3)+`<path d="M40 40 H102 V60 H40 Z" fill="none" class="tr thin" style="stroke-dasharray:3 3"/>`+
      row(36,70,7,0,9,3.5)+row(106,70,7,0,9,3.5)+T(71,104,"ESP32")+
      R(150,34,120,58,"ic",4)+T(210,67,"OLED")+
      C(186,128,8,"ring")+C(170,144,8,"ring")+C(202,144,8,"ring")+C(186,160,8,"ring")+
      R(250,140,34,22,"ic",2)+T(267,154,"LiPo")+
      P("M106 80 H128 L140 68 H150")+P("M106 98 H134 L150 114 V128 H178","tr thin")+
      P("M106 116 H124 L150 142 H162","tr thin")+P("M250 150 H226 L214 162 H194","tr thin");
  },
  pulse(){
    return edge()+holes()+
      R(36,56,110,40,"ic",3)+row(44,60,10,10,0,3.5)+row(44,92,10,10,0,3.5)+T(91,80,"NANO")+
      R(180,36,100,52,"ic",4)+T(230,66,"OLED")+
      R(214,122,30,30,"ic",3)+C(229,137,6,"ring")+T(229,166,"MAX30102")+
      C(60,146,8,"ring")+C(92,146,8,"ring")+C(124,146,8,"ring")+
      P("M146 66 H166 L176 56 H180")+P("M146 82 H168 L196 110 V122 H214")+
      P("M60 138 V112 L68 104 H120","tr thin")+P("M124 138 V118 L138 104 H146","tr thin");
  },
  shield(){
    let ports="";
    [["A",40],["D",100],["S",184],["I²C",250]].forEach(([l,x],i)=>{
      for(let k=0;k<3;k++)ports+=row(x,30+k*12,i===3?4:3,10,0,5);
      ports+=T(x+10,82,l);
    });
    return edge()+holes()+ports+
      R(116,100,92,48,"ic",3)+row(122,104,9,10,0,3.5)+row(122,144,9,10,0,3.5)+T(162,128,"PICO")+
      P("M60 66 V90 L82 112 H116")+P("M120 66 V86 L134 100","tr thin")+
      P("M204 66 V86 L190 100","tr thin")+P("M270 66 V90 L248 112 H208")+
      P("M60 160 H260","tr thin");
  }
};

function drawBoard(id){
  return `<svg class="board" viewBox="0 0 320 200" role="img" aria-label="${id} board drawing">${DRAW[id]()}</svg>`;
}

/* measure traces, add travelling pulses, redraw on hover */
function wireBoard(host){
  const svg=host.querySelector("svg.board"); if(!svg) return;
  const trs=[...svg.querySelectorAll(".tr")];
  trs.forEach(p=>{try{p.style.setProperty("--len",Math.ceil(p.getTotalLength())+1)}catch(e){}});
  if(!RM){
    trs.filter(p=>!p.classList.contains("thin")).slice(0,2).forEach((p,i)=>{
      const c=document.createElementNS("http://www.w3.org/2000/svg","circle");
      c.setAttribute("r","2.6");c.setAttribute("class","pulse");
      c.innerHTML=`<animateMotion dur="${2.6+i*.9}s" begin="${i*.8}s" repeatCount="indefinite" path="${p.getAttribute("d")}"/>`;
      svg.appendChild(c);
    });
    const card=host.closest("[data-board-card]")||host;
    card.addEventListener("pointerenter",()=>{host.classList.add("redraw");host.getBoundingClientRect();requestAnimationFrame(()=>host.classList.remove("redraw"))});
  }
}

/* ---------- page-wide effects ---------- */
function init(){
  const bar=document.querySelector(".progress"), nav=document.querySelector("nav.top");
  let ticking=false;
  const onScroll=()=>{ if(ticking) return; ticking=true; requestAnimationFrame(()=>{
    const h=document.documentElement.scrollHeight-innerHeight;
    if(bar) bar.style.setProperty("--p",h>0?scrollY/h:0);
    if(nav) nav.classList.toggle("scrolled",scrollY>8);
    document.dispatchEvent(new CustomEvent("tick"));
    ticking=false;});
  };
  addEventListener("scroll",onScroll,{passive:true}); onScroll();

  if("IntersectionObserver" in window && !RM){
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{rootMargin:"0px 0px -8% 0px"});
    document.querySelectorAll(".rv").forEach(el=>io.observe(el));
  } else document.querySelectorAll(".rv").forEach(el=>el.classList.add("in"));

  document.querySelectorAll(".glow").forEach(el=>el.addEventListener("pointermove",e=>{
    const r=el.getBoundingClientRect();
    el.style.setProperty("--gx",(e.clientX-r.left)+"px");el.style.setProperty("--gy",(e.clientY-r.top)+"px");
  }));

  if(FINE && !RM){
    document.querySelectorAll(".mag").forEach(el=>{
      el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect();
        el.style.setProperty("--mx",((e.clientX-r.left-r.width/2)*.22)+"px");
        el.style.setProperty("--my",((e.clientY-r.top-r.height/2)*.3)+"px");});
      el.addEventListener("pointerleave",()=>{el.style.setProperty("--mx","0px");el.style.setProperty("--my","0px")});
    });
    document.querySelectorAll("[data-tilt]").forEach(el=>{
      el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        el.style.transform=`perspective(900px) rotateX(${(-y*7).toFixed(2)}deg) rotateY(${(x*9).toFixed(2)}deg) translateY(-4px)`;});
      el.addEventListener("pointerleave",()=>{el.style.transform=""});
    });
  }

  const copy=document.getElementById("copy"), addr=document.getElementById("addr");
  if(copy&&addr) copy.addEventListener("click",()=>{
    const done=()=>{copy.textContent="Copied";setTimeout(()=>copy.textContent="Copy email",1600)};
    const sel=()=>{const r=document.createRange();r.selectNodeContents(addr);const s=getSelection();s.removeAllRanges();s.addRange(r)};
    try{navigator.clipboard.writeText(addr.textContent.trim()).then(done,sel)}catch(e){sel()}
  });
}

window.PCB={PROJECTS,drawBoard,wireBoard,init,RM};
})();
