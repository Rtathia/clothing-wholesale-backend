-- 导出数据用于 Railway PostgreSQL 迁移

-- 1. 创建 categories 表
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 2. 创建 fabrics 表
CREATE TABLE IF NOT EXISTS fabrics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 3. 创建 crafts 表
CREATE TABLE IF NOT EXISTS crafts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 4. 创建 fits 表
CREATE TABLE IF NOT EXISTS fits (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 5. 创建 styles 表
CREATE TABLE IF NOT EXISTS styles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 6. 创建 tshirt_colors 表
CREATE TABLE IF NOT EXISTS tshirt_colors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color_code VARCHAR(20),
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 7. 创建 products 表
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    category_id INTEGER REFERENCES categories(id),
    fabric_id INTEGER REFERENCES fabrics(id),
    craft_id INTEGER REFERENCES crafts(id),
    fit_id INTEGER REFERENCES fits(id),
    style_id INTEGER REFERENCES styles(id),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    detail_images TEXT DEFAULT '[]',
    videos TEXT DEFAULT '[]',
    photos TEXT DEFAULT '[]'
);

-- 8. 创建 sizes 表
CREATE TABLE IF NOT EXISTS sizes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 9. 创建 product_sizes 表
CREATE TABLE IF NOT EXISTS product_sizes (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    size_id INTEGER REFERENCES sizes(id) ON DELETE CASCADE,
    stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 10. 创建 health_check 表
CREATE TABLE IF NOT EXISTS health_check (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== 数据插入 ====================

-- 插入 categories
INSERT INTO categories (id, name, icon, sort_order, is_active) VALUES
(1, '翻领短袖', '👕', 1, true),
(2, '翻领长袖', '🧥', 2, true),
(3, 'T恤', '👔', 3, true),
(4, '卫衣', '🎽', 4, true);

-- 插入 fabrics
INSERT INTO fabrics (id, name, icon, sort_order, is_active) VALUES
(1, '纯棉', '🌿', 1, true),
(2, '纯涤', '🔬', 2, true),
(3, '棉涤混纺', '🧵', 3, true),
(4, '其他', '📦', 4, true);

-- 插入 crafts
INSERT INTO crafts (id, name, icon, sort_order, is_active) VALUES
(1, '印刷', '🖨️', 2, true),
(2, '刺绣', '✨', 3, true),
(3, '纯色', '🎨', 1, true);

-- 插入 fits
INSERT INTO fits (id, name, sort_order, is_active) VALUES
(1, '修身', 1, true),
(2, '常规', 2, true),
(3, '宽松', 3, true);

-- 插入 styles
INSERT INTO styles (id, name, sort_order, is_active) VALUES
(1, '短袖', 1, true),
(2, '长袖', 2, true),
(3, '套头', 3, true);

-- 插入 sizes
INSERT INTO sizes (id, name, sort_order, is_active) VALUES
(1, 'XS', 1, true),
(2, 'S', 2, true),
(3, 'M', 3, true),
(4, 'L', 4, true),
(5, 'XL', 5, true),
(6, '2XL', 6, true),
(7, '3XL', 7, true),
(8, '4XL', 8, true),
(9, '5XL', 9, true);

-- 插入 tshirt_colors
INSERT INTO tshirt_colors (id, name, color_code, image_url, sort_order, is_active) VALUES
(1, '白色', '#ffffff', 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E7%99%BD%E8%89%B2.png&nonce=9617b1c1-7651-4843-b824-89cb0e5bf652&project_id=7619676618268688390&sign=0adac256c30015bf2724b814a885d6a06986f3ebdc0e05fc7e7f9a565ca6143c', 1, true),
(2, '黑色', '#1a1a1a', 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E9%BB%91%E8%89%B2.png&nonce=bd8d8e93-04c5-4769-8103-5ed4a8782ca1&project_id=7619676618268688390&sign=5fb8dcab0f03cbc51118deee001ecc28725052edb21ed995122739cdf309a304', 2, true),
(3, '藏青', '#1e3a5f', 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E8%97%8F%E9%9D%92.png&nonce=0fd0099e-974f-4402-bb7e-a7e2fa6754cf&project_id=7619676618268688390&sign=2c62af9c7e3c695518cbda736e6e5c4c514be90c55874b48d37d59f6197a8b1c', 3, true),
(4, '深灰', '#4a4a4a', 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E6%B7%B1%E7%81%B0.png&nonce=7c8c8715-d7d8-4feb-8929-63211b67491e&project_id=7619676618268688390&sign=c97662e281b802fde3f177b3fb6dc643f27b79388e0807e089fc244089939a8f', 4, true),
(5, '浅灰', '#c0c0c0', 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E6%B5%85%E7%81%B0.png&nonce=067a4c7f-11af-43fa-b031-0ea5ae3b3c51&project_id=7619676618268688390&sign=ec724737e9802f6aaec94fdce8dec1f249f8a1210b2a3068d930fbe0d04764d0', 5, true),
(6, '蓝色', '#2563eb', 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E8%93%9D%E8%89%B2.png&nonce=2ef15266-7f3d-4dbf-8036-35e8587f04ba&project_id=7619676618268688390&sign=d8264b3d2e2e87ee109c693ae0d8bb4910b8040416cc53a9bffdd22cd4b02be1', 6, true);

-- 插入 products (所有产品)
INSERT INTO products (id, name, description, price, image_url, category_id, fabric_id, craft_id, fit_id, style_id, is_active, sort_order, detail_images) VALUES
(1, '经典POLO衫', '经典款式，舒适透气', 8900, 'https://img.alicdn.com/imgextra/i4/2216685773707/O1CN01JhVTtS1h6CgZWN1Px_!!2216685773707.jpg_Q75.jpg_.webp', 1, 1, 2, 1, 1, false, 1, '[]'),
(2, '商务长袖POLO', '商务场合首选', 12900, 'https://img.alicdn.com/imgextra/i1/2216685773707/O1CN01FQJNdr1h6CgXlPDdE_!!2216685773707.jpg_Q75.jpg_.webp', 2, 3, 2, 2, 2, false, 2, '[]'),
(3, '纯棉圆领T恤', '纯棉舒适，日常百搭', 5900, 'https://img.alicdn.com/imgextra/i3/2216685773707/O1CN01vXjLMT1h6CgWzZCFr_!!2216685773707.jpg_Q75.jpg_.webp', 3, 1, 1, 3, 1, false, 3, '[]'),
(4, '运动卫衣', '运动休闲两相宜', 15900, 'https://img.alicdn.com/imgextra/i2/2216685773707/O1CN01xEeUet1h6CgQJcCBl_!!2216685773707.jpg_Q75.jpg_.webp', 4, 2, 1, 3, 3, false, 4, '[]'),
(5, '休闲POLO衫', '休闲款式，舒适百搭', 9900, 'https://img.alicdn.com/imgextra/i4/2216685773707/O1CN01JhVTtS1h6CgZWN1Px_!!2216685773707.jpg_Q75.jpg_.webp', 1, 3, 2, 2, 1, false, 5, '[]'),
(6, '#AS001 印花T恤', NULL, 9500, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/AS001_46007ff0.png?sign=1809418313-a4c676b838-0-8e0cdd1fdcf7d784e981d5cbb94ec98ca4bca01337044e0b7c0af177128e4b8d', 3, 1, 1, 1, 1, false, 6, '[]'),
(7, '刺绣T恤', '100%棉', 5900, NULL, 3, 1, 2, 2, 1, false, 0, '[]'),
(8, '#AS001 纯棉印花T恤', NULL, 8900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/AS001_d433fea6.png?sign=1809418314-83a0d53196-0-837e98866e14fa2d36d9f40458ab7047e47037098c73a280793c3ac801bb0c40', 3, 1, 1, 2, 1, false, 0, '[]'),
(9, '#AS001 220g纯棉印花T恤', NULL, 8900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/AS001_cdf707bc.png?sign=1809418314-f459871c51-0-a0cedf3c20d2380b2150902a8f4c7a225e3eccd56a524cca215df955faf187e3', 3, 1, 1, 2, 1, true, 0, '[]'),
(10, '#AS002 220g纯棉印花T恤', NULL, 8900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/AS002_13ce5ac9.png?sign=1809418314-117b10d26a-0-fe5a8bb70971ba971430383968e604bc601f4e8a77fda1ce316b876bf0b1b996', 3, 1, 1, 2, 1, true, 0, '[]'),
(11, '#AS003 220g纯棉印花T恤', NULL, 8800, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/AS003_70aed65e.png?sign=1809418314-bf7c2badcb-0-62d4450415b74f1587dca42137ad58cedefcfba58d77b5148324c0a8e14f71db', 3, 1, 1, 2, 1, true, 0, '[]'),
(12, '#AS004 220g纯棉印花T恤', NULL, 8900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/AS004_ee2a79af.png?sign=1809418315-47426b8fc9-0-ff2f2a9e82d4e2192eff911384aafd8b5e6474219ddac43d7a1dda25a72543aa', 3, 1, 1, 2, 1, true, 0, '[]'),
(13, '#JS001 210g纯棉刺绣T恤', NULL, 9700, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/JS001_5aa08e1f.png?sign=1809418315-0333be2e00-0-363c4508999ca4d6f809a0851c8d01cd27b8e3758ed83716563be98cae463baf', 3, 1, 2, 2, 1, true, 0, '[]'),
(14, '#JS002 210g纯棉刺绣T恤', NULL, 9900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/JS002_fbffabbd.png?sign=1809418315-ba37a725d5-0-60225374bfcd3ae9723931b4a9f2997e5b1bb084a3d5c7154f7952c5eedcbf92', 3, 1, 2, 2, 1, true, 0, '[]'),
(15, '#CN001 200g纯色T恤', '90%棉 8%涤纶 2%氨纶 ', 6900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/CN001_3a03b930.png?sign=1809418315-47a827bdc0-0-0b31fecc7fd363b54315378a3bda5aca101d1a24736eff247427b78932356b4b', 3, 3, 3, 2, 1, true, 0, '[]'),
(16, '#JR001 220g扎染印刷T恤', '90%棉 10%涤纶', 13900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/JR001_7d97682c.png?sign=1809418316-e243c21a30-0-d16d988cf199292755329c5b4c1fd7b05863f8609b484cd3cfd07dc72f870740', 3, 3, 1, 3, 1, true, 0, '[]'),
(17, '#JR002 220g扎染印刷T恤', '90%棉 10%涤纶', 12900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/JR002_bb0cd287.png?sign=1809418316-f89f3b3863-0-2027deb4b588a301789ca022ef8448612975a203337571b33ace58cc46572c81', 3, 3, 1, 3, 1, true, 0, '[]'),
(18, '#AS005 220g纯棉印刷T恤', NULL, 8800, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/AS005_d9d31ba0.png?sign=1809418316-69ac857f5b-0-b0f25ad192e16e9c99c1099bebee6593b41413b5d6a4e0be919dd65b98cf12a1', 3, 1, 1, 2, 1, true, 0, '[]'),
(19, '#AS006 185g印花T恤', '80%棉 10%涤纶 5%氨纶', 7700, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/AS006_1b47058d.png?sign=1809418316-cfe896b156-0-1674ceaef1bfbdeafe7b9a1a0321915960d38ba9461aa4b9e31cd47b0ea4c7f0', 3, 3, 1, 1, 1, true, 0, '[]'),
(20, '#AS007 220g纯棉印花T恤', NULL, 8900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/AS007_59a2d99c.png?sign=1809418317-df92a169ab-0-b39afc4a14683ed69fa68d870af83dcdea9dda936aaba2279aed13328d9f3e77', 3, 1, 1, 2, 1, true, 0, '[]'),
(21, '#JS003 210g纯棉刺绣T恤', NULL, 11900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/JS003_c577f8ac.png?sign=1809418317-ea320c1d79-0-d79fc0e925a85cc135c8dcc7b4ad9095f39b82ad7f463de0d0e79d2a1bd3cd55', NULL, 1, 2, 2, 1, true, 0, '[]'),
(22, '#JS004 250g毛绒刺绣T恤', '毛绒款 80%棉 10%涤纶 10%氨纶', 15900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/1777881102777_8byhmn_aa6a8eb3.file-1777881101555?sign=1809418317-4fa625643f-0-beaff9184c6aa5534abe7ea08a7aaa90d7b9b057b5eb7aa0503d8e844cc14a63', 3, 3, 2, 2, 1, true, 0, '[]'),
(23, '#CN002 180g纯色T恤', '95%棉 5%涤纶', 3900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/CN002_bb5ea9c1.png?sign=1809418317-8ca74c70dd-0-01d4c1016612c9cfdac77d2f277004d15b23dc12bd8ff2e3039d182e23562c36', 3, 3, 3, 2, 1, true, 0, '[]'),
(24, '#CN003 240g纯棉纯色款T恤', NULL, 4900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/CN003_1e71a87c.png?sign=1809418318-91ae27b06f-0-8461524887987f28be40e374f2f0d2119f8222cabf4ab13408dfa8e9bb9208af', 3, 1, 3, 2, 1, true, 0, '[]'),
(25, '#HL006 405g纯棉印刷卫衣', NULL, 15900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/HL006_3d9403da.png?sign=1809418318-06163851f6-0-6e3a3dceec7aef842028d3444c8a67676690da6a05c337fed471afa8e5bca90f', 4, 1, 1, 3, 2, true, 0, '[]'),
(26, '#HL003 520g环保面料条纹卫衣', '50%棉 30%涤纶 10%氨纶 10%人棉', 34900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/HL003_30909df5.png?sign=1809418318-83bc94e975-0-629883d40485a1d195d2bdcdc65bd41e989ae514e51dc80da07b82f4b70c4521', 4, 3, 1, 3, 3, true, 0, '[]'),
(27, '#HL005 420g纯棉刺绣卫衣', NULL, 21900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/HL005_176307f2.png?sign=1809418319-6f198da13d-0-e58d532d3b6baa1ab3621ed5275b0f56d45004b4d754967c9cefa3a495799302', 4, 1, 2, 3, 3, true, 0, '[]'),
(28, '#PL001 210g条纹款间色翻领短袖', '90%棉 5%涤纶 5%氨纶', 7900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/1777880625335_r7htb_514f407c.file-1777880624143?sign=1809418319-e7421d4580-0-ccbcf014647689f664450cc22ec8e26ac896f6dde060589da5b0f5be0e336d2c', 1, 4, 1, 1, 1, true, 0, '[]'),
(29, '#PL002 210g间色罗纹翻领短袖', '90%棉 5%涤纶 5%氨纶', 8900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/1777880677771_px85d_9d3a037f.file-1777880676813?sign=1809418319-b4e47155ce-0-51f723ee51f60f4c6dfb5cefe70fd162c831cf86d5530215d8f13302cc3bb785', 1, 3, 3, 1, 1, true, 0, '[]'),
(30, '#HL004 600g纯棉拉链款卫衣', NULL, 25900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/HL004_88e05034_3eabc808.jpg?sign=1809418319-e30f9813de-0-3c7efe96c62374761f8ddb1ecfc519284c7833770f6fcc50997bd2d215bbd29e', 4, 1, 3, 2, 3, true, 0, '[]'),
(31, '#HL007 470g纯棉印花卫衣', NULL, 17900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/HL007_3629f1a0.png?sign=1809418318-04729d2270-0-a435fd0e948e2fd660b0849d7faa665f9e59c2f10b56fa1b28f9699dde1f0993', 4, 1, 1, 3, 3, true, 0, '[]'),
(32, '#PL004 185g纯色罗纹翻领短袖', '90%棉 10%氨纶', 6900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/1777882057018_4te0ki_d714e0ed.file-1777882055288?sign=1809418319-60e86c36e5-0-f1bd6502b2d5b6e274ebcb9b00afacc7f85eb647d651e50b2b052546f44cfebc', 1, 4, 3, 1, 1, true, 0, '[]'),
(33, '#PL005 185g条纹款罗纹翻领短袖', '90%棉 10%氨纶', 6900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/1777882077023_kfdhfd_a156763d.file-1777882076035?sign=1809418320-469a15d858-0-de42a99891c9fd6e159ebb517c27c6b0cf5e170a13f7bd2c0e1daaf22430eb07', 1, 4, 1, 1, 1, true, 0, '[]'),
(34, '#PL006 185g间色罗纹翻领短袖', '90%棉 10%氨纶', 6900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/1777882032394_a6jud_786edb94.file-1777882031543?sign=1809418320-74e420be34-0-f88e0dd540ad1932ad2f8e83af08844b624b5b91c89f7733da18f14f43f86c64', 1, 4, 1, 1, 1, true, 0, '[]'),
(35, '#PN004 195g间色罗纹翻领长袖', '90%棉 10%氨纶', 9900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/PN001_a5e81c0d_7edd0f90.png?sign=1809418320-8a952553e1-0-89955b50d772cbd14ca002603df8b491732196eb364e9e06039cb76824d0279e', 2, 4, 1, 1, 2, false, 0, '[]'),
(36, '#PN003 195g淡蓝色条纹款罗纹翻领长袖', '90%棉 5%涤纶 5%氨纶', 8900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/1777881357630_tx31lf_f08a98bb.file-1777881356797?sign=1809418320-4085c2c5b0-0-8c38737ac1cd5947a95d40021d0338eaf8d5dc82980646af810a16e78a64cb86', 2, 4, 1, 1, 2, true, 0, '[]'),
(37, '#PN002 195g黑色网格款罗纹翻领长袖', '90%棉 5%涤纶 5%氨纶', 8900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/1777881340626_aphb9q_b96a48dc.file-1777881339499?sign=1809418321-92fff027a1-0-47a7fe217ed3aeb393c4141dea580cee693dc5f72bbdcf5623c26d91b1c2df75', 2, 4, 1, 2, 2, true, 0, '[]'),
(38, '#PN001 195g纯色罗纹翻领长袖', '70%棉 20%涤纶 10%氨纶', 8900, 'https://coze-coding-project.tos.coze.site/coze_storage_7619677622187884587/products/1777881000930_t0gqce_ce7c7b91.file-1777880999791?sign=1809418321-dae2940e81-0-cc510f0cebc3bc7f2b7c743c5ec2cbbce8afaf072cc28f8011cc28a44ba3bf2e', 2, 4, 3, 2, 2, true, 0, '[]');

-- 插入 health_check
INSERT INTO health_check (status, message) VALUES ('ok', 'Database connected successfully');
