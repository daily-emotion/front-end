module.exports = {
    preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json', // tsconfig.json 경로 명시
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  };
  