<template>
  <div class="ganttPage">
    <BasicForm class="formbox" submitOnReset @register="registerForm" @submit="handleSearchInfoChange" />
    <div class="pages" style="background-color: #fff">
      <table class="table-fixedHeader" cellpadding="0" cellspacing="0" border="0">
        <thead>
          <tr>
            <th width="150px">工单</th>
            <th width="120px">产品编码</th>
            <th width="400px">产品名称</th>
            <th width="60px" v-for="(data, index) in dateArrsplit" :key="index">
              <p style="width: 60px; height: 20px; line-height: 20px" v-for="(val, num) in data" :key="num">{{ val }}</p>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in gattList" :key="i">
            <td width="150px">
              {{ item.code }}
            </td>
            <td width="120px">
              {{ item.prodCode }}
            </td>
            <td width="400px">
              {{ item.prodName }}
            </td>
            <td width="60px" v-for="(data, index) in dateArrsplit" :key="index" style="border-right: 2px dotted #dfe2eb">
              <div
                v-if="item.numIndex == index"
                :style="{ width: item.num * 60 + 'px' }"
                @click="clickNav(i, item)"
                style="cursor: pointer; padding: 0 5px"
                ><Progress :percent="item.rate" style="width: 100%; height: 10px" :stroke-width="10" :strokeColor="item.color" trailColor="#cbc9c9"
              /></div>
            </td>
            <!-- <td :style="{ width: 60 * dateArr.length + 'px' }">
             
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
    <BasicModal @register="registerModal" :defaultFullscreen="true" :title="'工作台流程图'" :showOkBtn="false" :showCancelBtn="false" destroyOnClose>
      <WorkflowViewer />
    </BasicModal>
  </div>
</template>
<script lang="ts" name="mo-ganttChart" setup>
  import { ref, computed, unref, getCurrentInstance, nextTick, provide } from 'vue';
  import { Progress } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { searchFormSchema } from './gantt.data';
  import { listMoByGantt } from './gantt.api';
  import { BasicModal, useModal } from '/@/components/Modal';
  import WorkflowViewer from '/@/views/mes/workbench/components/WorkflowViewer.vue';
  const searchData = ref({});
  //表单配置
  const [registerForm, { getFieldsValue }] = useForm({
    //labelWidth: 150,
    schemas: searchFormSchema,
    baseColProps: { span: 24 },
  });

  const moPlan = ref<any>({});
  const inputFlowCard = ref('');
  provide('moPlan', moPlan);
  provide('inputFlowCard', inputFlowCard);
  //注册model
  const [registerModal, { openModal }] = useModal();

  /**
   * 查询按钮点击事件
   */
  const sarchData = ref({});
  function handleSearchInfoChange() {
    sarchData.value = getFieldsValue();
    if (sarchData.dateRange) {
      searchData.value['dateRange'] = unref(sarchData).dateRange;
    } else {
      searchData.value['dateRange'] = '';
    }
    if (sarchData.code) {
      searchData.value['code'] = unref(sarchData).code;
    } else {
      searchData.value['code'] = '';
    }
    loadData();
  }
  /**
   * 加载数据
   */
  const dateArr = ref([]);
  const dateArrsplit = ref([]);
  const gattList = ref<any>([]);
  loadData();
  function loadData() {
    if (dateArr.value.length != 0) {
      dateArr.value = [];
      dateArrsplit.value = [];
    }
    if (gattList.value.length != 0) {
      gattList.value = [];
    }
    listMoByGantt(sarchData.value).then((res) => {
      dateArr.value = res.dateList;
      res.dateList.forEach((item) => {
        dateArrsplit.value.push(item.split(' '));
      });
      gattList.value = res.gattList;
      gattList.value.forEach((element) => {
        element.num = space(element.planStartTime, element.planCompleteTime) + 1;
        element.numIndex = space(res.dateList[0], element.planStartTime);
        element.color = compareDate(element.planCompleteTime, new Date()) ? '#52e56a' : 'Red';
      });
    });
    console.log(dateArr);
    console.log(dateArrsplit);
    console.log(gattList);
  }

  function space(startTime, endTime) {
    //startTime和endTime是2006-12-18格式
    var dateSpan, tempDate, dates;
    startTime = Date.parse(startTime);
    endTime = Date.parse(endTime);
    dateSpan = endTime - startTime;
    dateSpan = Math.abs(dateSpan);
    dates = Math.floor(dateSpan / (24 * 3600 * 1000));
    return dates;
  }

  function compareDate(date1, date2) {
    var oDate1 = new Date(date1);
    var oDate2 = new Date(date2);
    if (oDate1.getTime() > oDate2.getTime()) {
      return true; //第一个大
    } else {
      return false; //第二个大
    }
  }

  const { proxy } = getCurrentInstance();
  //const titsRight = ref(null);
  //const tbodyRight = ref(null);
  //const tbodyLeftItem = ref(null);
  //function scrollEvent(e) {
  //proxy.$refs.titsRight.style.left = -e.target.scrollLeft + 480 + 'px';
  //proxy.$refs.tbodyLeftItem.style.top = -e.target.scrollTop + 40 + 'px';
  // proxy.$refs.tbodyLeftItem.style.left = -e.target.scrollLeft + 120 + "px";
  //}

  function clickNav(index, task) {
    moPlan.value = task;
    openModal(true, {
      isUpdate: false,
      showFooter: true,
    });
  }
</script>

<style scoped lang="less">
  @import url('gantt.less');
</style>
