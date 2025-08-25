'use client';

import {useState} from 'react';
import {useForm, type SubmitHandler} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {mapSymptomsAction} from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Loader2, HeartPulse, AlertTriangle} from 'lucide-react';
import {Alert, AlertDescription} from './ui/alert';

const FormSchema = z.object({
  symptoms: z.string().min(10, {
    message: 'Please enter at least 10 characters to describe your symptoms.',
  }),
});

type FormData = z.infer<typeof FormSchema>;

export function SymptomConditionMapper() {
  const [result, setResult] =
    useState<{potentialConditions: string; disclaimer: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async data => {
    setIsLoading(true);
    setResult(null);
    const response = await mapSymptomsAction(data.symptoms);
    setResult(response);
    setIsLoading(false);
  };

  return (
    <div className="grid gap-8 p-4 pt-0 md:grid-cols-2 md:p-6 md:pt-0">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Describe Your Symptoms</CardTitle>
          <CardDescription>
            Enter your symptoms below. Be as descriptive as possible for better results.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-1 flex-col space-y-6"
            >
              <FormField
                control={form.control}
                name="symptoms"
                render={({field}) => (
                  <FormItem className="flex flex-1 flex-col">
                    <FormLabel className="sr-only">Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I have a persistent cough, fever, and a headache...'"
                        className="flex-1 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <HeartPulse className="mr-2 h-4 w-4" />
                )}
                Analyze Symptoms
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Potential Conditions</CardTitle>
          <CardDescription>
            Here are some potential conditions based on your symptoms.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {result && !isLoading && (
            <div className="h-full space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">{result.disclaimer}</AlertDescription>
              </Alert>
              <div className="h-full rounded-lg bg-muted/50 p-4">
                <p className="whitespace-pre-wrap text-sm">{result.potentialConditions}</p>
              </div>
            </div>
          )}
          {!result && !isLoading && (
            <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed text-center text-muted-foreground">
              <p>Potential conditions will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
