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