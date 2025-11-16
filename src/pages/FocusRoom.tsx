import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, Volume2, Clock } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

export default function FocusRoom() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [duration, setDuration] = useState('25');
  const addXP = useUserStore((state) => state.addXP);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((parseInt(duration) * 60 - timeLeft) / (parseInt(duration) * 60)) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Award XP for completed session
      if (mode === 'focus') {
        addXP(parseInt(duration) * 2); // 2 XP per minute
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, duration, addXP]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(parseInt(duration) * 60);
  };

  const handleDurationChange = (value: string) => {
    setDuration(value);
    setTimeLeft(parseInt(value) * 60);
    setIsRunning(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center gap-3">
          <Clock className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Focus Room</h1>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Timer */}
        <Card>
          <CardHeader>
            <CardTitle>Pomodoro Timer</CardTitle>
            <CardDescription>
              Stay focused and productive with timed work sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {/* Circular Progress */}
            <div className="relative mb-8 h-64 w-64">
              <svg className="h-full w-full -rotate-90 transform">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                  className="text-primary transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  key={`${minutes}-${seconds}`}
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-6xl font-bold"
                >
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </motion.div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {mode === 'focus' ? 'Focus Time' : 'Break Time'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              <Button size="lg" onClick={toggleTimer} className="min-w-32">
                {isRunning ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" onClick={resetTimer}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>

            {/* Duration Selector */}
            <div className="mt-6 w-full max-w-xs">
              <label className="mb-2 block text-sm font-medium">Duration (minutes)</label>
              <Select value={duration} onValueChange={handleDurationChange} disabled={isRunning}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="25">25 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Settings & Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ambient Sounds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Volume2 className="mr-2 h-4 w-4" />
                Rain Sounds
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Volume2 className="mr-2 h-4 w-4" />
                Forest Birds
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Volume2 className="mr-2 h-4 w-4" />
                Cafe Ambience
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Volume2 className="mr-2 h-4 w-4" />
                White Noise
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Focus Sessions</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Total Time</span>
                  <span className="font-semibold">1h 15m</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>XP Earned</span>
                  <span className="font-semibold text-success">+150 XP</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Take a 5-minute break every 25 minutes</li>
                <li>• Stay hydrated during focus sessions</li>
                <li>• Remove distractions before starting</li>
                <li>• Earn 2 XP per focused minute</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
