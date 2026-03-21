import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

@Injectable()
export class AdminService {
  // ==================== 分类管理 ====================
  
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

  // 添加分类
  async createCategory(dto: { name: string; icon?: string; sortOrder?: number }) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('categories')
      .insert({
        name: dto.name,
        icon: dto.icon,
        sort_order: dto.sortOrder || 0,
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  // 更新分类
  async updateCategory(id: number, dto: Partial<{ name: string; icon: string; sortOrder: number; isActive: boolean }>) {
    const client = getSupabaseClient();
    const updateData: Record<string, unknown> = { ...dto };
    if (dto.sortOrder !== undefined) updateData.sort_order = dto.sortOrder;
    if (dto.isActive !== undefined) updateData.is_active = dto.isActive;
    delete updateData.sortOrder;
    delete updateData.isActive;
    
    const { data, error } = await client
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  // 删除分类（软删除）
  async deleteCategory(id: number) {
    const client = getSupabaseClient();
    const { error } = await client
      .from('categories')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return { success: true };
  }

  // ==================== 布料管理 ====================
  
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

  async createFabric(dto: { name: string; icon?: string; sortOrder?: number }) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('fabrics')
      .insert({
        name: dto.name,
        icon: dto.icon,
        sort_order: dto.sortOrder || 0,
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async updateFabric(id: number, dto: Partial<{ name: string; icon: string; sortOrder: number; isActive: boolean }>) {
    const client = getSupabaseClient();
    const updateData: Record<string, unknown> = { ...dto };
    if (dto.sortOrder !== undefined) updateData.sort_order = dto.sortOrder;
    if (dto.isActive !== undefined) updateData.is_active = dto.isActive;
    delete updateData.sortOrder;
    delete updateData.isActive;
    
    const { data, error } = await client
      .from('fabrics')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async deleteFabric(id: number) {
    const client = getSupabaseClient();
    const { error } = await client
      .from('fabrics')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return { success: true };
  }

  // ==================== 工艺管理 ====================
  
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

  async createCraft(dto: { name: string; icon?: string; sortOrder?: number }) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('crafts')
      .insert({
        name: dto.name,
        icon: dto.icon,
        sort_order: dto.sortOrder || 0,
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async updateCraft(id: number, dto: Partial<{ name: string; icon: string; sortOrder: number; isActive: boolean }>) {
    const client = getSupabaseClient();
    const updateData: Record<string, unknown> = { ...dto };
    if (dto.sortOrder !== undefined) updateData.sort_order = dto.sortOrder;
    if (dto.isActive !== undefined) updateData.is_active = dto.isActive;
    delete updateData.sortOrder;
    delete updateData.isActive;
    
    const { data, error } = await client
      .from('crafts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async deleteCraft(id: number) {
    const client = getSupabaseClient();
    const { error } = await client
      .from('crafts')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return { success: true };
  }

  // ==================== 版型管理 ====================
  
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

  async createFit(dto: { name: string; sortOrder?: number }) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('fits')
      .insert({
        name: dto.name,
        sort_order: dto.sortOrder || 0,
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  // ==================== 款式管理 ====================
  
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

  async createStyle(dto: { name: string; sortOrder?: number }) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('styles')
      .insert({
        name: dto.name,
        sort_order: dto.sortOrder || 0,
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  // ==================== T恤颜色图片管理 ====================
  
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

  async createTshirtColor(dto: { name: string; colorCode?: string; imageUrl: string; sortOrder?: number }) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('tshirt_colors')
      .insert({
        name: dto.name,
        color_code: dto.colorCode,
        image_url: dto.imageUrl,
        sort_order: dto.sortOrder || 0,
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async updateTshirtColor(id: number, dto: Partial<{ name: string; colorCode: string; imageUrl: string; sortOrder: number; isActive: boolean }>) {
    const client = getSupabaseClient();
    const updateData: Record<string, unknown> = {};
    if (dto.name) updateData.name = dto.name;
    if (dto.colorCode !== undefined) updateData.color_code = dto.colorCode;
    if (dto.imageUrl) updateData.image_url = dto.imageUrl;
    if (dto.sortOrder !== undefined) updateData.sort_order = dto.sortOrder;
    if (dto.isActive !== undefined) updateData.is_active = dto.isActive;
    
    const { data, error } = await client
      .from('tshirt_colors')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async deleteTshirtColor(id: number) {
    const client = getSupabaseClient();
    const { error } = await client
      .from('tshirt_colors')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return { success: true };
  }

  // ==================== 产品管理 ====================
  
  async getProducts(filters?: { categoryId?: number; fabricId?: number; craftId?: number }) {
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
    
    const { data, error } = await query;
    
    if (error) throw new Error(error.message);
    return data;
  }

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

  async createProduct(dto: {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    categoryId?: number;
    fabricId?: number;
    craftId?: number;
    fitId?: number;
    styleId?: number;
    sortOrder?: number;
  }) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('products')
      .insert({
        name: dto.name,
        description: dto.description,
        price: dto.price,
        image_url: dto.imageUrl,
        category_id: dto.categoryId,
        fabric_id: dto.fabricId,
        craft_id: dto.craftId,
        fit_id: dto.fitId,
        style_id: dto.styleId,
        sort_order: dto.sortOrder || 0,
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async updateProduct(id: number, dto: Partial<{
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryId: number;
    fabricId: number;
    craftId: number;
    fitId: number;
    styleId: number;
    sortOrder: number;
    isActive: boolean;
  }>) {
    const client = getSupabaseClient();
    const updateData: Record<string, unknown> = {};
    if (dto.name) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.price !== undefined) updateData.price = dto.price;
    if (dto.imageUrl) updateData.image_url = dto.imageUrl;
    if (dto.categoryId !== undefined) updateData.category_id = dto.categoryId;
    if (dto.fabricId !== undefined) updateData.fabric_id = dto.fabricId;
    if (dto.craftId !== undefined) updateData.craft_id = dto.craftId;
    if (dto.fitId !== undefined) updateData.fit_id = dto.fitId;
    if (dto.styleId !== undefined) updateData.style_id = dto.styleId;
    if (dto.sortOrder !== undefined) updateData.sort_order = dto.sortOrder;
    if (dto.isActive !== undefined) updateData.is_active = dto.isActive;
    
    const { data, error } = await client
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async deleteProduct(id: number) {
    const client = getSupabaseClient();
    const { error } = await client
      .from('products')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return { success: true };
  }
}
