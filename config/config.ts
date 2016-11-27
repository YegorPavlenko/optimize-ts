import * as path from 'path';
import * as nconf from 'nconf';

let configFile: string;

if (process.env.NODE_ENV === 'development') {
  configFile = path.join(__dirname, 'config_dev.json');
} else if (process.env.NODE_ENV === 'test') {
  configFile = path.join(__dirname, 'config_test.json');
} else if (process.env.NODE_ENV === 'prod') {
  configFile = path.join(__dirname, 'config_prod.json');
} else {
  configFile = path.join(__dirname, 'config_test.json');
}

export default nconf.argv()
  .env()
  .file({file: configFile});
//# sourceMappingURL=config.js.map