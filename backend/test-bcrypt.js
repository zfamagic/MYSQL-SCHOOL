const bcrypt = require('bcryptjs');
const hash = '$2b$10$pw6P556NEQlFhZwIOoOooePIZ1Qv9iMFumEOnuG7AN9T.Dt4KjBLm';
const password = '123456';

bcrypt.compare(password, hash).then(match => {
  console.log('密码是否匹配:', match); // 应该输出 true
});