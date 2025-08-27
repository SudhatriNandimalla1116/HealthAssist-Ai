'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, Upload, Wand2, AlertTriangle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { analyzeSkinCondition } from '@/app/actions';

export function SkinAnalyzer() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        setHasCameraPermission(false);
        console.error('Camera permission denied:', error);
      }
    };
    getCameraPermission();
  }, []);

  const startCamera = async () => {
    if (!hasCameraPermission) {
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Error starting camera:', error);
      toast({
        variant: 'destructive',
        title: 'Could not start camera',
        description: 'Please ensure your camera is not in use by another application.',
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      toast({ variant: 'destructive', title: 'No image selected' });
      return;
    }
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeSkinCondition({ photoDataUri: image });
      setAnalysis(result.analysis);
    } catch (error) {
      console.error('Error analyzing skin condition:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze the image. Please try again.',
      });
    }
    setIsLoading(false);
  };
  
  const handleClearImage = () => {
    setImage(null);
    setAnalysis(null);
  };

  return (
    <div className="grid gap-8 p-4 pt-0 md:grid-cols-2 md:p-6 md:pt-0">
      <Card>
        <CardHeader>
          <CardTitle>Upload or Capture Image</CardTitle>
          <CardDescription>Select an image of the skin condition for analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {image ? (
            <div className="relative group">
               <Image src={image} alt="Selected skin condition" width={600} height={400} className="w-full rounded-md object-contain" />
               <Button variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleClearImage}>
                   <X className="h-4 w-4" />
                   <span className="sr-only">Clear Image</span>
                </Button>
            </div>
          ) : isCameraOpen ? (
            <div className="space-y-2">
              <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay playsInline />
              <div className="flex gap-2">
                <Button onClick={handleCapture} className="w-full">
                  <Camera className="mr-2 h-4 w-4" /> Capture
                </Button>
                 <Button onClick={stopCamera} variant="outline" className="w-full">
                  Close Camera
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Camera className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Take a photo or upload an image.</p>
              <div className="flex gap-2">
                <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                  <Upload className="mr-2 h-4 w-4" /> Upload File
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <Button onClick={startCamera} disabled={!hasCameraPermission}>
                  <Camera className="mr-2 h-4 w-4" /> Use Camera
                </Button>
              </div>
               {!hasCameraPermission && <p className="text-xs text-destructive">Camera permission is required to use this feature.</p>}
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
          <Button onClick={handleAnalyze} disabled={!image || isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Analyze Skin Condition
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis</CardTitle>
          <CardDescription>Potential insights based on the provided image.</CardDescription>
        </CardHeader>
        <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Disclaimer</AlertTitle>
              <AlertDescription>
                This AI analysis is for informational purposes only and is not a substitute for professional medical advice. Consult a dermatologist or healthcare provider for an accurate diagnosis.
              </AlertDescription>
            </Alert>
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {analysis && !isLoading && (
             <div className="h-full space-y-4 rounded-lg bg-muted/50 p-4">
                <p className="whitespace-pre-wrap text-sm">{analysis}</p>
              </div>
          )}
          {!analysis && !isLoading && (
            <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed text-center">
              <p className="text-muted-foreground">Analysis results will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
