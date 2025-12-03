import { RuleTester } from 'eslint';
//@ts-ignore
import parser from '@typescript-eslint/parser';
import { enforceEntityHierarchyRule } from '../../src/rules/entitiesHierarchy';

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
});

ruleTester.run('entities-hierarchy common tests', enforceEntityHierarchyRule, {
  valid: [
    {
      code: "import { something } from '~/entities/user';",
      filename: 'src/entities/booking/Booking.ts',
      options: [
        {
          alias: '~',
          checkingLayers: ['entities'],
          hierarchy: ['booking', 'user', 'role'],
        },
      ],
    },
  ],
  invalid: [
    {
        code: "import { something } from '~/entities/booking';",
        filename: 'src/entities/user/Booking.ts',
        options: [
          {
            alias: '~',
            checkingLayers: ['entities'],
            hierarchy: ['booking', 'user', 'role'],
          },
        ],
        errors: [
            {
            messageId: 'wrongEntityDirection',
            data: {
                currentEntity: 'user',
                importingEntity: 'booking',
            },
            },
        ],
    },
  ],
});

ruleTester.run('entities-hierarchy empty checkingLayers', enforceEntityHierarchyRule, {
    // По иерархии user ниже, но ошибки, нет так как checkingLayers пустой
    valid: [
      {
        code: "import { something } from '~/entities/booking';",
        filename: 'src/entities/user/User.ts',
        options: [
          {
            alias: '~',
            checkingLayers: [],
            hierarchy: ['booking', 'user', 'role'],
          },
        ],
      },
    ],
    invalid: [
      {
          code: "import { something } from '~/features/user';",
          filename: 'src/features/role/Role.ts',
          options: [
            {
              alias: '~',
              checkingLayers: ['entities', 'features'],
              hierarchy: ['booking', 'user', 'role'],
            },
          ],
          errors: [
              {
              messageId: 'wrongEntityDirection',
              data: {
                  currentEntity: 'role',
                  importingEntity: 'user',
              },
              },
          ],
      },
    ],
  });

  ruleTester.run('entities-hierarchy does not check deep nesting', enforceEntityHierarchyRule, {
    valid: [
      {
        code: "import { BaseRoleT } from '~/entities/role';",
        filename: 'src/entities/transactions/mappers/common/mapTransactionUserToClient.ts',
        options: [
          {
            checkingLayers: ['entities', 'features', 'widgets'],
            alias: '~',
            hierarchy: [
              'booking',
              'salaryCalculation',
              'transaction',
              'transactions',
              'transactionTags',
              'orders',
              'quest',
              'guest',
              'rfm',
              'salaryMod',
              'shift',
              'floorPlan',
              'questSettings',
              'questSettingsV1',
              'salarySetting',
              'fineSetting',
              'floorSetting',
              'account',
              'category',
              'user',
              'role',
              'geo',
              'domain',
              'spot',
              'product',
              'document',
              'common',
            ],
          },
        ],
      },
    ],
    invalid: [],
  });