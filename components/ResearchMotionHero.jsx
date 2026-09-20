'use client';
import EchoText from './EchoText';
import './ResearchMotionHero.css';

// Editorial hierarchy, not statistical word frequency.
const rows = [
  [['실뜨기', 'small'], ['성장 중심 평가', 'small'], ['영어 말하기', 'small'], ['음운인식', 'small'], ['한글 교육', 'small']],
  [['자기효능감', 'medium'], ['문제해결력', 'medium'], ['기초학력', 'medium'], ['글쓰기 첨삭', 'small']],
  [['음악적 창의성', 'medium'], ['사회정서교육', 'hero'], ['긍정적 행동지원', 'medium']],
  [['질문 중심 수업', 'medium'], ['문해력', 'hero'], ['생성형 AI', 'hero'], ['바이브코딩', 'medium']],
  [['전문적 학습공동체', 'small'], ['프롬프트 설계', 'small'], ['말하기·쓰기·토의', 'small'], ['학습 몰입', 'small'], ['인성 역량', 'small'], ['정서 지능', 'small']],
  [['독서프로그램', 'small'], ['회복적 생활지도', 'small'], ['삶의 만족도', 'small'], ['부산형 IB학교', 'small'], ['맞춤형 학습', 'small']],
  [['시각적 지원', 'small'], ['학교자율시간', 'small'], ['지역 연계 책쓰기', 'small'], ['학교급식 가치', 'small']],
];

export default function ResearchMotionHero() {
  return (
    <section className="research-motion-hero" aria-label="선생님들의 연구주제 키워드">
      <div className="research-keyword-cloud">
        {rows.map((words, rowIndex) => (
          <div className="research-keyword-row" key={rowIndex}>
            {words.map(([text, size], wordIndex) => {
              const seed = rowIndex * 7 + wordIndex;
              const color = size === 'hero' ? '#172c4f' : ['#344f71', '#416b92', '#876579'][seed % 3];
              return (
                <div key={text} className={`research-keyword research-keyword--${size}`}>
                  <EchoText
                    text={text}
                    echoes={9}
                    lag={0.24}
                    offset={36}
                    direction={seed % 2 ? 'left' : 'right'}
                    fade={0.72}
                    blur={2}
                    tint={seed % 2 ? "#edbed7" : "#85c4ec"}
                    mode="pointer"
                    pointerScope="self"
                    cursorRadius={100}
                    duration={900}
                    ease="ease-out"
                    fontSize="inherit"
                    fontWeight={size === 'hero' ? 900 : size === 'medium' ? 750 : 600}
                    color={color}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
