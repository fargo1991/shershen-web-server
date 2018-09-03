/**
 * Created by yaroslav on 30.08.18.
 */

// [!] - Константы с ролями пользователей не менять! Эти значения сохраняются в БД. Таблицы: users, token (зашифрована в jwt)

const ADMIN = 'ADMIN';
const FRAN_ADMIN = 'FRAN_ADMIN';
const BRAND_ADMIN = 'BRAND_ADMIN';
const MERCHANT_ADMIN = 'MERCHANT_ADMIN';
const CUSTOMER = 'CUSTOMER';
const GUEST = 'GUEST';

config =
  [
    {
      role : ADMIN,
      routes : [
        {
          /** @user  */
          route : '/user',
          methods : {
            'GET' : { access : true, accessFields : 'all', exceptedFields : ['password'] },
            'POST' : { access : true, accessFields : 'all' },
            'PUT' : { access : true, accessFields : 'all' },
            'DELETE' : { access : true }
          }
        },
        {
          /** @merchant */
          route : '/merchant',
          methods : {
            'GET' : { access : true, accessFields : 'all' },
            'POST' : { access : true, accessFields : 'all' },
            'PUT' : { access : true, accessFields : 'all'},
            'DELETE' : { access : true }
          }
        }
      ]
    },
    {
      role : MERCHANT_ADMIN,
      routes : [
        {
          /** @user  */
          route : '/user',
          methods : {
            'GET' : { access : true, accessFields : 'all', exceptedFields : ['password'] },
            'POST' : { access : false, accessFields : 'none'  },
            'PUT' : { access : true, accessFields : 'all', exceptedFields : ['role'] },
            'DELETE' : { access : false }
          }
        },
        {
          /** @merchant */
          route : '/merchant',
          methods : {
            'GET' : { access : true, accessFields : 'all' },
            'POST' : { access : false, accessFields : 'none' },
            'PUT' : { access : true, accessFields : 'all'},
            'DELETE' : { access : false }
          }
        },
      ]
    },
    {
      role : CUSTOMER,
      routes : [
        {
          /** @user  */
          route : '/user',
          methods : {
            'GET' : { access : true, accessFields : 'all', exceptedFields : ['password'] },
            'POST' : { access : false, accessFields : 'none' },
            'PUT' : { access : true, accessFields : 'all', exceptedFields : ['role'] },
            'DELETE' : { access : true }
          }
        },
        {
          /** @merchant */
          route : '/merchant',
          methods : {
            'GET' : { access : true, accessFields : 'all' },
            'POST' : { access : false, accessFields : 'none' },
            'PUT' : { access : false, accessFields : 'none'},
            'DELETE' : { access : false }
          }
        }
      ]
    },
    {
      role : GUEST,
      routes : [
        {
          /** @user  */
          route : '/user',
          methods : {
            'GET' : { access : true, accessFields : 'all', exceptedFields : ['password'] },
            'POST' : { access : true,  accessFields : 'all', exceptedFields : [`role=${MERCHANT_ADMIN},${FRAN_ADMIN},${ADMIN}`] },
            'PUT' : { access : false, accessFields : 'none' },
            'DELETE' : { access : false }
          }
        },
        {
          /** @merchant */
          route : '/merchant',
          methods : {
            'GET' : { access : true, accessFields : 'all' },
            'POST' : { access : false, accessFields : 'none' },
            'PUT' : { access : false, accessFields : 'none' },
            'DELETE' : { access : false }
          }
        }
      ]
    },

  ]

module.exports = config;