'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { getUnitById } from '@/lib/data';
import { markSetCompleted } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Clock, 
  Target,
  ArrowRight,
  RotateCw,
  Home
} from 'lucide-react';

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const unitId = params.unitId as string;
  const type = params.type as 'vocabulary' | 'grammar' | 'reading';
  const setId = params.setId as string;
  
  const unit = getUnitById(unitId);
  
  // URL에서 결과 데이터 가져오기
  const score = parseInt(searchParams.get('score') || '0');
  const correct = parseInt(searchParams.get('correct') || '0');
  const total = parseInt(searchParams.get('total') || '10');
  const time = parseInt(searchParams.get('time') || '0');
  const wrongIds = searchParams.get('wrong')?.split(',').filter(Boolean) || [];
  
  // 결과 저장
  useEffect(() => {
    if (unit) {
      // unitId에서 gradeId 추출
      const gradeId = unitId.split('-').slice(0, 2).join('-');
      markSetCompleted(gradeId, unitId, setId, type, score, wrongIds);
    }
  }, [unit, unitId, setId, type, score, wrongIds]);

  if (!unit) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">단원을 찾을 수 없습니다</h1>
          <Button onClick={() => router.push('/')} className="mt-4">
            홈으로 가기
          </Button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'emerald', message: '완벽합니다! 🎉' };
    if (score >= 80) return { grade: 'A', color: 'emerald', message: '훌륭해요! 👏' };
    if (score >= 70) return { grade: 'B+', color: 'blue', message: '잘했어요! 👍' };
    if (score >= 60) return { grade: 'B', color: 'blue', message: '좋아요! 💪' };
    if (score >= 50) return { grade: 'C', color: 'yellow', message: '조금만 더! 📚' };
    return { grade: 'D', color: 'red', message: '복습이 필요해요 🔄' };
  };

  const scoreGrade = getScoreGrade(score);
  const isPassed = score >= 70;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-2xl font-bold text-gray-900">{unit.title}</h1>
          <p className="text-gray-600 mt-1">{setId} 결과</p>
        </div>
      </div>

      {/* 결과 카드 */}
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* 메인 점수 카드 */}
          <Card className={`bg-gradient-to-br ${
            scoreGrade.color === 'emerald' ? 'from-emerald-500 to-teal-600' :
            scoreGrade.color === 'blue' ? 'from-blue-500 to-indigo-600' :
            scoreGrade.color === 'yellow' ? 'from-yellow-500 to-orange-600' :
            'from-red-500 to-pink-600'
          } text-white shadow-2xl`}>
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-90" />
                <h2 className="text-5xl font-bold mb-2">{score}점</h2>
                <p className="text-2xl font-semibold opacity-90">{scoreGrade.grade}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-xl">{scoreGrade.message}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-left bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div>
                  <p className="text-sm opacity-75">정답 / 전체</p>
                  <p className="text-2xl font-bold">{correct} / {total}</p>
                </div>
                <div>
                  <p className="text-sm opacity-75">소요 시간</p>
                  <p className="text-2xl font-bold">{formatTime(time)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 상세 통계 */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-emerald-600">{correct}</p>
                <p className="text-sm text-gray-600 mt-1">정답</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-red-600">{wrongIds.length}</p>
                <p className="text-sm text-gray-600 mt-1">오답</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-blue-600">{time}s</p>
                <p className="text-sm text-gray-600 mt-1">시간</p>
              </CardContent>
            </Card>
          </div>

          {/* 진행률 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                정답률
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">전체 문제</span>
                  <span className="font-bold text-gray-900">{correct} / {total}</span>
                </div>
                <Progress value={score} className="h-3" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">정확도</span>
                  <span className="font-bold text-blue-600">{score}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 오답이 있을 때 */}
          {wrongIds.length > 0 && (
            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-900 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  틀린 문제가 있어요
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-800 mb-4">
                  {wrongIds.length}개의 문제를 틀렸습니다. 오답 노트에서 복습하세요!
                </p>
                <Button
                  variant="outline"
                  className="w-full border-orange-300 hover:bg-orange-100"
                  onClick={() => router.push(`/unit/${unitId}?tab=vocabulary`)}
                >
                  오답 복습하기
                </Button>
              </CardContent>
            </Card>
          )}

          {/* 다음 액션 */}
          <Card>
            <CardHeader>
              <CardTitle>다음 할 일</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isPassed ? (
                <>
                  <Button
                    className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push(`/unit/${unitId}`)}
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    다음 세트 학습하기
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full h-14 text-lg"
                    onClick={() => router.push('/')}
                  >
                    <Home className="w-5 h-5 mr-2" />
                    홈으로 가기
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    70점 이상을 받아야 다음 세트로 넘어갈 수 있어요. 다시 도전해보세요!
                  </p>
                  
                  <Button
                    className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => router.push(`/solve/${unitId}/${type}/${setId}`)}
                  >
                    <RotateCw className="w-5 h-5 mr-2" />
                    다시 풀기
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full h-14 text-lg"
                    onClick={() => router.push(`/unit/${unitId}`)}
                  >
                    단원으로 돌아가기
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* 학습 팁 */}
          {wrongIds.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">💡 학습 팁</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• 틀린 문제는 오답 노트에 저장됩니다</li>
                  <li>• 플래시카드로 다시 한번 단어를 복습하세요</li>
                  <li>• 예문을 소리내어 읽어보면 더 잘 외워집니다</li>
                  <li>• 매일 조금씩 꾸준히 하는 것이 중요해요!</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

