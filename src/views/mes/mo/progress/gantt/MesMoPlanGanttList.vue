<template>
  <BasicModal v-bind="$attrs" @register="registerPlanGanttModal" destroyOnClose :title="'进度详情'" :width="800">
    <div ref="ganttRef" />
  </BasicModal>
</template>

<script lang="ts" name="mo-mesMoPlanGranttList" setup>
import { ref, computed, unref, onMounted, watch, watchEffect, reactive } from 'vue';
import { gantt } from 'dhtmlx-gantt';
import { listByMoId } from './MesMoPlanGanttList.api';
import { BasicModal, useModalInner } from '/@/components/Modal';
 import "dhtmlx-gantt/codebase/dhtmlxgantt.css"
const ganttRef = ref();

const planList = ref();

const ganttTasks=reactive({} as any);

const ganttColumns=ref([] as any);


const [registerPlanGanttModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  gantt.clearAll();
  setModalProps({ confirmLoading: false, showCancelBtn: false, showOkBtn: false, defaultFullscreen: true });
  listByMoId({ moId: data.moId }).then((res) => {
    planList.value = res;
  });
});

function getDaysBetween(dateString1, dateString2) {
  var startDate = Date.parse(dateString1);
  var endDate = Date.parse(dateString2);
  if (startDate > endDate) {
    return 0;
  }
  var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000) + 1;
  return days;
}
watch(
  () => planList.value,
  () => {
    if (planList.value && planList.value.length > 0) {
      let datas = [] as any;
      for (let plan of unref(planList)) {
        let obj = {} as any;
        obj.id = plan.id;
        obj.text = plan.code;
        obj.start_date = plan.planStartTime;
        obj.end_date = plan.planCompleteTime;
        obj.duration = getDaysBetween(plan.planStartTime, plan.planCompleteTime);
        // obj.progress = 0.9;
        obj.progress=parseFloat(Math.floor(Number(plan.completedQty?plan.completedQty:0)/Number(plan.qty)*100)*100)
        //if(Number(obj.progress)==0){
          //obj.progress=0.01
        //}
        datas.push(obj);
      }
      ganttTasks.data = datas;


      //设置任务条进度内容
      gantt.templates.progress_text = function (start, end, task) {
        return "<div style='text-align:left;color:#fff;padding-left:20px'>" + Math.round(task.progress * 100) + '% </div>';
      };


      gantt.config.autosize = true
      gantt.config.show_grid=false;
      gantt.config.xml_date = '%Y-%m-%d';
      gantt.i18n.setLocale('cn');
      gantt.config.readonly = true;
      
      
      gantt.config.scale_unit = 'day';
      gantt.config.date_scale = '%Y-%m-%d';
      gantt.init(ganttRef.value);
      gantt.parse(ganttTasks);


      

    }
  },
  { immediate: false, deep: true }
);
</script>

<style scoped>
</style>
