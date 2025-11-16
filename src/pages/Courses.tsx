import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TranslatedText } from '@/components/TranslatedText';
import { BookOpen, Plus, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  rating: number;
}

export default function Courses() {
  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'Introduction to React',
      description: 'Learn the fundamentals of React including components, hooks, and state management',
      progress: 65,
      totalModules: 12,
      completedModules: 8,
      difficulty: 'Beginner',
      estimatedHours: 20,
      rating: 4.8,
    },
    {
      id: '2',
      title: 'Web Development Basics',
      description: 'Master HTML, CSS, and JavaScript to build modern websites',
      progress: 40,
      totalModules: 15,
      completedModules: 6,
      difficulty: 'Beginner',
      estimatedHours: 30,
      rating: 4.9,
    },
    {
      id: '3',
      title: 'Data Structures & Algorithms',
      description: 'Essential computer science concepts for technical interviews',
      progress: 20,
      totalModules: 20,
      completedModules: 4,
      difficulty: 'Advanced',
      estimatedHours: 50,
      rating: 4.7,
    },
  ]);

  const difficultyColors = {
    Beginner: 'bg-success text-success-foreground',
    Intermediate: 'bg-accent text-accent-foreground',
    Advanced: 'bg-destructive text-destructive-foreground',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold"><TranslatedText text="My Courses" /></h1>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            <TranslatedText text="New Course" />
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><TranslatedText text="Active Courses" /></p>
              <p className="text-2xl font-bold">{courses.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-success/10 p-3">
              <Star className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><TranslatedText text="Completed Modules" /></p>
              <p className="text-2xl font-bold">
                {courses.reduce((sum, c) => sum + c.completedModules, 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-accent/10 p-3">
              <Clock className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><TranslatedText text="Learning Hours" /></p>
              <p className="text-2xl font-bold">
                {courses.reduce((sum, c) => sum + c.estimatedHours, 0)}h
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full transition-all hover:shadow-glow-primary">
              <CardHeader>
                <div className="mb-2 flex items-start justify-between">
                  <Badge className={difficultyColors[course.difficulty]}>
                    <TranslatedText text={course.difficulty} />
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-success text-success" />
                    <span>{course.rating}</span>
                  </div>
                </div>
                <CardTitle className="line-clamp-1"><TranslatedText text={course.title} /></CardTitle>
                <CardDescription className="line-clamp-2">
                  <TranslatedText text={course.description} />
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground"><TranslatedText text="Progress" /></span>
                    <span className="font-semibold">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {course.completedModules} <TranslatedText text="of" /> {course.totalModules} <TranslatedText text="modules completed" />
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{course.estimatedHours}h</span>
                  </div>
                  <Button size="sm"><TranslatedText text="Continue" /></Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
