import {CodeGenerator} from '../generator';

import {CCodeGenerator} from './c';
import {JSCodeGenerator} from './js';

export function makeGenerator(name: string): CodeGenerator {
  if (name === 'c') {
    return new CCodeGenerator();
  } else if (name === 'js') {
    return new JSCodeGenerator();
  } else {
    throw new Error('Generator for ${name} not implemented');
  }
}
