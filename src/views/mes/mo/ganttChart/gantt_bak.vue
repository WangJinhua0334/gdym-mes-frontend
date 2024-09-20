<template>
  <div class="ganttPage" :style="{ backgroundColor: themeColor == 'light' ? '#fff' : '#151515' }">
    <!-- 查询条件 -->
    <div style="width: 100%; height: 40px; margin-bottom: 10px; display: flex">
      <a-form style="width: 100%" layout="inline" autocomplete="off">
        <a-form-item label="车间" :labelCol="{ span: 8 }" style="width: 300px">
          <a-input v-model:value="form.workShop" placeholder="请输入设备编码" />
        </a-form-item>
        <a-form-item label="工作中心" :labelCol="{ span: 6 }" style="width: 300px; display: flex">
          <a-select v-model:value="form.workCenter" :options="statusOptions" />
        </a-form-item>
        <a-form-item label="时间" :labelCol="{ span: 3 }" style="width: 500px; display: flex">
          <a-date-picker v-model:value="form.time" picker="day" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="submit"> 查询 </a-button>
        </a-form-item>
      </a-form>
    </div>

    <!-- 表格 甘特图 -->
    <div class="gantt-box">
      <div class="status-box">
        <div class="status-item">
          <p class="status-color color1"></p>
          <p class="status-info">待生产</p>
        </div>
        <div class="status-item">
          <p class="status-color color2"></p>
          <p class="status-info">部分派工</p>
        </div>
        <div class="status-item">
          <p class="status-color color3"></p>
          <p class="status-info">已打印</p>
        </div>
        <div class="status-item">
          <p class="status-color color4"></p>
          <p class="status-info">生产中</p>
        </div>
        <div class="status-item">
          <p class="status-color color5"></p>
          <p class="status-info">已完工</p>
        </div>
        <div class="status-item">
          <p class="status-color color6"></p>
          <p class="status-info">关闭</p>
        </div>
      </div>
      <div class="gantt">
        <div class="container">
          <div class="box">
            <div class="list">
              <div class="nav nav-item">
                <p>序号</p>
                <p>工单编号</p>
                <p>产品编码</p>
                <p>产品名称</p>
                <p>工艺路线</p>
                <p>完成进度</p>
              </div>
              <div class="nav" id="nav">
                <div class="nav-item" v-for="(data, index) in dataList" :key="index">
                  <p>{{ data.rowNum }}</p>
                  <p>{{ data.MOCode }}</p>
                  <p>{{ data.ProductRootCode }}</p>
                  <p>{{ data.ProductName }}</p>
                  <p>{{ data.WorkflowRootCode }}</p>
                  <p>{{ data.About }}%</p>
                </div>
              </div>
            </div>
            <div class="list list1">
              <div class="nav1">
                <div class="nav2" id="date" v-for="(data, index) in dateArr" :key="index">
                  <p>{{ data.time }}</p>
                </div>
              </div>
              <div id="nav1">
                <div class="nav2" v-for="(data, index) in dataList" :key="index" style="width: 300px">
                  <Progress :class="clazz" :percent="30" style="width: 100%; height: 100%" />
                  <!-- <a-progress style="width: 100%;height: 100%;" :percent="30" /> -->
                  <!-- <div class="layui-progress layui-progress-big progress" data-id="'+data[i].MOId+'"
                                            :style="{ width: num * 120 + 'px', left: m * 120 + 'px' }">
                                            <div class="layui-progress-bar layui-bg-orange" lay-percent="'+data[i].About+'%"
                                                :style="{ width: data[i].About + '%' }"></div>
                                        </div> -->
                </div>
              </div>
            </div>
          </div>
          <div id="test1"></div>
        </div>
      </div>
    </div>

    <!-- 弹出框 -->
    <div class="popup-mask" id="mask">
      <div class="popup-box">
        <div class="popup-title">
          <h3>信息</h3>
          <i class="layui-icon layui-icon-close" id="close"></i>
        </div>
        <div style="text-align: center">
          <form class="layui-form" action="" style="background-color: #fff" lay-filter="example">
            <div class="layui-form-item">
              <div class="layui-inline">
                <label class="layui-form-label">工单编号</label>
                <div class="layui-input-inline">
                  <input type="tel" name="MOCode" autocomplete="off" class="layui-input" disabled="disabled" />
                </div>
              </div>
              <div class="layui-inline">
                <label class="layui-form-label">工序类型</label>
                <div class="layui-input-inline">
                  <input type="text" name="MOTypeName" autocomplete="off" class="layui-input" disabled="disabled" />
                </div>
              </div>
            </div>
            <div class="layui-form-item">
              <div class="layui-inline">
                <label class="layui-form-label">产品编码</label>
                <div class="layui-input-inline">
                  <input type="tel" name="ProductRootCode" autocomplete="off" class="layui-input" disabled="disabled" />
                </div>
              </div>
              <div class="layui-inline">
                <label class="layui-form-label">产品名称</label>
                <div class="layui-input-inline">
                  <input type="text" name="ProductName" autocomplete="off" class="layui-input" disabled="disabled" />
                </div>
              </div>
            </div>
            <div class="layui-form-item">
              <div class="layui-inline">
                <label class="layui-form-label">数量</label>
                <div class="layui-input-inline">
                  <input type="tel" name="Qty" autocomplete="off" class="layui-input" disabled="disabled" />
                </div>
              </div>
              <div class="layui-inline">
                <label class="layui-form-label">工艺线路</label>
                <div class="layui-input-inline">
                  <input type="text" name="WorkflowRootCode" autocomplete="off" class="layui-input" disabled="disabled" />
                </div>
              </div>
            </div>
            <div class="layui-form-item">
              <div class="layui-inline">
                <label class="layui-form-label">开始时间</label>
                <div class="layui-input-inline">
                  <input
                    type="text"
                    name="startDateTime"
                    autocomplete="off"
                    placeholder="请选择"
                    lay-verify="required"
                    class="layui-input"
                    id="startTime1"
                    readonly
                  />
                </div>
              </div>
              <div class="layui-inline">
                <label class="layui-form-label">结束时间</label>
                <div class="layui-input-inline">
                  <input
                    type="text"
                    name="endDateTime"
                    autocomplete="off"
                    placeholder="请选择"
                    lay-verify="required"
                    class="layui-input"
                    id="endTime1"
                    readonly
                  />
                </div>
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label" style="margin-left: 98px">备注</label>
              <div class="layui-input-block" style="margin-left: 90px">
                <textarea class="layui-textarea" name="moDescription" lay-verify="content" id="LAY_demo_editor"></textarea>
              </div>
            </div>
            <div class="layui-form-item">
              <div class="layui-input-block">
                <button type="submit" class="layui-btn" lay-submit="" lay-filter="demo1">取消</button>
                <button type="reset" class="layui-btn layui-btn-primary" id="LAY-component-form-getval">提交</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" name="mo-ganttChart" setup>
  import { ref, computed, unref } from 'vue';
  import { defHttp } from '/@/utils/http/axios';
  import { Progress } from 'ant-design-vue';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  const { getDarkMode } = useRootSetting();
  const themeColor = computed(() => {
    return unref(getDarkMode.value);
  });

  const dataList = ref([
    {
      rowNum: 1,
      MOCode: '12321312',
      ProductRootCode: '2141231',
      ProductName: '产品以',
      WorkflowRootCode: '4213213',
      About: 20,
      MOId: '1232132',
    },
  ]);
  const form = ref({
    workShop: '',
    workCenter: '',
    time: '',
  });

  const clazz = computed(() => {
    return {
      'j-vxe-progress': true,
    };
  });

  const dateArr = ref([
    {
      time: '周一',
    },
    {
      time: '周二',
    },
    {
      time: '周三',
    },
    {
      time: '周四',
    },
    {
      time: '周五',
    },
    {
      time: '周六',
    },
    {
      time: '周日',
    },
  ]);

  const statusOptions = ref([
    {
      value: 1,
      label: '工作中心1',
    },
  ]);

  function submit() {}
</script>
<style>
  .layui-laypage-limits .layui-form select {
    display: block;
  }

  xm-select {
    min-height: 26px;
    line-height: 26px;
    border: none;
  }

  xm-select > .xm-label .xm-label-block {
    height: 18px;
    line-height: 18px;
  }

  .layui-form-label {
    padding: 4px 0px !important;
    font-weight: normal !important;
  }

  .layui-input-block {
    min-height: 38px !important;
  }

  .layui-input-block input {
    width: 100%;
    height: 100%;
    font-size: 12px;
  }

  .layui-input-inline input {
    width: 100%;
  }

  .layui-form-item {
    margin-top: 20px;
  }

  .layui-form-label {
    margin-right: 10px;
  }

  .gantt-box {
    width: 100%;
    height: 87%;
  }

  .status-box {
    width: 100%;
    height: 40px;
    display: flex;
  }

  .status-item {
    display: flex;
    margin-left: 10px;
  }

  .status-item .status-color {
    width: 60px;
    height: 20px;
    margin-top: 10px;
    background-color: #ccc;
  }

  .status-item .color1 {
    background-color: #ffb800;
  }

  .status-item .color2 {
    background-color: #009688;
  }

  .status-item .color3 {
    background-color: #1e9fff;
  }

  .status-item .color4 {
    background-color: #009688;
  }

  .status-item .color5 {
    background-color: #ff5722;
  }

  .status-item .color6 {
    background-color: #393d49;
  }

  .status-info {
    font-size: 12px;
    line-height: 40px;
    margin-left: 10px;
  }

  .gantt {
    width: 100%;
    height: calc(100% - 100px);
  }

  .container {
    width: 100%;
    height: 100%;
  }

  .box {
    width: 98%;
    height: 100%;
    margin: 0 auto;
    border: 1px solid #000;
    display: flex;
  }

  .item {
    flex: 1;
  }

  .list {
    width: 100%;
  }

  .list p {
    flex: 1;
    text-align: center;
  }

  #cont {
    height: 500px;
  }

  .list1 {
    width: 100%;
    overflow: auto;
  }

  /*滚动条样式*/
  .list1::-webkit-scrollbar {
    height: 6px;
  }

  .list1::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }

  .list1::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }

  .nav {
    flex: 1;
  }

  .nav-item {
    display: flex;
    height: 54px;
    border-bottom: 1px solid #000;
    position: relative;
  }

  .nav-item p {
    align-self: center;
  }

  .nav1 {
    width: auto;
    display: inline-flex;
    height: 54px;
    border-bottom: 1px solid #000;
    position: relative;
  }

  .nav1 p {
    width: 120px;
    height: 54px;
    float: left;
    line-height: 54px;
    text-align: center;
    vertical-align: middle;
  }

  .nav2 {
    width: auto;
    height: 54px;
    display: inline-flex;
    position: relative;
    border-bottom: 1px solid #000;
    vertical-align: top;
  }

  .nav2 p {
    width: 120px;
    height: 54px;
    float: left;
    line-height: 54px;
    text-align: center;
    vertical-align: top;
  }

  .progress-box {
    width: 100%;
    position: absolute;
    left: 0;
  }

  .progress {
    width: 100%;
    position: absolute;
    top: 15px;
  }

  .popup-mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .popup-box {
    width: 800px;
    height: 400px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -400px;
    margin-top: -200px;
  }

  .popup-title {
    width: 100%;
    height: 40px;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .popup-title h3 {
    float: left;
    font-size: 16px;
    line-height: 40px;
  }

  .popup-title i {
    display: inline-block;
    width: 20px;
    height: 20px;
    float: right;
    margin-top: 10px;
    cursor: pointer;
  }

  .layui-textarea {
    width: 69%;
  }
</style>
