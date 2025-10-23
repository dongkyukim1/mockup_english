// ============================================
// TTS (Text-to-Speech) 서비스
// ============================================

/**
 * 영어 단어/문장을 음성으로 읽어주는 기능
 * Web Speech API 사용
 */

export const speakText = (text: string, lang: string = 'en-US'): void => {
  // 브라우저 지원 체크
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('이 브라우저는 음성 합성을 지원하지 않습니다.');
    return;
  }

  // 이전 음성 정지
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // 언어 설정
  utterance.lang = lang;
  
  // 음성 설정
  utterance.rate = 0.9; // 속도 (0.1 ~ 10)
  utterance.pitch = 1.0; // 음높이 (0 ~ 2)
  utterance.volume = 1.0; // 볼륨 (0 ~ 1)
  
  // 음성 재생
  window.speechSynthesis.speak(utterance);
};

/**
 * 영어 단어 발음 (미국식)
 */
export const speakEnglish = (text: string): void => {
  speakText(text, 'en-US');
};

/**
 * 영어 단어 발음 (영국식)
 */
export const speakEnglishUK = (text: string): void => {
  speakText(text, 'en-GB');
};

/**
 * 한국어 발음
 */
export const speakKorean = (text: string): void => {
  speakText(text, 'ko-KR');
};

/**
 * 현재 재생중인 음성 정지
 */
export const stopSpeaking = (): void => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * 사용 가능한 음성 목록 가져오기
 */
export const getAvailableVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    let voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      resolve(voices);
    } else {
      // 음성 목록 로드 대기
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };
    }
  });
};

/**
 * 특정 음성으로 발음하기
 */
export const speakWithVoice = (
  text: string,
  voiceName?: string,
  options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
  }
): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // 음성 선택
  if (voiceName) {
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.name === voiceName);
    if (voice) {
      utterance.voice = voice;
    }
  }
  
  // 옵션 적용
  if (options) {
    if (options.rate) utterance.rate = options.rate;
    if (options.pitch) utterance.pitch = options.pitch;
    if (options.volume) utterance.volume = options.volume;
  }
  
  window.speechSynthesis.speak(utterance);
};

/**
 * React Hook: useSpeech
 */
export const createSpeechHook = () => {
  return {
    speak: speakEnglish,
    speakUK: speakEnglishUK,
    speakKorean,
    stop: stopSpeaking,
    speakCustom: speakWithVoice,
  };
};

