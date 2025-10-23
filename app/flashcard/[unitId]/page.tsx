'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUnitById } from '@/lib/data';
import { getFlashcardProgress, saveFlashcardProgress } from '@/lib/storage';
import { speakEnglish } from '@/lib/tts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RotateCw, Check, X, ArrowLeft, Volume2 } from 'lucide-react';

export default function FlashcardPage() {
  const params = useParams();
  const router = useRouter();
  const unitId = params.unitId as string;
  
  const unit = getUnitById(unitId);
  const vocabulary = unit?.vocabulary?.coreWords || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredWords, setMasteredWords] = useState<string[]>([]);
  const [reviewWords, setReviewWords] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // 로컬스토리지에서 진행상황 불러오기
    const progress = getFlashcardProgress(unitId);
    if (progress) {
      setMasteredWords(progress.masteredWords || []);
      setReviewWords(progress.reviewWords || []);
    }
  }, [unitId]);

  if (!unit || vocabulary.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">단어를 찾을 수 없습니다</h1>
          <Button onClick={() => router.back()} className="mt-4">
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const currentWord = vocabulary[currentIndex];
  const totalWords = vocabulary.length;
  const completedWords = masteredWords.length;
  const progressPercent = Math.round((completedWords / totalWords) * 100);
  const isMastered = masteredWords.includes(currentWord.english);
  const isReview = reviewWords.includes(currentWord.english);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMastered = () => {
    if (!masteredWords.includes(currentWord.english)) {
      const newMastered = [...masteredWords, currentWord.english];
      setMasteredWords(newMastered);
      
      // reviewWords에서 제거
      const newReview = reviewWords.filter(w => w !== currentWord.english);
      setReviewWords(newReview);
      
      // 저장
      saveFlashcardProgress(unitId, newMastered, newReview);
    }
    
    goToNext();
  };

  const handleNeedReview = () => {
    if (!reviewWords.includes(currentWord.english) && !masteredWords.includes(currentWord.english)) {
      const newReview = [...reviewWords, currentWord.english];
      setReviewWords(newReview);
      saveFlashcardProgress(unitId, masteredWords, newReview);
    }
    
    goToNext();
  };

  const goToNext = () => {
    setIsFlipped(false);
    
    if (currentIndex < totalWords - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 마지막 카드면 완료 처리
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsComplete(false);
  };

  const handleFinish = () => {
    // 플래시카드 완료 상태 저장
    saveFlashcardProgress(unitId, masteredWords, reviewWords, true);
    router.back();
  };

  // 완료 화면
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full bg-white shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-emerald-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              플래시카드 완료! 🎉
            </h1>
            
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                <span className="text-gray-700">외운 단어</span>
                <span className="font-bold text-emerald-600 text-xl">
                  {masteredWords.length}개
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700">복습 필요</span>
                <span className="font-bold text-orange-600 text-xl">
                  {reviewWords.length}개
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">완료율</span>
                <span className="font-bold text-blue-600 text-xl">
                  {progressPercent}%
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleRestart}
                variant="outline"
                className="flex-1"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                다시 학습
              </Button>
              
              <Button
                onClick={handleFinish}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                완료하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 플래시카드 화면
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              돌아가기
            </Button>
            
            <Badge variant="outline" className="text-sm">
              {currentIndex + 1} / {totalWords}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">학습 진행도</span>
              <span className="font-bold text-emerald-600">
                {completedWords} / {totalWords} ({progressPercent}%)
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>
      </div>

      {/* 플래시카드 */}
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* 현재 단어 상태 표시 */}
          <div className="flex gap-2 mb-4 justify-center">
            {isMastered && (
              <Badge className="bg-emerald-500">
                <Check className="w-3 h-3 mr-1" />
                외운 단어
              </Badge>
            )}
            {isReview && (
              <Badge variant="outline" className="border-orange-500 text-orange-600">
                <RotateCw className="w-3 h-3 mr-1" />
                복습 필요
              </Badge>
            )}
          </div>

          {/* 카드 */}
          <div
            className="relative cursor-pointer mb-8"
            onClick={handleFlip}
            style={{ perspective: '1000px', minHeight: '400px' }}
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
              }}
            >
              {/* 앞면 - 영어 */}
              <Card
                className={`absolute w-full backface-hidden bg-white shadow-2xl ${
                  !isFlipped ? 'block' : 'hidden'
                }`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <CardContent className="p-12 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <p className="text-6xl font-bold text-blue-600 mb-4">
                      {currentWord.english}
                    </p>
                    {currentWord.pronunciation && (
                      <p className="text-gray-400 text-lg mb-8">
                        {currentWord.pronunciation}
                      </p>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakEnglish(currentWord.english);
                      }}
                    >
                      <Volume2 className="w-4 h-4" />
                      발음 듣기
                    </Button>
                  </div>
                  
                  <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500">카드를 클릭하여 뜻 확인</p>
                    <RotateCw className="w-6 h-6 text-gray-300 mx-auto mt-2" />
                  </div>
                </CardContent>
              </Card>

              {/* 뒷면 - 한글 + 예문 */}
              <Card
                className={`absolute w-full backface-hidden bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl ${
                  isFlipped ? 'block' : 'hidden'
                }`}
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <CardContent className="p-12 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="text-center mb-8">
                    <p className="text-3xl font-bold mb-2">
                      {currentWord.english}
                    </p>
                    <p className="text-5xl font-bold opacity-90">
                      {currentWord.korean}
                    </p>
                  </div>
                  
                  <div className="w-full max-w-md">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                      <p className="text-sm text-white/60 mb-2">예문</p>
                      <p className="text-lg leading-relaxed mb-2">
                        {currentWord.exampleSentence}
                      </p>
                      <p className="text-sm text-white/80 italic">
                        {currentWord.exampleTranslation}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <p className="text-sm text-white/70">이 단어를 외우셨나요?</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 버튼 */}
          {isFlipped && (
            <div className="flex gap-4 max-w-md mx-auto">
              <Button
                onClick={handleNeedReview}
                variant="outline"
                size="lg"
                className="flex-1 h-16 text-lg border-2 border-orange-500 hover:bg-orange-50"
              >
                <X className="w-5 h-5 mr-2" />
                아직이요
              </Button>
              
              <Button
                onClick={handleMastered}
                size="lg"
                className="flex-1 h-16 text-lg bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="w-5 h-5 mr-2" />
                외웠어요!
              </Button>
            </div>
          )}

          {!isFlipped && (
            <div className="text-center">
              <Button
                onClick={handleFlip}
                size="lg"
                variant="outline"
                className="px-8"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                카드 뒤집기
              </Button>
            </div>
          )}

          {/* 진행 통계 */}
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <p className="text-2xl font-bold text-gray-900">{totalWords}</p>
              <p className="text-sm text-gray-600">전체</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg shadow">
              <p className="text-2xl font-bold text-emerald-600">{masteredWords.length}</p>
              <p className="text-sm text-gray-600">외움</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg shadow">
              <p className="text-2xl font-bold text-orange-600">{reviewWords.length}</p>
              <p className="text-sm text-gray-600">복습</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

