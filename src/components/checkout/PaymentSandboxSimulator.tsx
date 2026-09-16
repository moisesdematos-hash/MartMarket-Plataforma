// ==============================================================================
// MARTMARKET PAYMENT SANDBOX SIMULATOR & GATEWAY QA
// ==============================================================================

import React, { useState } from 'react';
import { Terminal, Smartphone, Building2, CheckCircle2, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface PaymentSandboxSimulatorProps {
  onSimulateApproved: (method: string) => void;
  onSimulateDeclined: () => void;
  currentMethod: string;
}

export const PaymentSandboxSimulator: React.FC<PaymentSandboxSimulatorProps> = ({
  onSimulateApproved,
  onSimulateDeclined,
  currentMethod
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunSimulation = (type: 'approved' | 'declined') => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      if (type === 'approved') {
        onSimulateApproved(currentMethod);
      } else {
        onSimulateDeclined();
      }
    }, 700);
  };

  return (
    <div className="rounded-2xl bg-slate-950 border border-amber-500/30 p-4 space-y-3 text-xs text-slate-300">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-slate-100">Sandbox / Simulador de Gateways</span>
        </div>
        <Badge variant="warning" size="sm">Ambiente de Teste</Badge>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        Permite testar o comportamento do checkout, simulação de aprovação em tempo real e retorno de webhooks sem cobrança real.
      </p>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          type="button"
          variant="success"
          size="sm"
          isLoading={isSimulating}
          onClick={() => handleRunSimulation('approved')}
          leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
        >
          Simular Pagamento Aprovado (MCX / PayPay / Ref)
        </Button>

        <Button
          type="button"
          variant="danger"
          size="sm"
          isLoading={isSimulating}
          onClick={() => handleRunSimulation('declined')}
          leftIcon={<XCircle className="w-3.5 h-3.5" />}
        >
          Simular Falha / Recusa
        </Button>
      </div>
    </div>
  );
};
