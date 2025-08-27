'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Bell, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Reminder {
  id: string;
  title: string;
  type: 'medication' | 'appointment';
  time: string;
}

const FormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  type: z.enum(['medication', 'appointment']),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid HH:MM time.'),
});

type FormData = z.infer<typeof FormSchema>;

export function HealthReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      type: 'medication',
      time: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setIsLoading(true);
    // Simulate saving reminder
    setTimeout(() => {
      const newReminder = { ...data, id: `reminder-${Date.now()}` };
      setReminders((prev) => [...prev, newReminder]);
      toast({ title: 'Reminder set successfully!' });
      form.reset();
      setIsLoading(false);
    }, 1000);
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter(r => r.id !== id));
    toast({ title: 'Reminder deleted.' });
  }

  return (
    <div className="grid gap-8 p-4 pt-0 md:grid-cols-2 md:p-6 md:pt-0">
      <Card>
        <CardHeader>
          <CardTitle>Set a New Reminder</CardTitle>
          <CardDescription>Fill out the form to create a health reminder.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reminder Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Take Vitamin D" {...field} />
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
                    <FormLabel>Reminder Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time (24-hour format)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Add Reminder
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Reminders</CardTitle>
          <CardDescription>Here are your scheduled health reminders.</CardDescription>
        </CardHeader>
        <CardContent>
          {reminders.length > 0 ? (
            <ul className="space-y-4">
              {reminders.sort((a, b) => a.time.localeCompare(b.time)).map(reminder => (
                <li key={reminder.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                     <Bell className="h-5 w-5 text-primary" />
                     <div>
                        <p className="font-semibold">{reminder.title}</p>
                        <p className="text-sm text-muted-foreground">
                            {`Type: ${reminder.type}`}
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-medium text-foreground">{reminder.time}</p>
                    <Button variant="ghost" size="icon" onClick={() => deleteReminder(reminder.id)}>
                        <X className="h-4 w-4"/>
                        <span className="sr-only">Delete reminder</span>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
              <Bell className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">You have no active reminders.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
