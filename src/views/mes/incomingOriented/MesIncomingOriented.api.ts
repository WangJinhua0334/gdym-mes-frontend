import { defHttp } from '/@/utils/http/axios';
import { useUserStore } from '/@/store/modules/user';
import printJS from 'print-js';

export interface ReceiptResult {
  billNo: string;
  items: Array<{ originalCoilNumber: string; internalCoilNumber: string; labelNumber: string }>;
}

export const submitReceipt = (params: Record<string, unknown>) =>
  defHttp.post<ReceiptResult>({ url: '/etl/orientedReceiptMaterial/submit', data: params });

/** 独立导出，保留当前租户；导出/打印错误必须向上传递，使按钮可重试。 */
export async function printReceiptLabels(reportId: string, numbers: string[], tenantId: number): Promise<void> {
  const checkTenant = () => {
    if (Number(useUserStore().getTenant) !== tenantId) throw new Error('租户已切换，请重新选择打印记录');
  };
  checkTenant();
  if (!numbers.length || numbers.some((number) => !/^ZQ\d{12}$/.test(number))) throw new Error('取向钢卷号无效');
  const pdf = await defHttp.post<Blob>(
    {
      url: '/jmreport/exportPdfStream',
      data: { excelConfigId: reportId, queryParam: { id: numbers.join(','), tenantId: String(tenantId) } },
      responseType: 'blob',
    },
    { isTransformResponse: false }
  );
  checkTenant();
  if (!(pdf instanceof Blob) || !pdf.size || pdf.type.includes('json')) throw new Error('标签 PDF 导出失败');
  const url = URL.createObjectURL(pdf);
  await new Promise<void>((resolve, reject) => {
    const done = (error?: unknown) => {
      URL.revokeObjectURL(url);
      if (error) reject(error);
      else resolve();
    };
    try {
      printJS({ printable: url, type: 'pdf', showModal: true, onPrintDialogClose: () => done(), onError: (error) => done(error) });
    } catch (error) {
      done(error);
    }
  });
}
