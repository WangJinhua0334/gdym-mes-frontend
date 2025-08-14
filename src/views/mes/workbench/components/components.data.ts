/**
 * 工作台 组件信息配置
 * <p>
 * 注意：
 * componentList中的 name 必须和后台工作命令中的组件填写一致
 * componentList中的 com 必须是对应的组件
 *
 */
import { markRaw, reactive } from 'vue';
import StartWorkModal from '/@/views/mes/wip/startwork/StartWork.vue';
import ProductWokeModal from '/@/views/mes/wip/productwoke/ProductWoke.vue';
import CompleteWorkModal from '/@/views/mes/wip/completework/CompleteWork.vue';
import ProductBindModal from '/@/views/mes/wip/productbind/ProductBind.vue';
import ProductTestModal from '/@/views/mes/wip/producttest/ProductTest.vue';
import ProductInspectModal from '/@/views/mes/wip/productinspect/ProductInspect.vue';
import ProductInspectFirstModal from '/@/views/mes/wip/productinspectfirst/ProductInspectFirst.vue';
import ProductOutInspectModal from '/@/views/mes/wip/productoutinspect/ProductOutInspect.vue';
import DefectiveHandleModal from '/@/views/mes/lotdefective/components/complete/MesLotDefectiveComplete.vue';
import ProductWokeHourModal from '/@/views/mes/wip/productwokehour/ProductWokeHour.vue';

import RepairModal from '/@/views/mes/lotrepair/RepairModal.vue';
import RepairList from '/@/views/mes/lotrepairlist/MesLotRepairList.vue';

import ProductBindList from '/@/views/mes/lotitembindlist/MesLotItemBindList.vue';
import ProductUnbindList from '/@/views/mes/lotitembindlist/MesLotItemUnbindList.vue';

import ProductTestList from '/@/views/mes/lottestlist/MesLotTestList.vue';

import ProductInspectList from '/@/views/mes/lotinspectlist/MesLotInspectList.vue';
import ProductInspectFirstList from '/@/views/mes/lotinspectfirstlist/MesLotInspFirstList.vue';
import ProductOutInspectList from '/@/views/mes/lotoutinspectlist/MesLotOutInspectList.vue';
import ProductwokeHourList from '/@/views/mes/lotwokehourlist/MesLotWokeHourList.vue';
import ProductwokeList from '/@/views/mes/lotwokelist/MesLotWokeList.vue';

import BindSnModal from '/@/views/mes/mo/components/MesMoPlanBindSn.vue';
import SplitModal from '/@/views/mes/lotsplit/Split.vue';
import ReworkModal from '/@/views/mes/lotrework/Rework.vue';

import TemporaryWorkModal from '/@/views/mes/temporarywork/components/MesTemporaryWork.vue';
import TemporaryWorkList from '/@/views/mes/temporarywork/MesTemporaryWorkList.vue';

import AbnormalCallModal from '/@/views/mes/abnormal/MesAbnormalCall.vue';

import ProductInModal from '/@/views/mes/productin/components/add/MesProductInAdd.vue';
import ProductInList from '/@/views/mes/productin/MesProductInList.vue';

import WorkFlowFileView from '/@/views/mes/wip/fileview/WorkFlowStationFileView.vue';
import DistributeLine from '/@/views/mes/distributeLine/DistributeLine.vue';
import MesMoSnList from '/@/views/mes/lotsnlist/MesMoSnList.vue';
import RemoteWorkPostList from '/@/views/mes/remoteshutdown/RemoteWorkPostList.vue';
import SplitList from '/@/views/mes/lotsplitlist/SplitList.vue';
import ScarnSn from '/@/views/mes/wip/scarn/ScarnSn.vue';

import WkpStockDeduct from '/@/views/mes/wip/prodwkpstock/WkpStockDeduct.vue';
import WkpStockUp from '/@/views/mes/wip/prodwkpstock/WkpStockUp.vue';
import WkpStockDown from '/@/views/mes/wip/prodwkpstock/WkpStockDown.vue';
import MesWkpStockList from '../../wkpstocklist/MesWkpStockList.vue';
import WkpMoChange from '/@/views/mes/wkpmolist/components/WkpMoChange.vue';
import MesMoPack from '/@/views/mes/mopack/MesMoPack.vue';
import MesMoPackList from '/@/views/mes/mopack/MesMoPackList.vue';

const componentList = reactive([
  { name: 'StartWork', com: markRaw(StartWorkModal) },
  { name: 'ProductWoke', com: markRaw(ProductWokeModal) },
  { name: 'CompleteWork', com: markRaw(CompleteWorkModal) },
  { name: 'ProductBind', com: markRaw(ProductBindModal) },
  { name: 'ProductTest', com: markRaw(ProductTestModal) },
  { name: 'ProductInspect', com: markRaw(ProductInspectModal) },
  { name: 'ProductInspectFirst', com: markRaw(ProductInspectFirstModal) },
  { name: 'ProductOutInspect', com: markRaw(ProductOutInspectModal) },
  { name: 'DefectiveHandle', com: markRaw(DefectiveHandleModal) },
  { name: 'ProductWokeHour', com: markRaw(ProductWokeHourModal) },
  { name: 'WkpMoChange', com: markRaw(WkpMoChange) },

  { name: 'ProductBindList', com: markRaw(ProductBindList) },
  { name: 'ProductUnbindList', com: markRaw(ProductUnbindList) },
  { name: 'ProductTestList', com: markRaw(ProductTestList) },
  { name: 'ProductInspectList', com: markRaw(ProductInspectList) },
  { name: 'ProductInspectFirstList', com: markRaw(ProductInspectFirstList) },
  { name: 'ProductOutInspectList', com: markRaw(ProductOutInspectList) },
  { name: 'ProductwokeHourList', com: markRaw(ProductwokeHourList) },
  { name: 'ProductwokeList', com: markRaw(ProductwokeList) },

  { name: 'BindSn', com: markRaw(BindSnModal) },
  { name: 'Split', com: markRaw(SplitModal) },
  { name: 'Rework', com: markRaw(ReworkModal) },

  { name: 'TemporaryWork', com: markRaw(TemporaryWorkModal) },
  { name: 'TemporaryWorkList', com: markRaw(TemporaryWorkList) },

  { name: 'AbnormalCall', com: markRaw(AbnormalCallModal) },

  { name: 'Repair', com: markRaw(RepairModal) },
  { name: 'RepairList', com: markRaw(RepairList) },

  { name: 'ProductIn', com: markRaw(ProductInModal) },
  { name: 'ProductInList', com: markRaw(ProductInList) },

  { name: 'WorkFlowFileView', com: markRaw(WorkFlowFileView) },
  { name: 'DistributeLine', com: markRaw(DistributeLine) },
  { name: 'MesMoSnList', com: markRaw(MesMoSnList) },
  { name: 'RemoteWorkPostList', com: markRaw(RemoteWorkPostList) },
  { name: 'SplitList', com: markRaw(SplitList) },
  { name: 'ScarnSn', com: markRaw(ScarnSn) },
  { name: 'WkpStockDeduct', com: markRaw(WkpStockDeduct) },
  { name: 'WkpStockUp', com: markRaw(WkpStockUp) },
  { name: 'WkpStockDown', com: markRaw(WkpStockDown) },
  { name: 'MesWkpStockList', com: markRaw(MesWkpStockList) },
  { name: 'MesMoPack', com: markRaw(MesMoPack) },
  { name: 'MesMoPackList', com: markRaw(MesMoPackList) },
]);

/**
 * 根据组件名称，获取组件
 * @param name
 */
export const getComponent = (name) => {
  if (name == '' || name == null) {
    return Promise.resolve(null);
  }

  for (const i in componentList) {
    if (name == componentList[i].name) {
      return Promise.resolve(componentList[i].com);
    }
  }

  return Promise.resolve(null);
};
