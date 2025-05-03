# eslint-plugin-tis-imports

Eslint plugin for precise control of architectural restrictions. FSD, public api, hierarchy of entities in the project. There is also support for restricting the use of files by scope.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-tis-imports`:

```sh
npm install eslint-plugin-tis-imports --save-dev
```

## Usage

Add `tis-imports` to the plugins section of your `.eslint.config.mjs` configuration file. You can omit the `eslint-plugin-` prefix:

```mjs
import tisImportsPlugin from 'eslint-plugin-tis-imports'

...

{
    plugins: {
      'tis-imports': tisImportsPlugin,
    },
}
```

Then configure the rules you want to use under the rules section.

```mjs
...
{
    rules: {
      // 🔹 1. Контроль слоёв и направлений
      'tis-imports/layer-imports': ['error', {
        alias: '~',
        layers: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'],
        notStrictLayers: ['entities', 'features'],
        publicApiEnabled: true,
      }],

      // 🔸 2. Контроль иерархии сущностей внутри одного слоя
      'tis-imports/entities-hierarchy': ['error', {
        checkingLayers: ['entities'],
        alias: '~',
        hierarchy: ['user', 'role'],
      }],

      // 🔸 3. Контроль использования определенных файлов внутри определенного scope
      'tis-imports/restrict-imports': ['error', {
        imports: [{ checkingImport: 'entities/role', allowedFolders: ['pages/role', 'widgets/role', 'features/role'] }],
        alias: '~',
      }],
    },
}
...
```