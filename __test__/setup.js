import { config } from 'dotenv';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
config({ path: `${process.cwd()}\\.env.local` });
