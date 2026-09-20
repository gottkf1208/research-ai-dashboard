'use client';
import {useState} from 'react';
import {Check,ChevronDown,Clipboard,ArrowUpRight} from 'lucide-react';
import {aiServices,BrandLogo} from './service-links';

export function Prompt({title,body}:{title:string;body:string}){
 const [copied,setCopied]=useState(false);
 const [status,setStatus]=useState('');
 async function copy(service?:string){
  try{
   if(navigator.clipboard?.writeText){
    await navigator.clipboard.writeText(body);
   }else{
    const input=document.createElement('textarea');
    input.value=body;input.setAttribute('readonly','');
    input.style.cssText='position:fixed;left:-9999px;top:0';
    document.body.appendChild(input);input.select();
    const ok=document.execCommand('copy');input.remove();
    if(!ok)throw new Error('Copy unavailable');
   }
   setCopied(true);
   setStatus(service?`복사했습니다. ${service} 채팅창에 붙여넣으세요.`:'프롬프트를 복사했습니다.');
  }catch{
   setCopied(false);
   setStatus('자동 복사가 차단됐습니다. 아래 문장을 선택해 복사한 뒤 AI 채팅창에 붙여넣으세요.');
  }
 }
 return <details className='prompt'><summary>{title}<ChevronDown size={17}/></summary><div className='prompt-body'>
  <div className='prompt-actions'><button className='copy' onClick={()=>void copy()}>{copied?<Check size={15}/>:<Clipboard size={15}/>} {copied?'복사했습니다':'프롬프트 복사'}</button>
   <div className='ai-shortcuts' aria-label='내가 쓰는 AI로 가져가기'>{aiServices.map(service=><a key={service.id} className='ai-service' href={service.url} target='_blank' rel='noopener noreferrer' onClick={()=>void copy(service.name)} title={`프롬프트 복사 후 ${service.name} 열기 (새 창)`}><BrandLogo brand={service.id}/><span>{service.name}</span><ArrowUpRight size={12}/></a>)}</div>
  </div>
  <small className='prompt-transfer-hint'>AI 버튼을 누르면 복사하고 새 창을 엽니다. 채팅창에 붙여넣으세요.</small>
  <p className='prompt-status' role='status' aria-live='polite'>{status}</p>
  <pre tabIndex={0}>{body}</pre>
 </div></details>;
}
