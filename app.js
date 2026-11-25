import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/controls/OrbitControls.js';
const stage=document.querySelector('#stage'),loading=document.querySelector('#loading');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(stage.clientWidth,stage.clientHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;stage.appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=null;
const camera=new THREE.PerspectiveCamera(34,stage.clientWidth/stage.clientHeight,.1,100);camera.position.set(0,1.65,5.4);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,1.35,0);controls.enableDamping=true;controls.dampingFactor=.06;controls.minDistance=2.5;controls.maxDistance=8;
scene.add(new THREE.HemisphereLight(0xffe9f3,0x292035,2));
const key=new THREE.DirectionalLight(0xffe2cf,3.4);key.position.set(-3,5,4);key.castShadow=true;scene.add(key);
const rim=new THREE.DirectionalLight(0xc38bff,2.2);rim.position.set(3,3,-4);scene.add(rim);
const fill=new THREE.PointLight(0xff5d89,1.5,12);fill.position.set(2,1.8,3);scene.add(fill);
const floor=new THREE.Mesh(new THREE.CircleGeometry(4,80),new THREE.MeshStandardMaterial({color:0x342738,roughness:.9}));floor.rotation.x=-Math.PI/2;floor.position.y=-.03;floor.receiveShadow=true;scene.add(floor);
let character=new THREE.Group();scene.add(character);let mode='realistic',pose=0,skin='#f2c6a8',hair='#23151c',outfit='black',bodyBuild=50,height=50,hairLength=70;
function mat(color,rough=.68,metal=0){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal})}
function sphere(parent,name,pos,scale,m){let o=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),m);o.name=name;o.position.set(...pos);o.scale.set(...scale);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function cylinder(parent,name,pos,r1,r2,h,m){let o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,24),m);o.name=name;o.position.set(...pos);o.castShadow=true;parent.add(o);return o}
function segment(parent,name,a,b,r,m){let mid=new THREE.Vector3(...a).add(new THREE.Vector3(...b)).multiplyScalar(.5),len=new THREE.Vector3(...a).distanceTo(new THREE.Vector3(...b));let o=new THREE.Mesh(new THREE.CylinderGeometry(r*.82,r,len,18),m);o.position.copy(mid);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(...b).sub(new THREE.Vector3(...a)).normalize());o.castShadow=true;parent.add(o);sphere(parent,name+' joint',a,[r,r,r],m);return o}
function clearModel(){scene.remove(character);character=new THREE.Group();scene.add(character)}
function createModel(){clearModel();let sm=mat(skin,mode==='realistic'?.52:.9),hm=mat(hair,mode==='realistic'?.35:.75),cloth=mat(outfit==='white'?'#ded8e5':outfit==='red'?'#9c2445':outfit==='fantasy'?'#41566b':'#29232d',.78),accent=mat(outfit==='fantasy'?'#c7a76a':'#8c3e59',.35,.35),boots=mat('#27212c'),eye=mat(mode==='anime'?'#56b9f2':'#392c30',.28);
const s=bodyBuild/50,h=height/50;
// legs and shoes
const hip=1.02*h,legLen=.91*h;
for(let side of [-1,1]){let x=side*.14*s;segment(character,'thigh',[x,hip,0],[x,hip-legLen*.53,0],.105*s,cloth);segment(character,'shin',[x,hip-legLen*.53,0],[x,hip-legLen,0],.075*s,sm);sphere(character,'shoe',[x,hip-legLen-.05,.09],[.09,.07,.17],boots)}
// torso and shoulders
sphere(character,'pelvis',[0,1.05*h,0],[.27*s,.19,.17],cloth);
sphere(character,'torso',[0,1.43*h,0],[.29*s,.36,.18],cloth);
sphere(character,'chest',[0,1.62*h,0],[.31*s,.18,.19],cloth);
sphere(character,'neck',[0,1.82*h,0],[.09,.14,.09],sm);
sphere(character,'head',[0,2.02*h,0],[.16,.22,.145],sm);
sphere(character,'hair cap',[0,2.12*h,-.02],[.17,.16,.15],hm);
sphere(character,'fringe',[0,2.11*h,.12],[.14,.10,.07],hm);
for(let side of [-1,1]){sphere(character,'ear',[side*.16,2.01*h,0],[.045,.07,.04],sm);sphere(character,'eye',[side*.065,2.04*h,.132],[.024,.028,.012],eye);sphere(character,'pupil',[side*.065,2.04*h,.143],[.01,.014,.006],mat('#1b171c'));sphere(character,'cheek',[side*.09,1.99*h,.13],[.04,.025,.009],mat(mode==='anime'?'#e98e9c':'#c87c78'));}
if(hairLength>5){for(let side of [-1,1]){let len=.35+hairLength/100*.55; sphere(character,'hair side',[side*.13,2.00*h-len*.45,-.035],[.085,len*.55,.1],hm);sphere(character,'hair strand',[side*.15,2.02*h-len,-.02],[.05,.11,.07],hm)}}
const armY=1.65*h;for(let side of [-1,1]){let shoulder=[side*.31*s,armY,0],elbow=[side*.48*s,1.35*h,.02],hand=[side*.5*s,1.08*h,.08];sphere(character,'shoulder',shoulder,[.12,.12,.12],cloth);segment(character,'upper arm',shoulder,elbow,.075*s,cloth);segment(character,'forearm',elbow,hand,.06*s,sm);sphere(character,'hand',hand,[.055,.07,.05],sm)}
// hair ponytail and accessory
if(hairLength>45)sphere(character,'back hair',[0,1.83*h,-.14],[.14,.38,.11],hm);
if(outfit==='fantasy'){for(let side of [-1,1])sphere(character,'armor shoulder',[side*.33,1.65*h,0],[.12,.1,.14],accent);cylinder(character,'belt',[0,1.18*h,0],.28,.28,.05,accent)}
// floor ring
character.position.y=0;character.rotation.y=pose===1?.3:pose===2?-.45:0;
}
createModel();loading.classList.add('hidden');
function setMode(m){mode=m;document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===m));document.querySelector('#stylePill').textContent=m.toUpperCase();createModel()}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
document.querySelectorAll('#skinSwatches button').forEach(b=>b.style.background=b.dataset.color);
document.querySelectorAll('#hairSwatches button').forEach(b=>b.style.background=b.dataset.color);
document.querySelectorAll('.swatches button').forEach(b=>b.onclick=()=>{b.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');if(b.parentElement.id==='skinSwatches')skin=b.dataset.color;else hair=b.dataset.color;createModel()});
[['build','buildOut'],['height','heightOut'],['hair','hairOut']].forEach(([id,out])=>{let el=document.getElementById(id);el.oninput=()=>{document.getElementById(out).value=el.value;bodyBuild=+document.getElementById('build').value;height=+document.getElementById('height').value;hairLength=+document.getElementById('hair').value;createModel()}})
document.querySelector('#outfit').onchange=e=>{outfit=e.target.value;createModel()};
document.querySelector('#preset').onchange=e=>{const v=e.target.value;if(v==='fantasy')outfit='fantasy';if(v==='cyber')outfit='red';if(v==='casual')outfit='white';document.querySelector('#outfit').value=outfit;createModel()};
document.querySelector('#background').onchange=e=>{const v=e.target.value;const colors={studio:0x342738,sunset:0x6b3c46,night:0x18253d,forest:0x253e33};floor.material.color.setHex(colors[v]);scene.background=new THREE.Color(v==='night'?'#10192b':v==='sunset'?'#321a28':v==='forest'?'#101e19':'#17111b')};
document.querySelector('#light').oninput=e=>{key.intensity=+e.target.value/25;document.querySelector('#lightOut').value=e.target.value};
document.querySelector('#randomBtn').onclick=()=>{bodyBuild=25+Math.random()*60;height=35+Math.random()*40;hairLength=Math.random()*100;skin=['#f2c6a8','#d69a75','#a96c4d','#704832','#f0d7c8'][Math.floor(Math.random()*5)];hair=['#23151c','#8e4d2b','#d8bd86','#b8c6d7','#c84b66'][Math.floor(Math.random()*5)];document.querySelector('#build').value=bodyBuild;document.querySelector('#height').value=height;document.querySelector('#hair').value=hairLength;document.querySelector('#buildOut').value=Math.round(bodyBuild);document.querySelector('#heightOut').value=Math.round(height);document.querySelector('#hairOut').value=Math.round(hairLength);document.querySelectorAll('#skinSwatches button').forEach(b=>b.classList.toggle('selected',b.dataset.color===skin));document.querySelectorAll('#hairSwatches button').forEach(b=>b.classList.toggle('selected',b.dataset.color===hair));createModel()};
document.querySelector('#poseBtn').onclick=()=>{pose=(pose+1)%3;document.querySelector('#poseBtn').textContent=['Pose: Neutral','Pose: Turn','Pose: Relaxed'][pose];createModel()};
document.querySelector('#resetView').onclick=()=>{camera.position.set(0,1.65,5.4);controls.target.set(0,1.35,0);controls.update()};
document.querySelector('#fullscreen').onclick=()=>{const el=document.querySelector('#viewport');if(el.requestFullscreen)el.requestFullscreen()};
const gallery=document.querySelector('#galleryGrid');let shots=0;
function capture(){const data=renderer.domElement.toDataURL('image/png');shots++;const wrap=document.createElement('div');wrap.className='thumb';const img=document.createElement('img');img.src=data;const label=document.createElement('span');label.textContent='Snapshot '+shots;wrap.append(img,label);gallery.querySelector('.empty-gallery')?.remove();gallery.prepend(wrap);document.querySelector('#galleryCount').textContent=shots+' images';const a=document.createElement('a');a.href=data;a.download='character-studio-'+shots+'.png';a.click()}
document.querySelector('#captureBtn').onclick=capture;document.querySelector('#saveBtn').onclick=capture;
function resize(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)}
new ResizeObserver(resize).observe(stage);
function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera)}animate();
