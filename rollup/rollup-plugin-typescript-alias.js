import {replaceTscAliasPaths} from 'tsc-alias';

const typescriptAlias = (options) => {
  return {
    name: 'typescript-alias',
    writeBundle: () => {
      return replaceTscAliasPaths(options);
    },
  };
};

export default typescriptAlias;
