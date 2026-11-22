import{mkdirSync as a,readFileSync as b,readdirSync as c,writeFileSync as d}from'node:fs';
import{join as e}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output',
// Per-opcode layout packed as one decimal number: hundreds digit = immediate bytes, tens = pops, ones = pushes.
// Missing indices are opcodes that do not exist. (imm*100 + pops*10 + pushes)
T=[0,101,401,10,12,22,23,33,,,,,,,,,21,21,21,21,21,21,21,11,21,21,21,11,21,21,21,,21,21,21,,,,,,,,,,,,,,200,210,210,200,0,,,,,,,,,,,,11,20,,,,,,,,,,,,,,,10,10,1,10];
function run(p,q){
const n=p.length,S=new Int32Array(256),C=new Int32Array(64),m=new Int32Array(256),o=new Uint8Array(65536);
let s=0,c=0,l=0,i=0,g=0,st=0,x=-1;
while(x<0){
if(st>999999){x=10;break}
if(g<0||g>=n){x=9;break}
const op=p[g],t=T[op];
if(t===undefined){x=5;break}
const im=t/100|0;
if(g+im>=n){x=9;break}
st++;
const po=t/10|0;
if(s<po%10){x=2;break}
if(s-po%10+t%10>256){x=3;break}
const z=g+1+im;g=z;
switch(op){
case 0:x=0;break;
case 1:S[s++]=(p[z-1]<<24)>>24;break;
case 2:S[s++]=p[z-4]|p[z-3]<<8|p[z-2]<<16|p[z-1]<<24;break;
case 3:s--;break;
case 4:S[s]=S[s-1];s++;break;
case 5:{const v=S[s-1];S[s-1]=S[s-2];S[s-2]=v;break}
case 6:S[s]=S[s-2];s++;break;
case 7:{const v=S[s-3];S[s-3]=S[s-2];S[s-2]=S[s-1];S[s-1]=v;break}
case 23:S[s-1]=-S[s-1]|0;break;
case 27:S[s-1]=~S[s-1];break;
case 48:case 49:case 50:{
const r=(p[z-2]|p[z-1]<<8)<<16>>16;let j=1;
if(op>48){const v=S[--s];j=op==49?v==0:v!=0}
if(j)g=z+r;
break}
case 51:if(c>63)x=7;else{C[c++]=z;g=p[z-2]|p[z-1]<<8}break;
case 52:if(c<1)x=8;else g=C[--c];break;
case 64:{const v=S[s-1];if(v<0||v>255)x=6;else S[s-1]=m[v];break}
case 65:{const v=S[s-1];if(v<0||v>255)x=6;else{m[v]=S[s-2];s-=2}break}
case 80:{const w=''+S[s-1];if(l+w.length>65536)x=11;else{s--;for(let k=0;k<w.length;k++)o[l++]=w.charCodeAt(k)}break}
case 81:if(l>65535)x=11;else o[l++]=S[--s]&255;break;
case 82:S[s++]=i<q.length?q[i++]:-1;break;
case 83:x=S[--s]&255;break;
default:{
const B=S[s-1],A=S[s-2];let r=0;
if(op==16)r=A+B|0;
else if(op==17)r=A-B|0;
else if(op==18)r=Math.imul(A,B);
else if(op==19){if(!B){x=4;break}r=A==-2147483648&&B==-1?A:A/B|0}
else if(op==20){if(!B){x=4;break}r=B==-1?0:A%B|0}
else if(op==21){if(!B){x=4;break}r=Math.floor((A>>>0)/(B>>>0))|0}
else if(op==22){if(!B){x=4;break}r=(A>>>0)%(B>>>0)|0}
else if(op==24)r=A&B;
else if(op==25)r=A|B;
else if(op==26)r=A^B;
else if(op==28)r=A<<(B&31);
else if(op==29)r=A>>(B&31);
else if(op==30)r=A>>>(B&31)|0;
else if(op==32)r=A==B?1:0;
else if(op==33)r=A<B?1:0;
else r=(A>>>0)<(B>>>0)?1:0;
s--;S[s-1]=r;
}}}
return[o.slice(0,l),x]}
for(const id of c(I).sort()){
const[u,x]=run(b(e(I,id,'program.bin')),b(e(I,id,'input.bin')));
a(e(O,id),{recursive:true});d(e(O,id,'stdout.bin'),u);d(e(O,id,'exit.txt'),x+'\n')}
