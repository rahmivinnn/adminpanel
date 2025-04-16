'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, Search } from 'lucide-react';
import MeditationUploadForm from './MeditationUploadForm';

interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  plays: number;
}

export default function MeditationManagement() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [meditations, setMeditations] = useState<Meditation[]>([
    {
      id: '1',
      title: 'Deep Relaxation For Parents',
      description: 'A calming meditation for parents',
      duration: '10 min',
      category: 'Relaxation',
      plays: 4500
    },
    {
      id: '2',
      title: 'Quick Stress Reset',
      description: 'Quick meditation for stress relief',
      duration: '5 min',
      category: 'Stress Relief',
      plays: 3200
    },
    {
      id: '3',
      title: 'Focus Booster',
      description: 'Enhance your focus and concentration',
      duration: '15 min',
      category: 'Focus',
      plays: 2800
    }
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-900">Meditation Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500">Total Meditations</p>
            <p className="text-2xl font-bold text-gray-900">{meditations.length}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowUploadForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Meditation
            </Button>
            <Button 
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowUploadForm(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Meditation
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search meditations..."
              className="pl-10"
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="stress-relief">Stress Relief</SelectItem>
              <SelectItem value="focus">Focus</SelectItem>
              <SelectItem value="sleep">Sleep</SelectItem>
              <SelectItem value="anxiety-relief">Anxiety Relief</SelectItem>
              <SelectItem value="mindfulness">Mindfulness</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meditations.map((meditation) => (
            <Card key={meditation.id}>
              <CardHeader>
                <CardTitle className="text-gray-900">{meditation.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{meditation.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Duration: {meditation.duration}</span>
                  <span>Category: {meditation.category}</span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Plays: {meditation.plays.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {showUploadForm && (
          <MeditationUploadForm
            onClose={() => setShowUploadForm(false)}
            onUploadComplete={() => {
              setShowUploadForm(false);
              // Here you would typically refresh the meditations list
            }}
          />
        )}
      </CardContent>
    </Card>
  );
} 