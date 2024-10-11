<template>
  <div class="chatWrap">
    <div class="content">
      <div class="main">
        <div id="scrollRef" ref="scrollRef" class="scrollArea">
          <template v-if="chatData.length">
            <div class="chatContentArea">
              <chatMessage
                v-for="(item, index) of chatData"
                :key="index"
                :date-time="item.dateTime"
                :text="item.text"
                :inversion="item.inversion"
                :error="item.error"
                :loading="item.loading"
                :fileUrls="item.fileUrls"
                :imgUrls="item.imgUrls"
              />
            </div>
            <div v-if="loading" class="stopArea">
              <a-button type="primary" danger @click="handleStop" class="stopBtn">
                <svg
                  t="1706148514627"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5214"
                  width="18"
                  height="18"
                >
                  <path
                    d="M512 967.111111c-250.311111 0-455.111111-204.8-455.111111-455.111111s204.8-455.111111 455.111111-455.111111 455.111111 204.8 455.111111 455.111111-204.8 455.111111-455.111111 455.111111z m0-56.888889c221.866667 0 398.222222-176.355556 398.222222-398.222222s-176.355556-398.222222-398.222222-398.222222-398.222222 176.355556-398.222222 398.222222 176.355556 398.222222 398.222222 398.222222z"
                    fill="currentColor"
                    p-id="5215"
                  />
                  <path d="M341.333333 341.333333h341.333334v341.333334H341.333333z" fill="currentColor" p-id="5216" />
                </svg>
                <span>停止响应</span>
              </a-button>
            </div>
          </template>
          <template v-else>
            <div class="emptyArea">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                class="mr-2 text-3xl iconify iconify--ri"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M16 16a3 3 0 1 1 0 6a3 3 0 0 1 0-6M6 12a4 4 0 1 1 0 8a4 4 0 0 1 0-8m8.5-10a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11"
                />
              </svg>
              <span>新建聊天</span>
            </div>
          </template>
        </div>
      </div>
      <div class="footer">
        <div class="topArea">
          <presetQuestion @outQuestion="handleOutQuestion" />
        </div>
        <div class="bottomArea">
          <!-- <a-button type="text" class="delBtn" @click="handleDelSession">
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="icon-d0254a77f10b972" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48" style="mask-type: alpha">
                <path d="M48 0H0V48H48V0Z" fill="#0077B3" />
              </mask>
              <g mask="url(#icon-d0254a77f10b972)">
                <path d="M6 24.0083V42H42V24" stroke="#0077B3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M33 15L24 6L15 15" stroke="#0077B3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M23.9917 32V6" stroke="#0077B3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              </g>
            </svg>
          </a-button> -->
          <a-popover id="popoverId" placement="top" trigger="hover" @visible-change="handleVisibleChange">
            <template #content>
              <div class="popover-content">
                <a-button type="text" class="sub-btn" @click="fileOpenFile">
                  <svg width="15" height="15" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <mask id="icon-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48" style="mask-type: alpha">
                        <rect width="48" height="48" fill="white" />
                        <path
                          d="M38 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H38C39.1046 44 40 43.1046 40 42V6C40 4.89543 39.1046 4 38 4Z"
                          fill="black"
                        />
                        <path d="M17 30L31 30" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M17 36H24" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M19 17L29 17" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M24 22V12" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                      </mask>
                    </defs>
                    <g mask="url(#icon-mask)">
                      <path
                        d="M38 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H38C39.1046 44 40 43.1046 40 42V6C40 4.89543 39.1046 4 38 4Z"
                        fill="none"
                        stroke="#0077B3"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path d="M17 30L31 30" stroke="#0077B3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M17 36H24" stroke="#0077B3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M19 17L29 17" stroke="#0077B3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M24 22V12" stroke="#0077B3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                  </svg>
                  上传文件
                </a-button>
                <a-button type="text" class="sub-btn" @click="fileOpenImg">
                  <svg width="15" height="15" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- 同样的方式应用第二个 SVG -->
                    <defs>
                      <mask id="icon-mask-2" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48" style="mask-type: alpha">
                        <rect width="48" height="48" fill="white" />
                        <path
                          d="M44 24C44 22.8954 43.1046 22 42 22C40.8954 22 40 22.8954 40 24H44ZM24 8C25.1046 8 26 7.10457 26 6C26 4.89543 25.1046 4 24 4V8ZM39 40H9V44H39V40ZM8 39V9H4V39H8ZM40 24V39H44V24H40ZM9 8H24V4H9V8ZM9 40C8.44772 40 8 39.5523 8 39H4C4 41.7614 6.23857 44 9 44V40ZM39 44C41.7614 44 44 41.7614 44 39H40C40 39.5523 39.5523 40 39 40V44ZM8 9C8 8.44772 8.44771 8 9 8V4C6.23858 4 4 6.23857 4 9H8Z"
                          fill="black"
                        />
                        <path
                          d="M6 35L16.6931 25.198C17.4389 24.5143 18.5779 24.4953 19.3461 25.1538L32 36"
                          stroke="black"
                          stroke-width="4"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M28 31L32.7735 26.2265C33.4772 25.5228 34.5914 25.4436 35.3877 26.0408L42 31"
                          stroke="black"
                          stroke-width="4"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path d="M30 12L42 12" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M36 6V18" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                      </mask>
                    </defs>
                    <g mask="url(#icon-mask-2)">
                      <path
                        d="M44 24C44 22.8954 43.1046 22 42 22C40.8954 22 40 22.8954 40 24H44ZM24 8C25.1046 8 26 7.10457 26 6C26 4.89543 25.1046 4 24 4V8ZM39 40H9V44H39V40ZM8 39V9H4V39H8ZM40 24V39H44V24H40ZM9 8H24V4H9V8ZM9 40C8.44772 40 8 39.5523 8 39H4C4 41.7614 6.23857 44 9 44V40ZM39 44C41.7614 44 44 41.7614 44 39H40C40 39.5523 39.5523 40 39 40V44ZM8 9C8 8.44772 8.44771 8 9 8V4C6.23858 4 4 6.23857 4 9H8Z"
                        fill="#0077B3"
                      />
                      <path
                        d="M6 35L16.6931 25.198C17.4389 24.5143 18.5779 24.4953 19.3461 25.1538L32 36"
                        stroke="#0077B3"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M28 31L32.7735 26.2265C33.4772 25.5228 34.5914 25.4436 35.3877 26.0408L42 31"
                        stroke="#0077B3"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path d="M30 12L42 12" stroke="#0077B3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M36 6V18" stroke="#0077B3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                  </svg>
                  上传图片
                </a-button>
              </div>
            </template>
            <a-button type="text" class="delBtn">
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="icon-d0254a77f10b972" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48" style="mask-type: alpha">
                  <path d="M48 0H0V48H48V0Z" fill="#0077B3" />
                </mask>
                <g mask="url(#icon-d0254a77f10b972)">
                  <path d="M6 24.0083V42H42V24" stroke="#0077B3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M33 15L24 6L15 15" stroke="#0077B3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M23.9917 32V6" stroke="#0077B3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                </g>
              </svg>
            </a-button>
          </a-popover>
          <a-button type="text" class="delBtn" @click="handleDelSession">
            <svg
              t="1706504908534"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1584"
              width="18"
              height="18"
            >
              <path
                d="M816.872727 158.254545h-181.527272V139.636364c0-39.563636-30.254545-69.818182-69.818182-69.818182h-107.054546c-39.563636 0-69.818182 30.254545-69.818182 69.818182v18.618181H207.127273c-48.872727 0-90.763636 41.890909-90.763637 93.09091s41.890909 90.763636 90.763637 90.763636h609.745454c51.2 0 90.763636-41.890909 90.763637-90.763636 0-51.2-41.890909-93.090909-90.763637-93.09091zM435.2 139.636364c0-13.963636 9.309091-23.272727 23.272727-23.272728h107.054546c13.963636 0 23.272727 9.309091 23.272727 23.272728v18.618181h-153.6V139.636364z m381.672727 155.927272H207.127273c-25.6 0-44.218182-20.945455-44.218182-44.218181 0-25.6 20.945455-44.218182 44.218182-44.218182h609.745454c25.6 0 44.218182 20.945455 44.218182 44.218182 0 23.272727-20.945455 44.218182-44.218182 44.218181zM835.490909 407.272727h-121.018182c-13.963636 0-23.272727 9.309091-23.272727 23.272728s9.309091 23.272727 23.272727 23.272727h97.745455V837.818182c0 39.563636-30.254545 69.818182-69.818182 69.818182h-37.236364V602.763636c0-13.963636-9.309091-23.272727-23.272727-23.272727s-23.272727 9.309091-23.272727 23.272727V907.636364h-118.690909V602.763636c0-13.963636-9.309091-23.272727-23.272728-23.272727s-23.272727 9.309091-23.272727 23.272727V907.636364H372.363636V602.763636c0-13.963636-9.309091-23.272727-23.272727-23.272727s-23.272727 9.309091-23.272727 23.272727V907.636364h-34.909091c-39.563636 0-69.818182-30.254545-69.818182-69.818182V453.818182H558.545455c13.963636 0 23.272727-9.309091 23.272727-23.272727s-9.309091-23.272727-23.272727-23.272728H197.818182c-13.963636 0-23.272727 9.309091-23.272727 23.272728V837.818182c0 65.163636 51.2 116.363636 116.363636 116.363636h451.490909c65.163636 0 116.363636-51.2 116.363636-116.363636V430.545455c0-13.963636-11.636364-23.272727-23.272727-23.272728z"
                fill="currentColor"
                p-id="1585"
              />
            </svg>
          </a-button>
          <a-button type="text" class="contextBtn" :class="[usingContext && 'enabled']" @click="handleUsingContext">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              class="iconify iconify--ri"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.956 9.956 0 0 1-4.708-1.175L2 22l1.176-5.29A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2m0 2a8 8 0 0 0-8 8c0 1.335.326 2.618.94 3.766l.35.654l-.656 2.946l2.948-.654l.653.349A7.955 7.955 0 0 0 12 20a8 8 0 1 0 0-16m1 3v5h4v2h-6V7z"
              />
            </svg>
          </a-button>
          <div style="width: 88%; border: 1px solid #40a9ff; padding: 5px; border-radius: 10px">
            <div><JUpload ref="uploadFileRef" v-bind="uploadFileBinds.props" @change="emitFileValue" /></div>
            <div><JUpload ref="uploadImgRef" v-bind="uploadImgBinds.props" @change="emitImgValue" /></div>
            <div>
              <a-textarea
                ref="inputRef"
                v-model:value="prompt"
                :autoSize="{ minRows: 1, maxRows: 6 }"
                :placeholder="placeholder"
                @pressEnter="handleEnter"
                autofocus
                style="border: none; margin: 0px; width: 95%"
              />
              <a-button
                @click="
                  () => {
                    handleSubmit();
                  }
                "
                :disabled="loading"
                type="primary"
                class="sendBtn"
                style="display: inline"
              >
                <svg
                  t="1706147858151"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4237"
                  width="1em"
                  height="1em"
                >
                  <path
                    d="M865.28 202.5472c-17.1008-15.2576-41.0624-19.6608-62.5664-11.5712L177.7664 427.1104c-23.2448 8.8064-38.5024 29.696-39.6288 54.5792-1.1264 24.8832 11.9808 47.104 34.4064 58.0608l97.5872 47.7184c4.5056 2.2528 8.0896 6.0416 9.9328 10.6496l65.4336 161.1776c7.7824 19.1488 24.4736 32.9728 44.7488 37.0688 20.2752 4.096 41.0624-2.1504 55.6032-16.7936l36.352-36.352c6.4512-6.4512 16.5888-7.8848 24.576-3.3792l156.5696 88.8832c9.4208 5.3248 19.8656 8.0896 30.3104 8.0896 8.192 0 16.4864-1.6384 24.2688-5.0176 17.8176-7.68 30.72-22.8352 35.4304-41.6768l130.7648-527.1552c5.5296-22.016-1.7408-45.2608-18.8416-60.416z m-20.8896 50.7904L713.5232 780.4928c-1.536 6.2464-5.8368 11.3664-11.776 13.9264s-12.5952 2.1504-18.2272-1.024L526.9504 704.512c-9.4208-5.3248-19.8656-7.9872-30.208-7.9872-15.9744 0-31.744 6.144-43.52 17.92l-36.352 36.352c-3.8912 3.8912-8.9088 5.9392-14.2336 6.0416l55.6032-152.1664c0.512-1.3312 1.2288-2.56 2.2528-3.6864l240.3328-246.1696c8.2944-8.4992-2.048-21.9136-12.3904-16.0768L301.6704 559.8208c-4.096-3.584-8.704-6.656-13.6192-9.1136L190.464 502.9888c-11.264-5.5296-11.5712-16.1792-11.4688-19.3536 0.1024-3.1744 1.536-13.824 13.2096-18.2272L817.152 229.2736c10.4448-3.9936 18.0224 1.3312 20.8896 3.8912 2.8672 2.4576 9.0112 9.3184 6.3488 20.1728z"
                    p-id="4238"
                    fill="currentColor"
                  />
                </svg>
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Ref } from 'vue';
  import { computed, ref, createVNode, onUnmounted, onMounted, reactive } from 'vue';
  import { useScroll } from '../hooks/useScroll';
  import { EventSourcePolyfill } from 'event-source-polyfill';
  import { ConfigEnum } from '/@/enums/httpEnum';
  import { getToken } from '/@/utils/auth';
  import { getAppEnvConfig } from '/@/utils/env';
  import chatMessage from './chatMessage.vue';
  import presetQuestion from './presetQuestion.vue';
  import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { message, Modal, Tabs } from 'ant-design-vue';
  import JUpload from '/@/components/Form/src/jeecg/components/JUpload/JUpload.vue';
  import { UploadTypeEnum } from '/@/components/Form/src/jeecg/components/JUpload/upload.data';
  import '../style/github-markdown.less';
  import '../style/highlight.less';
  import '../style/style.less';

  const props = defineProps(['chatData', 'uuid', 'dataSource']);
  const emit = defineEmits(['save', 'change', 'update:value', 'register']);
  const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll();
  const prompt = ref<string>('');
  const loading = ref<boolean>(false);
  const inputRef = ref<Ref | null>(null);
  // const chatData = computed(() => {
  //   return props.chatData;
  // });
  // 当前模式下, 发送消息会携带之前的聊天记录
  const usingContext = ref<any>(true);
  const uuid = computed(() => {
    return props.uuid;
  });
  let fileValue = ref<string>('');
  let imgValue = ref<string>('');
  const uploadFileRef = ref(null);
  const uploadImgRef = ref(null);
  const uploadFileBinds = reactive({ props: {} as any });
  uploadFileBinds.props.fileType = UploadTypeEnum.file;
  uploadFileBinds.props.maxCount = 5;
  uploadFileBinds.props.buttonVisible = false;
  uploadFileBinds.props.value = '';

  const uploadImgBinds = reactive({ props: {} as any });
  uploadImgBinds.props.fileType = UploadTypeEnum.image;
  uploadImgBinds.props.maxCount = 5;
  uploadImgBinds.props.buttonVisible = false;
  uploadImgBinds.props.value = '';

  const visible = ref(false);
  /**
   * 显示隐藏
   */
  function handleVisibleChange(val) {
    visible.value = val;
  }
  /**
   * 上传文件打开
   */
  function fileOpenFile() {
    // 如果 JUpload 包含一个 input 元素并且这个 input 处理文件选择
    if (uploadFileRef.value?.$el && uploadFileRef.value?.$el.querySelector('input[type="file"]')) {
      uploadFileRef.value.$el.querySelector('input[type="file"]').click();
    } else if (uploadFileRef.value?.click) {
      // 如果 JUpload 提供了一个 click 方法
      uploadFileRef.value.click();
    } else {
      console.error('无法触发点击事件');
    }
  }
  /**
   * 上传图片打开
   */
  function fileOpenImg() {
    // 如果 JUpload 包含一个 input 元素并且这个 input 处理文件选择
    if (uploadImgRef.value?.$el && uploadImgRef.value?.$el.querySelector('input[type="file"]')) {
      uploadImgRef.value.$el.querySelector('input[type="file"]').click();
    } else if (uploadImgRef.value?.click) {
      // 如果 JUpload 提供了一个 click 方法
      uploadImgRef.value.click();
    } else {
      console.error('无法触发点击事件');
    }
  }
  /**
   * 文件上传之后值改变
   */
  function emitFileValue(value) {
    fileValue.value = value;
  }
  /**
   * 图片上传之后值改变
   */
  function emitImgValue(value) {
    imgValue.value = value;
  }
  let evtSource: any = null;
  // const presetQuestion = ref(['小红书文案', '朋友圈文案', '演讲稿生成']);
  const { VITE_GLOB_API_URL } = getAppEnvConfig();

  const conversationList = computed(() => props.chatData.filter((item) => !item.inversion && !!item.conversationOptions));
  const placeholder = computed(() => {
    return '来说点什么吧...（Shift + Enter = 换行）';
  });

  function handleEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }
  function handleSubmit() {
    let message = prompt.value;
    if (!message || message.trim() === '') return;
    prompt.value = '';
    resetUploadComponents();
    onConversation(message);
  }
  const handleOutQuestion = (message) => {
    onConversation(message);
  };
  /**
   * 清除本次会话上传文件信息
   */
  function resetUploadComponents() {
    if (uploadFileRef.value && typeof uploadFileRef.value.reset === 'function') {
      uploadFileRef.value.reset();
    }

    if (uploadImgRef.value && typeof uploadImgRef.value.reset === 'function') {
      uploadImgRef.value.reset();
    }
  }
  async function onConversation(message) {
    if (loading.value) return;
    loading.value = true;

    if (props.chatData.length == 0) {
      const findItem = props.dataSource.history.find((item) => item.uuid === uuid.value);
      if (findItem && findItem.title == '新建聊天') {
        findItem.title = message;
      }
    }
    addChat(uuid.value, {
      dateTime: new Date().toLocaleString(),
      text: message,
      inversion: true,
      error: false,
      conversationOptions: null,
      requestOptions: { prompt: message, options: null },
      fileUrls: fileValue.value, // 传递文件 URL
      imgUrls: imgValue.value, // 传递图片 URL
    });
    scrollToBottom();

    let options: any = {};
    const lastContext = conversationList.value[conversationList.value.length - 1]?.conversationOptions;
    if (lastContext && usingContext.value) options = { ...lastContext };

    addChat(uuid.value, {
      dateTime: new Date().toLocaleString(),
      text: '思考中...',
      loading: true,
      inversion: false,
      error: false,
      conversationOptions: null,
      requestOptions: { prompt: message, options: { ...options } },
      fileUrls: '', // 初始为空
      imgUrls: '', // 初始为空
    });
    scrollToBottom();

    const initEventSource = () => {
      let lastText = '';
      if (typeof EventSource !== 'undefined') {
        const token = getToken();
        const fileUrls = fileValue.value; // 假设 fileValue 是一个响应式对象
        const imgUrls = imgValue.value; // 假设 imgValue 是一个响应式对象
        // evtSource = new EventSourcePolyfill(
        //   `${VITE_GLOB_API_URL}/ai/chat/send?message=${message}${options.parentMessageId ? '&topicId=' + options.parentMessageId : ''}`,
        //   {
        //     withCredentials: true,
        //     headers: {
        //       [ConfigEnum.TOKEN]: token,
        //     },
        //   }
        // ); // 后端接口，要配置允许跨域属性
        const params = new URLSearchParams({
          message: message,
          ...(options.parentMessageId && { topicId: options.parentMessageId }),
          ...(fileUrls && { fileUrls: fileUrls }),
          ...(imgUrls && { imgUrls: imgUrls }),
        }).toString();

        const url = `${VITE_GLOB_API_URL}/ai/chat/send?${params}`;

        evtSource = new EventSourcePolyfill(url, {
          withCredentials: true,
          headers: {
            [ConfigEnum.TOKEN]: token,
          },
        });
        //清除文件信息
        fileValue.value = '';
        imgValue.value = '';
        // 与事件源的连接刚打开时触发
        evtSource.onopen = function (e) {
          //console.log(e);
        };
        evtSource.addEventListener('message', function (e) {
          const data = e.data;
          if (data === '[DONE]') {
            updateChatSome(uuid, props.chatData.length - 1, { loading: false });
            scrollToBottom();
            handleStop();
            evtSource.close(); // 关闭连接
          } else {
            try {
              const _data = JSON.parse(data);
              const content = _data.content;
              if (content != undefined) {
                lastText += content;
                updateChat(uuid.value, props.chatData.length - 1, {
                  dateTime: new Date().toLocaleString(),
                  text: lastText,
                  inversion: false,
                  error: false,
                  loading: true,
                  conversationOptions: e.lastEventId == '[ERR]' ? null : { conversationId: data.conversationId, parentMessageId: e.lastEventId },
                  requestOptions: { prompt: message, options: { ...options } },
                });
                scrollToBottom();
              } else {
                updateChatSome(uuid.value, props.chatData.length - 1, { loading: false });
                scrollToBottom();
                handleStop();
              }
            } catch (error) {
              updateChatSome(uuid.value, props.chatData.length - 1, { loading: false });
              scrollToBottom();
              handleStop();
              evtSource.close(); // 关闭连接
            }
          }
        });
        // 当从事件源接收到数据时触发
        // evtSource.onmessage = function (e) {};
        // 与事件源的连接无法打开时触发
        evtSource.addEventListener('error', function (e) {
          // console.log(e);
          if (e.error?.message || e.statusText) {
            updateChat(uuid.value, props.chatData.length - 1, {
              dateTime: new Date().toLocaleString(),
              text: e.error?.message ?? e.statusText,
              inversion: false,
              error: false,
              loading: true,
              conversationOptions: null,
              requestOptions: { prompt: message, options: { ...options } },
            });
            scrollToBottom();
          }
          evtSource.close(); // 关闭连接
          updateChatSome(uuid.value, props.chatData.length - 1, { loading: false });
          handleStop();
        });
      } else {
        console.log('当前浏览器不支持使用EventSource接收服务器推送事件!');
      }
    };
    initEventSource();
  }
  onUnmounted(() => {
    evtSource?.close();
    updateChatSome(uuid.value, props.chatData.length - 1, { loading: false });
  });
  const addChat = (uuid, data) => {
    props.chatData.push({
      ...data,
      fileUrls: data.fileUrls || '', // 文件 URL 数组
      imgUrls: data.imgUrls || '', // 图片 URL 数组
    });
  };
  const updateChat = (uuid, index, data) => {
    props.chatData.splice(index, 1, data);
  };
  const updateChatSome = (uuid, index, data) => {
    props.chatData[index] = { ...props.chatData[index], ...data };
  };
  // 清空会话
  const handleDelSession = () => {
    Modal.confirm({
      title: '清空会话',
      icon: createVNode(ExclamationCircleOutlined),
      content: '是否清空会话?',
      closable: true,
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        try {
          return await new Promise<void>((resolve) => {
            props.chatData.length = 0;
            emit('save');
            resolve();
          });
        } catch {
          return console.log('Oops errors!');
        }
      },
    });
  };
  // 停止响应
  const handleStop = () => {
    if (loading.value) {
      loading.value = false;
    }
    if (evtSource) {
      evtSource?.close();
      updateChatSome(uuid, props.chatData.length - 1, { loading: false });
    }
  };
  // 是否使用上下文
  const handleUsingContext = () => {
    usingContext.value = !usingContext.value;
    if (usingContext.value) {
      message.success('当前模式下, 发送消息会携带之前的聊天记录');
    } else {
      message.warning('当前模式下, 发送消息不会携带之前的聊天记录');
    }
  };
  onMounted(() => {
    scrollToBottom();
  });
</script>

<style lang="less" scoped>
  .chatWrap {
    width: 100%;
    height: 100%;
    padding: 20px;
    .content {
      height: 100%;
      width: 100%;
      background: #fff;
      display: flex;
      flex-direction: column;
    }
  }
  .main {
    flex: 1;
    min-height: 0;
    .scrollArea {
      overflow-y: auto;
      height: 100%;
    }
    .chatContentArea {
      padding: 10px;
    }
  }
  .emptyArea {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #d4d4d4;
  }
  .stopArea {
    display: flex;
    justify-content: center;
    padding: 10px 0;
    .stopBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        margin-right: 5px;
      }
    }
  }
  .footer {
    display: flex;
    flex-direction: column;
    padding: 6px 16px;
    .topArea {
      padding-left: 94px;
      margin-bottom: 6px;
    }
    .bottomArea {
      display: flex;
      align-items: center;

      .ant-input {
        margin: 0 16px;
      }
      .ant-input,
      .ant-btn {
        height: 36px;
      }
      textarea.ant-input {
        padding-top: 6px;
        padding-bottom: 6px;
      }
      .contextBtn,
      .delBtn {
        padding: 0;
        width: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .delBtn {
        margin-right: 8px;
      }
      .contextBtn {
        color: #a8071a;
        &.enabled {
          color: @primary-color;
        }
        font-size: 18px;
      }
      .sendBtn {
        padding: 0 10px;
        font-size: 22px;
        display: flex;
        align-items: center;
      }
    }
  }
  /**新增样式 */
  ::v-deep(.ant-motion-collapse) {
    display: inline-block !important;
  }
  ::v-deep(.ant-upload-select-picture-card) {
    display: none !important;
  }
</style>
