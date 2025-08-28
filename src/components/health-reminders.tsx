'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Bell, X, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Reminder {
  id: string;
  title: string;
  type: 'medication' | 'appointment';
  time: string;
  date: string;
  completed: boolean;
  nextReminder: number; // timestamp for next reminder
}

const FormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  type: z.enum(['medication', 'appointment']),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid HH:MM time.'),
  date: z.string().min(1, 'Please select a date.'),
});

type FormData = z.infer<typeof FormSchema>;

const STORAGE_KEY = 'health-reminders-data';

export function HealthReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { toast } = useToast();
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load reminders from localStorage on mount
  useEffect(() => {
    const savedReminders = localStorage.getItem(STORAGE_KEY);
    if (savedReminders) {
      try {
        const parsed = JSON.parse(savedReminders);
        setReminders(parsed);
      } catch (error) {
        console.error('Error loading reminders:', error);
      }
    }
  }, []);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  // Check for notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      if (permission === 'granted') {
        toast({ title: 'Notifications enabled!', description: 'You will now receive reminder notifications.' });
      }
    }
  }, [toast]);

  // Create audio element for sound notifications
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audioRef.current.volume = 0.5;
  }, []);

  // Schedule reminder notifications
  const scheduleReminder = useCallback((reminder: Reminder) => {
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const reminderDate = new Date(reminder.date);
    reminderDate.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    let nextReminderTime = reminderDate.getTime();
    
    // If the time has passed today, schedule for tomorrow
    if (nextReminderTime <= now.getTime()) {
      nextReminderTime += 24 * 60 * 60 * 1000; // Add 24 hours
    }
    
    const updatedReminder = { ...reminder, nextReminder: nextReminderTime };
    setReminders(prev => prev.map(r => r.id === reminder.id ? updatedReminder : r));
    
    // Schedule the notification
    const timeUntilReminder = nextReminderTime - now.getTime();
    
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    
    notificationTimeoutRef.current = setTimeout(() => {
      showNotification(reminder);
      // Schedule next reminder (daily for medications, one-time for appointments)
      if (reminder.type === 'medication') {
        scheduleReminder({ ...reminder, nextReminder: nextReminderTime + 24 * 60 * 60 * 1000 });
      }
    }, timeUntilReminder);
  }, []);

  // Show notification
  const showNotification = useCallback((reminder: Reminder) => {
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Health Reminder', {
        body: `${reminder.title} - ${reminder.type}`,
        icon: '/favicon.ico',
        tag: reminder.id,
        requireInteraction: true,
      });
    }
    
    // Sound notification
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
    
    // Toast notification
    toast({
      title: 'Reminder!',
      description: `${reminder.title} - ${reminder.type}`,
      duration: 10000, // 10 seconds
    });
    
    // Update reminder as completed
    setReminders(prev => prev.map(r => 
      r.id === reminder.id ? { ...r, completed: true } : r
    ));
  }, [toast]);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      type: 'medication',
      time: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setIsLoading(true);
    
    const newReminder: Reminder = {
      ...data,
      id: `reminder-${Date.now()}`,
      completed: false,
      nextReminder: 0,
    };
    
    setReminders((prev) => [...prev, newReminder]);
    
    // Schedule the reminder
    scheduleReminder(newReminder);
    
    toast({ 
      title: 'Reminder set successfully!', 
      description: `You will be notified at ${data.time} on ${data.date}` 
    });
    
    form.reset({
      title: '',
      type: 'medication',
      time: '',
      date: new Date().toISOString().split('T')[0],
    });
    
    setIsLoading(false);
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter(r => r.id !== id));
    toast({ title: 'Reminder deleted.' });
  };

  const toggleCompleted = (id: string) => {
    setReminders((prev) => prev.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeUntilReminder = (nextReminder: number) => {
    const now = new Date().getTime();
    const diff = nextReminder - now;
    
    if (diff <= 0) return 'Due now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `In ${hours}h ${minutes}m`;
    return `In ${minutes}m`;
  };

  return (
    <div className="space-y-6 p-4 pt-0 md:p-6 md:pt-0">
      {/* Notification Permission Request */}
      {!notificationsEnabled && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-300">Enable Notifications</h3>
                <p className="text-sm text-blue-200">Get notified about your health reminders</p>
              </div>
              <Button onClick={requestNotificationPermission} variant="outline" size="sm">
                Enable Notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Set New Reminder Form */}
        <Card className="border-blue-500/20 bg-card/50">
          <CardHeader className="border-b border-blue-500/10">
            <CardTitle className="text-blue-300">Set a New Reminder</CardTitle>
            <CardDescription className="text-blue-200">Fill out the form to create a health reminder.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200">Reminder Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Take Vitamin D" 
                          className="border-blue-500/20 focus:border-blue-500/50 focus:ring-blue-500/20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200">Reminder Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-blue-500/20 focus:border-blue-500/50 focus:ring-blue-500/20">
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="medication">Medication</SelectItem>
                          <SelectItem value="appointment">Appointment</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200">Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          className="border-blue-500/20 focus:border-blue-500/50 focus:ring-blue-500/20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200">Time (24-hour format)</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          className="border-blue-500/20 focus:border-blue-500/50 focus:ring-blue-500/20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="button-blue-gradient text-white border-0 hover:scale-105 transition-transform w-full"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Add Reminder
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Your Reminders List */}
        <Card className="border-blue-500/20 bg-card/50">
          <CardHeader className="border-b border-blue-500/10">
            <CardTitle className="text-blue-300">Your Reminders</CardTitle>
            <CardDescription className="text-blue-200">Here are your scheduled health reminders.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {reminders.length > 0 ? (
              <ul className="space-y-4">
                {reminders
                  .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
                  .map(reminder => (
                    <li 
                      key={reminder.id} 
                      className={`flex items-center justify-between rounded-lg border p-4 transition-all ${
                        reminder.completed 
                          ? 'border-green-500/30 bg-green-500/5 opacity-75' 
                          : 'border-blue-500/20 hover:border-blue-500/40'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className={`p-2 rounded-full ${
                            reminder.completed 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {reminder.completed ? <CheckCircle className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className={`font-semibold ${reminder.completed ? 'line-through' : ''}`}>
                            {reminder.title}
                          </p>
                          <p className="text-sm text-blue-200">
                            {`Type: ${reminder.type}`}
                          </p>
                          <p className="text-xs text-blue-300">
                            {formatDate(reminder.date)} at {reminder.time}
                          </p>
                          {reminder.nextReminder > 0 && (
                            <p className="text-xs text-blue-400 flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {getTimeUntilReminder(reminder.nextReminder)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleCompleted(reminder.id)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {reminder.completed ? 'Undo' : 'Complete'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteReminder(reminder.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4"/>
                          <span className="sr-only">Delete reminder</span>
                        </Button>
                      </div>
                    </li>
                  ))}
              </ul>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-500/30 text-center">
                <Bell className="h-12 w-12 text-blue-300" />
                <p className="mt-4 text-blue-200">You have no active reminders.</p>
                <p className="text-sm text-blue-300">Set your first reminder using the form on the left.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
