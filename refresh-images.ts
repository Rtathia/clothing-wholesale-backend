// 脚本：重新生成产品图片的永久签名URL
const { S3Storage } = require('coze-coding-dev-sdk');

const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  bucketName: process.env.COZE_BUCKET_NAME,
});

// 从URL中提取key
function extractKeyFromUrl(url) {
  // URL格式: https://coze-coding-project.tos.coze.site/coze_storage_xxx/...
  const match = url.match(/coze_storage_[^\/]+\/(.+)$/);
  return match ? match[1] : null;
}

async function refreshProductImages() {
  // 产品图片key列表（从数据库查询得到的URL）
  const productUrls = [
    'coze_storage_7619677622187884587/products/1774258635348_e5r78_0895ff66.file-1774258634526',
    'coze_storage_7619677622187884587/products/1774258656323_3lwgj_42cc1ef2.file-1774258655444',
    'coze_storage_7619677622187884587/products/1774258684609_dqvjup_6bfced78.file-1774258683591',
    'coze_storage_7619677622187884587/products/1774258708312_xzs0u_d1fd858f.file-1774258707676',
    'coze_storage_7619677622187884587/products/1774258893984_sbcsqy_778a79db.file-1774258893224',
    'coze_storage_7619677622187884587/products/1774258864109_6mvcw_9514844d.file-1774258863338',
    'coze_storage_7619677622187884587/products/1774258736292_ejb6vp_5897c523.file-1774258735522',
    'coze_storage_7619677622187884587/products/1774314733832_fucjk_6c37a7a2.file-1774314732596',
    'coze_storage_7619677622187884587/products/1774314690534_xloxnr_4b6ada62.file-1774314689674',
    'coze_storage_7619677622187884587/products/1774314713644_mjuyzo_2409d345.file-1774314713371',
    'coze_storage_7619677622187884587/products/1774314750420_8fr6p_b6ca1944.file-1774314750154',
    'coze_storage_7619677622187884587/products/1774314779148_bbfibjj_74925fed.file-1774314778272',
    'coze_storage_7619677622187884587/products/1774314795576_kqc9vn_0811aa6b.file-1774314794570',
    'coze_storage_7619677622187884587/products/1774314808617_lktsda_fa8499aa.file-1774314807381',
    'coze_storage_7619677622187884587/products/1774323394144_0y8ofw_82cd6fd9.file-1774323393080',
    'coze_storage_7619677622187884587/products/1774323427703_zs0s8xb_d367f7a1.file-1774323426589',
    'coze_storage_7619677622187884587/products/1774323448103_b0ut3_fe5e34b3.file-1774323447214',
    'coze_storage_7619677622187884587/products/1774323576245_buvy4b_1ecbbefe.file-1774323575459',
    'coze_storage_7619677622187884587/products/1774323493226_pcqom7_3025d289.file-1774323492098',
    'coze_storage_7619677622187884587/products/1774323597477_qyrysr_82352231.file-1774323596195',
    'coze_storage_7619677622187884587/products/1774323613218_sbnx6e_be8f7da7.file-1774323612090',
    'coze_storage_7619677622187884587/products/1774323647312_8gyag9_b124bb2b.file-1774323646376',
    'coze_storage_7619677622187884587/products/1774323466034_qkyrne_0ae6842e.file-1774323465133',
    'coze_storage_7619677622187884587/products/1774333833816_m0rt8w_66126165.file-1774333832692',
    'coze_storage_7619677622187884587/products/1774333850834_gojcqhe_599c2664.file-1774333849712',
    'coze_storage_7619677622187884587/products/1774333887582_n63y1h_2c95586c.file-1774333886641',
    'coze_storage_7619677622187884587/products/1774333773219_i0c4hh_1cf377e3.file-1774333772504',
    'coze_storage_7619677622187884587/products/1774333871535_chgp7_665eae95.file-1774333870501',
    'coze_storage_7619677622187884587/products/1774333814119_2mafo_60f73cc7.file-1774333813434',
    'coze_storage_7619677622187884587/products/1774333798670_3stkb_7fff3c40.file-1774333797913',
  ];

  console.log('开始刷新产品图片URL...\n');

  for (const key of productUrls) {
    try {
      // 检查文件是否存在
      const exists = await storage.fileExists({ fileKey: key });
      if (exists) {
        // 生成新的签名URL（30天有效期）
        const newUrl = await storage.generatePresignedUrl({ key, expireTime: 2592000 });
        console.log(`✅ ${key.split('/').pop()}`);
        console.log(`   新URL: ${newUrl.substring(0, 80)}...`);
      } else {
        console.log(`❌ ${key.split('/').pop()} - 文件不存在`);
      }
    } catch (e) {
      console.log(`❌ ${key.split('/').pop()} - 错误: ${e.message}`);
    }
  }
}

refreshProductImages().catch(console.error);
