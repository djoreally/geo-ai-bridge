
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Truck, Fuel, MapPin, Users, Wrench } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

export default function FleetManagement() {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVans = state.vans.filter(van =>
    van.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    van.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeVans = state.vans.filter(van => van.status === 'active').length;
  const maintenanceVans = state.vans.filter(van => van.status === 'maintenance').length;
  const avgFuelLevel = state.vans.length > 0 ? 
    state.vans.reduce((sum, van) => sum + van.fuelLevel, 0) / state.vans.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage your service vehicle fleet
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Van
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.vans.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeVans}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{maintenanceVans}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Fuel Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgFuelLevel.toFixed(0)}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <Truck className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="gap-2">
            <Wrench className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="tracking" className="gap-2">
            <MapPin className="h-4 w-4" />
            Tracking
          </TabsTrigger>
          <TabsTrigger value="fuel">Fuel</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredVans.map((van) => (
              <Card key={van.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Truck className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{van.name}</h3>
                        <p className="text-sm text-muted-foreground">{van.make} {van.model} {van.year}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm">{van.licensePlate}</span>
                          {van.currentLocation && (
                            <span className="text-sm text-muted-foreground">
                              Last seen: {van.currentLocation.lastUpdated.toLocaleTimeString()}
                            </span>
                          )}
                          <div className="flex items-center space-x-1">
                            <Fuel className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{van.fuelLevel}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={van.status === 'active' ? 'default' : 'secondary'}
                      >
                        {van.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="fuel" className="space-y-4">
          <div className="grid gap-4">
            {filteredVans.map((van) => (
              <Card key={van.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Fuel className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{van.name}</h3>
                        <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className={`h-2 rounded-full ${
                              van.fuelLevel > 50 ? 'bg-green-500' : 
                              van.fuelLevel > 25 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${van.fuelLevel}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{van.fuelLevel}%</div>
                      <p className="text-sm text-muted-foreground">Fuel Level</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
