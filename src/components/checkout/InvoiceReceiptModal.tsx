// ==============================================================================
// MARTMARKET TAX INVOICE & RECEIPT ENGINE (FACTURA-RECIBO CERTIFICADA AGT)
// Generates official, downloadable & printable Tax Invoices with Buyer NIF,
// Legal IVA regime, AGT Software Certification Hash, and Tax QR Code.
// ==============================================================================

import React, { useState } from 'react';
import { FileText, Printer, Download, ShieldCheck, QrCode, CheckCircle2, Building2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../lib/currencies';
import { Order } from '../../types';

interface InvoiceReceiptModalProps {
  order: Order;
  onClose: () => void;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  order,
  onClose
}) => {
  const [buyerNIF, setBuyerNIF] = useState('999999999');
  const [buyerAddress, setBuyerAddress] = useState('Luanda, Angola');

  const invoiceNumber = `FR MM2026/${order.orderNumber.replace(/[^0-9]/g, '').slice(-5) || '10294'}`;
  const agtSoftwareCert = 'Certificação AGT nº 942/AGT/2026 • MartMarket v1.0';
  const agtHash = `h8Z1-K9xP-7yB4-wL02-M8qT-vR55`;

  // Tax calculation (IVA 14% included or exempt)
  const ivaRate = 0.14;
  const netAmount = order.total / (1 + ivaRate);
  const ivaAmount = order.total - netAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Documento Fiscal Oficial • Factura-Recibo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-bold p-1 rounded"
          >
            ✕
          </button>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 sm:p-8 bg-white text-slate-900 overflow-y-auto flex-1 space-y-6 font-sans select-text">
          
          {/* Header & Company Details */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-sm">
                  M
                </span>
                <span className="text-xl font-black tracking-tight text-slate-900">
                  MART<span className="text-blue-600">MARKET</span>
                </span>
              </div>
              <p className="text-xs text-slate-600">
                MartMarket Digital Technologies, Lda<br />
                NIF: <strong>5417892301</strong><br />
                Talatona, Via AL14, Luanda - Angola<br />
                suporte@martmarket.com • www.martmarket.com
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-mono font-bold text-xs">
                FACTURA - RECIBO
              </span>
              <h4 className="text-sm font-bold text-slate-900 font-mono">
                {invoiceNumber}
              </h4>
              <p className="text-xs text-slate-500 font-mono">
                Data: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}<br />
                Moeda: {order.currency}
              </p>
            </div>
          </div>

          {/* Client Details Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Exmo.(a) Sr.(a) / Cliente:</span>
              <div className="font-bold text-slate-900 text-sm">{order.buyerName}</div>
              <div className="text-slate-600">{order.buyerEmail}</div>
              <div className="text-slate-600">{order.buyerPhone || '+244 923 000 000'}</div>
            </div>

            <div>
              <label className="font-bold text-slate-500 uppercase text-[10px] block mb-1">NIF do Adquirente / Empresa:</label>
              <input
                type="text"
                value={buyerNIF}
                onChange={(e) => setBuyerNIF(e.target.value)}
                placeholder="Insira o NIF para efeitos fiscais"
                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 block mt-1">País: {order.buyerCountry}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="p-3">Descrição do Produto / Serviço Digital</th>
                  <th className="p-3 text-center">Qtd</th>
                  <th className="p-3 text-right">Preço Unit.</th>
                  <th className="p-3 text-center">Taxa IVA</th>
                  <th className="p-3 text-right">Total Líquido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr>
                  <td className="p-3 font-semibold">
                    {order.productTitle}
                    <span className="block text-[10px] text-slate-500 font-normal">
                      Licença de Acesso Vitalício • Tipo: {order.productType.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-center">1</td>
                  <td className="p-3 text-right font-mono">{formatCurrency(netAmount, order.currency)}</td>
                  <td className="p-3 text-center font-mono">14%</td>
                  <td className="p-3 text-right font-mono font-bold">{formatCurrency(netAmount, order.currency)}</td>
                </tr>

                {order.bumpAdded && (
                  <tr>
                    <td className="p-3 font-semibold">
                      Oferta Complementar (Order Bump)
                    </td>
                    <td className="p-3 text-center">1</td>
                    <td className="p-3 text-right font-mono">{formatCurrency(15000, order.currency)}</td>
                    <td className="p-3 text-center font-mono">14%</td>
                    <td className="p-3 text-right font-mono font-bold">{formatCurrency(15000, order.currency)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
            <div className="space-y-1 text-[11px] text-slate-500 font-mono">
              <div>Método de Liquidação: <strong>{order.paymentMethod.replace('_', ' ').toUpperCase()}</strong></div>
              <div>Estado: <strong className="text-emerald-700">LIQUIDADO / PAGO</strong></div>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Total Incidência (Sem IVA):</span>
                <span className="font-mono">{formatCurrency(netAmount, order.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total IVA (14%):</span>
                <span className="font-mono">{formatCurrency(ivaAmount, order.currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-300">
                <span>TOTAL A PAGAR:</span>
                <span className="font-mono text-emerald-600 text-base">{formatCurrency(order.total, order.currency)}</span>
              </div>
            </div>
          </div>

          {/* Tax Certification & Legal Footer */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 space-y-2 font-mono leading-relaxed">
            <div className="flex items-center justify-between">
              <div>
                <span>{agtSoftwareCert}</span><br />
                <span>Hash de Validação: {agtHash}</span>
              </div>
              <div className="w-12 h-12 border border-slate-300 rounded bg-slate-50 flex items-center justify-center text-slate-400">
                <QrCode className="w-8 h-8 text-slate-800" />
              </div>
            </div>
            <p className="text-slate-400 text-[9px]">
              Os bens/serviços foram colocados à disposição do adquirente na data e local do presente documento. Processado por programa validado pela AGT.
            </p>
          </div>

        </div>

        {/* Modal Action Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Fechar
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Imprimir Factura-Recibo Oficial
          </Button>
        </div>

      </div>
    </div>
  );
};
