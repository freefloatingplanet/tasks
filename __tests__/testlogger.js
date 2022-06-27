const lo = require('../my_modules/infrastructure/file/logger')

test('ログ書き込みのチェック', ()=>{
  lo.writelog('test').then(contents => {
    expect.stringContaining(contents);
  });


});
