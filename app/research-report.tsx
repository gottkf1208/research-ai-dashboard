'use client';

import {useState} from 'react';
import {ArrowLeft,ArrowRight,Download,FileText} from 'lucide-react';
import type {Topic} from './data';
import type {Design} from './workshop';
import {Prompt} from './practice-prompt';
import {saveText} from './charts';
import './research-report.css';

type Field={id:string;label:string;hint:string;short?:boolean};
type Section={id:string;title:string;note:string;fields:Field[]};
const key=(id:string)=>`보고서:${id}`;

// Headings follow the supplied HWPX form, including front matter and back matter.
export function reportSections(topic:Topic,d:Design):Section[]{return [
 {id:'cover',title:'표지',note:'특별연구년 특별연수 최종보고서 · 서식 1-3 · 20매 내외',fields:[
  {id:'title',label:'특별연구년 특별연수 개인연구 제목',hint:topic.title,short:true},
  {id:'affiliation',label:'소속',hint:'연구자 소속',short:true},
  {id:'author',label:'성명',hint:'연구자 성명',short:true},
  {id:'advisor-affiliation',label:'지도교수 소속',hint:'지도교수 소속',short:true},
  {id:'advisor',label:'지도교수 성명',hint:'지도교수 성명',short:true}]},
 {id:'summary',title:'□ 요약',note:'본문을 작성한 뒤 연구 목적·내용·결과를 간결하게 요약합니다.',fields:[
  {id:'summary-purpose',label:'연구 목적',hint:`이 연구에서 확인하려는 질문: ${d.question}`},
  {id:'summary-content',label:'연구 내용',hint:'실제로 수행한 대상·기간·절차·분석 내용을 간결하게 정리합니다.'},
  {id:'summary-results',label:'연구 결과',hint:`실제 자료에서 확인한 핵심 결과를 요약합니다. 확인할 지표 제안: ${d.metric}`}]},
 {id:'policy',title:'□ 정책 제안',note:'원본의 세 항목에 맞춰 작성합니다. 연구 결과와 연결되는 제안을 적습니다.',fields:[
  ...[1,2,3].map(n=>({id:`policy-${n}`,label:`정책 제안 ${n}`,hint:'실행 주체 → 제안 내용 → 연구 근거 → 필요한 지원·적용 조건. 근거가 없으면 비워둡니다.'}))]},
 {id:'contents',title:'□ 차례',note:'전체 차례·표 차례·그림 차례를 각각 작성합니다. 쪽수는 최종 편집 후 확정합니다.',fields:[
  {id:'contents-main',label:'전체 차례',hint:'Ⅰ. 서론\nⅡ. 이론적 배경과 선행연구 고찰\nⅢ. 연구 방법\nⅣ. 연구 결과\nⅤ. 결론 및 제언\n□ 참고 문헌\n□ 부록\n실제 소제목과 쪽수를 함께 정리합니다.'},
  {id:'contents-tables',label:'표 차례',hint:'표 번호 / 표 제목 / 최종 쪽수'},
  {id:'contents-figures',label:'그림 차례',hint:'그림 번호 / 그림 제목 / 최종 쪽수'}]},
 {id:'intro',title:'Ⅰ. 서론',note:'필요성과 목적, 연구 과제, 용어, 제한점을 구분합니다.',fields:[
  {id:'intro-purpose',label:'1. 연구의 필요성 및 목적',hint:`${topic.title}\n현장에서 확인한 문제와 근거, 연구가 필요한 이유, 연구 목적을 연결합니다.`},
  {id:'intro-questions',label:'2. 연구 과제',hint:`연구 질문 제안: ${d.question}\n실제 연구계획에 맞게 확정한 과제를 번호로 정리합니다.`},
  {id:'intro-terms',label:'3. 용어의 정의',hint:'핵심 개념의 출처와 이 연구에서 관찰·측정하는 의미를 구분합니다.'},
  {id:'intro-limits',label:'4. 연구의 제한점',hint:`검토할 점: ${topic.caution}\n대상·기간·방법·해석 범위의 제한을 적습니다.`}]},
 {id:'theory',title:'Ⅱ. 이론적 배경과 선행연구 고찰',note:'직접 확인한 원문을 바탕으로 개념과 선행연구를 정리합니다.',fields:[
  {id:'theory-discussion',label:'1. 연구 주제에 대한 논의',hint:`검토할 이론·관점 제안: ${d.theory}\n정의, 핵심 주장, 이 연구에 적용할 관점과 출처를 적습니다.`},
  {id:'theory-review',label:'2. 선행 연구 고찰',hint:'저자·연도 / 대상·방법 / 주요 결과 / 한계 / 본 연구와의 관련성. 실제 확인한 문헌만 기록합니다.'}]},
 {id:'method',title:'Ⅲ. 연구 방법',note:'계획이 아닌 실제로 수행한 연구의 대상과 절차를 기록합니다.',fields:[
  {id:'method-participants',label:'1. 연구 대상',hint:'대상의 선정 기준·규모·특성, 연구 맥락과 기간을 실제 기록에 따라 작성합니다.'},
  {id:'method-analysis',label:'2. 자료의 수집과 분석',hint:`설계 제안 — 분석 단위: ${d.unit}\n자료 항목: ${d.fields}\n시점·방법: ${d.sampling}\n실제 사용한 도구·절차·분석 방법·제외 기준·연구 윤리를 적습니다.`}]},
 {id:'results',title:'Ⅳ. 연구 결과',note:'연구 과제에 대응해 실제 결과와 근거를 제시합니다. 원본에는 고정된 하위 목차가 없습니다.',fields:[
  {id:'results',label:'연구 결과',hint:`확인할 지표 제안: ${d.metric}\n연구 과제별 결과 → 실제 표·그림·관찰·인용 근거 → 해석 → 반례와 대안 설명을 정리합니다. 가상 데이터는 제외합니다.`}]},
 {id:'conclusion',title:'Ⅴ. 결론 및 제언',note:'확인한 결과의 범위 안에서 결론과 적용·후속 연구 제언을 작성합니다.',fields:[
  {id:'conclusion',label:'결론 및 제언',hint:`각 연구 과제에 대한 답, 결과의 의미, 적용 조건, 후속 연구를 연결합니다.\n검토할 실행 방향 제안: ${d.action}\n상관이나 단순 전후 차이를 인과 효과로 단정하지 않습니다.`}]},
 {id:'references',title:'□ 참고 문헌',note:'본문에서 실제로 인용한 문헌의 서지사항을 원문과 대조합니다.',fields:[
  {id:'references',label:'참고 문헌',hint:'저자·연도·제목·발행처·권호·쪽수·DOI/URL 등을 기록합니다. 존재와 내용을 확인하지 못한 문헌은 포함하지 않습니다.'}]},
 {id:'appendix',title:'□ 부록',note:'본문을 뒷받침하는 실제 자료와 산출물을 정리합니다.',fields:[
  {id:'appendix',label:'부록',hint:`예상 산출물: ${topic.output}\n실제 사용한 도구, 문항·루브릭, 자료 사전, 프로그램·개발물, AI 활용·교사 수정 기록 등의 제목과 첨부 위치를 정리합니다.`}]}
 ];}

export function createReportDraft(topic:Topic,d:Design,memo:Record<string,string>){
 return `# 특별연구년 특별연수 최종보고서\n\n서식 1-3 · 20매 내외\n\n${reportSections(topic,d).map(s=>`## ${s.title}\n\n${s.fields.map(f=>`### ${f.label}\n\n${memo[key(f.id)]?.trim()||(f.id==='title'?topic.title:'[미작성]')}`).join('\n\n')}`).join('\n\n')}\n`;
}

export function createReportPrompt(topic:Topic,d:Design,memo:Record<string,string>){
 const sections=reportSections(topic,d);
 // Cover identities stay out of the AI prompt; they are only part of the local draft.
 const supplied=sections.filter(s=>s.id!=='cover').flatMap(s=>s.fields.filter(f=>memo[key(f.id)]?.trim()).map(f=>`${s.title} / ${f.label}\n${memo[key(f.id)]}`));
 return `다음 공식 양식에 맞춰 특별연구년 특별연수 최종보고서 초안을 작성해줘.\n연구 제목: ${memo[key('title')]?.trim()||topic.title}\n분량 안내: 20매 내외. 글자 수만으로 쪽수를 보장하지 말고 최종 편집에서 조정해줘.\n\n[지켜야 할 목차]\n${sections.map(s=>`${s.title}\n${s.fields.map(f=>`  ${f.label}`).join('\n')}`).join('\n')}\n\n[이 연구실의 설계 제안 — 수행 사실이나 결과가 아님]\n연구 질문: ${d.question}\n분석 단위: ${d.unit}\n자료 수집 제안: ${d.sampling}\n지표 제안: ${d.metric}\n이론 검토 제안: ${d.theory}\n예상 산출물: ${topic.output}\n해석 시 검토할 점: ${topic.caution}\n\n[연구자가 작성한 메모 — 첨부 근거와 대조할 것]\n${supplied.join('\n\n')||'아직 작성한 본문 메모가 없음.'}\n\n[작성 조건]\n1. 내가 첨부한 실제 원자료·분석표·수행 기록·원문과 위 메모를 대조해 작성해줘. 메모만으로 확인되지 않는 결과는 [근거 확인 필요]로 남겨줘.\n2. 제공하지 않은 대상 수, 기간, 수치, 통계적 유의성, 인용, 참고 문헌, 쪽수는 만들지 말고 [확인 필요]로 표시해줘. 화면의 가상 데이터와 설계 제안은 연구 결과로 쓰지 마.\n3. Ⅰ~Ⅲ의 소목차 명칭과 순서를 유지해줘. Ⅳ·Ⅴ의 세부 소제목은 자료에 맞춰 제안하되 공식 양식에서 지정한 것으로 설명하지 마.\n4. 요약의 연구 목적·연구 내용·연구 결과를 구분해줘. 정책 제안 세 칸은 결과의 근거, 실행 주체, 실행 내용, 적용 조건을 연결하고 근거가 부족하면 [추가 근거 필요]로 남겨줘.\n5. 전체 차례·표 차례·그림 차례를 분리하고 쪽수는 [편집 후 확정]으로 둬. 참고 문헌에는 실제 확인하고 본문에서 인용한 자료만 넣어줘.\n6. 관찰 사실과 해석, 반례와 대안 설명, 제한점을 구분해줘. 부록에는 실제 사용한 도구·개발물·자료 사전·AI 활용 및 교사 수정 기록의 목록을 제안해줘.\n7. 제공되지 않은 표지의 소속·성명·지도교수 정보는 [직접 입력]으로 둬. 마지막에 연구자가 확인할 미완성 항목을 정리해줘.`;
}

export function ResearchReport({topic,design,memo,onChange,onDownloadNotes}:{topic:Topic;design:Design;memo:Record<string,string>;onChange:(key:string,value:string)=>void;onDownloadNotes:()=>void}){
 const [selected,setSelected]=useState(0);
 const sections=reportSections(topic,design),section=sections[selected];
 const legacy=['연구 결과로 확인한 사실','교사가 수정한 내용','다음 실행'].filter(k=>memo[k]);
 return <div className='report-workspace'>
  <div className='report-toolbar'><div><span className='eyebrow'>서식 1-3 · 특별연구년 특별연수</span><h2>최종보고서 작성</h2><p>원본 양식의 순서대로 작성하고, 항목별 초안을 모아 저장하세요.</p></div><div className='report-actions'>
   <a className='btn' href='./templates/final-report.hwpx' download='특별연구년-최종보고서-원본양식.hwpx'><FileText size={16}/>원본 양식</a>
   <button className='btn primary' onClick={()=>saveText(createReportDraft(topic,design,memo),`연구-${topic.id}-최종보고서-초안.md`)}><Download size={16}/>작성 초안 저장</button>
  </div></div>
  <div className='report-layout'>
   <nav className='report-outline' aria-label='최종보고서 목차'><span className='report-outline-label'>양식 목차 <small>20매 내외</small></span>{sections.map((s,i)=><button key={s.id} type='button' className={i===selected?'active':''} aria-current={i===selected?'step':undefined} onClick={()=>setSelected(i)}>{s.title}</button>)}</nav>
   <div className='report-editor'>
    <section className='panel' aria-label={section.title}><div className='report-section-heading'><h3>{section.title}</h3><span>{selected+1} / {sections.length}</span></div><p className='report-section-note'>{section.note}</p>
     <div className={section.id==='cover'?'report-cover-fields':''}>{section.fields.map(f=><label key={f.id} className='note-label' htmlFor={`report-${topic.id}-${f.id}`}>{f.label}<textarea id={`report-${topic.id}-${f.id}`} rows={f.short?2:f.id==='results'||f.id==='conclusion'?9:5} value={memo[key(f.id)]??(f.id==='title'?topic.title:'')} placeholder={f.hint} onChange={e=>onChange(key(f.id),e.target.value)}/></label>)}</div>
     <div className='report-section-paging'><button type='button' className='btn' disabled={selected===0} onClick={()=>setSelected(n=>n-1)}><ArrowLeft size={15}/>이전 항목</button><small>작성 내용은 이 브라우저에 자동 저장됩니다.</small><button type='button' className='btn' disabled={selected===sections.length-1} onClick={()=>setSelected(n=>n+1)}>다음 항목<ArrowRight size={15}/></button></div>
    </section>
    <Prompt title='이 양식으로 보고서 초안 작성하기' body={createReportPrompt(topic,design,memo)}/>
    <p className='report-help'>안내 문구는 주제별 작성 제안입니다. 초안 저장은 Markdown 파일이며, 최종 제출본은 원본 HWPX에서 서식과 쪽수를 정리해주세요.</p>
    {legacy.length>0&&<details className='report-legacy'><summary>이전에 작성한 보고서 메모</summary>{legacy.map(k=><label key={k} className='note-label'>{k}<textarea rows={3} value={memo[k]} onChange={e=>onChange(k,e.target.value)}/></label>)}</details>}
    <button type='button' className='btn report-notes-download' onClick={onDownloadNotes}><Download size={15}/>이 연구의 전체 실습 기록 저장</button>
   </div>
  </div>
 </div>;
}
