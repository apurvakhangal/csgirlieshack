import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { createRoadmap } from '@/services/roadmapService';
import { getCurrentUserId } from '@/lib/auth';
import { Target, CheckCircle2, Circle, Clock, Loader2 } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedHours: number;
  completed: boolean;
}

export default function Roadmap() {
  const [goal, setGoal] = useState('');
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapData, setRoadmapData] = useState<Milestone[]>([]);
  const { toast } = useToast();

  const completedCount = roadmapData.filter((m) => m.completed).length;
  const progressPercentage = roadmapData.length > 0 ? (completedCount / roadmapData.length) * 100 : 0;

  const difficultyColors = {
    easy: 'bg-success text-success-foreground',
    medium: 'bg-accent text-accent-foreground',
    hard: 'bg-destructive text-destructive-foreground',
  };

  const generateRoadmap = async () => {
    if (!goal.trim()) {
      toast({
        title: 'Goal required',
        description: 'Please enter a learning goal.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        throw new Error('You must be logged in to generate a roadmap');
      }

      const { roadmap, error } = await createRoadmap(userId, goal);
      
      if (error) throw new Error(error);
      if (!roadmap) throw new Error('Failed to generate roadmap');

      setRoadmapData(roadmap.milestones as Milestone[]);
      setShowRoadmap(true);
      
      toast({
        title: 'Roadmap generated!',
        description: 'Your personalized learning roadmap is ready.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate roadmap. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center gap-3">
          <Target className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Learning Roadmap</h1>
        </div>
      </motion.div>

      {/* Goal Input */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>What do you want to learn?</CardTitle>
          <CardDescription>
            Enter your learning goal and I'll create a personalized roadmap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Master React and build web applications"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateRoadmap()}
            />
            <Button onClick={generateRoadmap} disabled={isGenerating || !goal.trim()}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Roadmap'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Display */}
      {showRoadmap && (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>
                {completedCount} of {roadmapData.length} milestones completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercentage} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}% complete
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {roadmapData.length === 0 && showRoadmap && (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No roadmap generated yet. Enter a goal and click "Generate Roadmap".
                </CardContent>
              </Card>
            )}
            {roadmapData.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`transition-all ${
                    milestone.completed ? 'border-success' : ''
                  }`}
                >
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="mt-1">
                      {milestone.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-success" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{milestone.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {milestone.description}
                          </p>
                        </div>
                        <Button
                          variant={milestone.completed ? 'outline' : 'default'}
                          size="sm"
                        >
                          {milestone.completed ? 'Review' : 'Start'}
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={difficultyColors[milestone.difficulty]}>
                          {milestone.difficulty}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {milestone.estimatedHours}h
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
