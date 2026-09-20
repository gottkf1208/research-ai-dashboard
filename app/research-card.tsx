'use client';
import {useState,type CSSProperties} from 'react';
import {ArrowRight,Check,Palette,RotateCcw} from 'lucide-react';
import type {Topic} from './data';
import './research-card.css';

export const cardPalettes=[['로즈','#dc8aaa'],['스카이','#76b4e2'],['라벤더','#a69ad5'],['민트','#79b5a4'],['버터','#dec66b'],['피치','#e4a37e'],['네이비','#36547b'],['실버','#9ca7b5']] as const;
export function ResearchCard({topic,short,color,onColor,onEnter}:{topic:Topic;short:string;color?:string;onColor:(color?:string)=>void;onEnter:()=>void}){
 const [open,setOpen]=useState(false);
 const instructor=topic.instructor;
 return <article className={`research-card customizable-card${instructor?' instructor-card':''}${color?' has-card-color':''}`} style={color?{'--card-color':color} as CSSProperties:undefined}>
  <button type='button' className='research-card-entry' aria-label={instructor?'강사 시연 마음데이터 웹앱 연구실 입장':`${String(topic.id).padStart(2,'0')} ${short} 연구실 입장`} onClick={onEnter}>
   <div className='card-meta'><span className='room-number'>{instructor?'DEMO':String(topic.id).padStart(2,'0')}</span><span>{instructor?'두목쿼카 · 강사 시연':topic.area}</span><span className='card-track'>{instructor?'가상 연구 샘플':topic.track}</span></div>
   <h2>{short}</h2><p className='card-full-title'>{topic.title}</p>
   <div className='card-data'>{(instructor?['동일한 1~7단계','가상 데이터 18행','보고서 작성 예시']:topic.data.slice(0,3)).map(v=><span key={v}>{v}</span>)}</div>
   <div className='card-enter'><span>{instructor?'강사 샘플 연구실 입장':'내 연구실 입장'}</span><ArrowRight size={19}/></div>
  </button>
  {!instructor&&<div className='card-customize'><button type='button' className='card-color-toggle' aria-expanded={open} aria-controls={`colors-${topic.id}`} onClick={()=>setOpen(v=>!v)}><Palette size={14}/>카드 색상<span className='card-current-color' style={{background:color||'#fff'}}/></button>
   {open&&<div id={`colors-${topic.id}`} className='card-color-panel' aria-label={`${short} 카드 색상 선택`}>
    <div className='card-color-swatches'>{cardPalettes.map(([label,value])=><button type='button' key={value} title={label} aria-label={label} aria-pressed={color===value} style={{background:value}} onClick={()=>onColor(value)}>{color===value&&<Check size={14}/>}</button>)}</div>
    <label className='card-custom-color'>직접 선택<input aria-label={`${short} 직접 색상 선택`} type='color' value={color||'#9ca7b5'} onChange={e=>onColor(e.target.value)}/></label>
    <button type='button' className='card-color-reset' onClick={()=>onColor()}><RotateCcw size={12}/>기본색</button>
   </div>}
  </div>}
 </article>;
}
