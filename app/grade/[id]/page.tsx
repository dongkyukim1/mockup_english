"use client";

import { useState, useEffect } from 'react';
import { use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, Brain, BookMarked, CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { getGradeById, getUnitsByGrade } from '@/lib/data';
import { getProgress } from '@/lib/storage';
import type { TextbookUnit } from '@/types';

interface GradePageProps {
  params: Promise<{ id: string }>;
}

export default function GradePage({ params }: GradePageProps) {
  const { id } = use(params);
  const grade = getGradeById(id);
  const units = getUnitsByGrade(id);
  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (!grade) {
    return (
      <div className="min-h-screen english-pattern-bg p-6 flex items-center justify-center">
        <Card className="english-card max-w-md">
          <CardHeader>
            <CardTitle>학년을 찾을 수 없습니다</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="english-button-primary">홈으로 돌아가기</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getUnitProgress = (unit: TextbookUnit) => {
    const gradeProgress = progress.grades[id];
    if (!gradeProgress || !gradeProgress.units[unit.id]) {
      return {
        vocabProgress: 0,
        grammarProgress: 0,
        readingProgress: 0,
        overallProgress: 0,
      };
    }

    const unitProgress = gradeProgress.units[unit.id];

    // Vocabulary: flashcard + Set A + B = 3 sets
    const vocabTotal = 3;
    const vocabCompleted = unitProgress.vocabulary?.completedSets?.length || 0;
    const vocabProgress = Math.round((vocabCompleted / vocabTotal) * 100);

    // Grammar: 각 grammar point 마다 Set A + B
    const grammarTotal = unit.grammar.length * 2;
    const grammarCompleted = Object.values(unitProgress.grammar || {}).reduce(
      (sum, g) => sum + (g.completedSets?.length || 0),
      0
    );
    const grammarProgress = grammarTotal > 0 ? Math.round((grammarCompleted / grammarTotal) * 100) : 0;

    // Reading: Set A + B = 2 sets
    const readingTotal = 2;
    const readingCompleted = unitProgress.reading?.completedSets?.length || 0;
    const readingProgress = Math.round((readingCompleted / readingTotal) * 100);

    // Overall
    const overallTotal = vocabTotal + grammarTotal + readingTotal;
    const overallCompleted = vocabCompleted + grammarCompleted + readingCompleted;
    const overallProgress = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

    return {
      vocabProgress,
      grammarProgress,
      readingProgress,
      overallProgress,
    };
  };

  return (
    <div className="min-h-screen english-pattern-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 hover:bg-indigo-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{grade.name}</h1>
              <p className="text-gray-600 mt-1">
                총 {units.filter((u) => !u.isMock).length}개 단원
              </p>
            </div>
          </div>
        </div>

        {/* 단원 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map((unit, index) => {
            const unitProgress = getUnitProgress(unit);
            const isComplete = unitProgress.overallProgress === 100;

            return (
              <Card
                key={unit.id}
                className={`english-card ${
                  unit.isMock ? 'opacity-50' : 'english-interactive cursor-pointer'
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={unit.isMock ? 'english-badge' : 'english-badge-primary'}>
                      Lesson {unit.order}
                    </Badge>
                    {isComplete && !unit.isMock && (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    )}
                    {unit.isMock && (
                      <Badge variant="outline" className="text-xs">
                        준비중
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-800">
                    {unit.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{unit.topic}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!unit.isMock && (
                    <>
                      {/* 전체 진행도 */}
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>전체 진행도</span>
                          <span className="font-semibold english-gradient-text">
                            {unitProgress.overallProgress}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full english-progress transition-all duration-500"
                            style={{ width: `${unitProgress.overallProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* 영역별 진행도 */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BookMarked className="w-4 h-4 text-emerald-500" />
                            <span className="text-gray-600">Vocabulary</span>
                          </div>
                          <span className="font-medium text-gray-700">
                            {unitProgress.vocabProgress}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-500" />
                            <span className="text-gray-600">Grammar</span>
                          </div>
                          <span className="font-medium text-gray-700">
                            {unitProgress.grammarProgress}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-600">Reading</span>
                          </div>
                          <span className="font-medium text-gray-700">
                            {unitProgress.readingProgress}%
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* 버튼 */}
                  <div className="pt-2">
                    {unit.isMock ? (
                      <Button className="w-full" disabled>
                        <Lock className="w-4 h-4 mr-2" />
                        준비중
                      </Button>
                    ) : (
                      <Link href={`/unit/${unit.id}`}>
                        <Button className="w-full english-button-primary">
                          {unitProgress.overallProgress > 0 ? '계속하기' : '시작하기'}
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
  );
}

