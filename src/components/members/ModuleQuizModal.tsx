// ==============================================================================
// MARTMARKET MODULE QUIZ & CERTIFICATE GATING ENGINE
// Interactive evaluation system with multiple-choice questions, automated scoring,
// passing threshold validation, and instant certificate eligibility feedback.
// ==============================================================================

import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface ModuleQuizModalProps {
  moduleTitle: string;
  onPassed: () => void;
  onClose: () => void;
}

const SAMPLE_QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Qual é o benefício primário de utilizar uma arquitetura baseada no padrão Double-Entry Ledger em plataformas financeiras?',
    options: [
      'Garantir que a soma de todos os débitos seja estritamente igual à soma de todos os créditos, evitando inconsistência de saldo.',
      'Reduzir a latência das consultas ao banco de dados em 90%.',
      'Permitir que usuários façam saques sem confirmação do banco.',
      'Substituir a necessidade de criptografia HTTPS nas rotas.'
    ],
    correctIndex: 0,
    explanation: 'O padrão contábil de partidas dobradas (Double-Entry Ledger) garante integridade matemática absoluta: cada transação tem origem e destino equilibrados.'
  },
  {
    id: 2,
    question: 'Como a MartMarket viabiliza transações financeiras em Angola sem depender do gateway Stripe?',
    options: [
      'Utiliza transferências em dinheiro físico via correio.',
      'Implementa adaptadores para Multicaixa Express (Push MCX), Referência GPO e Unitel Money via APIs bancárias seguras.',
      'Obriga todos os clientes a criarem contas bancárias internacionais no exterior.',
      'Aceita apenas permuta de bens digitais.'
    ],
    correctIndex: 1,
    explanation: 'A arquitetura desacoplada do PaymentEngine usa adaptadores de pagamento locais homologados para a rede EMIS/Multicaixa de Angola.'
  },
  {
    id: 3,
    question: 'Para que serve a técnica de Marca d’Água Dinâmica (Dynamic Watermarking) implementada no player de vídeo?',
    options: [
      'Aumentar o consumo de banda de internet do aluno.',
      'Desestimular e rastrear gravações de tela e vazamentos piratas exibindo identificadores do usuário em posições flutuantes.',
      'Inserir anúncios de terceiros no meio da aula.',
      'Diminuir a resolução do vídeo automaticamente.'
    ],
    correctIndex: 1,
    explanation: 'A marca d’água translúcida exibe o nome, e-mail e hash IP do aluno pulsando na tela para rastrear qualquer captura não autorizada.'
  },
  {
    id: 4,
    question: 'Qual é a principal função de um Order Bump no One-Page Checkout?',
    options: [
      'Bloquear a compra caso o cliente não compre dois produtos.',
      'Aumentar o Ticket Médio (AOV) permitindo a adição de um produto complementar com apenas 1 clique antes de finalizar o pedido.',
      'Cobrar taxas ocultas sem consentimento do comprador.',
      'Redirecionar o cliente para outro site externo.'
    ],
    correctIndex: 1,
    explanation: 'O Order Bump é uma oferta de complemento imediato com alto índice de conversão (geralmente entre 20% e 40% de adesão).'
  }
];

export const ModuleQuizModal: React.FC<ModuleQuizModalProps> = ({
  moduleTitle,
  onPassed,
  onClose
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const questions = SAMPLE_QUIZ_QUESTIONS;
  const passingScorePercentage = 75; // Requires 3/4 (75%) or 4/4 (100%)

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });
    const percentage = Math.round((correctCount / questions.length) * 100);
    return { correctCount, total: questions.length, percentage, isPassed: percentage >= passingScorePercentage };
  };

  const scoreResult = calculateScore();

  const handleFinishQuiz = () => {
    setSubmitted(true);
    if (scoreResult.isPassed) {
      onPassed();
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setCurrentStep(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Avaliação de Fixação: {moduleTitle}
              </h3>
              <p className="text-xs text-slate-400">
                Nota mínima para aprovação e liberação do certificado: {passingScorePercentage}%
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!submitted ? (
            <div className="space-y-6">
              {/* Question Stepper / Tracker */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Pergunta {currentStep + 1} de {questions.length}</span>
                <span>{Object.keys(selectedAnswers).length} de {questions.length} respondidas</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Current Question Block */}
              {(() => {
                const q = questions[currentStep];
                const selected = selectedAnswers[q.id];

                return (
                  <div className="space-y-4 animate-fade-in">
                    <h4 className="text-base font-bold text-white leading-snug">
                      {q.question}
                    </h4>

                    <div className="space-y-2.5">
                      {q.options.map((option, optIdx) => {
                        const isChosen = selected === optIdx;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer flex items-start gap-3 ${
                              isChosen
                                ? 'bg-blue-600/15 border-blue-500 text-white shadow-sm ring-1 ring-blue-500'
                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5 ${
                                isChosen ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1">{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-6 space-y-6 animate-fade-in">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700 shadow-xl">
                {scoreResult.isPassed ? (
                  <Award className="w-16 h-16 text-emerald-400 animate-pulse" />
                ) : (
                  <XCircle className="w-16 h-16 text-rose-400" />
                )}
              </div>

              <div>
                <Badge
                  variant={scoreResult.isPassed ? 'success' : 'danger'}
                  size="md"
                  icon={scoreResult.isPassed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                >
                  {scoreResult.isPassed ? 'Aprovado com Sucesso!' : 'Necessário Revisar o Conteúdo'}
                </Badge>
                
                <h3 className="text-2xl font-black text-white mt-3">
                  Sua Pontuação: {scoreResult.percentage}% ({scoreResult.correctCount}/{scoreResult.total} corretas)
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  {scoreResult.isPassed
                    ? 'Parabéns! Você demonstrou domínio dos conceitos chave deste módulo e está elegível para avançar.'
                    : `Você precisa de no mínimo ${passingScorePercentage}% de aproveitamento. Assista novamente às aulas e refaça o teste.`}
                </p>
              </div>

              {/* Answers Breakdown */}
              <div className="text-left space-y-3 pt-4 border-t border-slate-800">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Gabarito Comentado:
                </h5>
                {questions.map((q, idx) => {
                  const isCorrect = selectedAnswers[q.id] === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        isCorrect
                          ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300'
                          : 'bg-rose-950/20 border-rose-800/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-white">{idx + 1}. {q.question}</span>
                        {isCorrect ? (
                          <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correta
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1 text-[11px]">
                            <XCircle className="w-3.5 h-3.5" /> Incorreta
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans italic">
                        💡 {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {!submitted ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Voltar
              </Button>

              <div className="flex gap-2">
                {currentStep < questions.length - 1 ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    disabled={selectedAnswers[questions[currentStep].id] === undefined}
                  >
                    Próxima Pergunta <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    className="!bg-emerald-600 hover:!bg-emerald-500"
                    onClick={handleFinishQuiz}
                    disabled={Object.keys(selectedAnswers).length < questions.length}
                  >
                    Finalizar Avaliação <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              {!scoreResult.isPassed ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetake}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Tentar Novamente
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Progresso do módulo certificado registrado no ledger!</span>
                </div>
              )}

              <Button
                variant="primary"
                size="sm"
                onClick={onClose}
              >
                {scoreResult.isPassed ? 'Continuar Curso' : 'Fechar'}
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
