'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, MapPin, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

// Mock data - in a real app, this would come from an API
const mockLocations = {
  doctor: [
    { id: 1, name: 'City Clinic', address: '123 Health St, Cityville', distance: '1.2 mi' },
    { id: 2, name: 'Dr. Emily Carter', address: '456 Wellness Ave, Cityville', distance: '2.5 mi' },
  ],
  hospital: [
    { id: 1, name: 'City General Hospital', address: '789 Recovery Rd, Cityville', distance: '3.1 mi' },
  ],
  pharmacy: [
     { id: 1, name: 'HealthFirst Pharmacy', address: '101 Prescription Pl, Cityville', distance: '0.8 mi' },
     { id: 2, name: 'Med-Express', address: '202 Pill Ln, Cityville', distance: '1.5 mi' },
  ]
};

export function HealthServicesFinder() {
  const [serviceType, setServiceType] = useState('doctor');
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
      setHasLocationPermission(permissionStatus.state === 'granted');
      permissionStatus.onchange = () => {
        setHasLocationPermission(permissionStatus.state === 'granted');
      };
    });
  }, []);

  const handleSearch = () => {
    if (hasLocationPermission === false) {
       toast({
        variant: 'destructive',
        title: 'Location permission required',
        description: 'Please enable location services in your browser to find nearby services.',
      });
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLocations(mockLocations[serviceType as keyof typeof mockLocations] || []);
      setIsLoading(false);
    }, 1500);
  };

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setHasLocationPermission(true);
        toast({ title: 'Location access granted!' });
        handleSearch();
      },
      (error) => {
        setHasLocationPermission(false);
        toast({
          variant: 'destructive',
          title: 'Location Access Denied',
          description: 'You need to allow location access to use this feature.',
        });
      }
    );
  };

  return (
    <div className="grid gap-8 p-4 pt-0 md:p-6 md:pt-0">
      <Card>
        <CardHeader>
          <CardTitle>Find Health Services</CardTitle>
          <CardDescription>Select a service type and search to find locations near you.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">Doctors</SelectItem>
                <SelectItem value="hospital">Hospitals</SelectItem>
                <SelectItem value="pharmacy">Pharmacies</SelectItem>
              </SelectContent>
            </Select>
             {hasLocationPermission ? (
              <Button onClick={handleSearch} disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Search Nearby
              </Button>
            ) : (
              <Button onClick={requestLocation} className="w-full sm:w-auto">
                <MapPin className="mr-2 h-4 w-4" />
                Enable Location to Search
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>Showing nearby {serviceType}s.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : locations.length > 0 ? (
            <ul className="space-y-4">
              {locations.map(location => (
                <li key={location.id} className="flex items-start justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-semibold">{location.name}</p>
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                  </div>
                  <p className="text-sm font-medium text-primary">{location.distance}</p>
                </li>
              ))}
            </ul>
          ) : (
             <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
              <MapPin className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Search results will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
