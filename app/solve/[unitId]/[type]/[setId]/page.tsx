'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUnitById } from '@/lib/data';
import { generateVocabTest, type VocabTestQuestion } from '@/lib/gemini';
import { speakEnglish } from '@/lib/tts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Volume2, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function SolvePage() {
  const params = useParams();
  const router = useRouter();
  
  const unitId = params.unitId as string;
  const type = params.type as 'vocabulary' | 'grammar' | 'reading';
  const setId = params.setId as string;
  
  const unit = getUnitById(unitId);
  
  const [questions, setQuestions] = useState<VocabTestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // 타이머
  useEffect(() => {
    if (!isLoading && questions.length > 0 && startTime === 0) {
      setStartTime(Date.now());
    }
  }, [isLoading, questions.length, startTime]);

  useEffect(() => {
    if (startTime > 0) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [startTime]);

  // 문제 생성
  useEffect(() => {
    const loadQuestions = async () => {
      if (!unit) return;
      
      setIsLoading(true);
      
      try {
        if (type === 'vocabulary') {
          const words = unit.vocabulary?.coreWords || [];
          
          // 10문제 생성 (API 사용 또는 목업)
          const testQuestions = await generateVocabTest(words, 10);
          setQuestions(testQuestions);
        } else if (type === 'grammar') {
          // Grammar 목업 문제 (임시)
          const grammarQuestions: VocabTestQuestion[] = [
            {
              question: '다음 중 현재진행형으로 올바른 문장은?',
              options: [
                'I am studying English now.',
                'I studying English now.',
                'I am study English now.',
                'I studies English now.'
              ],
              correctAnswer: 'I am studying English now.',
              explanation: '현재진행형은 "be동사 + 동사ing" 형태입니다.'
            },
            {
              question: '빈칸에 들어갈 알맞은 말은? "She ___ to school every day."',
              options: ['go', 'goes', 'going', 'is go'],
              correctAnswer: 'goes',
              explanation: '3인칭 단수 현재형은 동사에 s/es를 붙입니다.'
            },
            {
              question: '다음 문장의 시제는? "I have lived here for 5 years."',
              options: ['현재시제', '과거시제', '현재완료', '미래시제'],
              correctAnswer: '현재완료',
              explanation: '"have + p.p" 형태는 현재완료입니다.'
            },
            {
              question: '빈칸에 들어갈 알맞은 말은? "They ___ playing soccer now."',
              options: ['is', 'am', 'are', 'be'],
              correctAnswer: 'are',
              explanation: 'They는 복수이므로 are를 사용합니다.'
            },
            {
              question: '과거형이 올바르지 않은 것은?',
              options: ['go - went', 'eat - ate', 'run - ran', 'study - studyed'],
              correctAnswer: 'study - studyed',
              explanation: 'study의 과거형은 studied입니다.'
            },
          ];
          setQuestions(grammarQuestions);
        } else if (type === 'reading') {
          // Reading 목업 문제 (임시)
          const readingQuestions: VocabTestQuestion[] = [
            {
              question: '지문의 주제로 가장 적절한 것은?',
              options: [
                '일상생활',
                '여행 경험',
                '학교생활',
                '취미생활'
              ],
              correctAnswer: '일상생활',
              explanation: '전반적으로 일상적인 활동들을 설명하고 있습니다.'
            },
            {
              question: '글쓴이가 아침에 하는 일이 아닌 것은?',
              options: ['양치질', '아침식사', '숙제하기', '학교 가기'],
              correctAnswer: '숙제하기',
              explanation: '숙제는 방과 후에 한다고 나와 있습니다.'
            },
            {
              question: '글쓴이의 점심시간은?',
              options: ['11:30', '12:00', '12:30', '13:00'],
              correctAnswer: '12:30',
              explanation: 'We have lunch at 12:30.'
            },
          ];
          setQuestions(readingQuestions);
        }
      } catch (error) {
        console.error('문제 생성 실패:', error);
        setQuestions([]);
      }
      
      setIsLoading(false);
    };
    
    loadQuestions();
  }, [unit, type]);

  if (!unit) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">단원을 찾을 수 없습니다</h1>
          <Button onClick={() => router.back()} className="mt-4">
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700">문제를 생성하고 있습니다...</p>
            <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">문제를 생성할 수 없습니다</h1>
          <Button onClick={() => router.back()} className="mt-4">
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPercent = Math.round((currentIndex / totalQuestions) * 100);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || isAnswered) return;
    
    setIsAnswered(true);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setWrongAnswers([...wrongAnswers, currentQuestion.id]);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // 완료 - 결과 페이지로 이동
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      router.push(`/result/${unitId}/${type}/${setId}?score=${score}&correct=${correctAnswers}&total=${totalQuestions}&time=${elapsedTime}&wrong=${wrongAnswers.join(',')}`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm gap-2">
                <Clock className="w-4 h-4" />
                {formatTime(elapsedTime)}
              </Badge>
              
              <Badge variant="outline" className="text-sm">
                {currentIndex + 1} / {totalQuestions}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">{unit.title}</span>
              <span className="font-bold text-blue-600">
                정답률: {totalQuestions > 0 ? Math.round((correctAnswers / (currentIndex + (isAnswered ? 1 : 0))) * 100) : 0}%
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>
      </div>

      {/* 문제 */}
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  문제 {currentIndex + 1}
                </CardTitle>
                
                {currentQuestion.type === 'eng-to-kor' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // 문제에서 단어 추출
                      const match = currentQuestion.question.match(/"([^"]+)"/);
                      if (match && match[1]) {
                        speakEnglish(match[1]);
                      }
                    }}
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    발음 듣기
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="p-8">
              {/* 문제 텍스트 */}
              <div className="mb-8">
                <p className="text-xl text-gray-800 leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              {/* 선택지 */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQuestion.correctAnswer;
                  const showResult = isAnswered;
                  
                  let buttonClass = 'w-full p-4 text-left rounded-lg border-2 transition-all ';
                  
                  if (showResult) {
                    if (isCorrect) {
                      buttonClass += 'border-emerald-500 bg-emerald-50 text-emerald-900';
                    } else if (isSelected && !isCorrect) {
                      buttonClass += 'border-red-500 bg-red-50 text-red-900';
                    } else {
                      buttonClass += 'border-gray-200 bg-gray-50 text-gray-500';
                    }
                  } else {
                    if (isSelected) {
                      buttonClass += 'border-blue-500 bg-blue-50 text-blue-900';
                    } else {
                      buttonClass += 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50';
                    }
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={isAnswered}
                      className={buttonClass}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-lg">{option}</span>
                        </div>
                        
                        {showResult && isCorrect && (
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 설명 (답안 제출 후) */}
              {isAnswered && currentQuestion.explanation && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-1">설명</p>
                  <p className="text-sm text-blue-800">{currentQuestion.explanation}</p>
                </div>
              )}

              {/* 버튼 */}
              <div className="mt-8 flex gap-3">
                {!isAnswered ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedAnswer}
                    className="flex-1 h-12 text-lg bg-blue-600 hover:bg-blue-700"
                  >
                    제출하기
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="flex-1 h-12 text-lg bg-emerald-600 hover:bg-emerald-700"
                  >
                    {currentIndex < totalQuestions - 1 ? '다음 문제' : '완료하기'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 진행 통계 */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
                <p className="text-sm text-gray-600">전체 문제</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{correctAnswers}</p>
                <p className="text-sm text-gray-600">정답</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-red-600">{wrongAnswers.length}</p>
                <p className="text-sm text-gray-600">오답</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

