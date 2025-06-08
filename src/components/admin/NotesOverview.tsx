import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, TrendingUp, Calendar, Eye } from 'lucide-react';
import { getNotes } from '@/utils/notesStorage';

interface NotesOverviewProps {
  onManageNotes: () => void;
}

const NotesOverview: React.FC<NotesOverviewProps> = ({ onManageNotes }) => {
  const [notesData, setNotesData] = useState({
    total: 0,
    thisMonth: 0,
    recentNotes: [] as any[]
  });

  useEffect(() => {
    loadNotesData();
  }, []);

  const loadNotesData = async () => {
    try {
      const notes = await getNotes();
      const now = new Date();
      const thisMonth = notes.filter(note => {
        const noteDate = new Date(note.createdAt);
        return noteDate.getMonth() === now.getMonth() && 
               noteDate.getFullYear() === now.getFullYear();
      });

      setNotesData({
        total: notes.length,
        thisMonth: thisMonth.length,
        recentNotes: notes.slice(0, 5)
      });
    } catch (error) {
      console.error('Error loading notes data:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notes Overview</h2>
        <Button onClick={onManageNotes}>
          Manage Notes
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Notes</p>
                <p className="text-xl font-bold">{notesData.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-xl font-bold">{notesData.thisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recent Activity</p>
                <p className="text-xl font-bold">{notesData.recentNotes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notes</CardTitle>
        </CardHeader>
        <CardContent>
          {notesData.recentNotes.length > 0 ? (
            <div className="space-y-3">
              {notesData.recentNotes.map((note) => (
                <div key={note.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{note.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {note.slug}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/notes/${note.slug}`, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No notes created yet</p>
              <Button onClick={onManageNotes}>
                Create Your First Note
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotesOverview;