
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dice6, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameStore, Task } from '@/store/gameStore';

interface DiceRollerProps {
  onRoll: (result: number) => void;
  targetAC: number;
  taskName: string;
  taskCategory: Task['category'];
  isOpen: boolean;
  onClose: () => void;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  onRoll,
  targetAC,
  taskName,
  taskCategory,
  isOpen,
  onClose
}) => {
  const { diceType, character, useSpell, spellsUsed } = useGameStore();
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [canUseSpell, setCanUseSpell] = useState(character.avatar.id === 'mage' && spellsUsed < 3);

  const getModifiers = () => {
    const { avatar } = character;
    let totalBonus = avatar.baseBonus;
    let modifierText = `Base: +${avatar.baseBonus}`;

    if (avatar.specialties.includes(taskCategory)) {
      totalBonus += 3;
      modifierText += ', Especialidade: +3';
    } else if (avatar.weaknesses.includes(taskCategory)) {
      totalBonus -= 2;
      modifierText += ', Fraqueza: -2';
    }

    return { totalBonus, modifierText };
  };

  const rollDice = async () => {
    setIsRolling(true);
    
    // Simulate dice rolling animation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const baseRoll = Math.floor(Math.random() * diceType) + 1;
    const { totalBonus } = getModifiers();
    const totalRoll = baseRoll + totalBonus;
    
    setLastRoll(totalRoll);
    setIsRolling(false);
    
    setTimeout(() => {
      onRoll(totalRoll);
      onClose();
    }, 1500);
  };

  const handleSpellReroll = async () => {
    if (useSpell()) {
      setCanUseSpell(false);
      setLastRoll(null);
      await rollDice();
    }
  };

  const { modifierText } = getModifiers();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-amber-300 p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-amber-800">Teste de Habilidade</h3>
            <p className="text-amber-700">Enfrente o desafio: <span className="font-bold">{taskName}</span></p>
            <p className="text-sm text-amber-600">Classe de Armadura: {targetAC}</p>
          </div>

          {/* Avatar Info */}
          <div className="bg-white/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">{character.avatar.icon}</span>
              <span className="font-bold text-amber-800">{character.avatar.name}</span>
            </div>
            <p className="text-xs text-amber-700">{modifierText}</p>
          </div>

          <div className="space-y-4">
            <motion.div
              className="flex justify-center"
              animate={isRolling ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isRolling ? Infinity : 0 }}
            >
              <div className="relative">
                <Dice6 
                  size={80} 
                  className={`${isRolling ? 'text-blue-500' : 'text-amber-600'} transition-colors duration-300`}
                />
                {lastRoll && !isRolling && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="text-2xl font-bold text-white bg-amber-600 rounded-full w-12 h-12 flex items-center justify-center">
                      {lastRoll}
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {lastRoll && !isRolling && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2"
              >
                <p className="text-lg font-semibold">
                  Resultado: <span className="text-2xl text-amber-700">{lastRoll}</span>
                </p>
                <p className={`font-bold ${lastRoll >= targetAC ? 'text-green-600' : 'text-red-600'}`}>
                  {lastRoll >= targetAC ? '✅ SUCESSO!' : '❌ FALHOU!'}
                </p>
                <p className="text-sm text-amber-600">{modifierText}</p>
              </motion.div>
            )}

            <div className="space-y-3">
              {!lastRoll && (
                <Button
                  onClick={rollDice}
                  disabled={isRolling}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {isRolling ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="mr-2"
                      >
                        <Dice6 size={16} />
                      </motion.div>
                      Rolando...
                    </>
                  ) : (
                    <>
                      <Dice6 className="mr-2" size={16} />
                      Rolar D{diceType}
                    </>
                  )}
                </Button>
              )}

              {lastRoll && canUseSpell && lastRoll < targetAC && character.avatar.id === 'mage' && (
                <Button
                  onClick={handleSpellReroll}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Sparkles className="mr-2" size={16} />
                  Usar Magia - Rolar Novamente
                </Button>
              )}

              <Button
                onClick={onClose}
                variant="outline"
                className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                {lastRoll ? 'Continuar' : 'Cancelar'}
              </Button>
            </div>
          </div>

          <div className="text-xs text-amber-600 space-y-1">
            <p>👨‍💻 Desenvolvedor: Especialista em tarefas técnicas</p>
            <p>📊 Analista: Expert em negócios e documentação</p>
            <p>🎨 Designer: Focado em design e UX</p>
            <p>🧪 Tester: Especialista em testes</p>
            <p>⚖️ Generalista: Bônus equilibrado para tudo</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
