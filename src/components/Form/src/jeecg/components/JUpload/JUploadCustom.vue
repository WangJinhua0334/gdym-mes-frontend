<template>
  <div ref="containerRef" :class="`${prefixCls}-container`" style="display: flex">
    <a-upload :headers="headers" :multiple="multiple" :action="uploadUrl" :fileList="fileList" :disabled="disabled"
      :remove="onRemove" v-bind="bindProps" @change="onFileChange" @preview="onFilePreview"
      v-if="selectType2 && selectType2 == 'uplaod'">
      <template v-if="isImageMode">
        <div v-if="!isMaxCount">
          <Icon icon="ant-design:plus-outlined" />
          <div class="ant-upload-text">{{ text }}</div>
        </div>
      </template>
      <a-button v-else-if="buttonVisible" :disabled="isMaxCount || disabled">
        <Icon icon="ant-design:upload-outlined" />
        <span>{{ text }}</span>
      </a-button>
    </a-upload>
    <div style="margin-left: 10px" v-if="selectType1 && selectType1 == 'camera'">
      <a-button type="primary" @click="onTake" :disabled="disabled">拍照上传</a-button>
      <div style="margin-top: 10px; display: flex; flex-wrap: wrap" v-if="imgUrlList.length > 0">
        <img v-for="(item, index) in imgUrlList" :key="index" :src="item"
          style="width: 80px; height: 80px; margin-left: 10px; margin-bottom: 10px" />
      </div>
      <a-modal v-bind="bindProps" title="拍照上传" :width="!showCanvas ? '520px' : '900px'" v-model:visible="visible"
        @cancel="onCancel" @ok="handleOk">
        <div class="box" style="display: flex;margin-top: 10px;">
          <video id="videoCamera" style="margin: 0 auto;" :width="videoWidth" :height="videoHeight" autoPlay></video>
          <canvas style="display:none;" id="canvasCamera"></canvas>
          <div v-if="showCanvas" class="img_bg_camera">
            <div v-for="(item, index) in urlList" :key="index" @mouseenter="mousechange(item)"
              @mouseleave="mousemove(item)" :class="item.checked ? 'active' : ''" @click="chooseImg(item, index)">
              <img style="width: 100%;height: 100%;" :src="item.url" alt="">
              <Icon icon="ant-design:close-outlined" class="tx_img" color="#fff" v-if="item.showMove"
                @click="moveImg(index)" />
            </div>
          </div>
        </div>
        <div class="btn-box" style="margin: 10px 0; display: flex; align-items: center; justify-content: center">
          <a-button @click="drawImage" class="btn" type="primary" size="small" style="margin: 0 10px"> 拍照 </a-button>
          <a-button @click="changeVideo" class="btn" type="primary" size="small" style="margin: 0 10px"> 摄像头切换 </a-button>
          <a-button @click="resetCanvas" class="btn" type="primary" size="small" style="margin: 0 10px"> 重置 </a-button>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, nextTick, createApp, onMounted } from 'vue';
import { Icon } from '/@/components/Icon';
import { getToken } from '/@/utils/auth';
import { uploadUrl, uploadFile } from '/@/api/common/api';
import { propTypes } from '/@/utils/propTypes';
import { useMessage } from '/@/hooks/web/useMessage';
import { createImgPreview } from '/@/components/Preview/index';
import { useAttrs } from '/@/hooks/core/useAttrs';
import { useDesign } from '/@/hooks/web/useDesign';
import { UploadTypeEnum } from './upload.data';
import { getFileAccessHttpUrl } from '/@/utils/common/compUtils';
import UploadItemActions from './components/UploadItemActions.vue';

const { createMessage, createConfirm } = useMessage();
const { prefixCls } = useDesign('j-upload');
const attrs = useAttrs();
const emit = defineEmits(['change', 'update:value']);
const props = defineProps({
  value: propTypes.oneOfType([propTypes.string, propTypes.array]),
  text: propTypes.string.def('上传'),
  fileType: propTypes.string.def(UploadTypeEnum.all),
  /*这个属性用于控制文件上传的业务路径*/
  bizPath: propTypes.string.def('temp'),
  /**
   * 是否返回url，
   * true：仅返回url
   * false：返回fileName filePath fileSize
   */
  returnUrl: propTypes.bool.def(true),
  // 最大上传数量
  maxCount: propTypes.number.def(0),
  buttonVisible: propTypes.bool.def(true),
  multiple: propTypes.bool.def(true),
  // 是否显示左右移动按钮
  mover: propTypes.bool.def(true),
  // 是否显示下载按钮
  download: propTypes.bool.def(true),
  // 删除时是否显示确认框
  removeConfirm: propTypes.bool.def(false),
  beforeUpload: propTypes.func,
  disabled: propTypes.bool.def(false),
  uploadType: {
    type: Array,
    default: () => [],
  },
});

const headers = reactive({
  'X-Access-Token': getToken(),
});
const fileList = ref<any[]>([]);
const uploadGoOn = ref<boolean>(true);
// refs
const containerRef = ref();
// 是否达到了最大上传数量
const isMaxCount = computed(() => props.maxCount > 0 && fileList.value.length >= props.maxCount);
// 当前是否是上传图片模式
const isImageMode = computed(() => props.fileType === UploadTypeEnum.image);
// 合并 props 和 attrs
const bindProps = computed(() => {
  const bind: any = Object.assign({}, props, attrs);
  bind.name = 'file';
  bind.listType = isImageMode.value ? 'picture-card' : 'text';
  bind.class = [bind.class, { 'upload-disabled': props.disabled }];
  bind.data = { biz: props.bizPath, ...bind.data };
  //update-begin-author:taoyan date:20220407 for: 自定义beforeUpload return false，并不能中断上传过程
  if (!bind.beforeUpload) {
    bind.beforeUpload = onBeforeUpload;
  }
  //update-end-author:taoyan date:20220407 for: 自定义beforeUpload return false，并不能中断上传过程
  // 如果当前是图片上传模式，就只能上传图片
  if (isImageMode.value && !bind.accept) {
    bind.accept = 'image/*';
  }
  return bind;
});

const selectType1 = ref('');
const selectType2 = ref('');
const clickType = ref(1);
const camerasList = ref<any[]>([]);
/**
 * 判断popup配置项是否正确
 */
onMounted(() => {
  if (props.uploadType.length == 0) {
    createMessage.error('popup参数未正确配置!');
  } else {
    for (let i = 0; i < props.uploadType.length; i++) {
      if (props.uploadType[i] == 'camera') {
        selectType1.value = props.uploadType[i];
      } else {
        selectType2.value = props.uploadType[i];
      }
    }
  }
});

watch(
  () => props.value,
  (val) => {
    if (Array.isArray(val)) {
      if (props.returnUrl) {
        parsePathsValue(val.join(','));
      } else {
        parseArrayValue(val);
      }
    } else {
      parsePathsValue(val);
    }
  },
  { immediate: true }
);

watch(fileList, () => nextTick(() => addActionsListener()), { immediate: true });

const antUploadItemCls = 'ant-upload-list-item';

// Listener
function addActionsListener() {
  if (!isImageMode.value) {
    return;
  }
  const uploadItems = containerRef.value ? containerRef.value.getElementsByClassName(antUploadItemCls) : null;
  if (!uploadItems || uploadItems.length === 0) {
    return;
  }
  for (const uploadItem of uploadItems) {
    let hasActions = uploadItem.getAttribute('data-has-actions') === 'true';
    if (!hasActions) {
      uploadItem.addEventListener('mouseover', onAddActionsButton);
    }
  }
}

// 添加可左右移动的按钮
function onAddActionsButton(event) {
  const getUploadItem = () => {
    for (const path of event.path) {
      if (path.classList.contains(antUploadItemCls)) {
        return path;
      } else if (path.classList.contains(`${prefixCls}-container`)) {
        return null;
      }
    }
    return null;
  };
  const uploadItem = getUploadItem();
  if (!uploadItem) {
    return;
  }
  const actions = uploadItem.getElementsByClassName('ant-upload-list-item-actions');
  if (!actions || actions.length === 0) {
    return;
  }
  // 添加操作按钮
  const div = document.createElement('div');
  div.className = 'upload-actions-container';
  createApp(UploadItemActions, {
    element: uploadItem,
    fileList: fileList,
    mover: props.mover,
    download: props.download,
    emitValue: emitValue,
  }).mount(div);
  actions[0].appendChild(div);
  uploadItem.setAttribute('data-has-actions', 'true');
  uploadItem.removeEventListener('mouseover', onAddActionsButton);
}

// 解析数据库存储的逗号分割
function parsePathsValue(paths) {
  if (!paths || paths.length == 0) {
    if (clickType.value == 1) {
      fileList.value = [];
    } else {
      camerasList.value = [];
    }

    return;
  }
  let list: any[] = [];
  for (const item of paths.split(',')) {
    let url = getFileAccessHttpUrl(item);
    list.push({
      uid: uidGenerator(),
      name: getFileName(item),
      status: 'done',
      url: url,
      response: { status: 'history', message: item },
    });
  }
  if (clickType.value == 1) {
    fileList.value = list;
  } else {
    camerasList.value = list;
  }
}

// 解析数组值
function parseArrayValue(array) {
  if (!array || array.length == 0) {
    fileList.value = [];
    if (clickType.value == 1) {
      fileList.value = [];
    } else {
      camerasList.value = [];
    }
    return;
  }
  let list: any[] = [];
  for (const item of array) {
    let url = getFileAccessHttpUrl(item.filePath);
    list.push({
      uid: uidGenerator(),
      name: item.fileName,
      url: url,
      status: 'done',
      response: { status: 'history', message: item.filePath },
    });
  }
  if (clickType.value == 1) {
    fileList.value = list;
  } else {
    camerasList.value = list;
  }
}

// 文件上传之前的操作
function onBeforeUpload(file) {
  uploadGoOn.value = true;
  if (isImageMode.value) {
    if (file.type.indexOf('image') < 0) {
      createMessage.warning('请上传图片');
      uploadGoOn.value = false;
      return false;
    }
  }
  // 扩展 beforeUpload 验证
  if (typeof props.beforeUpload === 'function') {
    return props.beforeUpload(file);
  }
  return true;
}

// 删除处理事件
function onRemove() {
  if (props.removeConfirm) {
    return new Promise((resolve) => {
      createConfirm({
        title: '删除',
        content: `确定要删除这${isImageMode.value ? '张图片' : '个文件'}吗？`,
        iconType: 'warning',
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  }
  return true;
}

// upload组件change事件
function onFileChange(info) {
  clickType.value = 1;
  if (!info.file.status && uploadGoOn.value === false) {
    info.fileList.pop();
  }
  let fileListTemp = info.fileList;
  // 限制最大上传数
  if (props.maxCount > 0) {
    let count = fileListTemp.length;
    if (count >= props.maxCount) {
      let diffNum = props.maxCount - fileListTemp.length;
      if (diffNum >= 0) {
        fileListTemp = fileListTemp.slice(-props.maxCount);
      } else {
        return;
      }
    }
  }
  if (info.file.status === 'done') {
    if (info.file.response.success) {
      fileListTemp = fileListTemp.map((file) => {
        if (file.response) {
          let reUrl = file.response.message;
          file.url = getFileAccessHttpUrl(reUrl);
        }
        return file;
      });
    }
  } else if (info.file.status === 'error') {
    createMessage.error(`${info.file.name} 上传失败.`);
  }
  fileList.value = fileListTemp;
  if (info.file.status === 'done' || info.file.status === 'removed') {
    //returnUrl为true时仅返回文件路径
    if (props.returnUrl) {
      handlePathChange();
    } else {
      //returnUrl为false时返回文件名称、文件路径及文件大小
      let newFileList: any[] = [];
      for (const item of fileListTemp) {
        if (item.status === 'done') {
          let fileJson = {
            fileName: item.name,
            filePath: item.response.message,
            fileSize: item.size,
          };
          newFileList.push(fileJson);
        } else {
          return;
        }
      }
      emitValue(newFileList);
    }
  }
}

function handlePathChange() {
  let uploadFiles = fileList.value;
  let path = '';
  if (!uploadFiles || uploadFiles.length == 0) {
    path = '';
  }
  let pathList: string[] = [];
  for (const item of uploadFiles) {
    if (item.status === 'done') {
      pathList.push(item.response.message);
    } else {
      return;
    }
  }
  if (pathList.length > 0) {
    path = pathList.join(',');
  }
  emitValue(path);
}

// 预览文件、图片
function onFilePreview(file) {
  if (isImageMode.value) {
    createImgPreview({ imageList: [file.url], maskClosable: true });
  } else {
    window.open(file.url);
  }
}

function emitValue(value) {
  emit('change', value);
  emit('update:value', value);
}

function uidGenerator() {
  return '-' + parseInt(Math.random() * 10000 + 1, 10);
}

function getFileName(path) {
  if (path.lastIndexOf('\\') >= 0) {
    let reg = new RegExp('\\\\', 'g');
    path = path.replace(reg, '/');
  }
  return path.substring(path.lastIndexOf('/') + 1);
}

defineExpose({
  addActionsListener,
});

// 拍照
const visible = ref(false);
const thisCancas = ref(null);
const thisContext = ref(null);
const thisVideo = ref(null);
const videoWidth = ref(400);
const videoHeight = ref(300);
const showCanvas = ref(false);
let imgUrl = '',
  imgUrlList = ref<any[]>([]),
  imgList = ref<any[]>([]),
  urlList = ref<any[]>([]);
/*调用摄像头拍照开始*/
function onTake() {
  visible.value = true;
  clickType.value = 2;
  // getCompetence();
  takePhoto()
}
function onCancel() {
  //thisVideo.value = document.getElementById('videoCamera');
  closeCamera();
  nextTick(() => {
  visible.value = false;
  });
  // if (thisVideo.value && thisVideo.value !== null) {
  //   thisVideo.value.srcObject.getTracks()[0].stop();
  // }
  // if(mediaStreamTrack){
  //     mediaStreamTrack.stop();
  //   }
}

function getUserMedia(constraints, success, error) {
    if (navigator.mediaDevices.getUserMedia) {
        //最新的标准API
        navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
    } else if (navigator.webkitGetUserMedia) {
        //webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error)
    } else if (navigator.mozGetUserMedia) {
        //firfox浏览器
        navigator.mozGetUserMedia(constraints, success, error);
    } else if (navigator.getUserMedia) {
        //旧版API
        navigator.getUserMedia(constraints, success, error);
    }
}


//   //默认后置摄像头
let mode = 'environment';
let mediaStreamTrack;
function changeVideo(){
  changeMode();
}
// 切换摄像头
function changeMode() {
    mode = mode === 'user' ? 'environment' : 'user';
    closeCamera();
    takePhoto();
}
//请求摄像头
function takePhoto() {
  nextTick(() => {
    thisVideo.value = document.getElementById('videoCamera');
    const constraints = {
      audio: false,
      video: { width: videoWidth.value, height: videoHeight.value,facingMode: mode }
    }
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          // 旧的浏览器可能没有srcObject
          if ('srcObject' in thisVideo.value) {
            thisVideo.value.srcObject = stream;
            mediaStreamTrack = stream.getTracks()[0];
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            thisVideo.value.src = window.URL.createObjectURL(stream);
          }
          thisVideo.value.onloadedmetadata = function (e) {
            thisVideo.value.play();
          };
        })
        .catch((err) => {
          createMessage.error('没有开启摄像头权限或浏览器版本不兼容.!');
        });
    }
  })
}

// 调用摄像头权限
function getCompetence() {
  //必须在model中render后才可获取到dom节点,直接获取无法获取到model中的dom节点
  nextTick(() => {
    thisVideo.value = document.getElementById('videoCamera');
    const constraints = {
      audio: false,
      video: { width: videoWidth.value, height: videoHeight.value },
    };
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          // 旧的浏览器可能没有srcObject
          if ('srcObject' in thisVideo.value) {
            thisVideo.value.srcObject = stream;
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            thisVideo.value.src = window.URL.createObjectURL(stream);
          }
          thisVideo.value.onloadedmetadata = function (e) {
            thisVideo.value.play();
          };
        })
        .catch((err) => {
          createMessage.error('没有开启摄像头权限或浏览器版本不兼容.!');
        });
    }

  });
}
//绘制图片
function drawImage() {
  // 点击，canvas画图
  showCanvas.value = true;
  nextTick(() => {
    thisCancas.value = document.getElementById('canvasCamera');
    thisContext.value = thisCancas.value.getContext('2d');
    thisContext.value.drawImage(thisVideo.value, 0, 0, 300, 150);
    if (urlList.value.length > 5) {
      createMessage.error('超过最大拍照数量');
    } else {
      urlList.value.push({
        url: thisCancas.value.toDataURL(),
        showMove: false,
        checked: false
      });
    }
  });
}
// base64转文件
function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {
    type: mime,
  });
}

function mousechange(item) {
  item.showMove = true
}

function mousemove(item) {
  item.showMove = false
}

function moveImg(index) {
  urlList.value.splice(index, 1)
}

function chooseImg(item, index) {
  item.checked = !item.checked;
  if (item.checked) {
    imgUrlList.value.push(item.url)
  } else {
    imgUrlList.value.splice(index, 1)
  }
}

function handleOk() {
  if (imgUrlList.value.length == 0) {
    createMessage.error('请选择要上传的图片');
    return;
  }
  // if (thisVideo.value && thisVideo.value !== null) {
  //   thisVideo.value.srcObject.getTracks()[0].stop();
  // }
  closeCamera();
  visible.value = false;
  imgUrlList.value.forEach((val) => {
    const res = dataURLtoFile(val.toString(), 'img.jpg');
    let params = {
      file: res,
      filename: res.name,
      data: { biz: 'jeditor', jeditor: '1' },
    };
    const uploadSuccess = (res) => {
      if (res.success) {
        imgUrl = res.message;
        imgList.value.push(imgUrl);
        if (imgList.value) {
          let camerasListTemp = [
            {
              lastModified: res.lastModified,
              name: res.name,
              size: res.size,
              type: res.type,
              webkitRelativePath: '',
            },
          ];
          camerasListTemp = camerasListTemp.map((item) => {
            item.url = getFileAccessHttpUrl(imgList.value.join(','));
            return item;
          });
          camerasList.value = camerasListTemp;
          if (props.returnUrl) {
            let uploadFiles1 = camerasList.value;
            let path1 = '';
            if (!uploadFiles1 || uploadFiles1.length == 0) {
              path1 = '';
            }
            let pathList1: string[] = [];
            for (const item of uploadFiles1) {
              pathList1.push(item.url);
            }
            if (pathList1.length > 0) {
              path1 = pathList1.join(',');
            }
            emitValue(path1);
          } else {
            //returnUrl为false时返回文件名称、文件路径及文件大小
            let newFileList1: any[] = [];
            for (const item of camerasListTemp) {
              let fileJson1 = {
                fileName: item.name,
                filePath: item.url,
                fileSize: item.size,
              };
              newFileList1.push(fileJson1);
            }
            emitValue(newFileList1);
          }
        }
      }
    };
    uploadFile(params, uploadSuccess);
  })


}
//清空画布
function clearCanvas(id) {
  let c = document.getElementById(id);
  let cxt = c.getContext('2d');
  cxt.clearRect(0, 0, c.width, c.height);
}
//重置画布
function resetCanvas() {
  if (imgUrlList.value.length != 0) {
    clearCanvas('canvasCamera');
  }
  imgUrlList.value = [];
  showCanvas.value = false;
}
/*调用摄像头拍照结束*/
function closeCamera(){
  if (thisVideo.value && thisVideo.value !== null) {
    thisVideo.value.srcObject.getTracks()[0].stop();
  }
  thisVideo.value.srcObject = null;
}
</script>

<style lang="less">
//noinspection LessUnresolvedVariable
@prefix-cls: ~'@{namespace}-j-upload';

.@{prefix-cls} {
  &-container {
    position: relative;

    .upload-disabled {
      .ant-upload-list-item {
        .anticon-close {
          display: none;
        }

        .anticon-delete {
          display: none;
        }
      }

      /* update-begin-author:taoyan date:2022-5-24 for:VUEN-1093详情界面 图片下载按钮显示不全*/
      .upload-download-handler {
        right: 6px !important;
      }

      /* update-end-author:taoyan date:2022-5-24 for:VUEN-1093详情界面 图片下载按钮显示不全*/
    }

    .ant-upload-list-item {
      .upload-actions-container {
        position: absolute;
        top: -31px;
        left: -18px;
        z-index: 11;
        width: 84px;
        height: 84px;
        line-height: 28px;
        text-align: center;
        pointer-events: none;

        a {
          opacity: 0.9;
          margin: 0 5px;
          cursor: pointer;
          transition: opacity 0.3s;

          .anticon {
            color: #fff;
            font-size: 16px;
          }

          &:hover {
            opacity: 1;
          }
        }

        .upload-mover-handler,
        .upload-download-handler {
          position: absolute;
          pointer-events: auto;
        }

        .upload-mover-handler {
          width: 100%;
          bottom: 0;
        }

        .upload-download-handler {
          top: -4px;
          right: -4px;
        }
      }
    }
  }

  .box {
    .canvas {
      margin: 0 auto;
    }

    .btn-box {
      margin-top: 10px;

      .btn {
        margin: 10px 0;
      }
    }

  }

}

.img_bg_camera {
  display: flex;
  flex-wrap: wrap;
  width: 400px;
  height: 300px;
  margin: 0 auto;

  >div {
    width: 100px;
    height: 100px;
    margin: 5px;
    position: relative;
    border: 3px solid #fff;
  }

  .active {
    border: 3px solid #1890ff;
  }

  .tx_img {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    z-index: 99;
  }
}
</style>
