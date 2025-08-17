import { analyzeTextWithCurrentTsModule } from '../../helpers/analyze-text-with-current-ts-module.js'
import { test } from '@japa/runner'
import { getComponentProp } from '../../helpers/util.js'

test('Correctly extends interface with interface from different file', ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule([
    {
      fileName: 'base.ts',
      analyze: false,
      text: `
export interface Checked {
  checked: boolean;
}`,
    },
    {
      fileName: 'main.ts',
      text: `
import {Checked} from './base.js';

interface CheckableElement extends HTMLElement, Checked {
}

declare global {
  interface HTMLElementTagNameMap {
    "checkable-element": CheckableElement;
  }
}`,
    },
  ])

  const { members = [] } = result.componentDefinitions[0]?.declaration || {}

  assert.strictEqual(1, members.length)
  assert.isDefined(getComponentProp(members, 'checked'))
})

test('Correctly extends interface with interface+value from different file', ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule([
    {
      fileName: 'base.ts',
      analyze: false,
      text: `
interface Checked {
  checked: boolean;
}
declare const Checked: Checked;
export {Checked};
`,
    },
    {
      fileName: 'main.ts',
      text: `
import {Checked} from './base.js';

interface CheckableElement extends HTMLElement, Checked {
}

declare global {
  interface HTMLElementTagNameMap {
    "checkable-element-with-value": CheckableElement;
  }
}`,
    },
  ])

  const { members = [] } = result.componentDefinitions[0]?.declaration || {}

  assert.strictEqual(1, members.length)
  assert.isDefined(getComponentProp(members, 'checked'))
})

test('Correctly extends class with class from different file', ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule([
    {
      fileName: 'base.ts',
      analyze: false,
      text: `
export class Checked {
  checked: boolean;
}`,
    },
    {
      fileName: 'main.ts',
      text: `
import {Checked} from './base.js';

class CheckableElement extends Checked {
}

declare global {
  interface HTMLElementTagNameMap {
    "checkable-element": CheckableElement;
  }
}`,
    },
  ])

  const { members = [] } = result.componentDefinitions[0]?.declaration || {}

  assert.strictEqual(1, members.length)
  assert.isDefined(getComponentProp(members, 'checked'))
})

test('Correctly extends interface with interface from same file', ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule([
    {
      fileName: 'main.ts',
      text: `
interface Checked {
	checked: boolean;
}

interface CheckableElement extends HTMLElement, Checked {
}

declare global {
  interface HTMLElementTagNameMap {
    "checkable-element": CheckableElement;
  }
}`,
    },
  ])

  const { members = [] } = result.componentDefinitions[0]?.declaration || {}

  assert.strictEqual(1, members.length)
  assert.isDefined(getComponentProp(members, 'checked'))
})

test('Correctly extends class with class from same file', ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule([
    {
      fileName: 'main.ts',
      text: `
class Checked {
	checked: boolean;
}

class CheckableElement extends HTMLElement, Checked {
}

declare global {
  interface HTMLElementTagNameMap {
    "checkable-element": CheckableElement;
  }
}`,
    },
  ])

  const { members = [] } = result.componentDefinitions[0]?.declaration || {}

  assert.strictEqual(1, members.length)
  assert.isDefined(getComponentProp(members, 'checked'))
})
