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

  // 获取产品详情（包含尺码信息）
  async getProductById(id: number) {
    const client = getSupabaseClient();
    
    // 获取产品基本信息
    const { data: product, error: productError } = await client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (productError) throw new Error(productError.message);
    
    // 获取产品关联的尺码信息（如果表不存在则返回空数组）
    let sizes: { id: number; sizeId: number; sizeName: string; sortOrder: number; stock: number; isActive: boolean }[] = [];
    try {
      const { data: productSizes } = await client
        .from('product_sizes')
        .select(`
          id,
          stock,
          is_active,
          size_id,
          sizes: size_id (id, name, sort_order)
        `)
        .eq('product_id', id)
        .eq('is_active', true);
      
      if (productSizes) {
        sizes = (productSizes || []).map((item: Record<string, unknown>) => ({
          id: item.id as number,
          sizeId: item.size_id as number,
          sizeName: (item.sizes as Record<string, unknown>)?.name as string,
          sortOrder: (item.sizes as Record<string, unknown>)?.sort_order as number,
          stock: item.stock as number,
          isActive: item.is_active as boolean,
        })).sort((a, b) => a.sortOrder - b.sortOrder);
      }
    } catch (error) {
      console.error('获取产品尺码失败，可能是schema缓存未刷新:', error);
      // 返回空数组，不影响产品详情显示
    }
    
    return {
      ...product,
      sizes,
    };
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
