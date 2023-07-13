import { AppConfig } from "../src/common/config/config.js";

const config: AppConfig = {
  todoClient: {
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 1000,    
  }
};

export default config;