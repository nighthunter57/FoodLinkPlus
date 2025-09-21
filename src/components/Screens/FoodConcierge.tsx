import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FoodConciergeProps {
  questions: { text: string; options: string[] }[];
  currentQuestion: number;
  chatMessages: string[];
  handleQuickResponse: (response: string) => void;
  handleBrowseDeals: () => void;
}

export const FoodConcierge: React.FC<FoodConciergeProps> = ({
  questions,
  currentQuestion,
  chatMessages,
  handleQuickResponse,
  handleBrowseDeals,
}) => {
  return (
    <div className="p-4 bg-card border rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center">
          <MessageCircle size={20} className="text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Sam, your food concierge</h3>
          <p className="text-sm text-muted-foreground">Here to help you find the perfect meal</p>
        </div>
      </div>

      {chatMessages.length === 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-foreground">{questions[currentQuestion].text}</p>
          <div className="flex flex-wrap gap-2">
            {questions[currentQuestion].options.map((option) => (
              <Button
                key={option}
                variant="outline"
                size="sm"
                onClick={() => handleQuickResponse(option)}
                className="text-xs"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {chatMessages.map((message, index) => (
            <div key={index} className="text-sm bg-secondary p-2 rounded-lg">
              {message}
            </div>
          ))}
          {currentQuestion < questions.length - 1 && (
            <div className="space-y-2">
              <p className="text-sm text-foreground">{questions[currentQuestion].text}</p>
              <div className="flex flex-wrap gap-2">
                {questions[currentQuestion].options.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickResponse(option)}
                    className="text-xs"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <Button size="sm" className="bg-gradient-to-r from-accent to-accent/80">
          <Sparkles size={14} className="mr-1" />
          Surprise Me!
        </Button>
        <Button variant="outline" size="sm" onClick={handleBrowseDeals}>
          Browse Deals
        </Button>
      </div>
    </div>
  );
};
