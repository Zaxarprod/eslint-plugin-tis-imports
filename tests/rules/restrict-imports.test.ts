import { RuleTester } from 'eslint';
import path from 'path';
//@ts-ignore
import parser from '@typescript-eslint/parser';
import { restrictImportsRule } from '../../src/rules/restrictImports';

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
});

const bookingFilePath = path.resolve('src/features/booking/Booking.ts');

ruleTester.run('restrict-imports common tests', restrictImportsRule, {
  valid: [
    {
      code: "import { something } from '~/entities/user/components/UserInfo';",
      filename: 'src/features/user/User.ts',
      options: [
        {
          alias: '~',
          imports: [{ checkingImport: 'entities/user/components/UserInfo', allowedFolders: ['features/user'] }],
        },
      ],
    },
  ],
  invalid: [
    {
        code: "import { something } from '~/entities/user/components/UserInfo';",
        filename: 'src/features/booking/Booking.ts',
        options: [
          {
            alias: '~',
            imports: [{ checkingImport: 'entities/user/components/UserInfo', allowedFolders: ['features/user'] }],
          },
        ],
        errors: [
            {
            messageId: 'forbiddenImport',
            data: {
                checkingImport: 'entities/user/components/UserInfo',
                importingFile: bookingFilePath,
            },
            },
        ],
    },
  ],
});


const userInfoFilePath = path.resolve('src/features/user/component/UserInfo/utils.ts');

ruleTester.run('restrict-imports stories example', restrictImportsRule, {
    valid: [
      {
        code: "import { something } from '../stories/config';",
        filename: 'src/features/user/component/UserInfo/stories/utils.ts',
        options: [
          {
            alias: '~',
            imports: [{ checkingImport: 'stories', allowedFolders: ['stories'] }],
          },
        ],
      },
    ],
    invalid: [
      {
            code: "import { something } from '../stories/config';",
            filename: userInfoFilePath,
            options: [
            {
                alias: '~',
                imports: [{ checkingImport: 'stories', allowedFolders: ['stories'] }],
            },
            ],
            errors: [
                {
                messageId: 'forbiddenImport',
                data: {
                    checkingImport: 'stories',
                    importingFile: userInfoFilePath,
                },
                },
            ],
      },
    ],
  });