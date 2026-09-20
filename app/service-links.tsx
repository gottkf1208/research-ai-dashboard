import {brandAssets} from './brand-assets';
import {ArrowUpRight} from 'lucide-react';

export const PADLET_URL='https://padlet.com/gottkf12087/2026-s023fgim98q08n9zokgm';
export const aiServices=[
 {id:'chatgpt',name:'ChatGPT',url:'https://chatgpt.com/'},
 {id:'gemini',name:'Gemini',url:'https://gemini.google.com/app'},
 {id:'claude',name:'Claude',url:'https://claude.ai/'}
] as const;
const brandFiles:Record<string,string>={chatgpt:'chatgpt.svg',gemini:'gemini.svg',claude:'claude.png',padlet:'padlet.svg',mentimeter:'mentimeter.png',google:'google.svg',github:'github.svg'};
export function BrandLogo({brand}:{brand:string}){return brandFiles[brand]?<img className={`service-logo service-logo-${brand}`}  src={brandAssets[brand]} alt='' style={{colorScheme:'light'}} width={brand==='padlet'?76:20} height={20}/>:null;}
export function brandForUrl(url:string){try{const host=new URL(url).hostname;for(const [domain,brand] of [['github.com','github'],['chatgpt.com','chatgpt'],['openai.com','chatgpt'],['gemini.google.com','gemini'],['claude.ai','claude'],['claude.com','claude'],['padlet.com','padlet'],['mentimeter.com','mentimeter'],['menti.com','mentimeter'],['google.com','google']])if(host===domain||host.endsWith('.'+domain))return brand;return '';}catch{return '';}}
export function PadletLink({compact=false}:{compact?:boolean}){return <a className={`btn padlet-link${compact?' compact':''}`} href={PADLET_URL} target='_blank' rel='noopener noreferrer' aria-label='Padlet에 결과물 올리기 (새 창)'><BrandLogo brand='padlet'/><span>결과물 올리기</span><ArrowUpRight size={15}/></a>;}
