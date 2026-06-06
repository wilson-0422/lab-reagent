import { initializeDatabase, getDatabase } from './config/database';
import { UserService } from './services/userService';
import { ReagentService } from './services/reagentService';
import { HazardService } from './services/hazardService';
import { InstrumentService } from './services/instrumentService';
import { ExperimentService } from './services/experimentService';

initializeDatabase();

const db = getDatabase();

function seedUsers() {
  const existing = UserService.findByUsername('admin');
  if (existing) {
    console.log('种子数据已存在，跳过初始化');
    return;
  }

  UserService.create({ username: 'admin', password: 'admin123', real_name: '系统管理员', role: 'admin', department: '信息中心' });
  UserService.create({ username: 'zhangwei', password: '123456', real_name: '张伟', role: 'user', department: '化学分析室' });
  UserService.create({ username: 'lina', password: '123456', real_name: '李娜', role: 'user', department: '微生物检测室' });
  UserService.create({ username: 'wangfang', password: '123456', real_name: '王芳', role: 'user', department: '环境监测室' });
  UserService.create({ username: 'liuyang', password: '123456', real_name: '刘洋', role: 'admin', department: '质量管理部' });

  console.log('用户种子数据已创建');
}

function seedReagents() {
  const count = ReagentService.count();
  if (count > 0) return;

  const reagents = [
    { name: '盐酸', cas_number: '7647-01-0', category: '无机酸', specification: '分析纯 500mL', unit: '瓶', stock_quantity: 25, min_quantity: 10, location: 'A区-酸类柜-01', supplier: '国药集团化学试剂有限公司', price: 28.5 },
    { name: '硫酸', cas_number: '7664-93-9', category: '无机酸', specification: '优级纯 500mL', unit: '瓶', stock_quantity: 18, min_quantity: 10, location: 'A区-酸类柜-02', supplier: '国药集团化学试剂有限公司', price: 35.0 },
    { name: '氢氧化钠', cas_number: '1310-73-2', category: '无机碱', specification: '分析纯 500g', unit: '瓶', stock_quantity: 30, min_quantity: 10, location: 'A区-碱类柜-01', supplier: '西陇科学股份有限公司', price: 22.0 },
    { name: '无水乙醇', cas_number: '64-17-5', category: '有机溶剂', specification: '分析纯 2.5L', unit: '瓶', stock_quantity: 15, min_quantity: 5, location: 'B区-有机溶剂柜-01', supplier: '国药集团化学试剂有限公司', price: 65.0 },
    { name: '丙酮', cas_number: '67-64-1', category: '有机溶剂', specification: '分析纯 2.5L', unit: '瓶', stock_quantity: 8, min_quantity: 5, location: 'B区-有机溶剂柜-02', supplier: '西陇科学股份有限公司', price: 55.0 },
    { name: '硝酸银', cas_number: '7761-88-8', category: '无机盐', specification: '分析纯 25g', unit: '瓶', stock_quantity: 5, min_quantity: 3, location: 'C区-贵金属试剂柜-01', supplier: '阿拉丁试剂有限公司', price: 185.0 },
    { name: '氯化钠', cas_number: '7647-14-5', category: '无机盐', specification: '优级纯 500g', unit: '瓶', stock_quantity: 40, min_quantity: 15, location: 'A区-盐类柜-01', supplier: '国药集团化学试剂有限公司', price: 18.0 },
    { name: '磷酸二氢钾', cas_number: '7778-77-0', category: '无机盐', specification: '分析纯 500g', unit: '瓶', stock_quantity: 12, min_quantity: 5, location: 'A区-盐类柜-02', supplier: '西陇科学股份有限公司', price: 25.0 },
    { name: '甲醇', cas_number: '67-56-1', category: '有机溶剂', specification: '色谱纯 4L', unit: '瓶', stock_quantity: 3, min_quantity: 5, location: 'B区-有机溶剂柜-03', supplier: '默克化工技术有限公司', price: 320.0 },
    { name: '乙腈', cas_number: '75-05-8', category: '有机溶剂', specification: '色谱纯 4L', unit: '瓶', stock_quantity: 4, min_quantity: 5, location: 'B区-有机溶剂柜-04', supplier: '默克化工技术有限公司', price: 380.0 },
  ];

  for (const r of reagents) {
    ReagentService.create(r);
  }
  console.log('试剂种子数据已创建');
}

function seedHazards() {
  const count = HazardService.count();
  if (count > 0) return;

  const hazards = [
    { name: '浓硫酸', cas_number: '7664-93-9', hazard_class: '第8类 腐蚀品', un_number: 'UN1830', risk_phrase: 'R35:引起严重灼伤', safety_phrase: 'S26:不慎与眼睛接触后立即用大量水冲洗并就医;S30:切勿将水加入该物质中', storage_condition: '阴凉通风处，远离火源和可燃物，单独存放', stock_quantity: 10, location: '危化品库-A01', supervisor: '张伟' },
    { name: '浓硝酸', cas_number: '7697-37-2', hazard_class: '第8类 腐蚀品/第5.1类 氧化剂', un_number: 'UN2031', risk_phrase: 'R8:接触可燃物料可能导致火灾;R35:引起严重灼伤', safety_phrase: 'S23:不要吸入蒸汽;S26:不慎与眼睛接触后立即用大量水冲洗并就医', storage_condition: '阴凉通风处，远离有机物和可燃物', stock_quantity: 6, location: '危化品库-A02', supervisor: '张伟' },
    { name: '高锰酸钾', cas_number: '7722-64-7', hazard_class: '第5.1类 氧化剂', un_number: 'UN1490', risk_phrase: 'R8:接触可燃物料可能导致火灾;R22:吞食有害', safety_phrase: 'S17:远离可燃物料;S60:该物质及其容器必须作为危险废物处置', storage_condition: '阴凉干燥处，远离有机物和酸类', stock_quantity: 4, location: '危化品库-B01', supervisor: '李娜' },
    { name: '三氯甲烷', cas_number: '67-66-3', hazard_class: '第6.1类 毒害品', un_number: 'UN1888', risk_phrase: 'R22:吞食有害;R38:刺激皮肤;R40:可能致癌', safety_phrase: 'S36/37:穿戴合适的防护服和手套', storage_condition: '阴凉通风处，远离火源，密封保存', stock_quantity: 3, location: '危化品库-C01', supervisor: '王芳' },
    { name: '甲醛溶液', cas_number: '50-00-0', hazard_class: '第8类 腐蚀品/第6.1类 毒害品', un_number: 'UN1198', risk_phrase: 'R23/24/25:吸入、皮肤接触及吞食有毒;R34:引起灼伤;R40:可能致癌', safety_phrase: 'S26:不慎与眼睛接触后立即用大量水冲洗并就医;S36/37/39:穿戴合适的防护服、手套和护目镜', storage_condition: '阴凉通风处，密封保存，远离火源', stock_quantity: 5, location: '危化品库-C02', supervisor: '王芳' },
    { name: '过氧化氢(30%)', cas_number: '7722-84-1', hazard_class: '第5.1类 氧化剂', un_number: 'UN2015', risk_phrase: 'R5:受热可能引起爆炸;R8:接触可燃物料可能导致火灾;R20/22:吸入及吞食有害', safety_phrase: 'S17:远离可燃物料;S28:皮肤接触后立即用大量水冲洗', storage_condition: '阴凉通风处，远离有机物和可燃物', stock_quantity: 7, location: '危化品库-B02', supervisor: '李娜' },
  ];

  for (const h of hazards) {
    HazardService.create(h);
  }
  console.log('危化品种子数据已创建');
}

function seedInstruments() {
  const count = InstrumentService.count();
  if (count > 0) return;

  const instruments = [
    { name: '高效液相色谱仪', model: 'Agilent 1260 Infinity II', manufacturer: '安捷伦科技', serial_number: 'DE64372891', category: '色谱分析', location: '仪器室-101', status: '正常', purchase_date: '2022-03-15', warranty_date: '2025-03-15', description: '用于有机化合物的定性和定量分析' },
    { name: '气相色谱仪', model: 'Shimadzu GC-2030', manufacturer: '岛津制作所', serial_number: 'JP22050347', category: '色谱分析', location: '仪器室-101', status: '正常', purchase_date: '2021-08-20', warranty_date: '2024-08-20', description: '用于挥发性有机化合物的分析检测' },
    { name: '紫外可见分光光度计', model: 'UV-2600i', manufacturer: '岛津制作所', serial_number: 'JP23011258', category: '光谱分析', location: '仪器室-102', status: '正常', purchase_date: '2023-01-10', warranty_date: '2026-01-10', description: '用于物质浓度测定和纯度分析' },
    { name: '原子吸收光谱仪', model: 'AA-7000', manufacturer: '岛津制作所', serial_number: 'JP21080734', category: '光谱分析', location: '仪器室-102', status: '维修中', purchase_date: '2020-06-18', warranty_date: '2023-06-18', description: '用于金属元素的定量分析' },
    { name: '电子天平', model: 'ME204E', manufacturer: '梅特勒-托利多', serial_number: 'CH22104589', category: '常规仪器', location: '天平室-201', status: '正常', purchase_date: '2022-11-05', warranty_date: '2025-11-05', description: '万分之一分析天平，最大量程220g' },
    { name: 'pH计', model: 'FE28', manufacturer: '梅特勒-托利多', serial_number: 'CH23062347', category: '常规仪器', location: '前处理室-202', status: '正常', purchase_date: '2023-06-12', warranty_date: '2026-06-12', description: '台式pH/mV/温度测量仪' },
    { name: '超纯水制备系统', model: 'Milli-Q IQ 7003', manufacturer: '默克密理博', serial_number: 'US22093456', category: '辅助设备', location: '前处理室-202', status: '正常', purchase_date: '2022-09-28', warranty_date: '2025-09-28', description: '制备超纯水，电阻率18.2MΩ·cm' },
    { name: '离心机', model: 'Sorvall ST 8R', manufacturer: '赛默飞世尔', serial_number: 'US23051782', category: '前处理设备', location: '前处理室-203', status: '正常', purchase_date: '2023-05-20', warranty_date: '2026-05-20', description: '高速冷冻离心机，最大转速15000rpm' },
  ];

  for (const inst of instruments) {
    InstrumentService.create(inst);
  }
  console.log('仪器种子数据已创建');
}

function seedExperiments() {
  const count = ExperimentService.count();
  if (count > 0) return;

  const experiments = [
    { title: '饮用水中重金属含量检测', user_id: 2, category: '水质检测', description: '对采集的自来水及水源水样品进行铅、镉、汞、砷等重金属含量检测', procedure: '1. 取水样100mL于容量瓶中\n2. 加入2mL浓硝酸酸化\n3. 使用原子吸收光谱仪分别测定各金属元素含量\n4. 与标准曲线对比计算浓度', result: '铅: 0.003mg/L, 镉: 未检出, 汞: 未检出, 砷: 0.001mg/L', conclusion: '所有检测指标均符合GB 5749-2022生活饮用水卫生标准', status: '已完成' },
    { title: '食品中防腐剂含量测定', user_id: 3, category: '食品检测', description: '检测市售饮料中苯甲酸和山梨酸的含量', procedure: '1. 样品前处理：取10mL饮料样品，加入乙腈提取\n2. 过0.22μm滤膜\n3. HPLC法测定，色谱柱C18，流动相甲醇:水=60:40\n4. 外标法定量', result: '苯甲酸: 0.42g/kg, 山梨酸: 0.18g/kg', conclusion: '防腐剂含量符合GB 2760-2024食品添加剂使用标准', status: '已完成' },
    { title: '环境空气PM2.5监测', user_id: 4, category: '环境监测', description: '对实验室周边环境空气中PM2.5浓度进行连续监测', procedure: '1. 设置采样点3个\n2. 使用微振荡天平法连续采样24小时\n3. 记录每小时浓度值\n4. 计算日均值', result: '采样点1: 35μg/m³, 采样点2: 42μg/m³, 采样点3: 28μg/m³', conclusion: '日均值35μg/m³，符合GB 3095-2012二级标准(75μg/m³)', status: '已完成' },
    { title: '土壤中有机氯农药残留分析', user_id: 2, category: '土壤检测', description: '分析农田土壤中六六六、滴滴涕等有机氯农药残留量', procedure: '1. 土壤样品风干研磨过60目筛\n2. 索氏提取法提取\n3. 弗罗里硅土柱净化\n4. GC-ECD法测定', result: '', conclusion: '', status: '进行中' },
    { title: '化妆品中微生物限度检查', user_id: 3, category: '化妆品检测', description: '对化妆品样品进行菌落总数、霉菌和酵母菌总数检测', procedure: '1. 样品稀释制备\n2. 平皿计数法测定菌落总数\n3. 沙氏培养基测定霉菌和酵母菌\n4. 37℃培养48小时观察', result: '', conclusion: '', status: '草稿' },
  ];

  for (const exp of experiments) {
    ExperimentService.create(exp);
  }
  console.log('实验记录种子数据已创建');
}

function seedReservationData() {
  const existing = db.prepare('SELECT COUNT(*) as count FROM reservations').get() as any;
  if (existing.count > 0) return;

  db.prepare(
    "INSERT INTO reservations (instrument_id, user_id, start_time, end_time, purpose, status) VALUES (1, 2, '2026-06-07 09:00', '2026-06-07 12:00', '饮用水中有机物检测', '已确认')"
  ).run();
  db.prepare(
    "INSERT INTO reservations (instrument_id, user_id, start_time, end_time, purpose, status) VALUES (2, 3, '2026-06-07 14:00', '2026-06-07 17:00', '食品添加剂气相分析', '待确认')"
  ).run();
  db.prepare(
    "INSERT INTO reservations (instrument_id, user_id, start_time, end_time, purpose, status) VALUES (3, 4, '2026-06-08 09:00', '2026-06-08 11:00', '环境水样吸光度测定', '已确认')"
  ).run();
  db.prepare(
    "INSERT INTO reservations (instrument_id, user_id, start_time, end_time, purpose, status) VALUES (5, 2, '2026-06-08 13:30', '2026-06-08 15:30', '土壤样品称量', '已确认')"
  ).run();

  console.log('预约种子数据已创建');
}

try {
  seedUsers();
  seedReagents();
  seedHazards();
  seedInstruments();
  seedExperiments();
  seedReservationData();
  console.log('所有种子数据初始化完成！');
} catch (err) {
  console.error('种子数据初始化失败:', err);
}
