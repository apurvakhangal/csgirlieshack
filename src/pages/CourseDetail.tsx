import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { TranslatedText } from '@/components/TranslatedText';
import {
  BookOpen,
  Clock,
  Star,
  Trophy,
  Award,
  CheckCircle2,
  PlayCircle,
  Code,
  MessageSquare,
  ArrowLeft,
  Target,
  Zap,
  Users,
} from 'lucide-react';
import { getExternalCourses, type ExternalCourse } from '@/services/courseService';
import { getCourseById, getCourseProgress, completeModule, type Course, type Module } from '@/services/courseService';
import IDE from '@/components/IDE';
import DiscussionForum from '@/components/DiscussionForum';

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | ExternalCourse | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [activeModule, setActiveModule] = useState<number>(1);
  const [progress, setProgress] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'ide' | 'discussion'>('content');

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    setIsLoading(true);
    try {
      if (!courseId) {
        throw new Error('Course ID is required');
      }

      // Check if it's an external course
      if (courseId.startsWith('ext-')) {
        const result = await getExternalCourses();
        const externalCourse = result.courses?.find(c => c.id === courseId);
        if (externalCourse) {
          setCourse(externalCourse);
          // Generate mock modules for external courses
          setModules(generateMockModules(externalCourse));
        }
        // External courses don't have progress in database, use local state
        setIsLoading(false);
        return;
      }

      // Load from database
      const result = await getCourseById(courseId);
      if (result.course) {
        setCourse(result.course);
        setModules(result.modules || []);
      }
      
      // Load progress only for database courses
      try {
        const progressResult = await getCourseProgress(courseId);
        if (progressResult.progress && !progressResult.error) {
          setProgress(progressResult.progress.progress_percentage);
          setCompletedModules(
            Array.from({ length: progressResult.progress.completed_modules }, (_, i) => i + 1)
          );
        }
      } catch (progressError) {
        // Progress loading failed, but continue with course loading
        console.warn('Failed to load progress:', progressError);
      }
    } catch (error: any) {
      console.error('Error loading course:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load course',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockModules = (course: ExternalCourse): Module[] => {
    const moduleCount = 8;
    return Array.from({ length: moduleCount }, (_, i) => ({
      id: `module-${i + 1}`,
      course_id: course.id,
      module_number: i + 1,
      title: `Module ${i + 1}: ${getModuleTitle(course, i + 1)}`,
      summary: `Learn the fundamentals of ${getModuleTitle(course, i + 1).toLowerCase()}`,
      content: {
        concepts: [`Concept 1 for Module ${i + 1}`, `Concept 2 for Module ${i + 1}`],
        examples: [`Example 1 for Module ${i + 1}`, `Example 2 for Module ${i + 1}`],
        content_blocks: [
          {
            type: 'text',
            content: `This is the content for Module ${i + 1}. Learn about ${getModuleTitle(course, i + 1).toLowerCase()} in detail.`,
          },
        ],
      },
      time_required: 30 + i * 10,
      flashcards: [],
      practice_tasks: [],
      quiz: { questions: [] },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  };

  const getModuleTitle = (course: ExternalCourse, moduleNum: number): string => {
    if (course.category === 'coding' || course.is_tech) {
      const titles = [
        'Introduction',
        'Basic Concepts',
        'Variables and Data Types',
        'Control Structures',
        'Functions and Methods',
        'Object-Oriented Programming',
        'Advanced Topics',
        'Projects and Practice',
      ];
      return titles[moduleNum - 1] || `Topic ${moduleNum}`;
    } else if (course.category === 'language') {
      const titles = [
        'Introduction',
        'Alphabet and Pronunciation',
        'Basic Vocabulary',
        'Grammar Basics',
        'Common Phrases',
        'Conversation Practice',
        'Advanced Grammar',
        'Cultural Context',
      ];
      return titles[moduleNum - 1] || `Topic ${moduleNum}`;
    }
    return `Topic ${moduleNum}`;
  };

  const handleModuleComplete = async (moduleNum: number) => {
    if (completedModules.includes(moduleNum)) return;
    
    const newCompleted = [...completedModules, moduleNum];
    setCompletedModules(newCompleted);
    
    const newProgress = (newCompleted.length / modules.length) * 100;
    setProgress(newProgress);
    
    // Award XP
    const xpGain = 50;
    setXp(prev => {
      const newXp = prev + xpGain;
      const newLevel = Math.floor(newXp / 500) + 1;
      setLevel(newLevel);
      return newXp;
    });
    
    toast({
      title: 'Module Completed!',
      description: `You earned ${xpGain} XP!`,
    });
    
    if (courseId && !courseId.startsWith('ext-')) {
      await completeModule(courseId, moduleNum);
    }
  };

  const isTechCourse = course && ('is_tech' in course ? course.is_tech : course.category === 'coding' || course.category === 'tech');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Course not found</p>
            <Button onClick={() => navigate('/courses')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentModule = modules.find(m => m.module_number === activeModule);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Button
          variant="ghost"
          onClick={() => navigate('/courses')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>

        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-muted-foreground text-lg">{course.description}</p>
            </div>
          </div>

          {/* Gamification Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="text-2xl font-bold">{Math.round(progress)}%</p>
                  </div>
                </div>
                <Progress value={progress} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-yellow-500/10 p-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">XP</p>
                    <p className="text-2xl font-bold">{xp}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-500/10 p-2">
                    <Trophy className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="text-2xl font-bold">{level}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-500/10 p-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{completedModules.length}/{modules.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Module List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Modules</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.module_number)}
                    className={`w-full text-left p-3 hover:bg-accent transition-colors ${
                      activeModule === module.module_number ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {completedModules.includes(module.module_number) ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <PlayCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">
                          {module.module_number}. {module.title}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 ml-6">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{module.time_required} min</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">
                <BookOpen className="mr-2 h-4 w-4" />
                Content
              </TabsTrigger>
              {isTechCourse && (
                <TabsTrigger value="ide">
                  <Code className="mr-2 h-4 w-4" />
                  IDE
                </TabsTrigger>
              )}
              <TabsTrigger value="discussion">
                <MessageSquare className="mr-2 h-4 w-4" />
                Discussion
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-6">
              {currentModule ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{currentModule.title}</CardTitle>
                        <CardDescription>{currentModule.summary}</CardDescription>
                      </div>
                      {!completedModules.includes(currentModule.module_number) && (
                        <Button
                          onClick={() => handleModuleComplete(currentModule.module_number)}
                          size="sm"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Concepts */}
                    {currentModule.content.concepts && currentModule.content.concepts.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Key Concepts</h3>
                        <ul className="space-y-2">
                          {currentModule.content.concepts.map((concept, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Star className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                              <span>{concept}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Content Blocks */}
                    {currentModule.content.content_blocks && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Lesson Content</h3>
                        <div className="prose max-w-none">
                          {currentModule.content.content_blocks.map((block: any, idx: number) => (
                            <div key={idx} className="mb-4">
                              {block.type === 'text' && <p>{block.content}</p>}
                              {block.type === 'code' && (
                                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                                  <code>{block.content}</code>
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Examples */}
                    {currentModule.content.examples && currentModule.content.examples.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Examples</h3>
                        <div className="space-y-3">
                          {currentModule.content.examples.map((example, idx) => (
                            <Card key={idx} className="bg-muted/50">
                              <CardContent className="p-4">
                                <p>{example}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Practice Tasks */}
                    {currentModule.practice_tasks && currentModule.practice_tasks.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Practice Tasks</h3>
                        <div className="space-y-3">
                          {currentModule.practice_tasks.map((task, idx) => (
                            <Card key={idx}>
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-2">{task.title}</h4>
                                <p className="text-sm text-muted-foreground">{task.description}</p>
                                <Badge className="mt-2">{task.difficulty}</Badge>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between pt-6 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setActiveModule(Math.max(1, activeModule - 1))}
                        disabled={activeModule === 1}
                      >
                        Previous Module
                      </Button>
                      <Button
                        onClick={() => {
                          if (activeModule < modules.length) {
                            setActiveModule(activeModule + 1);
                          } else {
                            handleModuleComplete(activeModule);
                          }
                        }}
                        disabled={activeModule === modules.length && completedModules.includes(activeModule)}
                      >
                        {activeModule < modules.length ? 'Next Module' : 'Complete Course'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No modules available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {isTechCourse && (
              <TabsContent value="ide" className="mt-6">
                <IDE courseId={courseId!} moduleNumber={activeModule} />
              </TabsContent>
            )}

            <TabsContent value="discussion" className="mt-6">
              <DiscussionForum courseId={courseId!} courseTitle={course.title} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

