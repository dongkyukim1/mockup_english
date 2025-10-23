'use client';

import { useParams, useRouter } from 'next/navigation';
import { getUnitById } from '@/lib/data';
import { getUnitProgress, saveFlashcardProgress } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, BookMarked, FileText, Play, CheckCircle, Lock } from 'lucide-react';
import { useState } from 'react';

export default function UnitPage() {
  const params = useParams();
  const router = useRouter();
  const unitId = params.id as string;
  
  const unit = getUnitById(unitId);
  const progress = getUnitProgress(unitId);
  
  const [activeTab, setActiveTab] = useState('vocabulary');

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

  // Vocabulary 세트 정의
  const vocabularySets = [
    {
      id: 'flashcard',
      name: '플래시카드로 외우기',
      icon: BookMarked,
      color: 'emerald',
      type: 'flashcard',
      status: 'available' as const,
      description: '단어장을 카드로 외우세요',
    },
    {
      id: 'vocab-set-a',
      name: 'Set A: 단어 테스트',
      icon: FileText,
      color: 'blue',
      type: 'test',
      status: progress?.vocabulary?.completedSets?.includes('flashcard') ? 'available' : 'locked' as const,
      description: '영→한, 한→영 기본 테스트',
      problems: 10,
    },
    {
      id: 'vocab-set-b',
      name: 'Set B: 예문 완성',
      icon: FileText,
      color: 'indigo',
      type: 'test',
      status: progress?.vocabulary?.completedSets?.includes('vocab-set-a') ? 'available' : 'locked' as const,
      description: '문맥 속 단어 활용',
      problems: 10,
    },
  ];

  // Grammar 세트 정의
  const grammarSets = unit.grammar?.map((gp, index) => ({
    id: `grammar-${gp.id}`,
    name: gp.koreanName,
    description: gp.grammarPoint,
    sets: [
      {
        id: `${gp.id}-set-a`,
        name: 'Set A: 기본 문제',
        problems: 8,
        status: 'available' as const,
      },
      {
        id: `${gp.id}-set-b`,
        name: 'Set B: 응용 문제',
        problems: 8,
        status: progress?.grammar?.[gp.id]?.completedSets?.includes(`${gp.id}-set-a`) ? 'available' : 'locked' as const,
      },
    ],
  })) || [];

  // Reading 세트 정의
  const readingSets = [
    {
      id: 'reading-set-a',
      name: 'Set A: 내용 이해',
      icon: BookOpen,
      color: 'purple',
      type: 'test',
      status: 'available' as const,
      description: '지문 읽고 문제 풀기',
      problems: 5,
    },
    {
      id: 'reading-set-b',
      name: 'Set B: 추론 및 어휘',
      icon: BookOpen,
      color: 'violet',
      type: 'test',
      status: progress?.reading?.completedSets?.includes('reading-set-a') ? 'available' : 'locked' as const,
      description: '심화 독해 문제',
      problems: 5,
    },
  ];

  const handleStartSet = (setId: string, type: 'vocabulary' | 'grammar' | 'reading') => {
    if (setId === 'flashcard') {
      router.push(`/flashcard/${unitId}`);
    } else {
      router.push(`/solve/${unitId}/${type}/${setId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-6 px-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← 돌아가기
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {unit.title}
              </h1>
              <p className="text-gray-600 text-lg">
                {unit.topic}
              </p>
            </div>
            
            <Badge variant="outline" className="text-lg px-4 py-2">
              {unit.gradeId.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="container mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="vocabulary" className="text-base">
              <BookMarked className="w-4 h-4 mr-2" />
              Vocabulary
            </TabsTrigger>
            <TabsTrigger value="grammar" className="text-base">
              <FileText className="w-4 h-4 mr-2" />
              Grammar
            </TabsTrigger>
            <TabsTrigger value="reading" className="text-base">
              <BookOpen className="w-4 h-4 mr-2" />
              Reading
            </TabsTrigger>
          </TabsList>

          {/* Vocabulary 탭 */}
          <TabsContent value="vocabulary" className="space-y-6">
            {/* 단어 목록 미리보기 */}
            <Card className="border-2 border-blue-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-blue-600" />
                  핵심 단어 ({unit.vocabulary?.coreWords?.length || 0}개)
                </CardTitle>
                <CardDescription>
                  이번 단원에서 배울 핵심 단어들입니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {unit.vocabulary?.coreWords?.slice(0, 12).map((word, index) => (
                    <div
                      key={index}
                      className="p-3 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <div className="font-semibold text-blue-900">{word.english}</div>
                      <div className="text-sm text-gray-600">{word.korean}</div>
                    </div>
                  ))}
                </div>
                {(unit.vocabulary?.coreWords?.length || 0) > 12 && (
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    외 {(unit.vocabulary?.coreWords?.length || 0) - 12}개...
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Vocabulary 세트 */}
            <div className="grid gap-4">
              {vocabularySets.map((set) => {
                const Icon = set.icon;
                const isLocked = set.status === 'locked';
                const isCompleted = progress?.vocabulary?.completedSets?.includes(set.id);

                return (
                  <Card
                    key={set.id}
                    className={`transition-all ${
                      isLocked
                        ? 'opacity-60 bg-gray-50'
                        : 'hover:shadow-lg cursor-pointer bg-white'
                    } ${isCompleted ? 'border-2 border-emerald-500' : ''}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`p-3 rounded-lg ${
                            isLocked ? 'bg-gray-200' :
                            set.color === 'emerald' ? 'bg-emerald-100' :
                            set.color === 'blue' ? 'bg-blue-100' :
                            'bg-indigo-100'
                          }`}>
                            {isLocked ? (
                              <Lock className="w-6 h-6 text-gray-500" />
                            ) : (
                              <Icon className={`w-6 h-6 ${
                                set.color === 'emerald' ? 'text-emerald-600' :
                                set.color === 'blue' ? 'text-blue-600' :
                                'text-indigo-600'
                              }`} />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{set.name}</h3>
                              {isCompleted && (
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{set.description}</p>
                            {set.problems && (
                              <p className="text-xs text-gray-500 mt-1">
                                {set.problems}문제
                              </p>
                            )}
                            {isCompleted && progress?.vocabulary?.scores?.[set.id] && (
                              <div className="mt-2">
                                <Progress 
                                  value={progress.vocabulary.scores[set.id]} 
                                  className="h-2"
                                />
                                <p className="text-xs text-gray-600 mt-1">
                                  점수: {progress.vocabulary.scores[set.id]}점
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleStartSet(set.id, 'vocabulary')}
                          disabled={isLocked}
                          className={`${
                            isLocked ? '' :
                            set.color === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700' :
                            set.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                            'bg-indigo-600 hover:bg-indigo-700'
                          }`}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {isCompleted ? '다시 풀기' : '시작하기'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Grammar 탭 */}
          <TabsContent value="grammar" className="space-y-6">
            {grammarSets.map((grammarSection) => (
              <Card key={grammarSection.id} className="bg-white">
                <CardHeader>
                  <CardTitle>{grammarSection.name}</CardTitle>
                  <CardDescription>{grammarSection.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {grammarSection.sets.map((set) => {
                    const isLocked = set.status === 'locked';
                    const isCompleted = progress?.grammar?.[grammarSection.id.replace('grammar-', '')]?.completedSets?.includes(set.id);

                    return (
                      <div
                        key={set.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isLocked ? 'bg-gray-50 border-gray-200' :
                          isCompleted ? 'bg-emerald-50 border-emerald-200' :
                          'bg-purple-50 border-purple-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{set.name}</h4>
                              {isCompleted && (
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                              )}
                              {isLocked && (
                                <Lock className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{set.problems}문제</p>
                          </div>
                          
                          <Button
                            onClick={() => handleStartSet(set.id, 'grammar')}
                            disabled={isLocked}
                            variant={isCompleted ? 'outline' : 'default'}
                            className={!isCompleted ? 'bg-purple-600 hover:bg-purple-700' : ''}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {isCompleted ? '다시 풀기' : '시작하기'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Reading 탭 */}
          <TabsContent value="reading" className="space-y-6">
            {/* 지문 미리보기 */}
            {unit.reading && (
              <Card className="border-2 border-purple-200 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    Reading Passage
                  </CardTitle>
                  <CardDescription>
                    {unit.reading.wordCount} words · 
                    예상 시간 {unit.reading.estimatedMinutes}분
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <p className="text-gray-700 leading-relaxed line-clamp-6">
                      {unit.reading.passage}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reading 세트 */}
            <div className="grid gap-4">
              {readingSets.map((set) => {
                const Icon = set.icon;
                const isLocked = set.status === 'locked';
                const isCompleted = progress?.reading?.completedSets?.includes(set.id);

                return (
                  <Card
                    key={set.id}
                    className={`transition-all ${
                      isLocked ? 'opacity-60 bg-gray-50' : 'hover:shadow-lg bg-white'
                    } ${isCompleted ? 'border-2 border-emerald-500' : ''}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`p-3 rounded-lg ${
                            isLocked ? 'bg-gray-200' :
                            set.color === 'purple' ? 'bg-purple-100' :
                            'bg-violet-100'
                          }`}>
                            {isLocked ? (
                              <Lock className="w-6 h-6 text-gray-500" />
                            ) : (
                              <Icon className={`w-6 h-6 ${
                                set.color === 'purple' ? 'text-purple-600' : 'text-violet-600'
                              }`} />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{set.name}</h3>
                              {isCompleted && (
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{set.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{set.problems}문제</p>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleStartSet(set.id, 'reading')}
                          disabled={isLocked}
                          className={`${
                            isLocked ? '' :
                            set.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                            'bg-violet-600 hover:bg-violet-700'
                          }`}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {isCompleted ? '다시 풀기' : '시작하기'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

