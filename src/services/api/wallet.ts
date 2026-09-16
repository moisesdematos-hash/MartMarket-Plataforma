import { supabase } from '../../lib/supabase';
import { LedgerEntry, WithdrawalRequest, PayoutMethod } from '../../types';

export const walletApi = {
  /**
   * Get wallet balance for the authenticated user
   */
  async getWalletBalance(userId: string): Promise<{ available: number; pending: number }> {
    const { data, error } = await supabase
      .from('wallet_ledger')
      .select('amount, status')
      .eq('user_id', userId);

    if (error) throw error;

    const available = data.filter(d => d.status === 'available').reduce((acc, curr) => acc + curr.amount, 0);
    const pending = data.filter(d => d.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);

    return { available, pending };
  },

  /**
   * Get ledger entries for the user
   */
  async getLedger(userId: string): Promise<LedgerEntry[]> {
    const { data, error } = await supabase
      .from('wallet_ledger')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as LedgerEntry[];
  },

  /**
   * Request a new withdrawal
   */
  async requestWithdrawal(userId: string, amount: number, payoutMethodId: string): Promise<WithdrawalRequest> {
    // Note: This would typically be handled via a secure edge function,
    // this is a direct insert for architecture demonstration.
    const { data, error } = await supabase
      .from('wallet_ledger')
      .insert([{
        user_id: userId,
        amount: -amount,
        currency: 'AOA',
        type: 'withdrawal',
        status: 'processing',
        description: 'Pedido de Levantamento'
      }])
      .select()
      .single();

    if (error) throw error;
    return data as any;
  }
};
