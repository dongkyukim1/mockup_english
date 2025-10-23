// ============================================
// 로컬스토리지 진행상황 관리
// ============================================

import type { ProgressData, TodayStats, NextRecommendation } from '@/types';

const STORAGE_KEY = 'aidu-english-progress';

// ============================================
// 1. 진행상황 읽기/쓰기
// ============================================

export const getProgress = (): ProgressData => {
  if (typeof window === 'undefined') {
    return getDefaultProgress();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getDefaultProgress();
    }
    return JSON.parse(stored) as ProgressData;
  } catch (error) {
    console.error('Failed to load progress:', error);
    return getDefaultProgress();
  }
};

export const saveProgress = (progress: ProgressData): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

export const getDefaultProgress = (): ProgressData => {
  return {
    userId: 'guest',
    grades: {},
    totalWordsLearned: 0,
    streakDays: 0,
    lastStudyDate: new Date().toISOString().split('T')[0],
  };
};

// ============================================
// 2. 오늘의 학습 통계
// ============================================

export const getTodayStats = (): TodayStats => {
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];

  // 오늘 학습한 기록이 없으면 초기값
  if (progress.lastStudyDate !== today) {
    return {
      learnedWords: 0,
      completedSets: 0,
      studyTime: 0,
      averageScore: 0,
    };
  }

  // 실제 통계 계산 로직 (추후 구현)
  return {
    learnedWords: progress.totalWordsLearned,
    completedSets: 0, // TODO: 오늘 완료한 세트 수 계산
    studyTime: 0, // TODO: 오늘 학습 시간 계산
    averageScore: 0, // TODO: 오늘 평균 점수 계산
  };
};

// ============================================
// 3. 다음 추천 학습
// ============================================

export const getNextRecommendation = (): NextRecommendation | null => {
  const progress = getProgress();

  // 진행중인 세트가 있는지 확인
  // TODO: 실제 로직 구현

  // 기본 추천: 중1 Lesson 1 Vocabulary
  return {
    type: 'vocabulary',
    gradeId: 'middle-1',
    unitId: 'middle-1-lesson-1',
    setId: 'flashcard',
    message: '중1 - Lesson 1 - 플래시카드로 단어 외우기',
  };
};

// ============================================
// 4. 플래시카드 진행상황
// ============================================

export const markWordAsMastered = (
  gradeId: string,
  unitId: string,
  wordId: string
): void => {
  const progress = getProgress();

  if (!progress.grades[gradeId]) {
    progress.grades[gradeId] = { units: {} };
  }

  if (!progress.grades[gradeId].units[unitId]) {
    progress.grades[gradeId].units[unitId] = {
      vocabulary: {
        flashcardProgress: {
          masteredWords: [],
          reviewWords: [],
          lastReview: new Date().toISOString(),
        },
        completedSets: [],
        scores: {},
        wrongProblems: [],
      },
      grammar: {},
      reading: {
        completedSets: [],
        scores: {},
        wrongProblems: [],
      },
    };
  }

  const flashcardProgress =
    progress.grades[gradeId].units[unitId].vocabulary.flashcardProgress;

  if (!flashcardProgress.masteredWords.includes(wordId)) {
    flashcardProgress.masteredWords.push(wordId);

    // reviewWords에서 제거
    flashcardProgress.reviewWords = flashcardProgress.reviewWords.filter(
      (id) => id !== wordId
    );

    // 총 학습한 단어 수 증가
    progress.totalWordsLearned += 1;
  }

  saveProgress(progress);
};

export const markWordForReview = (
  gradeId: string,
  unitId: string,
  wordId: string
): void => {
  const progress = getProgress();

  if (!progress.grades[gradeId]) {
    progress.grades[gradeId] = { units: {} };
  }

  if (!progress.grades[gradeId].units[unitId]) {
    progress.grades[gradeId].units[unitId] = {
      vocabulary: {
        flashcardProgress: {
          masteredWords: [],
          reviewWords: [],
          lastReview: new Date().toISOString(),
        },
        completedSets: [],
        scores: {},
        wrongProblems: [],
      },
      grammar: {},
      reading: {
        completedSets: [],
        scores: {},
        wrongProblems: [],
      },
    };
  }

  const flashcardProgress =
    progress.grades[gradeId].units[unitId].vocabulary.flashcardProgress;

  if (
    !flashcardProgress.reviewWords.includes(wordId) &&
    !flashcardProgress.masteredWords.includes(wordId)
  ) {
    flashcardProgress.reviewWords.push(wordId);
  }

  saveProgress(progress);
};

// ============================================
// 5. 세트 완료 처리
// ============================================

export const markSetCompleted = (
  gradeId: string,
  unitId: string,
  setId: string,
  setType: 'vocabulary' | 'grammar' | 'reading',
  score: number,
  wrongProblemIds: string[] = []
): void => {
  const progress = getProgress();

  if (!progress.grades[gradeId]) {
    progress.grades[gradeId] = { units: {} };
  }

  if (!progress.grades[gradeId].units[unitId]) {
    progress.grades[gradeId].units[unitId] = {
      vocabulary: {
        flashcardProgress: {
          masteredWords: [],
          reviewWords: [],
          lastReview: new Date().toISOString(),
        },
        completedSets: [],
        scores: {},
        wrongProblems: [],
      },
      grammar: {},
      reading: {
        completedSets: [],
        scores: {},
        wrongProblems: [],
      },
    };
  }

  const unitProgress = progress.grades[gradeId].units[unitId];

  if (setType === 'vocabulary') {
    if (!unitProgress.vocabulary.completedSets.includes(setId)) {
      unitProgress.vocabulary.completedSets.push(setId);
    }
    unitProgress.vocabulary.scores[setId] = score;
    unitProgress.vocabulary.wrongProblems = [
      ...new Set([...unitProgress.vocabulary.wrongProblems, ...wrongProblemIds]),
    ];
  } else if (setType === 'reading') {
    if (!unitProgress.reading.completedSets.includes(setId)) {
      unitProgress.reading.completedSets.push(setId);
    }
    unitProgress.reading.scores[setId] = score;
    unitProgress.reading.wrongProblems = [
      ...new Set([...unitProgress.reading.wrongProblems, ...wrongProblemIds]),
    ];
  }

  // 오늘 날짜 업데이트
  progress.lastStudyDate = new Date().toISOString().split('T')[0];

  saveProgress(progress);
};

// ============================================
// 6. 학습 연속일 체크
// ============================================

export const updateStreak = (): void => {
  const progress = getProgress();
  const today = new Date();
  const lastStudy = new Date(progress.lastStudyDate);

  const diffDays = Math.floor(
    (today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 1) {
    // 하루 연속
    progress.streakDays += 1;
  } else if (diffDays > 1) {
    // 연속 끊김
    progress.streakDays = 1;
  }

  progress.lastStudyDate = today.toISOString().split('T')[0];
  saveProgress(progress);
};

// ============================================
// 7. 단원별 진행상황 조회
// ============================================

export const getUnitProgress = (unitId: string) => {
  const progress = getProgress();
  
  for (const gradeId in progress.grades) {
    const unitProgress = progress.grades[gradeId].units[unitId];
    if (unitProgress) {
      return unitProgress;
    }
  }
  
  return null;
};

// ============================================
// 8. 플래시카드 진행상황 조회/저장
// ============================================

export const getFlashcardProgress = (unitId: string) => {
  const unitProgress = getUnitProgress(unitId);
  return unitProgress?.vocabulary?.flashcardProgress || null;
};

export const saveFlashcardProgress = (
  unitId: string,
  masteredWords: string[],
  reviewWords: string[],
  isCompleted: boolean = false
) => {
  const progress = getProgress();
  
  // unitId에서 gradeId 추출 (예: middle-1-lesson-1 → middle-1)
  const gradeId = unitId.split('-').slice(0, 2).join('-');
  
  if (!progress.grades[gradeId]) {
    progress.grades[gradeId] = { units: {} };
  }
  
  if (!progress.grades[gradeId].units[unitId]) {
    progress.grades[gradeId].units[unitId] = {
      vocabulary: {
        flashcardProgress: {
          masteredWords: [],
          reviewWords: [],
          lastReview: new Date().toISOString(),
        },
        completedSets: [],
        scores: {},
        wrongProblems: [],
      },
      grammar: {},
      reading: {
        completedSets: [],
        scores: {},
        wrongProblems: [],
      },
    };
  }
  
  const unitData = progress.grades[gradeId].units[unitId];
  
  unitData.vocabulary.flashcardProgress = {
    masteredWords,
    reviewWords,
    lastReview: new Date().toISOString(),
  };
  
  // 플래시카드 완료 처리
  if (isCompleted && !unitData.vocabulary.completedSets.includes('flashcard')) {
    unitData.vocabulary.completedSets.push('flashcard');
  }
  
  // 총 학습 단어 수 업데이트
  progress.totalWordsLearned = masteredWords.length;
  progress.lastStudyDate = new Date().toISOString().split('T')[0];
  
  saveProgress(progress);
};

// ============================================
// 9. 진행상황 초기화 (테스트용)
// ============================================

export const resetProgress = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

