"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Brain, BookMarked, Trophy, TrendingUp, Target, Library, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { GRADES, ALL_UNITS } from '@/lib/data';
import { getProgress, getTodayStats, getNextRecommendation } from '@/lib/storage';
import type { Grade, TextbookUnit } from '@/types';

export default function HomePage() {
  const [progress, setProgress] = useState(getProgress());
  const [todayStats, setTodayStats] = useState(getTodayStats());
  const [nextRecommendation, setNextRecommendation] = useState(getNextRecommendation());
  const [expandedGradeIndex, setExpandedGradeIndex] = useState<number | null>(null);

  useEffect(() => {
    setProgress(getProgress());
    setTodayStats(getTodayStats());
    setNextRecommendation(getNextRecommendation());
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침이에요!';
    if (hour < 18) return '오늘도 힘내볼까요?';
    return '오늘 하루도 수고했어요!';
  };

  const getGradeProgress = (gradeId: string) => {
    const gradeProgress = progress.grades[gradeId];
    if (!gradeProgress) return { completed: 0, total: 0, percentage: 0 };

    const units = ALL_UNITS[gradeId] || [];
    let totalSets = 0;
    let completedSets = 0;

    units.forEach((unit) => {
      if (unit.isMock) return; // 목업은 제외

      // Vocabulary: flashcard + Set A + Set B = 3 sets
      totalSets += 3;
      // Grammar: 각 grammar point 마다 Set A + B = 2 sets
      totalSets += unit.grammar.length * 2;
      // Reading: Set A + B = 2 sets
      totalSets += 2;

      const unitProgress = gradeProgress.units[unit.id];
      if (unitProgress) {
        completedSets += unitProgress.vocabulary?.completedSets?.length || 0;
        completedSets += Object.values(unitProgress.grammar || {}).reduce(
          (sum, g) => sum + (g.completedSets?.length || 0),
          0
        );
        completedSets += unitProgress.reading?.completedSets?.length || 0;
      }
    });

    const percentage = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
    return { completed: completedSets, total: totalSets, percentage };
  };

  return (
    <div className="min-h-screen english-pattern-bg p-6">
      {/* 헤더 */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getGreeting()}
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                영어 학습을 시작해볼까요?
              </p>
            </div>
          </div>
        </div>

        {/* 오늘의 학습 현황 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* 오늘의 성과 */}
          <Card className="english-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span>오늘의 성과</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">외운 단어</span>
                <div className="flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-emerald-500" />
                  <span className="text-xl font-bold text-emerald-600">
                    {todayStats.learnedWords}개
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">완료한 세트</span>
                <span className="text-xl font-bold text-blue-600">
                  {todayStats.completedSets}개
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">학습 시간</span>
                <span className="text-xl font-bold text-purple-600">
                  {todayStats.studyTime}분
                </span>
              </div>
              <div className="pt-3 border-t">
                <span className="text-sm text-gray-500">학습 연속일</span>
                <div className="flex items-center gap-2 mt-1">
                  <Award className="w-5 h-5 text-orange-500" />
                  <span className="text-lg font-bold text-orange-600">
                    {progress.streakDays}일
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 다음 추천 학습 */}
          <Card className="english-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span>다음 추천 학습</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">추천 세트</span>
                <div className="font-medium text-lg text-gray-800 mt-1">
                  {nextRecommendation?.message || '학습을 시작하세요!'}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-indigo-400">
                <div className="text-sm font-semibold text-indigo-900 mb-1 flex items-center gap-2">
                  💡 학습 팁
                </div>
                <div className="text-sm text-indigo-800">
                  플래시카드로 단어를 먼저 외운 후 문제를 풀면 더 효과적이에요!
                </div>
              </div>
              {nextRecommendation && (
                <Link href={`/grade/${nextRecommendation.gradeId}`}>
                  <Button className="w-full english-button-primary" size="lg">
                    바로 시작하기
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* 전체 학습 진행 */}
          <Card className="english-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span>전체 진행 현황</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold english-gradient-text mb-1">
                  {progress.totalWordsLearned}개
                </div>
                <div className="text-sm text-gray-600">총 학습한 단어</div>
              </div>
              <div className="pt-3 border-t">
                <span className="text-sm text-gray-500 mb-2 block">학년별 진행도</span>
                <div className="space-y-2">
                  {GRADES.filter((g) => !g.isMock).map((grade) => {
                    const gradeProgress = getGradeProgress(grade.id);
                    return (
                      <div key={grade.id}>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{grade.name}</span>
                          <span className="font-semibold">{gradeProgress.percentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full english-progress transition-all duration-500"
                            style={{ width: `${gradeProgress.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 학년 리스트 */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg">
              <Library className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              학년별 학습
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GRADES.map((grade) => {
              const gradeProgress = getGradeProgress(grade.id);
              const units = ALL_UNITS[grade.id] || [];
              const availableUnits = units.filter((u) => !u.isMock);

              return (
                <Card
                  key={grade.id}
                  className={`english-card english-interactive cursor-pointer ${
                    grade.isMock ? 'opacity-50' : ''
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={grade.isMock ? 'english-badge' : 'english-badge-primary'}>
                        {grade.level === 'middle' ? '중학교' : '고등학교'}
                      </Badge>
                      {grade.isMock && (
                        <Badge variant="outline" className="text-xs">
                          준비중
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-800">
                      {grade.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>전체 진행도</span>
                      <span className="font-semibold english-gradient-text">
                        {gradeProgress.percentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full english-progress transition-all duration-500"
                        style={{ width: `${gradeProgress.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>완료 세트</span>
                      <span className="font-medium">
                        {gradeProgress.completed}/{gradeProgress.total}
                      </span>
                    </div>
                    <div className="pt-2">
                      {grade.isMock ? (
                        <Button className="w-full" disabled>
                          준비중
                        </Button>
                      ) : (
                        <Link href={`/grade/${grade.id}`}>
                          <Button className="w-full english-button-primary">
                            {availableUnits.length > 0 && gradeProgress.completed > 0
                              ? '계속하기'
                              : '시작하기'}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
