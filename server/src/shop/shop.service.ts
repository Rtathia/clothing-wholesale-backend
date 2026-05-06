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
    
    // 获取产品关联的尺码信息（分步查询，避免外键关联问题）
    let sizes: { id: number; sizeId: number; sizeName: string; sortOrder: number; stock: number; isActive: boolean }[] = [];
    try {
      // 1. 获取该产品的尺码关联记录
      const { data: productSizes } = await client
        .from('product_sizes')
        .select('id, size_id, stock, is_active')
        .eq('product_id', id)
        .eq('is_active', true);
      
      if (productSizes && productSizes.length > 0) {
        // 2. 获取所有尺码详情
        const { data: allSizes } = await client
          .from('sizes')
          .select('id, name, sort_order')
          .order('sort_order', { ascending: true });
        
        // 3. 在代码中合并数据
        const sizeMap = new Map((allSizes || []).map(s => [s.id, s]));
        sizes = productSizes
          .filter(ps => sizeMap.has(ps.size_id))
          .map(ps => {
            const sizeInfo = sizeMap.get(ps.size_id);
            return {
              id: ps.id,
              sizeId: ps.size_id,
              sizeName: sizeInfo?.name || '',
              sortOrder: sizeInfo?.sort_order || 0,
              stock: ps.stock ?? -1,
              isActive: ps.is_active ?? true,
            };
          })
          .sort((a, b) => a.sortOrder - b.sortOrder);
      }
    } catch (error) {
      console.error('获取产品尺码失败:', error);
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
