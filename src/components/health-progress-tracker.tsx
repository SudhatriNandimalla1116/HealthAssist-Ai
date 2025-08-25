'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addHealthDataPoint, getHealthDataHistory } from '@/app/actions';
import type { HealthDataPoint } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, LineChart, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';

const FormSchema = z.object({
  weight: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive('Weight must be positive.')),
  systolic: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().int().positive('Must be a positive number.')),
  diastolic: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().int().positive('Must be a positive number.')),
  mood: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().int().min(1).max(5)),
});

type FormData = z.infer<typeof FormSchema>;

export function HealthProgressTracker() {
  const [history, setHistory] = useState<HealthDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      weight: '' as any,
      systolic: '' as any,
      diastolic: '' as any,
      mood: 3,
    },
  });

  useEffect(() => {
    async function loadHistory() {
      setIsHistoryLoading(true);
      const data = await getHealthDataHistory();
      setHistory(data);
      setIsHistoryLoading(false);
    }
    loadHistory();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    const newDataPoint = await addHealthDataPoint(data);
    setHistory((prev) => [...prev, newDataPoint]);
    toast({ title: 'Health data saved!' });
    form.reset();
    setIsLoading(false);
  };
  
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="grid gap-8 p-4 pt-0 md:grid-cols-2 md:p-6 md:pt-0">
      <Card>
        <CardHeader>
          <CardTitle>Log Your Metrics</CardTitle>
          <CardDescription>Enter your current health data below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 70.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="systolic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Systolic BP</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 120" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="diastolic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diastolic BP</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 80" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mood (1-5)</FormLabel>
                    <FormControl>
                       <Input type="range" min="1" max="5" step="1" {...field} />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Sad</span>
                        <span>Neutral</span>
                        <span>Happy</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Add Entry
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Progress Over Time</CardTitle>
          <CardDescription>Visualize your health trends.</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          {isHistoryLoading ? (
             <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : history.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={history.map(p => ({ ...p, date: formatDate(p.createdAt as Date) }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8884d8" name="Weight (kg)" />
                <Line yAxisId="left" type="monotone" dataKey="systolic" stroke="#82ca9d" name="Systolic BP" />
                <Line yAxisId="left" type="monotone" dataKey="diastolic" stroke="#ffc658" name="Diastolic BP" />
                <Line yAxisId="right" type="monotone" dataKey="mood" stroke="#ff7300" name="Mood (1-5)" />
              </RechartsLineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
              <LineChart className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Your health data will appear here once you add an entry.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}