'use client';
import {useState} from 'react';
import {ResponsiveContainer,LineChart,Line,CartesianGrid,XAxis,YAxis,Tooltip} from 'recharts';
import {Download,Table2} from 'lucide-react';
import {mindRows,mindWeeks} from './instructor-sample';
// Kept separate from charts.tsx to avoid a module cycle.
function download(text:string,name:string){const url=URL.createObjectURL(new Blob(['\uFEFF'+text],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function MindDashboard(){
 const [show,setShow]=useState(false);
 const raw=['data_origin,student_id,week,emotion,score,context',...mindRows.map(r=>`${r.data_origin},${r.student_id},${r.week},${r.emotion},${r.score??''},${r.context}`)].join('\n');
 const aggregate=['data_origin,week,records,valid,missing,mean',...mindWeeks.map(r=>`synthetic,${r.week},${r.records},${r.valid},${r.missing},${r.mean}`)].join('\n');
 return <div className='dashboard'><div className='dash-head'><div><span className='eyebrow'>강사 시연 · 모두 가상 데이터</span><h3>마음데이터 · 편안함의 변화</h3></div><span className='tag'>1~5 선택 응답</span></div>
  <div className='metric-row'><div><small>가상 학생 / 기록</small><b>3명 / {mindRows.length}건</b></div><div><small>유효 점수</small><b>{mindRows.filter(r=>r.score!==null).length}개</b></div><div><small>미응답</small><b>{mindRows.filter(r=>r.score===null).length}개</b></div></div>
  <div className='chart-area' role='img' aria-label='가상 체크인 주차별 평균: 2.33, 2.50, 3.00, 3.33, 3.50, 3.67'>
   <ResponsiveContainer width='100%' height='100%'><LineChart data={mindWeeks} margin={{top:16,right:20,bottom:10}}><CartesianGrid vertical={false} stroke='#ece5eb'/><XAxis dataKey='label' tick={{fontSize:12}}/><YAxis domain={[1,5]} width={30}/><Tooltip formatter={value=>[value,'편안함 평균']}/><Line dataKey='mean' name='편안함 평균' stroke='#b57e9b' strokeWidth={2.5} dot={{r:4}}/></LineChart></ResponsiveContainer>
  </div><p className='mind-sample-caption'>2주·5주는 유효 응답 2개로 평균을 계산합니다. 감정·상황은 원자료에서 함께 확인하며, 점수의 상승을 교육 효과로 해석하지 않습니다.</p>
  <div className='dash-bottom'><button onClick={()=>setShow(v=>!v)}><Table2 size={15}/>{show?'표 닫기':'수치 보기'}</button><button onClick={()=>download(raw,'강사샘플-마음데이터-synthetic.csv')}><Download size={15}/>원자료 CSV</button><button onClick={()=>download(aggregate,'강사샘플-주차별집계-synthetic.csv')}><Download size={15}/>집계 CSV</button></div>
  {show&&<div className='raw-table'><table><thead><tr>{['주차','기록','유효','미응답','평균'].map(v=><th key={v}>{v}</th>)}</tr></thead><tbody>{mindWeeks.map(r=><tr key={r.week}><td>{r.label}</td><td>{r.records}</td><td>{r.valid}</td><td>{r.missing}</td><td>{r.mean.toFixed(2)}</td></tr>)}</tbody></table><details><summary>가상 원자료 18행</summary><pre>{raw}</pre></details></div>}
 </div>;
}
