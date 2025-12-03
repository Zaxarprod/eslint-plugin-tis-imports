import { RuleTester } from 'eslint';
//@ts-ignore
import parser from '@typescript-eslint/parser';
import { layersImportRule } from '../../src/rules/layerImportsRule';

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
});

ruleTester.run('layer-imports common tests', layersImportRule, {
  valid: [
    {
      code: "import { something } from '~/entities/user';",
      filename: 'src/features/booking/index.ts',
      options: [
        {
          alias: '~',
          layers: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'],
          notStrictLayers: ['entities'],
        },
      ],
    },
  ],
  invalid: [
    {
      code: "import { something } from '~/widgets/booking';",
      filename: 'src/features/some-widget.ts',
      options: [
        {
          alias: '~',
          layers: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'],
        },
      ],
      errors: [
        {
          messageId: 'wrongDirection',
          data: {
            currentLayer: 'features',
            importingLayer: 'widgets',
          },
        },
      ],
    },
  ],
});

ruleTester.run('layer-imports notStrictLayers=[]', layersImportRule, {
  valid: [
    {
      code: "import { something } from '~/shared/user';",
      filename: 'src/entities/booking/index.ts',
      options: [
        {
          alias: '~',
          layers: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'],
          notStrictLayers: [],
        },
      ],
    },
  ],
  invalid: [
    {
      code: "import { something } from '~/entities/user';",
      filename: 'src/entities/booking/index.ts',
      options: [
        {
          alias: '~',
          layers: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'],
          notStrictLayers: [],
        },
      ],
      errors: [
        {
          messageId: 'wrongDirection',
          data: {
            currentLayer: 'entities',
            importingLayer: 'entities',
          },
        },
      ],
    },
  ],
});

ruleTester.run(`layer-imports notStrictLayers=['entities']`, layersImportRule, {
  valid: [
    {
      code: "import { something } from '../../user';",
      filename: 'src/entities/booking/index.ts',
      options: [
        {
          alias: '~',
          layers: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'],
          notStrictLayers: ['entities'],
        },
      ],
    },
  ],
  invalid: [
    {
      code: "import { something } from '~/features/user';",
      filename: 'src/features/booking/index.ts',
      options: [
        {
          alias: '~',
          layers: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'],
          notStrictLayers: ['entities'],
        },
      ],
      errors: [
        {
          messageId: 'wrongDirection',
          data: {
            currentLayer: 'features',
            importingLayer: 'features',
          },
        },
      ],
    },
  ],
});

ruleTester.run(`layer-imports notStrictLayers=['entities'], relativePath Error`, layersImportRule, {
  valid: [
    {
      code: "import { something } from '../../user';",
      filename: 'src/entities/booking/index.ts',
      options: [
        {
          alias: '~',
          layers: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'],
          notStrictLayers: ['entities'],
        },
      ],
    },
  ],
  invalid: [
    {
      code: "import { something } from '~/entities/user';",
      filename: 'src/entities/booking/index.ts',
      options: [
        {
          alias: '~',
          layers: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'],
          notStrictLayers: [],
        },
      ],
      errors: [
        {
          messageId: 'wrongDirection',
          data: {
            currentLayer: 'entities',
            importingLayer: 'entities',
          },
        },
      ],
    },
  ],
});

ruleTester.run(`layer-imports public api rule`, layersImportRule, {
  valid: [
    {
      code: "import { something } from '~/entities/user';",
      filename: 'src/features/booking/index.ts',
      options: [
        {
          alias: '~',
          layers: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'],
          publicApiEnabled: true,
        },
      ],
    },
  ],
  invalid: [
    {
      code: "import { something } from '~/entities/user/something';",
      filename: 'src/features/booking/index.ts',
      options: [
        {
          alias: '~',
          layers: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'],
          publicApiEnabled: true,
        },
      ],
      errors: [
        {
          messageId: 'publicApiError',
          data: {
            currentLayer: 'entities',
          },
        },
      ],
    },
  ],
});

ruleTester.run(`layer-imports notStrictLayers=['entities'], same layers`, layersImportRule, {
  valid: [
    {
      code: "import { something } from './utils';",
      filename: 'src/entities/user/index.ts',
      options: [
        {
          alias: '~',
          layers: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'],
          notStrictLayers: ['entities'],
        },
      ],
    },
  ],
  invalid: [],
});

ruleTester.run(`layer-imports public api rule`, layersImportRule, {
  valid: [
    {
      code: "import { something } from '~/entities/user';",
      filename: 'src/features/booking/index.ts',
      options: [
        {
          alias: '~',
          layers: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'],
          publicApiEnabled: true,
        },
      ],
    },
  ],
  invalid: [
    {
      code: "import { something } from '~/entities/user/something';",
      filename: 'src/features/booking/index.ts',
      options: [
        {
          alias: '~',
          layers: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'],
          publicApiEnabled: true,
        },
      ],
      errors: [
        {
          messageId: 'publicApiError',
          data: {
            currentLayer: 'entities',
          },
        },
      ],
    },
  ],
});