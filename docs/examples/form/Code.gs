/** 연수용 가상 자료 수집. 새 Google 스프레드시트에 연결된 Apps Script에서 실행합니다. */
function createPracticeForm() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!sheet) throw new Error('스프레드시트의 확장 프로그램 > Apps Script에서 실행하세요.');
  const properties = PropertiesService.getScriptProperties();
  const oldId = properties.getProperty('PRACTICE_FORM_ID');
  if (oldId) {
    const oldForm = FormApp.openById(oldId);
    console.log('이미 만든 폼(편집): ' + oldForm.getEditUrl());
    console.log('응답 링크: ' + oldForm.getPublishedUrl());
    return;
  }
  // 비공개 초안으로 만듭니다. 게시·응답자 범위는 폼 화면에서 직접 확인하세요.
  const form = FormApp.create('연수용 마음 체크인 · 가상 자료', false);
  properties.setProperty('PRACTICE_FORM_ID', form.getId());
  form.setDescription('실제 학생 정보 없이 S01 등 가상 ID로 테스트합니다. 점수는 진단 도구가 아닙니다.');
  form.setCollectEmail(false);
  form.setPublishingSummary(false);
  form.setAllowResponseEdits(false);
  form.setShowLinkToRespondAgain(false);
  form.addTextItem().setTitle('가상ID').setRequired(true).setValidation(
    FormApp.createTextValidation().requireTextMatchesPattern('^S[0-9]{2}$')
      .setHelpText('S01처럼 S와 두 자리 숫자만 입력하세요.').build()
  );
  form.addListItem().setTitle('주차').setChoiceValues(['1','2','3','4','5','6']).setRequired(true);
  form.addMultipleChoiceItem().setTitle('감정').setChoiceValues(['편안','기쁨','걱정','속상','말하고 싶지 않음']).setRequired(true);
  form.addScaleItem().setTitle('오늘의 편안함').setBounds(1,5)
    .setLabels('전혀 편안하지 않음','매우 편안함').setRequired(false);
  form.addMultipleChoiceItem().setTitle('상황').setChoiceValues(['발표 전','짝 활동','개별 활동','쉬는 시간','응답하지 않음']).setRequired(true);
  form.setConfirmationMessage('실습 응답을 저장했습니다. 실제 연구 자료가 아닙니다.');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  console.log('폼 편집: ' + form.getEditUrl());
  console.log('응답 링크(게시 후 사용): ' + form.getPublishedUrl());
  console.log('응답 시트: ' + sheet.getUrl());
}
