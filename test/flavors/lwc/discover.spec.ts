import { test } from '@japa/runner'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import { analyzeTextWithCurrentTsModule } from '../../helpers/analyze-text-with-current-ts-module.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// To run the test:
//    yarn ava --ext ts test/flavors/lwc/discover-test.ts

test('LWC: Simple c-my-element ', ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule({
    fileName: 'modules/c/myElement/myElement.js',
    text: `
        import { api, LightningElement } from 'lwc';
        class MyElement extends LightningElement {}`,
  })

  const { componentDefinitions } = result

  assert.strictEqual(componentDefinitions.length, 1)
  assert.strictEqual(componentDefinitions[0].tagName, 'c-my-element')
})

test('LWC: Simple custom-my-element ', ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule({
    fileName: 'modules/custom/myElement/myElement.js',
    text: `
        import { api, LightningElement } from 'lwc';
        class MyElement extends LightningElement {}`,
  })

  const { componentDefinitions } = result

  assert.strictEqual(componentDefinitions.length, 1)
  assert.strictEqual(componentDefinitions[0].tagName, 'custom-my-element')
})

test('LWC: c-my-element ignores classname', ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule({
    fileName: 'modules/c/myElement/myElement.js',
    text: `
        import { api, LightningElement } from 'lwc';
        class CustomElement extends LightningElement {}`,
  })

  const { componentDefinitions } = result

  assert.strictEqual(componentDefinitions.length, 1)
  assert.strictEqual(componentDefinitions[0].tagName, 'c-my-element')
})

test('LWC: From file convention', ({ assert }) => {
  const fileName = path.join(__dirname, 'comp/c0/c0.js')
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule({
    fileName: fileName,
    text: fs.readFileSync(fileName, 'utf8'),
  })

  const componentDefinitions = result.componentDefinitions || []

  assert.strictEqual(componentDefinitions.length, 1)
  assert.strictEqual(componentDefinitions[0].tagName, 'comp-c0')
})

test('LWC: Invalid template but Lighting Element inheritance', ({ assert }) => {
  const fileName = path.join(__dirname, 'comp/c1/c1.js')
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule({
    fileName: fileName,
    text: fs.readFileSync(fileName, 'utf8'),
  })

  const componentDefinitions = result.componentDefinitions || []

  assert.strictEqual(componentDefinitions.length, 1)
  assert.strictEqual(componentDefinitions[0].tagName, 'comp-c1')
})

test('LWC: Invalid template No Lighting Element inheritance', ({ assert }) => {
  const fileName = path.join(__dirname, 'comp/c2/c2.js')
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule({
    fileName: fileName,
    text: fs.readFileSync(fileName, 'utf8'),
  })

  const componentDefinitions = result.componentDefinitions || []

  assert.strictEqual(componentDefinitions.length, 0)
})

// PHIL: does not work reliably
//
test('LWC: discover with JS tag ', ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule({
    fileName: 'modules/c/your/anElement.js',
    text: `
		import { BaseComponent } from 'lwc';
		/**
		 * @lwcelement
		 */
        class MyElement extends BaseComponent {}`,
  })

  const { componentDefinitions } = result

  assert.strictEqual(componentDefinitions.length, 1)
  assert.strictEqual(componentDefinitions[0].tagName, 'c-your')
})
test('LWC: discover with JS tag with tag name', ({ assert }) => {
  const {
    results: [result],
  } = analyzeTextWithCurrentTsModule({
    fileName: 'modules/c/your/anElement.js',
    text: `
		import { BaseComponent } from 'lwc';
		/**
		 * @lwcelement my-element
		 */
        class MyElement extends BaseComponent {}`,
  })

  const { componentDefinitions } = result

  assert.strictEqual(componentDefinitions.length, 1)
  assert.strictEqual(componentDefinitions[0].tagName, 'my-element')
})
