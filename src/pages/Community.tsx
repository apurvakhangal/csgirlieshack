import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageSquare, Trophy, ThumbsUp, Clock } from 'lucide-react';

export default function Community() {
  const forumThreads = [
    {
      id: '1',
      title: 'How do I master React Hooks?',
      author: 'Sarah K.',
      replies: 12,
      likes: 24,
      timeAgo: '2h ago',
      category: 'React',
    },
    {
      id: '2',
      title: 'Best resources for learning TypeScript?',
      author: 'John D.',
      replies: 8,
      likes: 15,
      timeAgo: '5h ago',
      category: 'TypeScript',
    },
    {
      id: '3',
      title: 'Study group for algorithms - anyone interested?',
      author: 'Alex M.',
      replies: 23,
      likes: 45,
      timeAgo: '1d ago',
      category: 'Study Groups',
    },
  ];

  const studyGroups = [
    {
      id: '1',
      name: 'React Developers',
      members: 245,
      description: 'Learn React together with weekly sessions',
      isJoined: true,
    },
    {
      id: '2',
      name: 'Data Science Beginners',
      members: 189,
      description: 'Starting your data science journey? Join us!',
      isJoined: false,
    },
    {
      id: '3',
      name: 'Morning Study Squad',
      members: 156,
      description: 'Early birds studying together 6-8 AM',
      isJoined: true,
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'Emma Watson', xp: 12500, avatar: 'EW' },
    { rank: 2, name: 'Michael Chen', xp: 11200, avatar: 'MC' },
    { rank: 3, name: 'Sofia Rodriguez', xp: 10800, avatar: 'SR' },
    { rank: 4, name: 'James Wilson', xp: 9500, avatar: 'JW' },
    { rank: 5, name: 'You', xp: 8200, avatar: 'YO' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Community</h1>
        </div>
      </motion.div>

      <Tabs defaultValue="forum" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forum">Forum</TabsTrigger>
          <TabsTrigger value="groups">Study Groups</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Forum */}
        <TabsContent value="forum" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Join discussions and get help from the community
            </p>
            <Button>New Thread</Button>
          </div>

          {forumThreads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="transition-all hover:shadow-glow-primary">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="outline">{thread.category}</Badge>
                        <span className="text-xs text-muted-foreground">{thread.timeAgo}</span>
                      </div>
                      <h3 className="mb-1 font-semibold">{thread.title}</h3>
                      <p className="text-sm text-muted-foreground">by {thread.author}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{thread.replies} replies</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{thread.likes} likes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Study Groups */}
        <TabsContent value="groups" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Connect with learners and study together
            </p>
            <Button>Create Group</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {studyGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{group.name}</CardTitle>
                    <CardDescription>{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{group.members} members</span>
                      </div>
                      <Button variant={group.isJoined ? 'outline' : 'default'} size="sm">
                        {group.isJoined ? 'Leave' : 'Join'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Top Learners</CardTitle>
                  <CardDescription>This week's XP rankings</CardDescription>
                </div>
                <Tabs defaultValue="week" className="w-auto">
                  <TabsList>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="all">All Time</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 rounded-lg p-4 ${
                      user.name === 'You' ? 'bg-primary/10' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center font-bold">
                        {user.rank <= 3 ? (
                          <Trophy
                            className={`h-6 w-6 ${
                              user.rank === 1
                                ? 'text-success'
                                : user.rank === 2
                                ? 'text-muted-foreground'
                                : 'text-accent'
                            }`}
                          />
                        ) : (
                          <span className="text-muted-foreground">{user.rank}</span>
                        )}
                      </div>
                      <Avatar>
                        <AvatarFallback>{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.xp} XP</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
