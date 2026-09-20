/** 가상 데이터 전용 웹앱. 새 스프레드시트에 연결된 프로젝트에서 사용합니다. */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('스프레드시트에서 이 프로젝트를 여세요.');
  PropertiesService.getScriptProperties().setProperty('DATA_SHEET_ID', ss.getId());
  let sheet = ss.getSheetByName('체크인');
  if (!sheet) sheet = ss.insertSheet('체크인');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['timestamp','data_origin','student_id','week','emotion','score','context','request_id']);
    sheet.setFrozenRows(1);
  }
  console.log('설정 완료. Index.html을 추가한 뒤 웹 앱으로 배포하세요.');
}
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index').setTitle('연수용 마음 체크인');
}
function submitCheckin(input) {
  if (!input || typeof input !== 'object') throw new Error('입력 자료가 없습니다.');
  const id = String(input.studentId || '').trim();
  const week = Number(input.week);
  const emotion = String(input.emotion || '');
  const context = String(input.context || '');
  const raw = String(input.score == null ? '' : input.score).trim();
  const score = raw === '' ? '' : Number(raw);
  const requestId = String(input.requestId || '');
  if (!/^S\d{2}$/.test(id)) throw new Error('가상ID는 S01 형식이어야 합니다.');
  if (!Number.isInteger(week) || week < 1 || week > 6) throw new Error('주차를 확인하세요.');
  if (!['편안','기쁨','걱정','속상','말하고 싶지 않음'].includes(emotion)) throw new Error('감정을 선택하세요.');
  if (!['발표 전','짝 활동','개별 활동','쉬는 시간','응답하지 않음'].includes(context)) throw new Error('상황을 선택하세요.');
  if (score !== '' && (!Number.isInteger(score) || score < 1 || score > 5)) throw new Error('점수는 1~5 또는 미응답이어야 합니다.');
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(requestId)) throw new Error('화면을 새로 열고 다시 제출하세요.');
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('DATA_SHEET_ID');
  if (!spreadsheetId) throw new Error('교사가 setup을 먼저 실행해야 합니다.');
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('체크인');
    if (!sheet) throw new Error('수집 시트가 없습니다. setup을 확인하세요.');
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const duplicate = sheet.getRange(2,8,lastRow-1,1).createTextFinder(requestId).matchEntireCell(true).findNext();
      if (duplicate) return {ok:true,message:'이미 저장된 응답입니다.'};
    }
    // 모든 문자열은 허용 목록/패턴을 통과했습니다. 자유입력 텍스트는 저장하지 않습니다.
    sheet.appendRow([new Date(),'synthetic',id,week,emotion,score,context,requestId]);
    SpreadsheetApp.flush();
    return {ok:true,message:'가상 응답 한 건을 저장했습니다.'};
  } finally {
    lock.releaseLock();
  }
}
