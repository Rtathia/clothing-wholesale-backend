import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

@Injectable()
export class ShopService {
  // 获取所有分类
  async getCategories() {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data;
  }

  // 获取所有布料
  async getFabrics() {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('fabrics')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data;
  }

  // 获取所有工艺
  async getCrafts() {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('crafts')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data;
  }

  // 获取所有版型
  async getFits() {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('fits')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data;
  }

  // 获取所有款式
  async getStyles() {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('styles')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data;
  }

  // 获取T恤颜色图片
  async getTshirtColors() {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('tshirt_colors')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data;
  }

  // 获取产品列表（带筛选）
  async getProducts(filters?: { 
    categoryId?: number; 
    fabricId?: number; 
    craftId?: number;
    fitId?: number;
    styleId?: number;
  }) {
    const client = getSupabaseClient();
    let query = client
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters?.fabricId) {
      query = query.eq('fabric_id', filters.fabricId);
    }
    if (filters?.craftId) {
      query = query.eq('craft_id', filters.craftId);
    }
    if (filters?.fitId) {
      query = query.eq('fit_id', filters.fitId);
    }
    if (filters?.styleId) {
      query = query.eq('style_id', filters.styleId);
    }
    
    const { data, error } = await query;
    
    if (error) throw new Error(error.message);
    return data;
  }

  // 获取产品详情
  async getProductById(id: number) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  // 获取筛选数据（一次性获取所有分类数据）
  async getFilterData() {
    const client = getSupabaseClient();
    
    const [categoriesRes, fabricsRes, craftsRes, fitsRes, stylesRes] = await Promise.all([
      client.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
      client.from('fabrics').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
      client.from('crafts').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
      client.from('fits').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
      client.from('styles').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
    ]);
    
    return {
      categories: categoriesRes.data || [],
      fabrics: fabricsRes.data || [],
      crafts: craftsRes.data || [],
      fits: fitsRes.data || [],
      styles: stylesRes.data || [],
    };
  }
}
