const da = require('../my_modules/infrastructure/file/dataAccessor')

test('ファイル名取得関数のチェック', ()=>{
  expect(da.getDataFileName('task')).toBe(da.TASKFILE);
  expect(da.getDataFileName('other')).toBe('');
});

test('ファイル読み込み関数のチェック', ()=>{
  let datatype = da.getDataFileName('task');
  da.readData(datatype).then(contents => {
    expect.stringContaining(contents);
  });


});
