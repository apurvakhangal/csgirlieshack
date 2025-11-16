import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUserStore } from '@/store/userStore';
import { useTranslatedText } from '@/hooks/useTranslation';
import { TranslatedText } from '@/components/TranslatedText';
import { BookOpen, Brain, Target, Zap, Trophy, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const user = useUserStore((state) => state.user);

  const quickActions = [
    { icon: BookOpen, label: 'Browse Courses', color: 'text-primary', path: '/courses' },
    { icon: Brain, label: 'Ask AI Bot', color: 'text-accent', path: '/ai-bot' },
    { icon: Target, label: 'View Roadmap', color: 'text-success', path: '/roadmap' },
    { icon: Clock, label: 'Focus Session', color: 'text-destructive', path: '/focus' },
  ];

  // Translate all text strings
  const welcomeText = useTranslatedText('Welcome back');
  const readyText = useTranslatedText('Ready to continue your learning journey?');
  const totalXPText = useTranslatedText('Total XP');
  const levelText = useTranslatedText('Level');
  const coursesText = useTranslatedText('Courses');
  const streakText = useTranslatedText('Streak');
  const daysText = useTranslatedText('days');
  const quickActionsTitle = useTranslatedText('Quick Actions');
  const quickActionsDesc = useTranslatedText('Jump right into your learning activities');
  const yourCoursesTitle = useTranslatedText('Your Courses');
  const yourCoursesDesc = useTranslatedText('Continue where you left off');
  const modulesCompletedText = useTranslatedText('modules completed');
  const ofText = useTranslatedText('of');
  const continueText = useTranslatedText('Continue');
  const levelProgressTitle = useTranslatedText('Level Progress');
  const xpToLevelText = useTranslatedText('XP to Level');
  const todaysGoalTitle = useTranslatedText("Today's Goal");
  const todaysGoalDesc = useTranslatedText('Stay consistent to build your streak');
  const completeModulesText = useTranslatedText('Complete');
  const modulesText = useTranslatedText('modules');
  const startLearningText = useTranslatedText('Start Learning');

  const courses = [
    { title: 'Introduction to React', progress: 65, modules: 12, completed: 8 },
    { title: 'Web Development Basics', progress: 40, modules: 15, completed: 6 },
    { title: 'Data Structures & Algorithms', progress: 20, modules: 20, completed: 4 },
  ];

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-3xl font-bold">
            {welcomeText}, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            {readyText}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{totalXPText}</p>
                  <p className="text-2xl font-bold">{user?.xp || 0}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-success/10 p-3">
                  <Trophy className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{levelText}</p>
                  <p className="text-2xl font-bold">{user?.level || 1}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-accent/10 p-3">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{coursesText}</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-destructive/10 p-3">
                  <Clock className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{streakText}</p>
                  <p className="text-2xl font-bold">{user?.streak || 0} {daysText}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{quickActionsTitle}</CardTitle>
                <CardDescription>{quickActionsDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Link to={action.path}>
                        <Button
                          variant="outline"
                          className="h-auto flex-col gap-2 p-4 w-full"
                        >
                          <action.icon className={`h-6 w-6 ${action.color}`} />
                          <span className="text-xs"><TranslatedText text={action.label} /></span>
                        </Button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Courses */}
            <Card>
              <CardHeader>
                <CardTitle>{yourCoursesTitle}</CardTitle>
                <CardDescription>{yourCoursesDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.map((course, index) => (
                  <motion.div
                    key={course.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold"><TranslatedText text={course.title} /></h4>
                        <p className="text-sm text-muted-foreground">
                          {course.completed} {ofText} {course.modules} {modulesCompletedText}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        {continueText}
                      </Button>
                    </div>
                    <Progress value={course.progress} />
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{levelProgressTitle}</CardTitle>
                  <CardDescription>
                    {100 - ((user?.xp || 0) % 100)} {xpToLevelText} {(user?.level || 1) + 1}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={(user?.xp || 0) % 100} />
                    <div className="flex items-center justify-between text-sm">
                      <span>{levelText} {user?.level || 1}</span>
                      <span>{levelText} {(user?.level || 1) + 1}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Today's Goal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{todaysGoalTitle}</CardTitle>
                  <CardDescription>{todaysGoalDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{completeModulesText} 2 {modulesText}</span>
                      <span className="text-sm text-muted-foreground">0/2</span>
                    </div>
                    <Progress value={0} />
                    <Button className="w-full" variant="outline">
                      {startLearningText}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
