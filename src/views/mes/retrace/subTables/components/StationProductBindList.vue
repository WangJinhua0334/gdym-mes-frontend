<template>
  <div v-if="isShow" :style="{ height: containerHeight }" style="margin: 20px 0px" ref="scrollBoardContainer">
    <p>物料绑定记录：</p>
    <!-- 使用 dv-scroll-board 展示数据 -->
    <dv-scroll-board :config="config" style="width: 100%" />
  </div>

  <!-- 生产记录弹窗 -->
  <ProducttionRecordModal @register="registerModal" />
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, getCurrentInstance } from 'vue';
  import { actionsProductBindList } from '../ProducttionRecordModal.api';
  import ProducttionRecordModal from '../ProducttionRecordModal.vue';
  import { useModal } from '/@/components/Modal';

  // 获取当前组件实例，以便访问 $refs 和 $el
  const instance = getCurrentInstance();

  const [registerModal, { openModal }] = useModal();
  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
    stationId: {
      type: String,
      default: '',
    },
  });

  // 配置对象，用于 dv-scroll-board
  const config = ref({
    header: [
      '<span style="color:#000;font-weight: bold;">工单</span>',
      '<span style="color:#000;font-weight: bold;">生产任务</span>',
      '<span style="color:#000;font-weight: bold;">物料编码</span>',
      '<span style="color:#000;font-weight: bold;">物料名称</span>',
      '<span style="color:#000;font-weight: bold;">数量</span>',
      '<span style="color:#000;font-weight: bold;">物料条码</span>',
      '<span style="color:#000;font-weight: bold;">物料批次</span>',
      '<span style="color:#000;font-weight: bold;">类型</span>',
      '<span style="color:#000;font-weight: bold;">绑定人</span>',
      '<span style="color:#000;font-weight: bold;">绑定工位</span>',
      '<span style="color:#000;font-weight: bold;">绑定时间</span>',
    ],
    headerHeight: 30 * (localStorage.remScale || 1), // 默认 remScale 为 1
    data: [],
    headerBGC: '',
    oddRowBGC: 'transparent',
    evenRowBGC: 'transparent',
    index: false,
    rowNum: 5,
    columnWidth: [
      200 * (localStorage.remScale || 1),
      200 * (localStorage.remScale || 1),
      200 * (localStorage.remScale || 1),
      400 * (localStorage.remScale || 1),
      200 * (localStorage.remScale || 1),
      200 * (localStorage.remScale || 1),
      150 * (localStorage.remScale || 1),
      150 * (localStorage.remScale || 1),
      200 * (localStorage.remScale || 1),
      200 * (localStorage.remScale || 1),
    ],
    align: ['center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center'],
  });

  const isShow = ref(false);
  const containerHeight = ref('auto'); // 容器高度

  // 监听 config.data 变化，控制显示和计算高度
  watch(
    () => config.value.data,
    (newData) => {
      if (newData && newData.length > 0) {
        isShow.value = true;
      } else {
        isShow.value = false;
      }
      // 计算新高度: 行高 * 行数 + 表头高 + 一些边距
      const rowHeight = 35; // 假设每行高度为 35px
      const headerHeight = config.value.headerHeight || 30;
      const margin = 70; // 上下 margin 和一些额外空间
      containerHeight.value = `${rowHeight * newData.length + headerHeight + margin}px`;
    },
    { immediate: true } // 立即执行一次
  );

  // 加载物料绑定列表
  function loadProductBindList() {
    const params = {
      id: props.id,
      stationId: props.stationId,
    };

    actionsProductBindList(params).then((res) => {
      const newData = [];
      res.forEach((item) => {
        // 如果是 'product' 类型，则条码列可点击
        if (item.materialSnType === 'product') {
          // 构造可点击的条码 HTML 字符串，并存储 ID 信息
          // 注意：这里使用了 data-* 属性来存储 ID，避免在字符串中直接拼接函数调用
          const clickableSn = `<span style="color:blue;font-size: 12px;height:20px; cursor: pointer;" class="clickable-sn" data-lot-id="${item.materialLotId}" data-sn-id="${item.materialSnId}" data-wfs-id="${item.wfsId}">${ReturnValue(item.materialSn)}</span>`;
          newData.push([
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.moId_dictText)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.moPlanId_dictText)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.prodId_dictText)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px; overflow:hidden;" title="${ReturnValue(item.prodName_dictText)}">${ReturnValue(item.prodName_dictText)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.qty)}</span>`,
            clickableSn, // 使用可点击的 span
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.materialBatch)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.materialSnType_dictText)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.bindBy_dictText)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.wkpId_dictText)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.bindTime)}</span>`,
          ]);
        } else {
          // 非 'product' 类型，条码不可点击
          newData.push([
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.moId_dictText)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.moPlanId_dictText)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.prodId_dictText)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px; overflow:hidden;" title="${ReturnValue(item.prodName_dictText)}">${ReturnValue(item.prodName_dictText)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.qty)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.materialSn)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.materialBatch)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.materialSnType_dictText)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.bindBy_dictText)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.wkpId_dictText)}</span>`,
            `<span style="color:#000;font-size: 12px;height:20px">${ReturnValue(item.bindTime)}</span>`,
          ]);
        }
      });

      // 更新配置
      config.value.data = newData;
      config.value.rowNum = newData.length > 0 ? newData.length : 5; // 至少显示 5 行

      // 强制更新配置对象以触发 dv-scroll-board 重新渲染
      config.value = { ...config.value };

      // 在下次 DOM 更新后添加事件监听器
      setTimeout(() => {
        addClickListeners();
      }, 0);
    });
  }

  // 为可点击的条码添加事件监听器
  function addClickListeners() {
    // 通过 ref 获取容器元素
    const container = instance?.refs.scrollBoardContainer;
    if (container instanceof HTMLElement) {
      // 查找所有带有 'clickable-sn' 类的 span 元素
      const clickableSpans = container.querySelectorAll('.clickable-sn');
      clickableSpans.forEach((span) => {
        // 移除旧的监听器（防止重复添加）
        span.removeEventListener('click', handleSpanClick);
        // 添加新的点击监听器
        span.addEventListener('click', handleSpanClick);
      });
    }
  }

  // 处理条码点击事件
  function handleSpanClick(event) {
    // 从 data-* 属性中获取 ID
    const lotId = event.target.dataset.lotId;
    const snId = event.target.dataset.snId;
    const wfsId = event.target.dataset.wfsId;

    if (lotId && snId && wfsId) {
      console.log('条码被点击:', lotId, snId, wfsId);
      handleProduction(lotId, snId, wfsId);
    } else {
      console.warn('点击的条码缺少必要的 ID 信息');
    }
  }

  // 打开生产记录弹窗
  function handleProduction(lot_id, sn_id, wfsId) {
    console.log('handleProduction', lot_id, sn_id, wfsId);
    const record = {
      id: lot_id,
      sn: sn_id,
      wfsId: wfsId,
    };
    openModal(true, {
      record: record,
    });
  }

  // 处理空值或无效值
  function ReturnValue(value) {
    if (value != null && value !== 'null' && value !== undefined) {
      return value;
    }
    return '';
  }

  // 监听 props.id 变化
  watch(
    () => props.id,
    (newId) => {
      if (newId) {
        loadProductBindList();
      }
    },
    { immediate: true } // 组件挂载时也执行
  );

  // 组件挂载时加载数据
  onMounted(() => {
    // loadProductBindList(); // 由 watch immediate 触发
  });
</script>

<style lang="less" scoped>
  /* 可以在这里添加一些样式 */
</style>
