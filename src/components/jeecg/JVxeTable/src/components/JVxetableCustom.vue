<template>
  <div class="customTable">
    <!-- 表头 -->
    <div class="table-header">
      <div class="table-title" v-for="(column,index) in columns" :key="index" :style="{width: column.width?column.width:'10%'}" >
        <div class="title-list">
          <p class="title-p1" v-if="column.children!=undefined">{{ column.title }}</p>
          <p class="title-p" v-else>{{ column.title }}</p>
          <div class="title-item" v-if="column.children">
            <p v-for="(c,num) in column.children" :key="num">{{ c.title }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 表格正文 -->
    <div class="table-cont">
      <div class="cont-item" v-for="(item,index) in data" :key="index">
        <div class="cont-list" v-for="(p,num) in columns" :key="num" :style="{width: p.width?p.width:'10%'}">
          <div class="item-p" v-if="!item.edit">
            <div v-if="!p.children">
              <p v-if="p.type=='num'">{{ index+1 }}</p>
              <p v-if="p.type != 'num' && p.type!='switch'"> {{ item[p.code] }} </p>
              <p v-if="p.type=='switch'"> <a-switch :checked="item.edit" /> </p>
            </div>
            <div class="title-item" v-if="p.children">
              <div class="item-p" v-for="(c,m) in p.children" :key="m">
                <p v-if="c.type != 'num' && c.type!='switch'"> {{ item[c.code] }} </p>
                <p v-if="c.type=='switch'"> <a-switch :checked="item[c.code] == 'Y'?true:false" /> </p>
              </div>
            </div>
          </div>
          <div class="item-p" v-if="item.edit==true">
            <div v-if="!p.children">
              <p v-if="p.code=='index'">{{ index+1 }}</p>
              <p v-if="p.type=='text'"> <a-input v-model:value="item[p.code]" placeholder="Basic usage" class="item-input" type="text" /> </p>
              <p v-if="p.type=='switch'"> <a-switch :checked="item.edit" /> </p>
              <p v-if="p.type=='select'"> <selectCustom :url="url" :params="params" :columns="columnsArr" :rowKey="rowKey" :labelKey="labelKey" :linkmap="linkmap"></selectCustom> </p>
              <p v-if="p.type=='inputNum'"> <a-input-number id="inputNumber" v-model:value="item[p.code]" :min="1" :max="10" /> </p>
              <p v-if="p.type=='upload'"> <JUploadCustom style="width: 100%;margin-left: 20px;" :uploadType="['camera', 'uplaod']"></JUploadCustom> </p>
            </div>
            <div class="title-item" v-if="p.children">
              <div class="item-p" v-for="(c,m) in p.children" :key="m">
                <p v-if="c.type=='text'"> <a-input v-model:value="item[c.code]" placeholder="Basic usage" class="item-input" type="text" /> </p>
                <p v-if="c.type=='switch'"> <a-switch :checked="item.edit" /> </p>
                <p v-if="c.type=='select'"> <selectCustom :url="url" :params="params" :columns="columnsArr" :rowKey="rowKey" :labelKey="labelKey" :linkmap="linkmap"></selectCustom> </p>
                <p v-if="c.type=='inputNum'"> <a-input-number id="inputNumber" v-model:value="item[c.code]" :min="1" :max="10" /> </p>
                <p v-if="c.type=='upload'"> <JUploadCustom style="width: 100%;margin-left: 20px;" :uploadType="['camera', 'uplaod']"></JUploadCustom> </p>
              </div>
            </div>
          </div>
          <div class="table-action" v-if="p.type=='operate'">
            <div class="action-btn" v-for="(act,k) in p.actions" :key="k">
              <p v-if="item.edit && act == 'edit'" @click="handleSave(index)">保存</p>
              <p v-if="act == 'edit'" @click="handleEdit(index)">编辑</p>
              <p v-if="act == 'del'">
                <a-popconfirm 
                  title="确定要删除这条数据吗？" 
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="confirm"
                  @cancel="cancel">
                  <a href="#">删除</a>
                </a-popconfirm>
              </p>
              <p v-if="act == 'detail' && !item.edit">详情</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
  import { computed, inject, ref, onMounted } from 'vue';
  import { Popconfirm,message } from 'ant-design-vue';
  import { propTypes } from '/@/utils/propTypes';
  import selectCustom from '/@/components/Form/src/jeecg/components/JSearchSelectCustom.vue'
  import JUploadCustom from '/@/components/Form/src/jeecg/components/JUpload/JUploadCustom.vue'
  const props = defineProps({
    columns: propTypes.array.def(() => []),
  });
  const url = ref('/workcenter/basWorkCenter/list')
  const params = ref({ column: 'createTime', order: 'desc', searchFields: 'code,name' /*, code: '${code}'*/ });
  const columnsArr = ref([
          {
            name: '编码',
            code: 'code',
          },
          {
            name: '名称',
            code: 'name',
          },
        ])
  const rowKey = ref('id');
  const labelKey = ref(['code']);
  const linkmap = ref([{ name: 'wkcName_dictText' }]);
  const editText = ref(null);
  const data = ref([{
    "id": "",
    "lotInspId": null,
    "stdItemId": "1674325002251108353",
    "code": "0001",
    "description": "测试",
    "samplingProcessId": "1636627830115397633",
    "inspCategory": "测试检验类别",
    "inspTool": "测试检验工具",
    "inspBasis": "测试检验依据",
    "techRequirements": "测试技术要求",
    "minOperators": null,
    "isSuitable": "N",
    "inspTag": "judgemengt",
    "ac": null,
    "re": null,
    "limitMin": null,
    "maxOperators": null,
    "limitMax": null,
    "unitId": "1632548472112562177",
    "result": null,
    "attachments": null,
    "remark": null,
    "inspBy": null,
    "inspTime": null,
    "valueList": [],
    edit: false
  },
  {
    "id": "",
    "lotInspId": null,
    "stdItemId": "1674325159436845057",
    "code": "0002",
    "description": "测试2",
    "samplingProcessId": "1636627830115397633",
    "inspCategory": "测试检验类别",
    "inspTool": "11",
    "inspBasis": "223",
    "techRequirements": "233",
    "minOperators": null,
    "isSuitable": "Y",
    "inspTag": "judgemengt",
    "ac": null,
    "re": null,
    "limitMin": null,
    "maxOperators": null,
    "limitMax": null,
    "unitId": "1643892395893288961",
    "result": null,
    "attachments": null,
    "remark": null,
    "inspBy": null,
    "inspTime": null,
    "valueList": [],
    edit: false
  },
  {
    "id": "",
    "lotInspId": null,
    "stdItemId": "1674325346842542082",
    "code": "0003",
    "description": "测试3",
    "samplingProcessId": "1638778938183081986",
    "inspCategory": "测试1",
    "inspTool": "11",
    "inspBasis": "332",
    "techRequirements": "测试1",
    "minOperators": "lower_limit_gt",
    "isSuitable": "Y",
    "inspTag": "measurement",
    "ac": null,
    "re": null,
    "limitMin": 20,
    "maxOperators": "top_limit_lt",
    "limitMax": 30,
    "unitId": "1643892396035895297",
    "result": null,
    "attachments": null,
    "remark": null,
    "inspBy": null,
    "inspTime": null,
    "valueList": [],
    edit: false
  }])
  function handleEdit(index) {
    data.value[index].edit = true
  }
  function handleSave(index){
    data.value[index].edit = false
    console.log(data.value)
  }
  const confirm = (e: MouseEvent) => {
    console.log(e);
    message.success('Click on Yes');
  };

  const cancel = (e: MouseEvent) => {
    console.log(e);
    message.error('Click on No');
  };
</script>
  
<style lang="less" scoped>
*{
  margin: 0;
  padding: 0;
}
.customTable{
  width: calc(100% - 20px);
  height: 100%;
  background-color: #fff;
  margin: 0 10px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  .table-header{
    width: 100%;
    height: 50px;
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    align-items: center;
    background-color: #fafafa;
    .table-title{
      font-size: 14px;
      border-right: 1px solid #e5e7eb;
      .title-p{
        line-height: 50px;
        text-align: center;
      }
      .title-p1{
        line-height: 25px;
        text-align: center;
        border-bottom: 1px solid #e5e7eb;
      }
      .title-list{
        .title-item{
          display: flex;
          p{
            flex: 1;
            text-align: center;
            border-right: 1px solid #e5e7eb;
          }
          p:last-child{
            border-right: none;
          }
        }
      }
      
      
    }
    .table-title:last-child{
      border-right: none;
    }
  }
  .table-cont{
    width: 100%;
    height: 100%;
    .cont-item{
      width: 100%;
      height: 50px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      .cont-list{
        .title-item{
          display: flex;
        }
        .item-p{
          width: 100%;
          line-height: 50px;
          text-align: center;
          border-right: 1px solid #e5e7eb;
        }
        .item-input{
          width: calc(100% - 30px);
          height: 40px;
          margin-top: 5px;
          margin-left: 10px;
          border: 1px solid #e5e7eb;
          padding-left: 10px;
        }
        .table-action{
          display: flex;
          .action-btn{
            flex: 1;
            p{
              text-align: center;
              color: #1890ff;
              line-height: 50px;
              cursor: pointer;
            }
          }
        }
      }
      
    }
    .cont-item:last-child{
      border-bottom: none;
    }
  }
}

</style>