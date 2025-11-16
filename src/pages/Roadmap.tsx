import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { createRoadmap } from '@/services/roadmapService';
import { getAvailableRoadmaps, getRoadmapsByCategory, searchRoadmaps, type RoadmapItem } from '@/services/roadmapShService';
import { getCurrentUserId } from '@/lib/auth';
import { TranslatedText } from '@/components/TranslatedText';
import { useTranslatedText } from '@/hooks/useTranslation';
import { Target, CheckCircle2, Circle, Clock, Loader2, Search, ExternalLink, Sparkles } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedHours: number;
  completed: boolean;
}

export default function Roadmap() {
  const [activeTab, setActiveTab] = useState<'available' | 'custom'>('available');
  const [goal, setGoal] = useState('');
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapData, setRoadmapData] = useState<Milestone[]>([]);
  const [availableRoadmaps, setAvailableRoadmaps] = useState<RoadmapItem[]>([]);
  const [filteredRoadmaps, setFilteredRoadmaps] = useState<RoadmapItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'role' | 'skill' | 'beginner'>('all');
  const [isLoadingRoadmaps, setIsLoadingRoadmaps] = useState(true);
  const { toast } = useToast();

  const completedCount = roadmapData.filter((m) => m.completed).length;
  const progressPercentage = roadmapData.length > 0 ? (completedCount / roadmapData.length) * 100 : 0;

  const difficultyColors = {
    easy: 'bg-success text-success-foreground',
    medium: 'bg-accent text-accent-foreground',
    hard: 'bg-destructive text-destructive-foreground',
  };

  const categoryColors = {
    role: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    skill: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    beginner: 'bg-green-500/10 text-green-600 dark:text-green-400',
  };

  const difficultyBadgeColors = {
    beginner: 'bg-green-500/10 text-green-600 dark:text-green-400',
    intermediate: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    advanced: 'bg-red-500/10 text-red-600 dark:text-red-400',
  };

  // Translation texts
  const goalRequiredText = useTranslatedText('Goal required');
  const pleaseEnterGoalText = useTranslatedText('Please enter a learning goal.');
  const mustBeLoggedInText = useTranslatedText('You must be logged in to generate a roadmap');
  const failedToGenerateText = useTranslatedText('Failed to generate roadmap');
  const roadmapGeneratedText = useTranslatedText('Roadmap generated!');
  const roadmapReadyText = useTranslatedText('Your personalized learning roadmap is ready.');
  const errorText = useTranslatedText('Error');
  const failedToGenerateTryAgainText = useTranslatedText('Failed to generate roadmap. Please try again.');
  const placeholderText = useTranslatedText("e.g., Master React and build web applications");
  const searchPlaceholderText = useTranslatedText('Search roadmaps...');

  // Load available roadmaps
  useEffect(() => {
    const loadRoadmaps = async () => {
      setIsLoadingRoadmaps(true);
      try {
        const roadmaps = await getAvailableRoadmaps();
        setAvailableRoadmaps(roadmaps);
        setFilteredRoadmaps(roadmaps);
      } catch (error) {
        console.error('Error loading roadmaps:', error);
        toast({
          title: errorText,
          description: 'Failed to load available roadmaps',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingRoadmaps(false);
      }
    };
    loadRoadmaps();
  }, []);

  // Filter roadmaps based on category and search
  useEffect(() => {
    const filterRoadmaps = async () => {
      let filtered = selectedCategory === 'all' 
        ? availableRoadmaps 
        : await getRoadmapsByCategory(selectedCategory);
      
      if (searchQuery.trim()) {
        filtered = await searchRoadmaps(searchQuery);
        // Also filter by category if not 'all'
        if (selectedCategory !== 'all') {
          filtered = filtered.filter((r) => r.category === selectedCategory);
        }
      }
      
      setFilteredRoadmaps(filtered);
    };
    
    filterRoadmaps();
  }, [searchQuery, selectedCategory, availableRoadmaps]);

  const generateRoadmap = async () => {
    if (!goal.trim()) {
      toast({
        title: goalRequiredText,
        description: pleaseEnterGoalText,
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        throw new Error(mustBeLoggedInText);
      }

      const { roadmap, error } = await createRoadmap(userId, goal);
      
      if (error) throw new Error(error);
      if (!roadmap) throw new Error(failedToGenerateText);

      setRoadmapData(roadmap.milestones as Milestone[]);
      setShowRoadmap(true);
      setActiveTab('custom');
      
      toast({
        title: roadmapGeneratedText,
        description: roadmapReadyText,
      });
    } catch (error: any) {
      toast({
        title: errorText,
        description: error.message || failedToGenerateTryAgainText,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewRoadmap = (roadmap: RoadmapItem) => {
    window.open(roadmap.url, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center gap-3">
          <Target className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold"><TranslatedText text="Learning Roadmaps" /></h1>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'available' | 'custom')} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="available">
            <TranslatedText text="Available Roadmaps" />
          </TabsTrigger>
          <TabsTrigger value="custom">
            <TranslatedText text="Generate Custom" />
          </TabsTrigger>
        </TabsList>

        {/* Available Roadmaps Tab */}
        <TabsContent value="available" className="mt-6">
          {/* Search and Filter */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={searchPlaceholderText}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                  >
                    <TranslatedText text="All" />
                  </Button>
                  <Button
                    variant={selectedCategory === 'role' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('role')}
                  >
                    <TranslatedText text="Role Based" />
                  </Button>
                  <Button
                    variant={selectedCategory === 'skill' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('skill')}
                  >
                    <TranslatedText text="Skill Based" />
                  </Button>
                  <Button
                    variant={selectedCategory === 'beginner' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('beginner')}
                  >
                    <TranslatedText text="Beginner" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roadmaps Grid */}
          {isLoadingRoadmaps ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredRoadmaps.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  <TranslatedText text="No roadmaps found. Try a different search or category." />
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredRoadmaps.map((roadmap, index) => (
                <motion.div
                  key={roadmap.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="flex h-full flex-col transition-all hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="mb-2">{roadmap.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {roadmap.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={categoryColors[roadmap.category]}>
                          <TranslatedText text={roadmap.category} />
                        </Badge>
                        <Badge className={difficultyBadgeColors[roadmap.difficulty]}>
                          <TranslatedText text={roadmap.difficulty} />
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {roadmap.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {roadmap.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{roadmap.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <Button
                        className="mt-auto"
                        variant="outline"
                        onClick={() => handleViewRoadmap(roadmap)}
                      >
                        <TranslatedText text="View Roadmap" />
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Custom Roadmap Generation Tab */}
        <TabsContent value="custom" className="mt-6">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <TranslatedText text="Generate Custom Roadmap" />
              </CardTitle>
              <CardDescription>
                <TranslatedText text="Enter your learning goal and I'll create a personalized roadmap using AI" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder={placeholderText}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && generateRoadmap()}
                />
                <Button onClick={generateRoadmap} disabled={isGenerating || !goal.trim()}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <TranslatedText text="Generating..." />
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      <TranslatedText text="Generate Roadmap" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Roadmap Display */}
          {showRoadmap && (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle><TranslatedText text="Your Progress" /></CardTitle>
                  <CardDescription>
                    {completedCount} <TranslatedText text="of" /> {roadmapData.length} <TranslatedText text="milestones completed" />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={progressPercentage} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {Math.round(progressPercentage)}% <TranslatedText text="complete" />
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {roadmapData.length === 0 && showRoadmap && (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      <TranslatedText text='No roadmap generated yet. Enter a goal and click "Generate Roadmap".' />
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
                              <h3 className="font-semibold"><TranslatedText text={milestone.title} /></h3>
                              <p className="text-sm text-muted-foreground">
                                <TranslatedText text={milestone.description} />
                              </p>
                            </div>
                            <Button
                              variant={milestone.completed ? 'outline' : 'default'}
                              size="sm"
                            >
                              {milestone.completed ? <TranslatedText text="Review" /> : <TranslatedText text="Start" />}
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={difficultyColors[milestone.difficulty]}>
                              <TranslatedText text={milestone.difficulty} />
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
