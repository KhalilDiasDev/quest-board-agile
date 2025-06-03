
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, Dice6, TrendingUp, Calendar, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/store/gameStore';

export const ActionLog: React.FC = () => {
  const { actionLog } = useGameStore();

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'roll':
        return <Dice6 size={16} className="text-blue-600" />;
      case 'levelup':
        return <TrendingUp size={16} className="text-yellow-600" />;
      case 'sprint':
        return <Calendar size={16} className="text-purple-600" />;
      default:
        return <Zap size={16} className="text-green-600" />;
    }
  };

  const getLogColor = (type: string, success?: boolean) => {
    if (type === 'roll') {
      return success ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50';
    }
    
    switch (type) {
      case 'levelup':
        return 'text-yellow-700 bg-yellow-50';
      case 'sprint':
        return 'text-purple-700 bg-purple-50';
      default:
        return 'text-blue-700 bg-blue-50';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300 border-2">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Scroll className="text-slate-600" size={20} />
          <h3 className="font-bold text-lg">Pergaminho de Aventuras</h3>
          <Badge variant="outline" className="text-xs">
            {actionLog.length} entradas
          </Badge>
        </div>

        <ScrollArea className="h-64">
          <AnimatePresence>
            {actionLog.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Scroll size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma aventura registrada ainda...</p>
                <p className="text-xs">Comece criando uma quest!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {actionLog.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-3 rounded-lg border ${getLogColor(log.type, log.success)} transition-all duration-200`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0 mt-0.5">
                        {getLogIcon(log.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-relaxed">
                          {log.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-75">
                            {formatTime(log.timestamp)}
                          </span>
                          
                          {log.diceRoll && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                log.success
                                  ? 'border-green-400 text-green-700'
                                  : 'border-red-400 text-red-700'
                              }`}
                            >
                              🎲 {log.diceRoll}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </div>
    </Card>
  );
};
