/* Runs the real SFC with Vue's in-memory renderer; no browser or ERP writes required.
 * node tests/oriented-receipt.component.cjs
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const vue = require('vue');
const { parse, compileScript } = require('@vue/compiler-sfc');
const ts = require('typescript');

const file = path.resolve(__dirname, '../src/views/mes/incomingOriented/MesIncomingOrientedList.vue');
const { descriptor } = parse(fs.readFileSync(file, 'utf8'));
const script = compileScript(descriptor, { id: 'oriented-test', inlineTemplate: true });
const js = ts.transpileModule(script.content, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 },
}).outputText;
const rows = vue.ref([]);
const user = vue.reactive({ getTenant: 1003, getUserInfo: { username: 'operator' } });
let fields = {};
let submitted = 0;
let printed = 0;
let printParameters;
let rejectSubmission = false;
let rejectPrinting = false;
const success = { billNo: 'RK001', items: [{ originalCoilNumber: 'SOURCE001', internalCoilNumber: 'ZQ202610240001', labelNumber: 'LABEL001' }] };
const mocked = {
  '/@/components/Form/index': {
    BasicForm: () => vue.h('form'),
    useForm: () => [
      () => {},
      {
        resetFields: async () => {},
        setFieldsValue: async (v) => {
          fields = { ...fields, ...v };
        },
        validate: async () => fields,
        scrollToField: () => {},
        getFieldsValue: () => fields,
      },
    ],
  },
  '/@/components/Table': {
    BasicTable: () => vue.h('table'),
    TableAction: () => vue.h('span'),
    useTable: () => [
      () => {},
      {
        setTableData: (v) => {
          rows.value = v;
        },
        getDataSource: () => rows.value,
      },
    ],
  },
  './MesIncomingOriented.data': { formSchema: [] },
  '/@/hooks/web/useMessage': { useMessage: () => ({ createMessage: { success() {}, warning() {}, error() {} } }) },
  './MesIncomingOriented.api': {
    printReceiptLabels: async (_report, numbers, tenant) => {
      printed++;
      printParameters = { R: { id: numbers.join(','), tenantId: tenant } };
      if (rejectPrinting) throw new Error('simulated print failure');
    },
    submitReceipt: async () => {
      submitted++;
      if (rejectSubmission) throw new Error('simulated submit failure');
      return success;
    },
  },
  '/@/store/modules/user': { useUserStore: () => user },
  '/@/utils': {
    loopPrintJimuReport: async (parameters) => {
      printed++;
      printParameters = parameters;
      if (rejectPrinting) throw new Error('simulated print failure');
    },
  },
  '/@/utils/printTemplate': { getPrintTemplateCode: async () => 'T', getReportIdByTemplateCode: async () => 'R' },
  '/@/utils/auth': { getToken: () => 'test-only' },
};
const storage = { getItem: () => null, setItem: () => {} };
const exported = { exports: {} };
vm.runInNewContext(
  js,
  {
    exports: exported.exports,
    module: exported,
    require: (name) => mocked[name] || require(name),
    console: { ...console, error() {} },
    localStorage: storage,
    sessionStorage: storage,
    document: { querySelector: () => null },
  },
  { filename: file }
);
function node(type, text = '') {
  return { type, text, children: [], props: {}, parent: null };
}
const renderer = vue.createRenderer({
  createElement: (tag) => node(tag),
  createText: (t) => node('text', t),
  createComment: () => node('comment'),
  setText: (n, t) => {
    n.text = t;
  },
  setElementText: (n, t) => {
    n.children = [];
    n.text = t;
  },
  parentNode: (n) => n.parent,
  nextSibling: (n) => n.parent?.children[n.parent.children.indexOf(n) + 1] || null,
  patchProp: (n, key, _old, value) => {
    n.props[key] = value;
  },
  insert: (n, parent, anchor) => {
    if (n.parent) n.parent.children.splice(n.parent.children.indexOf(n), 1);
    n.parent = parent;
    const i = anchor ? parent.children.indexOf(anchor) : -1;
    parent.children.splice(i < 0 ? parent.children.length : i, 0, n);
  },
  remove: (n) => {
    if (n.parent) n.parent.children.splice(n.parent.children.indexOf(n), 1);
  },
});
const root = node('root');
const app = renderer.createApp(exported.exports.default);
app.config.warnHandler = () => {};
app.mount(root);
const flush = async () => {
  for (let i = 0; i < 12; i++) {
    await Promise.resolve();
    await vue.nextTick();
  }
};
function text(n) {
  return n.text + n.children.map(text).join('');
}
function find(label) {
  const visit = (n) => (n.type === 'a-button' && text(n).trim() === label ? n : n.children.map(visit).find(Boolean));
  return visit(root);
}
function draft() {
  rows.value = [{ rowId: '1', coilNo: 'SOURCE001', purchaseOrderNo: 'PO001', weight: '2', firstOperation: 'sx' }];
}
async function click(label) {
  const button = find(label);
  assert.ok(button, `missing button ${label}`);
  await button.props.onClick();
  await flush();
}
async function testPrintTransport() {
  const source = fs.readFileSync(path.join(path.dirname(file), 'MesIncomingOriented.api.ts'), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const apiModule = { exports: {} };
  let request;
  let requests = 0;
  let dialogs = 0;
  let revoked = 0;
  let failExport = false;
  let failDialog = false;
  let switchDuringExport = false;
  vm.runInNewContext(compiled, {
    exports: apiModule.exports,
    module: apiModule,
    Blob,
    URL: {
      createObjectURL: () => 'blob:test',
      revokeObjectURL: () => {
        revoked++;
      },
    },
    require: (name) => {
      if (name === '/@/utils/http/axios')
        return {
          defHttp: {
            post: async (options) => {
              requests++;
              request = options;
              if (failExport) throw new Error('export failed');
              if (switchDuringExport) user.getTenant = 1003;
              return new Blob(['PDF'], { type: 'application/pdf' });
            },
          },
        };
      if (name === '/@/store/modules/user') return { useUserStore: () => user };
      if (name === 'print-js')
        return (options) => {
          dialogs++;
          if (failDialog) options.onError(new Error('dialog failed'));
          else options.onPrintDialogClose();
        };
      return require(name);
    },
  });
  const print = apiModule.exports.printReceiptLabels;
  await print('R', ['ZQ202610240001'], 1005);
  assert.equal(request.data.queryParam.tenantId, '1005', 'PDF export must use current tenant rather than hardcoded 1000');
  assert.equal(request.data.queryParam.id, 'ZQ202610240001');
  assert.equal(dialogs, 1);
  assert.equal(revoked, 1);
  failExport = true;
  await assert.rejects(print('R', ['ZQ202610240001'], 1005));
  assert.equal(dialogs, 1, 'export failure must not open a print dialog');
  failExport = false;
  failDialog = true;
  await assert.rejects(print('R', ['ZQ202610240001'], 1005));
  assert.equal(revoked, 2, 'failed dialog must release its PDF URL');
  failDialog = false;
  switchDuringExport = true;
  const previousDialogs = dialogs;
  await assert.rejects(print('R', ['ZQ202610240001'], 1005));
  assert.equal(dialogs, previousDialogs, 'tenant switch during export must prevent printing');
  assert.equal(requests, 4);
}
(async () => {
  await flush();
  assert.equal(find('打印标签'), undefined, 'printing must be hidden before success');
  rejectSubmission = true;
  draft();
  await assert.rejects(click('提交'));
  await flush();
  assert.equal(find('打印标签'), undefined, 'failed first submission must not enable printing');
  rejectSubmission = false;
  await click('提交');
  assert.ok(find('打印标签'));
  assert.equal(printed, 0, 'successful submission must never auto-print');
  assert.equal(rows.value.length, 0, 'successful draft must be cleared');
  await click('打印标签');
  assert.equal(printParameters.R.tenantId, 1003);
  assert.equal(printParameters.R.id, 'ZQ202610240001', 'printing must use generated number, not source');
  const beforeRetry = submitted;
  rejectPrinting = true;
  await click('打印标签');
  assert.ok(find('打印标签'), 'failed print must remain retryable');
  assert.equal(submitted, beforeRetry, 'printing must never resubmit receipt');
  rejectPrinting = false;
  rejectSubmission = true;
  draft();
  await assert.rejects(click('提交'));
  await flush();
  assert.ok(find('打印标签'), 'failed subsequent submission must retain prior successful batch');
  await click('打印标签');
  assert.equal(printParameters.R.id, 'ZQ202610240001');
  user.getTenant = 1005;
  await flush();
  assert.equal(find('打印标签'), undefined, 'switching tenant must clear printable result');
  app.unmount();
  await testPrintTransport();
  console.log('PASS: initial/failed/successful submit, explicit print, generated number, retry, retained result, tenant switch');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
