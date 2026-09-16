import { supabase } from '../../lib/supabase';
import { Order } from '../../types';

export const ordersApi = {
  /**
   * Get orders placed by a specific buyer
   */
  async getBuyerOrders(buyerId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, products(*)')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Order[];
  },

  /**
   * Get orders for a specific creator's products
   */
  async getCreatorOrders(creatorId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, products(*), user_profiles:buyer_id(*)')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Order[];
  }
};
