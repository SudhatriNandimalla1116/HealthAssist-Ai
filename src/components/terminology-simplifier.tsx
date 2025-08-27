'use client';

import {useState} from 'react';
import {useForm, type SubmitHandler} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {simplifyTerminologyAction} from '@/app/actions';
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
import {Wand2, Loader2, Clipboard, Check} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';

const FormSchema = z.object({
  medicalText: z.string().min(1, {
    message: 'Please enter some medical text.',
  }),
});

type FormData = z.infer<typeof FormSchema>;

export function TerminologySimplifier() {
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const {toast} = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      medicalText: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async data => {
    setIsSimplifying(true);
    setSimplifiedText('');
    setHasCopied(false);
    const result = await simplifyTerminologyAction(data.medicalText);
    setSimplifiedText(result);
    setIsSimplifying(false);
  };

  const handleCopy = () => {
    if (!simplifiedText) return;
    navigator.clipboard.writeText(simplifiedText);
    setHasCopied(true);
    toast({title: 'Copied to clipboard!'});
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="grid gap-8 p-4 pt-0 md:grid-cols-2 md:p-6 md:pt-0">
      <Card className="flex flex-col border-blue-500/20 bg-card/50">
        <CardHeader className="border-b border-blue-500/10">
          <CardTitle className="text-blue-300">Medical Text</CardTitle>
          <CardDescription className="text-blue-200">
            Enter complex medical terminology to get a simplified explanation.
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
                name="medicalText"
                render={({field}) => (
                  <FormItem className="flex flex-1 flex-col">
                    <FormLabel className="sr-only">Medical Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'The patient was diagnosed with myocardial infarction...'"
                        className="flex-1 resize-none border-blue-500/20 focus:border-blue-500/50 focus:ring-blue-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isSimplifying}
                className="button-blue-gradient text-white border-0 hover:scale-105 transition-transform"
              >
                {isSimplifying ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Simplify
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="flex flex-col border-blue-500/20 bg-card/50">
        <CardHeader className="border-b border-blue-500/10">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-blue-300">Simplified Explanation</CardTitle>
              <CardDescription className="text-blue-200">
                An easy-to-understand version of the text.
              </CardDescription>
            </div>
            {simplifiedText && !isSimplifying && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCopy}
                className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
              >
                {hasCopied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Clipboard className="h-4 w-4" />
                )}
                <span className="sr-only">Copy to clipboard</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          {isSimplifying && (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          )}
          {simplifiedText && !isSimplifying && (
            <div className="h-full rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
              <p className="whitespace-pre-wrap text-sm text-blue-100">{simplifiedText}</p>
            </div>
          )}
          {!simplifiedText && !isSimplifying && (
            <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-blue-500/30 text-center text-blue-300">
              <p>Your simplified text will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
