<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="title"
    :width="900"
    wrapClassName="bas-user-extend-modal"
    @ok="handleSubmit"
  >
    <div class="form-content">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, operationEchoOptions } from '../BasUserExtend.data';
  import { saveOrUpdate } from '../BasUserExtend.api';
  import { defHttp } from '@/utils/http/axios';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const optionalAssociationFields = [
    'deptId',
    'deptName',
    'deptNumber',
    'workShopId',
    'workShopName',
    'workShopNumber',
    'workTeamId',
    'workTeamName',
    'workTeamNumber',
    'wareHouseId',
    'wareHouseName',
    'wareHouseNumber',
    'operationId',
    'operationName',
    'operationNumber',
    'equipmentId',
    'equipmentName',
    'equipmentNumber',
    'printTemplateId',
    'printTemplateName',
    'printTemplateNumber',
  ];
  /**
   * 把档案上实际存在的字段抄到表单补丁里。
   * 档案没有该字段时不写入，避免用空值覆盖用户扩展记录里的原值。
   * @param target 待提交的表单补丁
   * @param source 按 id 查到的档案；为空时不处理
   * @param pairs 字段对应关系，每项为 [档案字段, 表单字段]
   */
  function assignExisting(target, source, pairs) {
    if (!source) {
      return;
    }
    pairs.forEach(([from, to]) => {
      if (Object.prototype.hasOwnProperty.call(source, from)) {
        target[to] = source[from];
      }
    });
  }

  async function findById(url, id) {
    if (!id) {
      return null;
    }
    try {
      const page = await defHttp.get({
        url,
        params: {
          id,
          pageNo: 1,
          pageSize: 1,
        },
      });
      const records = page?.records;
      if (!Array.isArray(records)) {
        return null;
      }
      return records.find((item) => String(item?.id) === String(id)) || null;
    } catch {
      return null;
    }
  }

  async function refreshMasterNames(record) {
    const patch = {};
    const [user, dept, workshop, team, warehouseResult, operation, equipment, template] = await Promise.all([
      findById('/sys/user/list', record.userId),
      findById('/sys/sysDepart/list', record.deptId),
      findById('/basic/basWorkShop/list', record.workShopId),
      findById('/basic/basWorkTeam/list', record.workTeamId),
      record.wareHouseId
        ? defHttp
            .get({
              url: '/basic/wareHouse/queryById',
              params: {
                id: record.wareHouseId,
              },
            })
            .catch(() => null)
        : Promise.resolve(null),
      findById('/basic/operation/list', record.operationId),
      findById('/basic/basEquipment/list', record.equipmentId),
      findById('/template/basTemplate/list', record.printTemplateId),
    ]);
    const warehouse = warehouseResult?.result ?? warehouseResult;
    assignExisting(patch, user, [
      ['realname', 'realName'],
      ['username', 'userName'],
    ]);
    assignExisting(patch, dept, [
      ['departName', 'deptName'],
      ['orgCode', 'deptNumber'],
    ]);
    assignExisting(patch, workshop, [
      ['name', 'workShopName'],
      ['code', 'workShopNumber'],
    ]);
    assignExisting(patch, team, [
      ['name', 'workTeamName'],
      ['code', 'workTeamNumber'],
    ]);
    assignExisting(patch, warehouse, [
      ['name', 'wareHouseName'],
      ['code', 'wareHouseNumber'],
      ['isOpenLocation', 'warehouseIsOpenLocation'],
    ]);
    if (warehouse && Object.prototype.hasOwnProperty.call(warehouse, 'isOpenLocation') && warehouse.isOpenLocation !== 'Y') {
      patch.defaultLocationId = null;
    }
    if (!record.wareHouseId) {
      patch.warehouseIsOpenLocation = null;
      patch.defaultLocationId = null;
    }
    assignExisting(patch, operation, [
      ['operationName', 'operationName'],
      ['operationNumber', 'operationNumber'],
    ]);
    assignExisting(patch, equipment, [
      ['name', 'equipmentName'],
      ['code', 'equipmentNumber'],
    ]);
    assignExisting(patch, template, [
      ['name', 'printTemplateName'],
      ['code', 'printTemplateNumber'],
    ]);
    if (Object.keys(patch).length > 0) {
      await setFieldsValue(patch);
    }
  }
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate, clearValidate }] = useForm({
    labelWidth: 120,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 12 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    // 先清掉上一条记录的工序，避免新增或另一条编辑带出旧工序名称
    operationEchoOptions.value = [];
    //重置表单
    await resetFields();
    // 重置会把厂区先写成空并触发必填校验，等这次校验发出后再写入档案值
    await nextTick();
    setModalProps({
      confirmLoading: false,
      showCancelBtn: !!data?.showFooter,
      showOkBtn: !!data?.showFooter,
      height: Math.max(180, Math.min(620, window.innerHeight - 220)),
    });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      const record = { ...data.record };
      // 工序档案主键是整数。先按用户扩展记录准备同类型选项，输入框才能显示已保存的工序。
      let operationOption = null;
      if (record.operationId !== null && record.operationId !== undefined && record.operationId !== '') {
        const operationId = Number(record.operationId);
        if (Number.isFinite(operationId)) {
          operationOption = {
            id: operationId,
            operationName: record.operationName,
            operationNumber: record.operationNumber,
          };
          record.operationId = operationId;
        }
      }
      const operation = await findById('/basic/operation/list', data.record?.operationId);
      if (operation && operation.id !== null && operation.id !== undefined) {
        const operationId = Number(operation.id);
        if (Number.isFinite(operationId)) {
          operationOption = {
            ...operation,
            id: operationId,
          };
          record.operationId = operationId;
        }
      }
      operationEchoOptions.value = operationOption ? [operationOption] : [];
      await nextTick();
      await setFieldsValue({
        ...record,
      });
      await refreshMasterNames(data.record);
      // 厂区已经回显后，清掉重置阶段留下的必填红字
      await nextTick();
      await clearValidate(['plantName']);
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });
  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
  //表单提交事件
  async function handleSubmit() {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });
      //提交表单
      const payload = { ...values };
      optionalAssociationFields.forEach((field) => {
        payload[field] = payload[field] ?? '';
      });
      if (payload.operationId !== '') {
        payload.operationId = String(payload.operationId);
      }
      if (!payload.wareHouseId) {
        payload.defaultLocationId = '';
      }
      delete payload.warehouseIsOpenLocation;
      await saveOrUpdate(payload, isUpdate.value);
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>

<style lang="less" scoped>
  .form-content {
    padding: 16px 30px 0;
  }

  :deep(.bas-user-extend-modal .ant-modal) {
    max-width: calc(100vw - 32px);
  }

  :deep(.form-content .ant-form-item) {
    margin-bottom: 10px;
  }

  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
</style>
