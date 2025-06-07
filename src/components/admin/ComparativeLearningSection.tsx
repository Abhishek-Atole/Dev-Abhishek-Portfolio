
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, GitCompare, Code2, Lightbulb } from 'lucide-react';

interface ComparisonItem {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  useCases: string[];
}

interface ComparativeLearningData {
  topic: string;
  description: string;
  items: ComparisonItem[];
}

interface ComparativeLearningSectionProps {
  data: ComparativeLearningData;
  onChange: (data: ComparativeLearningData) => void;
}

const ComparativeLearningSection: React.FC<ComparativeLearningSectionProps> = ({
  data,
  onChange
}) => {
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');
  const [newUseCase, setNewUseCase] = useState('');
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const addComparisonItem = () => {
    const newItem: ComparisonItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      pros: [],
      cons: [],
      useCases: []
    };

    onChange({
      ...data,
      items: [...data.items, newItem]
    });
  };

  const updateItem = (itemId: string, updates: Partial<ComparisonItem>) => {
    onChange({
      ...data,
      items: data.items.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    });
  };

  const removeItem = (itemId: string) => {
    onChange({
      ...data,
      items: data.items.filter(item => item.id !== itemId)
    });
  };

  const addListItem = (itemId: string, listType: 'pros' | 'cons' | 'useCases', value: string) => {
    if (!value.trim()) return;

    const item = data.items.find(i => i.id === itemId);
    if (!item) return;

    updateItem(itemId, {
      [listType]: [...item[listType], value.trim()]
    });

    // Clear the input
    if (listType === 'pros') setNewPro('');
    if (listType === 'cons') setNewCon('');
    if (listType === 'useCases') setNewUseCase('');
  };

  const removeListItem = (itemId: string, listType: 'pros' | 'cons' | 'useCases', index: number) => {
    const item = data.items.find(i => i.id === itemId);
    if (!item) return;

    const newList = item[listType].filter((_, i) => i !== index);
    updateItem(itemId, { [listType]: newList });
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="border-b border-border bg-muted/30">
        <CardTitle className="flex items-center gap-3">
          <GitCompare size={20} className="text-primary" />
          Comparative Learning Section
          <Badge variant="secondary" className="text-xs font-mono">
            Enhanced Learning
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Topic and Description */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="comparison-topic">Comparison Topic</Label>
            <Input
              id="comparison-topic"
              value={data.topic}
              onChange={(e) => onChange({ ...data, topic: e.target.value })}
              placeholder="e.g., React vs Vue vs Angular"
              className="font-mono"
            />
          </div>
          <div>
            <Label htmlFor="comparison-description">Overview Description</Label>
            <Textarea
              id="comparison-description"
              value={data.description}
              onChange={(e) => onChange({ ...data, description: e.target.value })}
              placeholder="Provide an overview of what you're comparing and why..."
              rows={3}
            />
          </div>
        </div>

        {/* Comparison Items */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Code2 size={18} className="text-primary" />
              Comparison Items
            </h3>
            <Button onClick={addComparisonItem} variant="outline" size="sm">
              <Plus size={16} className="mr-2" />
              Add Item
            </Button>
          </div>

          {data.items.map((item) => (
            <Card key={item.id} className="border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={item.title}
                      onChange={(e) => updateItem(item.id, { title: e.target.value })}
                      placeholder="Technology/Framework name"
                      className="font-mono font-semibold"
                    />
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      placeholder="Brief description of this technology..."
                      rows={2}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="ml-4 text-destructive hover:bg-destructive/10"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pros Section */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-green-600">
                    <Lightbulb size={14} />
                    Advantages
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={activeItemId === item.id ? newPro : ''}
                      onChange={(e) => {
                        setActiveItemId(item.id);
                        setNewPro(e.target.value);
                      }}
                      placeholder="Add an advantage..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addListItem(item.id, 'pros', newPro);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => addListItem(item.id, 'pros', newPro)}
                      variant="outline"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.pros.map((pro, index) => (
                      <Badge key={index} variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                        {pro}
                        <button
                          onClick={() => removeListItem(item.id, 'pros', index)}
                          className="ml-1 hover:text-green-900"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Cons Section */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-red-600">
                    <X size={14} />
                    Disadvantages
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={activeItemId === item.id ? newCon : ''}
                      onChange={(e) => {
                        setActiveItemId(item.id);
                        setNewCon(e.target.value);
                      }}
                      placeholder="Add a disadvantage..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addListItem(item.id, 'cons', newCon);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => addListItem(item.id, 'cons', newCon)}
                      variant="outline"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.cons.map((con, index) => (
                      <Badge key={index} variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                        {con}
                        <button
                          onClick={() => removeListItem(item.id, 'cons', index)}
                          className="ml-1 hover:text-red-900"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Use Cases Section */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-blue-600">
                    <Code2 size={14} />
                    Best Use Cases
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={activeItemId === item.id ? newUseCase : ''}
                      onChange={(e) => {
                        setActiveItemId(item.id);
                        setNewUseCase(e.target.value);
                      }}
                      placeholder="Add a use case..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addListItem(item.id, 'useCases', newUseCase);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => addListItem(item.id, 'useCases', newUseCase)}
                      variant="outline"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.useCases.map((useCase, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {useCase}
                        <button
                          onClick={() => removeListItem(item.id, 'useCases', index)}
                          className="ml-1 hover:text-blue-900"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {data.items.length === 0 && (
            <Card className="border-dashed border-2 border-muted-foreground/25">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <GitCompare size={48} className="text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No comparison items yet
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add comparison items to create detailed side-by-side analysis
                </p>
                <Button onClick={addComparisonItem} variant="outline">
                  <Plus size={16} className="mr-2" />
                  Add First Item
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview Section */}
        {data.items.length > 0 && (
          <Card className="bg-muted/30 border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Code2 size={16} className="text-primary" />
                Comparison Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <p><strong>Topic:</strong> {data.topic || 'No topic set'}</p>
              <p><strong>Items:</strong> {data.items.length} comparison{data.items.length !== 1 ? 's' : ''}</p>
              <p><strong>Status:</strong> {data.items.every(item => item.title && item.description) ? '✅ Ready' : '⚠️ Incomplete'}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default ComparativeLearningSection;
