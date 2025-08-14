//  表格合并
export const getSpanArr = (tableData, itemProperty) => {
  if (tableData.length === 0) {
    return false;
  }

  const spanArr = [];
  let pos;
  for (let i = 0; i < tableData.length; i++) {
    if (i === 0) {
      spanArr.push(1);
      pos = 0;
    } else {
      // 判断当前元素与上一个元素是否相同 相同则加 1。。。这里可以根据实际需求调整。可能多列相等时才合并
      if (tableData[i][itemProperty] && tableData[i][itemProperty] === tableData[i - 1][itemProperty]) {
        spanArr[pos] += 1;
        spanArr.push(0);
      } else {
        spanArr.push(1);
        pos = i;
      }
    }
  }
  return spanArr;
};
