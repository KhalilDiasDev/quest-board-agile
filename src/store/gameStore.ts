import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'business' | 'design' | 'testing' | 'documentation';
  difficulty: 'easy' | 'medium' | 'hard';
  armorClass: number;
  status: 'todo' | 'inprogress' | 'done' | 'finish' | 'failed';
  xpReward: number;
  createdAt: Date;
  completedAt?: Date;
  chances: number; // Chances restantes (máximo 3)
  maxChances: number; // Sempre 3
}

export interface Avatar {
  id: string;
  name: string;
  description: string;
  icon: string;
  specialties: Task['category'][];
  weaknesses: Task['category'][];
  baseBonus: number;
}

export interface Character {
  name: string;
  avatar: Avatar;
  level: number;
  xp: number;
  xpToNext: number;
  abilities: string[];
}

export interface Sprint {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  tasks: string[];
  isActive: boolean;
}

export interface ActionLog {
  id: string;
  type: 'roll' | 'move' | 'levelup' | 'sprint';
  message: string;
  timestamp: Date;
  diceRoll?: number;
  success?: boolean;
}

interface GameState {
  tasks: Task[];
  character: Character;
  availableAvatars: Avatar[];
  sprints: Sprint[];
  currentSprint: Sprint | null;
  actionLog: ActionLog[];
  diceType: number;
  spellsUsed: number;
  lastDiceResult: number | null; // Armazena o último resultado do dado
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'chances' | 'maxChances'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: Task['status']) => void;
  resetAllTasks: () => void;
  
  rollDice: (taskCategory: Task['category']) => number;
  attemptMoveTask: (taskId: string, newStatus: Task['status'], diceResult?: number) => boolean;
  setLastDiceResult: (result: number) => void;
  
  gainXp: (amount: number) => void;
  levelUp: () => void;
  
  createSprint: (sprint: Omit<Sprint, 'id'>) => void;
  setActiveSprint: (sprintId: string) => void;
  
  addLog: (log: Omit<ActionLog, 'id' | 'timestamp'>) => void;
  
  setDiceType: (type: number) => void;
  changeAvatar: (avatarId: string) => void;
  useSpell: () => boolean;
  resetSpellsForSprint: () => void;
}

// Avatares disponíveis
const avatars: Avatar[] = [
  {
    id: 'developer',
    name: 'Desenvolvedor',
    description: 'Especialista em programação e arquitetura de sistemas',
    icon: '👨‍💻',
    specialties: ['technical'],
    weaknesses: ['business', 'design'],
    baseBonus: 1
  },
  {
    id: 'analyst',
    name: 'Analista de Negócios',
    description: 'Expert em levantamento de requisitos e processos',
    icon: '📊',
    specialties: ['business', 'documentation'],
    weaknesses: ['technical'],
    baseBonus: 1
  },
  {
    id: 'designer',
    name: 'Designer UX/UI',
    description: 'Focado em experiência do usuário e interfaces',
    icon: '🎨',
    specialties: ['design'],
    weaknesses: ['technical', 'testing'],
    baseBonus: 1
  },
  {
    id: 'tester',
    name: 'Analista de Testes',
    description: 'Especialista em qualidade e testes automatizados',
    icon: '🧪',
    specialties: ['testing'],
    weaknesses: ['design', 'business'],
    baseBonus: 1
  },
  {
    id: 'fullstack',
    name: 'Generalista',
    description: 'Conhecimento amplo mas sem especializações',
    icon: '⚖️',
    specialties: [],
    weaknesses: [],
    baseBonus: 2
  }
];

// Tarefas pré-definidas com o novo sistema (sem hitPoints)
const initialTasks: Task[] = [
  {
    id: 'task-1',
    name: 'Levantamento de Requisitos',
    description: 'Definir funcionalidades e escopo do repositório de saberes',
    category: 'business',
    difficulty: 'easy',
    armorClass: 8,
    status: 'todo',
    xpReward: 80,
    createdAt: new Date(),
    chances: 3,
    maxChances: 3
  },
  {
    id: 'task-2',
    name: 'Modelagem do Banco de Dados',
    description: 'Criar diagrama ER e estrutura das tabelas para armazenar conhecimentos',
    category: 'technical',
    difficulty: 'medium',
    armorClass: 12,
    status: 'todo',
    xpReward: 120,
    createdAt: new Date(),
    chances: 3,
    maxChances: 3
  },
  {
    id: 'task-3',
    name: 'Implementar Sistema de Autenticação',
    description: 'Desenvolver login/logout e controle de acesso de usuários',
    category: 'technical',
    difficulty: 'hard',
    armorClass: 16,
    status: 'todo',
    xpReward: 180,
    createdAt: new Date(),
    chances: 3,
    maxChances: 3
  },
  {
    id: 'task-4',
    name: 'Criar Interface de Upload',
    description: 'Tela para upload de documentos, vídeos e materiais de conhecimento',
    category: 'design',
    difficulty: 'medium',
    armorClass: 11,
    status: 'todo',
    xpReward: 110,
    createdAt: new Date(),
    chances: 3,
    maxChances: 3
  },
  {
    id: 'task-5',
    name: 'Sistema de Busca e Filtros',
    description: 'Implementar busca textual e filtros por categoria, autor, data',
    category: 'technical',
    difficulty: 'hard',
    armorClass: 18,
    status: 'todo',
    xpReward: 200,
    createdAt: new Date(),
    chances: 3,
    maxChances: 3
  },
  {
    id: 'task-6',
    name: 'Dashboard de Administração',
    description: 'Painel para gestão de conteúdos, usuários e estatísticas',
    category: 'design',
    difficulty: 'medium',
    armorClass: 13,
    status: 'todo',
    xpReward: 140,
    createdAt: new Date(),
    chances: 3,
    maxChances: 3
  },
  {
    id: 'task-7',
    name: 'Sistema de Comentários',
    description: 'Permitir comentários e discussões nos materiais compartilhados',
    category: 'technical',
    difficulty: 'easy',
    armorClass: 9,
    status: 'todo',
    xpReward: 90,
    createdAt: new Date(),
    chances: 3,
    maxChances: 3
  },
  {
    id: 'task-8',
    name: 'Implementar Tags e Categorização',
    description: 'Sistema de tags para organizar e categorizar o conhecimento',
    category: 'business',
    difficulty: 'medium',
    armorClass: 12,
    status: 'todo',
    xpReward: 120,
    createdAt: new Date(),
    chances: 3,
    maxChances: 3
  },
  {
    id: 'task-9',
    name: 'API RESTful',
    description: 'Desenvolver endpoints para integração com outras aplicações',
    category: 'technical',
    difficulty: 'hard',
    armorClass: 15,
    status: 'todo',
    xpReward: 170,
    createdAt: new Date(),
    chances: 3,
    maxChances: 3
  },
  {
    id: 'task-10',
    name: 'Testes Automatizados',
    description: 'Criar suite de testes unitários e de integração',
    category: 'testing',
    difficulty: 'hard',
    armorClass: 17,
    status: 'todo',
    xpReward: 190,
    createdAt: new Date(),
    chances: 3,
    maxChances: 3
  }
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      tasks: initialTasks,
      character: {
        name: 'Aventureiro',
        avatar: avatars[0],
        level: 1,
        xp: 0,
        xpToNext: 100,
        abilities: ['Iniciante']
      },
      availableAvatars: avatars,
      sprints: [],
      currentSprint: null,
      actionLog: [],
      diceType: 20,
      spellsUsed: 0,
      lastDiceResult: null,

      addTask: (taskData) => {
        const task: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          chances: 3,
          maxChances: 3
        };
        
        set((state) => ({
          tasks: [...state.tasks, task]
        }));
        
        get().addLog({
          type: 'move',
          message: `Nova quest criada: "${task.name}" (CA: ${task.armorClass})`
        });
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map(task => 
            task.id === id ? { ...task, ...updates } : task
          )
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }));
      },

      moveTask: (id, newStatus) => {
        const task = get().tasks.find(t => t.id === id);
        if (!task) return;

        const updates: Partial<Task> = { status: newStatus };
        
        if (newStatus === 'finish' && task.status !== 'finish') {
          updates.completedAt = new Date();
          get().gainXp(task.xpReward);
          
          get().addLog({
            type: 'move',
            message: `Quest finalizada: "${task.name}" (+${task.xpReward} XP)`
          });
        } else if (newStatus === 'failed') {
          get().addLog({
            type: 'move',
            message: `Quest falhada: "${task.name}" - sem chances restantes`
          });
        } else {
          const statusNames = {
            todo: 'Taverna',
            inprogress: 'Missão',
            done: 'Batalha',
            finish: 'Vitória',
            failed: 'Falha'
          };
          
          get().addLog({
            type: 'move',
            message: `"${task.name}" movida para ${statusNames[newStatus]}`
          });
        }

        get().updateTask(id, updates);
      },

      resetAllTasks: () => {
        // Reset completo do jogo
        set({
          tasks: initialTasks.map(task => ({
            ...task,
            status: 'todo' as const,
            completedAt: undefined,
            chances: 3,
            createdAt: new Date()
          })),
          character: {
            name: 'Aventureiro',
            avatar: avatars[0],
            level: 1,
            xp: 0,
            xpToNext: 100,
            abilities: ['Iniciante']
          },
          actionLog: [],
          spellsUsed: 0,
          lastDiceResult: null
        });
        
        get().addLog({
          type: 'move',
          message: 'Jogo completamente resetado! Bem-vindo de volta, aventureiro!'
        });
      },

      rollDice: (taskCategory) => {
        const { diceType, character } = get();
        const baseRoll = Math.floor(Math.random() * diceType) + 1;
        let totalBonus = character.avatar?.baseBonus || 0;

        // Aplicar bônus por especialidade
        if (character.avatar?.specialties?.includes(taskCategory)) {
          totalBonus += 3;
        }

        // Aplicar penalidade por fraqueza
        if (character.avatar?.weaknesses?.includes(taskCategory)) {
          totalBonus -= 2;
        }

        const result = baseRoll + totalBonus;
        
        // Armazenar o resultado para uso posterior
        set({ lastDiceResult: result });
        
        return result;
      },

      setLastDiceResult: (result) => {
        set({ lastDiceResult: result });
      },

      attemptMoveTask: (taskId, newStatus, diceResult) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task) return false;

        // Não permitir rolagem se a task já foi completada ou falhou
        if (task.status === 'finish' || task.status === 'failed') {
          return false;
        }

        // Usar o resultado fornecido ou o último resultado armazenado
        const roll = diceResult || get().lastDiceResult || get().rollDice(task.category);
        const success = roll >= task.armorClass;
        
        const { character } = get();
        let bonusText = '';
        if (character.avatar?.specialties?.includes(task.category)) {
          bonusText = ' (Especialidade: +3)';
        } else if (character.avatar?.weaknesses?.includes(task.category)) {
          bonusText = ' (Fraqueza: -2)';
        }
        
        if (success) {
          // SUCESSO - Move para o próximo status automaticamente
          get().moveTask(taskId, newStatus);
          
          get().addLog({
            type: 'roll',
            message: `Rolou ${roll}, superou CA ${task.armorClass}! Quest avançou!${bonusText}`,
            diceRoll: roll,
            success: true
          });
        } else {
          // FALHA - Reduz chances (apenas na falha)
          const newChances = task.chances - 1;
          
          if (newChances <= 0) {
            // Sem chances restantes - task falha definitivamente
            get().moveTask(taskId, 'failed');
            get().addLog({
              type: 'roll',
              message: `Rolou ${roll}, falhou contra CA ${task.armorClass}. Quest falhou!${bonusText}`,
              diceRoll: roll,
              success: false
            });
          } else {
            // Ainda tem chances
            get().updateTask(taskId, { chances: newChances });
            get().addLog({
              type: 'roll',
              message: `Rolou ${roll}, falhou contra CA ${task.armorClass}. Chances restantes: ${newChances}${bonusText}`,
              diceRoll: roll,
              success: false
            });
          }
        }

        // Limpar o resultado armazenado após usar
        set({ lastDiceResult: null });

        return success;
      },

      gainXp: (amount) => {
        set((state) => {
          const newXp = state.character.xp + amount;
          let newLevel = state.character.level;
          let newXpToNext = state.character.xpToNext;
          
          if (newXp >= state.character.xpToNext) {
            newLevel++;
            newXpToNext = newLevel * 100;
            
            // Level up effects
            setTimeout(() => get().levelUp(), 500);
          }
          
          return {
            character: {
              ...state.character,
              xp: newXp,
              level: newLevel,
              xpToNext: newXpToNext
            }
          };
        });
      },

      levelUp: () => {
        const { character } = get();
        
        get().addLog({
          type: 'levelup',
          message: `Subiu para o nível ${character.level}! Novas habilidades desbloqueadas!`
        });
      },

      createSprint: (sprintData) => {
        const sprint: Sprint = {
          ...sprintData,
          id: crypto.randomUUID()
        };
        
        set((state) => ({
          sprints: [...state.sprints, sprint]
        }));
      },

      setActiveSprint: (sprintId) => {
        const sprint = get().sprints.find(s => s.id === sprintId);
        if (sprint) {
          set({ currentSprint: sprint });
          get().resetSpellsForSprint();
        }
      },

      addLog: (logData) => {
        const log: ActionLog = {
          ...logData,
          id: crypto.randomUUID(),
          timestamp: new Date()
        };
        
        set((state) => ({
          actionLog: [log, ...state.actionLog].slice(0, 50)
        }));
      },

      setDiceType: (type) => {
        set({ diceType: type });
      },

      changeAvatar: (avatarId) => {
        const avatar = get().availableAvatars.find(a => a.id === avatarId);
        if (avatar) {
          set((state) => ({
            character: {
              ...state.character,
              avatar
            }
          }));
          
          get().addLog({
            type: 'move',
            message: `Avatar alterado para ${avatar.name}: ${avatar.description}`
          });
        }
      },

      useSpell: () => {
        const { character, spellsUsed } = get();
        if (character.avatar?.id === 'mage' && spellsUsed < 3) {
          set((state) => ({
            spellsUsed: state.spellsUsed + 1
          }));
          return true;
        }
        return false;
      },

      resetSpellsForSprint: () => {
        set({ spellsUsed: 0 });
      }
    }),
    {
      name: 'rpg-task-manager'
    }
  )
);